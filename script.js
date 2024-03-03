let currentQuoteIndex = -1; // Initialize with -1 to start from the first quote

function updateQuote() {
    const quotes = [
        { text: "At <b>eight o'clock</b> on Thursday morning, Arthur didn't feel very good.", author: "Douglas Adams", book: "The Hitchhiker's Guide to the Galaxy" },
        { text: "It was a bright cold day in April, and the clocks were striking <b>thirteen</b>.", author: "George Orwell", book: "1984" },
        // Add more quotes here as per the format above
    ];

    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length; // Ensure we cycle through the quotes

    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');

    // Ensure fade-out effect
    quoteElement.style.opacity = 0;
    authorElement.style.opacity = 0;

    setTimeout(() => {
        quoteElement.innerHTML = `${quotes[currentQuoteIndex].text}`;
        authorElement.innerHTML = `${quotes[currentQuoteIndex].author}<br>${quotes[currentQuoteIndex].book}`;

        // Fade in
        quoteElement.style.opacity = 1;
        authorElement.style.opacity = 1;
    }, 1000); // Delay for fade-out effect
}

// Initial call to update the quote immediately on load
updateQuote();

// Set interval for quote updates
setInterval(updateQuote, 10000); // Includes time for fade effect
