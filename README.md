# README

## Description

This is a Node.js application that fetches vehicle information using an external API and scrapes additional data from a website. The fetched data is then written to a JSON file and sent to an internal API via an HTTP POST call.


## Installation

1. Clone the repository
2. Install dependencies using `npm install`
3. Create a `.env` file in the root directory and add the following variables:
4. Run the application using `node index.js`


## Configuration

Before running the application, you will need to set the following values in the `.env` file:

- `SCRAPE_PAGE_FIRST_URL`: the URL of the web page that need to load first.
- `PAGE_TO_SCRAPE`: the URL of the page to visit and perform a specific action.
- `INTERNALL_API_POST_CALL`: the URL of the internall API to call.

## Usage

To use the application, simply run the command `node index.js` in your terminal. The vehicle information will be fetched, additional data will be scraped, and the resulting data will be written to a JSON file and sent to your internal API via an HTTP POST call.

## License

This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
```
