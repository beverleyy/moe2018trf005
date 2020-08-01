## Attendance/payment calculator

Link: [beverleyy.github.io/moe2018trf005/attendance-payment](http://beverleyy.github.io/moe2018trf005/attendance-payment)

Parses data from the attendance/payment masterlist based on the entered matriculation number.

Displays total number of lessons attended, total payment to be received, and detailed list of attendance/absence for each lesson/test.

Developed using Visual Studio Code and optimized for Safari, Chrome and Firefox.

### Dependencies

* [PapaParse](http://www.papaparse.com)
* [CORS Anywhere](https://github.com/Rob--W/cors-anywhere/)
* Overpass font - [Google Fonts](http://fonts.google.com/specimen/Overpass)

### Instructions

Google sheet must be published as a .csv and share settings changed to "Anyone with the link can view". 

CORS Anywhere proxy server must be set up to bypass Google's CORS policy. For this app, I've set one up on [Heroku](https://www.heroku.com/) specifically for this calculator (only allows requests from my Github pages domain).

### Changelog

**01/08/2020:**

* Fixed CORS policy no access-control-allow-origin error (see instructions)

**29/07/2020:**

* Updated report generation code.
* Now displays breakdown of total number.
* Removed jQuery library and dependency.
* Tweaked UI for consistency.
