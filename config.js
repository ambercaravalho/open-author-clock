// Configuration settings for the Open Author Clock
export const config = {
  // Data source
  dataUrl: 'data.json',
  
  // Update interval in milliseconds (60000 = 1 minute)
  updateInterval: 60000,
  
  // Transition settings
  fadeOutDuration: 1000,  // milliseconds
  fadeInDuration: 1000,   // milliseconds
  
  // Font size adjustment
  fontSize: {
    base: 5.5,                // Base font size in vw
    portraitMultiplier: 1.5,  // Multiplier for portrait orientation
    shortQuoteThreshold: 100, // Character count for "short" quotes
    longQuoteThreshold: 300,  // Character count for "long" quotes
    shortQuoteSize: 7,        // Font size for short quotes (vw)
    longQuoteSize: 4          // Font size for long quotes (vw)
  },
  
  // Screen wake lock settings
  enableWakeLock: true,
  wakeLockFallbackInterval: 30000, // milliseconds
  
  // UTC timezone detection
  utcTimezonesOffset: -7, // Hours to adjust for UTC timezones
  
  // Selectors
  selectors: {
    quote: '#quote',
    author: '#author',
    quoteContainer: '#quoteContainer'
  }
};
