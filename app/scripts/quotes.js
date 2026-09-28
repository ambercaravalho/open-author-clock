// Loading, indexing, and selection of the quote list.

export const MINUTES_PER_DAY = 24 * 60;

const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;

export function parseTime(value) {
  const match = TIME_PATTERN.exec(String(value).trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

export function circularDistance(a, b) {
  const direct = Math.abs(a - b);
  return Math.min(direct, MINUTES_PER_DAY - direct);
}

function isUsable(entry) {
  return (
    entry !== null &&
    typeof entry === 'object' &&
    parseTime(entry.time) !== null &&
    typeof entry.quote === 'string' &&
    entry.quote.length > 0
  );
}

export class QuoteLibrary {
  constructor(entries) {
    if (!Array.isArray(entries)) {
      throw new TypeError('Quote data must be an array');
    }

    this.byMinute = new Map();
    this.skipped = 0;

    for (const entry of entries) {
      if (!isUsable(entry)) {
        this.skipped += 1;
        continue;
      }

      const minute = parseTime(entry.time);
      const bucket = this.byMinute.get(minute);
      if (bucket) {
        bucket.push(entry);
      } else {
        this.byMinute.set(minute, [entry]);
      }
    }

    this.minutes = [...this.byMinute.keys()].sort((a, b) => a - b);

    if (this.minutes.length === 0) {
      throw new Error('Quote data contained no usable entries');
    }
  }

  static async load(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
    }
    return new QuoteLibrary(await response.json());
  }

  get size() {
    let total = 0;
    for (const bucket of this.byMinute.values()) total += bucket.length;
    return total;
  }

  nearestMinute(minute) {
    if (this.byMinute.has(minute)) return minute;

    const { minutes } = this;

    let low = 0;
    let high = minutes.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (minutes[mid] < minute) low = mid + 1;
      else high = mid;
    }

    const after = minutes[low % minutes.length];
    const before = minutes[(low - 1 + minutes.length) % minutes.length];

    return circularDistance(before, minute) <= circularDistance(after, minute)
      ? before
      : after;
  }

  forMinute(minute) {
    const bucket = this.byMinute.get(this.nearestMinute(minute));
    return bucket[Math.floor(Math.random() * bucket.length)];
  }

  longest() {
    let winner = null;
    for (const bucket of this.byMinute.values()) {
      for (const entry of bucket) {
        if (!winner || entry.quote.length > winner.quote.length) winner = entry;
      }
    }
    return winner;
  }
}
