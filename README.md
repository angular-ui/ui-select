# AngularJS ui-select [![Build Status](https://travis-ci.org/angular-ui/ui-select.png)](https://travis-ci.org/angular-ui/ui-select)

AngularJS-native version of [Select2](http://ivaynberg.github.io/select2/) and [Selectize](http://brianreavis.github.io/selectize.js/).

See the [online demo](http://plnkr.co/edit/GtOOWE?p=preview).

## Features

- Search and select
- Support themes from Select2 (default theme) and Selectize (default, Bootstrap 2 & 3 themes)
- Keyboard support
- jQuery not required (except for old browsers)
- Small code base: 250 lines of JavaScript vs 20 KB for select2.min.js

For the roadmap, check [issue #3](https://github.com/angular-ui/ui-select/issues/3) and the [Wiki page](https://github.com/angular-ui/ui-select/wiki/Roadmap).

## Browser compatibility

Starting from Internet Explorer 8 and Firefox 3.6 included.

## Installation using [Bower](http://bower.io/)

- `bower install angular-ui-select`
- Inside your HTML add
  - select.js: `<script src="bower_components/ui-select/dist/select.js"></script>`
  - select.css: `<link rel="stylesheet" href="bower_components/ui-select/dist/select.css">`
- Add one of the supported themes:
  - Select2 (version ~3.4.5): `<link rel="stylesheet" href=".../select2.css">`
  - Selectize (version ~0.8.5): `<link rel="stylesheet" href=".../selectize.*.css">`
- Check the [examples](https://github.com/angular-ui/ui-select/blob/master/examples) to see how to use ui-select

## Run the tests

Install [Node.js](http://nodejs.org/), then inside a console:
```
npm update # Installs all Grunt dependencies (package.json) inside node_modules directory
bower update # Installs all ui-select dependencies (bower.json) inside bower_components directory
```

To run the tests:
```
grunt build # Build dist/select.js
grunt test # Launches Karma
```

## Contributing

- Run the tests
- Try the [examples](https://github.com/angular-ui/ui-select/blob/master/examples)

When issuing a pull request, please exclude changes in the "dist" folder to avoid merge conflicts.
