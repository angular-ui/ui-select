# AngularJS ui-select [![Build Status](https://travis-ci.org/angular-ui/ui-select.png)](https://travis-ci.org/angular-ui/ui-select)

AngularJS-native version of [Select2](http://ivaynberg.github.io/select2/) and [Selectize](http://brianreavis.github.io/selectize.js/).

- [Basic demo](http://plnkr.co/edit/GtOOWE?p=preview)
- [Select2 Bootstrap 3 demo](http://plnkr.co/edit/L8BdYv?p=preview)

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

Check the [examples](https://github.com/angular-ui/ui-select/blob/master/examples).

- `bower install angular-ui-select`
- Inside your HTML add
  - select.js: `<script src="bower_components/ui-select/dist/select.js"></script>`
  - select.css: `<link rel="stylesheet" href="bower_components/ui-select/dist/select.css">`

### Select2 theme

Bower:
- `bower install select2#~3.4.5`
- `<link rel="stylesheet" href="bower_components/select2/select2.css">`

[cdnjs](http://cdnjs.com/):
- `<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/select2/3.4.5/select2.css">`

### Selectize theme

Bower:
- `bower install selectize#~0.8.5`
- `<link rel="stylesheet" href="bower_components/selectize/dist/css/selectize.default.css">`
- Or the [LESS](http://lesscss.org/) version: `@import "bower_components/selectize/dist/less/selectize.default.less";`

[cdnjs](http://cdnjs.com/):
- `<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.8.5/css/selectize.default.css">`

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
