// Sizes the quote to the largest font size that fits its box without scrolling.

const TOLERANCE_PX = 0.5;
const ABSOLUTE_FLOOR_PX = 4;

export class TextFitter {
  #pendingFrame = null;
  #lastBoxSize = '';

  constructor(box, text, { minFontSize = 14, maxFontSize = 320, onFit } = {}) {
    this.box = box;
    this.text = text;
    this.minFontSize = minFontSize;
    this.maxFontSize = maxFontSize;
    this.onFit = onFit;
    this.lastFontSize = null;

    this.observer = new ResizeObserver(() => this.refit());
    this.observer.observe(box);

    document.fonts?.ready.then(() => this.refit({ force: true }));
  }

  #fits() {
    const available = this.box.getBoundingClientRect();
    const rendered = this.text.getBoundingClientRect();
    return (
      rendered.height <= available.height + TOLERANCE_PX &&
      rendered.width <= available.width + TOLERANCE_PX
    );
  }

  #apply(fontSize) {
    this.box.style.fontSize = `${fontSize}px`;
  }

  #search(low, high) {
    let best = null;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      this.#apply(mid);
      if (this.#fits()) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return best;
  }

  fit() {
    const { minFontSize } = this;
    const ceiling = Math.max(
      minFontSize,
      Math.min(this.maxFontSize, Math.ceil(this.box.clientHeight)),
    );

    this.#apply(minFontSize);
    let best;
    let fitted = true;

    if (this.#fits()) {
      best = this.#search(minFontSize + 1, ceiling) ?? minFontSize;
    } else {
      best = this.#search(ABSOLUTE_FLOOR_PX, minFontSize - 1);
      fitted = best !== null;
      if (!fitted) best = ABSOLUTE_FLOOR_PX;
    }

    this.#apply(best);
    this.lastFontSize = best;
    this.#lastBoxSize = this.#boxSize();
    this.onFit?.(best, fitted);
    return best;
  }

  #boxSize() {
    const { width, height } = this.box.getBoundingClientRect();
    return `${Math.round(width)}x${Math.round(height)}`;
  }

  refit({ force = false } = {}) {
    if (this.#pendingFrame !== null) return;

    this.#pendingFrame = requestAnimationFrame(() => {
      this.#pendingFrame = null;
      if (!this.text.textContent.trim()) return;
      if (!force && this.#boxSize() === this.#lastBoxSize) return;
      this.fit();
    });
  }

  disconnect() {
    this.observer.disconnect();
    if (this.#pendingFrame !== null) cancelAnimationFrame(this.#pendingFrame);
  }
}
