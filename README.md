# AngularJS ui-select [![Build Status](https://travis-ci.org/angular-ui/ui-select.png)](https://travis-ci.org/angular-ui/ui-select)

AngularJS-native version of [Select2](http://ivaynberg.github.io/select2/) and [Selectize](http://brianreavis.github.io/selectize.js/).

See the [online demo](http://plnkr.co/edit/GtOOWE?p=preview).

## Features

- Search and select
- Support themes from Select2 (default theme) and Selectize (default, Bootstrap 2 & 3 themes)
- Keyboard support
- jQuery not required (except for old browsers)

For the roadmap, check [issue #3](https://github.com/angular-ui/ui-select/issues/3) and the [Wiki page](https://github.com/angular-ui/ui-select/wiki/Roadmap).

## Browser support

Starting from Internet Explorer 8 and Firefox 3.6 included.

## Installation using [Bower](http://bower.io/)

- `bower install angular-ui-select`
- Inside your HTML add `<script src="bower_components/ui-select/dist/select.js"></script>`
- Add one of the themes supported by Select2 `<link rel="stylesheet" href=".../select2.css">` or Selectize `<link rel="stylesheet" href=".../selectize.*.css">`
- Check the [online demo](http://plnkr.co/edit/GtOOWE?p=preview) to see how to use ui-select

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
