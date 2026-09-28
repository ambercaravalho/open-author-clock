import { config } from './config.js';
import { MINUTES_PER_DAY, QuoteLibrary, parseTime } from './quotes.js';
import { TextFitter } from './fit-text.js';

const elements = {
  container: document.getElementById('quoteContainer'),
  quote: document.getElementById('quote'),
  quoteText: document.getElementById('quoteText'),
  author: document.getElementById('author'),
};

const params = new URLSearchParams(window.location.search);
const settings = resolveSettings();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let library = null;
let fitter = null;
let wakeLock = null;
let renderedMinute = null;
let tickTimer = null;
let swapTimer = null;
let fadeMs = 0;

function log(...args) {
  if (settings.debug) console.info('[clock]', ...args);
}

function resolveSettings() {
  const tz = params.get('tz');
  const parsedTz = tz === null ? null : Number(tz);

  return {
    ...config,
    debug: params.has('debug') ? params.get('debug') !== 'false' : config.debug,
    timezoneOffsetHours:
      parsedTz !== null && Number.isFinite(parsedTz) && Math.abs(parsedTz) <= 14
        ? parsedTz
        : config.timezoneOffsetHours,
  };
}

/* ---------------------------------------------------------------- the clock */

function currentMinuteOfDay(now = new Date()) {
  const { timezoneOffsetHours } = settings;

  if (timezoneOffsetHours === null) {
    return now.getHours() * 60 + now.getMinutes();
  }

  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const shifted = utcMinutes + Math.round(timezoneOffsetHours * 60);
  return ((shifted % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

function msUntilNextMinute(now = new Date()) {
  return 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
}

function scheduleNextTick() {
  clearTimeout(tickTimer);
  const delay = msUntilNextMinute() + 50;
  tickTimer = setTimeout(() => {
    showQuoteForNow();
    scheduleNextTick();
  }, delay);
  log(`next tick in ${delay}ms`);
}

/* --------------------------------------------------------------- rendering */

function withQuotationMarks(text) {
  const trimmed = text.trim();
  const opensWithMark = /^["“„«]/.test(trimmed);
  const closesWithMark = /["”»]$/.test(trimmed);
  return opensWithMark && closesWithMark ? trimmed : `“${trimmed}”`;
}

function renderQuoteText(target, text, timeString) {
  target.replaceChildren();

  const body = withQuotationMarks(text);
  const needle = (timeString ?? '').trim();

  if (!needle) {
    target.append(body);
    return;
  }

  const haystack = body.toLowerCase();
  const lowerNeedle = needle.toLowerCase();
  let cursor = 0;

  for (;;) {
    const hit = haystack.indexOf(lowerNeedle, cursor);
    if (hit === -1) break;

    if (hit > cursor) target.append(body.slice(cursor, hit));

    const strong = document.createElement('strong');
    strong.textContent = body.slice(hit, hit + needle.length);
    target.append(strong);

    cursor = hit + needle.length;
  }

  if (cursor < body.length) target.append(body.slice(cursor));
}

function applyFadeDuration() {
  const isEInk = document.documentElement.dataset.display === 'eink';
  fadeMs = reducedMotion.matches || isEInk ? 0 : settings.fadeDuration;
  document.documentElement.style.setProperty('--fade-duration', `${fadeMs}ms`);
  log(`fade duration ${fadeMs}ms`);
}

function render(entry) {
  renderQuoteText(elements.quoteText, entry.quote, entry.timeString);
  elements.author.textContent = [entry.title, entry.author]
    .filter(Boolean)
    .join(' – ');

  fitter.fit();

  elements.quote.style.opacity = '1';
  elements.author.style.opacity = '1';
}

function showQuote(entry) {
  clearTimeout(swapTimer);

  if (fadeMs === 0) {
    render(entry);
    return;
  }

  elements.quote.style.opacity = '0';
  elements.author.style.opacity = '0';
  swapTimer = setTimeout(() => render(entry), fadeMs);
}

function showQuoteForNow({ force = false } = {}) {
  const minute = currentMinuteOfDay();

  if (!force && minute === renderedMinute) return;

  renderedMinute = minute;
  const entry = library.forMinute(minute);
  log(`minute ${minute} -> ${entry.time} ${entry.title}`);
  showQuote(entry);
}

function showError(message) {
  clearTimeout(swapTimer);
  const overlay = document.createElement('div');
  overlay.className = 'error';
  overlay.setAttribute('role', 'alert');
  const text = document.createElement('p');
  text.textContent = message;
  overlay.append(text);
  elements.container.replaceChildren(overlay);
}

/* ------------------------------------------------------------- device tweaks */

function detectEInk() {
  if (/\b(Kindle|Silk|NOOK|Kobo|reMarkable|Sony Reader)\b/i.test(navigator.userAgent)) {
    document.documentElement.dataset.display = 'eink';
    log('e-ink display detected');
  }
}

async function requestWakeLock() {
  if (!settings.enableWakeLock || !('wakeLock' in navigator)) return;
  if (wakeLock || document.visibilityState !== 'visible') return;

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      wakeLock = null;
      log('wake lock released');
    });
    log('wake lock active');
  } catch (error) {
    wakeLock = null;
    log('wake lock unavailable:', error.message);
  }
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .catch((error) => log('service worker registration failed:', error.message));
  });
}

/* -------------------------------------------------------------------- start */

function pinnedQuote() {
  const requested = params.get('quote');
  if (!requested) return null;

  if (requested === 'longest') return library.longest();

  const minute = parseTime(requested);
  return minute === null ? null : library.forMinute(minute);
}

async function init() {
  detectEInk();
  applyFadeDuration();
  reducedMotion.addEventListener('change', applyFadeDuration);
  registerServiceWorker();

  try {
    library = await QuoteLibrary.load(settings.dataUrl);
  } catch (error) {
    console.error('Could not load the quote list:', error);
    showError('Could not load the quote list. Check your connection and reload.');
    return;
  }

  log(`loaded ${library.size} quotes across ${library.minutes.length} minutes`);
  if (library.skipped) {
    console.warn(`Skipped ${library.skipped} malformed quote entries`);
  }

  fitter = new TextFitter(elements.quote, elements.quoteText, {
    minFontSize: settings.minFontSize,
    maxFontSize: settings.maxFontSize,
    onFit: (size, fitted) => {
      if (!fitted) console.warn(`Quote clipped: it does not fit at ${size}px`);
      else log(`fitted at ${size}px`);
    },
  });

  const pinned = pinnedQuote();
  if (pinned) {
    log('pinned to a single quote for testing');
    showQuote(pinned);
  } else {
    showQuoteForNow({ force: true });
    scheduleNextTick();
  }

  requestWakeLock();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    requestWakeLock();
    if (pinned) return;
    showQuoteForNow();
    scheduleNextTick();
  });
}

init();
