// User-editable settings for the Open Author Clock.

export const config = {
  // Where the quote list lives, relative to index.html.
  dataUrl: 'data/quotes.json',

  // Crossfade length in milliseconds.
  fadeDuration: 1000,

  // Keep the screen on while the clock is displayed.
  enableWakeLock: true,

  // Fixed UTC offset in hours, e.g. -7 for UTC-7.
  timezoneOffsetHours: null,

  // Smallest and largest quote font size in pixels.
  minFontSize: 14,
  maxFontSize: 320,

  // Log timing and fitting details to the console.
  debug: false,
};
