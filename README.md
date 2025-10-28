# Open Author Clock ⏰

An open-source, web-based implementation of the Author Clock Kickstarter project intended to run in an web browser.

## ✨ See It in Action ✨

Why confine the words of literature to pages of a book? This project brings literary quotes to every minute of your day, telling time through the words of authors from times gone by.

<p align="center">
<img src="example-photo.jpg" height="400">

Try it out for yourself: [__Live Demo Site 🖥️__](https://clock.ambercaravalho.com)

### Inspiration

This project was sparked by two main projects:

- [The Author Clock](https://www.authorclock.com): A dedicated gadget that tells time through literary quotes, offering a new hand-picked passage every minute.

- The [literaryclock repo](https://github.com/elegantalchemist/literaryclock) by [elegantalchemist](https://github.com/elegantalchemist): The idea of a literary clock already executed on the Kindle Keyboard using Python.

## Configuration

You can customize the clock's behavior by editing `config.js`:

- **Update interval**: How often the quote updates
- **Fade durations**: Transition speed for quote changes
- **Font sizes**: Adjust text sizing for different quote lengths
- **Wake lock**: Keep screen awake while viewing
- **UTC timezone**: Automatic adjustment for UTC devices

## Contributing to the Quote List

If you've stumbled upon a quote that perfectly captures a minute, feel free to contribute!

### Quote Formatting

Each quote should be formatted as a JSON object in the `data.json` file:

```json
{
  "time": "14:45",
  "timeString": "quarter to three",
  "quote": "The full sentence from the book where the time is mentioned.",
  "title": "Book Title",
  "author": "Author Name"
}
```

- **time**: The specific time the quote represents, in 24-hour format (e.g., `14:45`).
- **timeString**: The way the time is mentioned within the quote, to be highlighted (e.g., `quarter to three`).
- **quote**: The full sentence from the book where the time is mentioned.
- **title**: The title of the book the quote is from.
- **author**: The author of the book.

For example:

```json
{
  "time": "00:00",
  "timeString": "midnight",
  "quote": "It starts at midnight.",
  "title": "Catching Fire",
  "author": "Suzanne Collins"
}
```

### Where to Add Your Quote

1. Open the `data.json` file
2. Find the appropriate time slot (quotes are ordered by time)
3. Add your new quote object to the array
4. Ensure proper JSON formatting (don't forget commas between objects!)

## More Info

### Known Issues

Visit this repo's [Issues](https://github.com/ambercaravalho/open-author-clock/issues) page to see known issues and contribute to make this project even better!

### License Disclaimer

This project uses quotes sourced from the [literaryclock](https://github.com/elegantalchemist/literaryclock) repo under the GNU General Public License v3.0.
