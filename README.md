# Open Author Clock ⏰

An open-source, web-based implementation of the Author Clock Kickstarter project intended to run on any type of device.

## ✨ See It in Action ✨

Why confine the beautiful words of literature to the pages of a book? This project brings literary quotes to every minute of your day, telling time through the wise and whimsical words of authors from times gone by.

<p align="center">
<img src="https://github.com/ambercaravalho/open-author-clock/raw/main/example-photo.jpg" height="400">

Try it out for yourself and see how literature can tell time: [__Live Demo Site 🖥️__](https://clock.ambercaravalho.com)

### Inspiration

This adventure was sparked by two main projects:

- [The Author Clock](https://www.authorclock.com): A dedicated gadget that tells time through literary quotes, offering a new hand-picked passage every minute.

- The [literaryclock repo](https://github.com/elegantalchemist/literaryclock) by [elegantalchemist](https://github.com/elegantalchemist): The brilliant idea of a literary clock already executed on the Kindle Keyboard using Python.

## Quick Setup with Docker 🚢

Getting this project up and running is as easy as:

1. __Installing Docker__: If you haven't already, you'll need Docker on your machine. Find the installation guide for your OS [here](https://docs.docker.com/engine/install/).

2. __Cloning This Repo__: Clone this repo to your local system:

    ```bash
    git clone https://github.com/ambercaravalho/open-author-clock.git
    ```

3. __Running the Dockerfile__: Navigate to the project's root directory in your terminal and run:

    ```bash
    docker build -t open-author-clock .
    docker run -d -p 80:80 --restart unless-stopped open-author-clock
    ```

Voilà! 🥳 You should now have the project running on `http://localhost`. 

Other devices can access the site through your system's IP address (e.g., `http://192.168.1.20`).

## Contributing to the Quote List

If you've stumbled upon a quote that perfectly captures a minute, feel free to contribute!

### Quote Formatting

Each quote should be formatted as follows:

`time|timestring|quote|title|author`

- **time**: The specific time the quote represents, in 24-hour format (e.g., `14:45`).
- **timestring**: The way the time is mentioned within the quote, to be highlighted (e.g., `quarter to three`).
- **quote**: The full sentence from the book where the time is mentioned.
- **title**: The title of the book the quote is from.
- **author**: The author of the book.

For example: `00:00|midnight|It starts at midnight.|Catching Fire|Suzanne Collins`

### Where to Add Your Quote

Navigate to the `script.js` file in the project, and you'll find an string named `csvData`. Add your formatted quote to this array, following the existing structure.

### Creating a Pull Request

This project always welcome good additions to the collection and encourage you to share any quote that resonates with the ticking of the literary clock. Each contribution enriches this project and keeps our collective timepiece ticking with intrigue and inspiration.

Happy contributing! 🎉

## Known Issues

Visit this repo's [Issues](https://github.com/ambercaravalho/open-author-clock/issues) page to see known issues and contribute to make this project even better!

## License Disclaimer

This project uses quotes sourced from the [literaryclock](https://github.com/elegantalchemist/literaryclock) repo under the GNU General Public License v3.0. We adhere to the same license, ensuring:
- Retention of license and copyright notice.
- Disclosure of source and state changes.
- Distribution under the GNU General Public License v3.0.

For detailed license information, please refer to the LICENSE file in this repository.
