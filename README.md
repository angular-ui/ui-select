# AngularJS ui-select [![Build Status](https://travis-ci.org/angular-ui/ui-select.png)](https://travis-ci.org/angular-ui/ui-select)

AngularJS-native version of [Select2](http://ivaynberg.github.io/select2/) and [Selectize](http://brianreavis.github.io/selectize.js/).

- [Demo](http://plnkr.co/edit/GtOOWE?p=preview)
- [Bootstrap theme](http://plnkr.co/edit/7Fpbtg?p=preview)

## Features

- Search and select
- Available themes: Bootstrap, Select2 and Selectize
- Keyboard support
- jQuery not required (except for old browsers)
- Small code base: 400 lines of JavaScript vs 20 KB for select2.min.js

For the roadmap, check [issue #3](https://github.com/angular-ui/ui-select/issues/3) and the [Wiki page](https://github.com/angular-ui/ui-select/wiki/Roadmap).

## Browser compatibility

Starting from Internet Explorer 8 and Firefox 3.6 included.

## Installation using [Bower](http://bower.io/)

Check the [examples](https://github.com/angular-ui/ui-select/blob/master/examples).

- `bower install angular-ui-select`
- Inside your HTML add
  - select.js: `<script src="bower_components/ui-select/dist/select.js"></script>`
  - select.css: `<link rel="stylesheet" href="bower_components/ui-select/dist/select.css">`

### Bootstrap theme

If you already use Bootstrap, this theme will save you a lot of CSS code compared to the Select2 and Selectize themes.

Bower:
- `bower install bootstrap`
- `<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">`
- Or the [LESS](http://lesscss.org/) version: `@import "bower_components/bootstrap/less/bootstrap.less";`

[Bootstrap CDN](http://www.bootstrapcdn.com/):
- `<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.css">`

Configuration:
```JavaScript
app.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'bootstrap';
});
```

### Select2 theme

Bower:
- `bower install select2#~3.4.5`
- `<link rel="stylesheet" href="bower_components/select2/select2.css">`

[cdnjs](http://cdnjs.com/):
- `<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/select2/3.4.5/select2.css">`

Configuration:
```JavaScript
app.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'select2';
});
```

### Selectize theme

Bower:
- `bower install selectize#~0.8.5`
- `<link rel="stylesheet" href="bower_components/selectize/dist/css/selectize.default.css">`
- Or the [LESS](http://lesscss.org/) version: `@import "bower_components/selectize/dist/less/selectize.default.less";`

[cdnjs](http://cdnjs.com/):
- `<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.8.5/css/selectize.default.css">`

Configuration:
```JavaScript
app.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'selectize';
});
```

## FAQ

### ng-model not working with a simple variable on $scope

You cannot write:
```HTML
<ui-select ng-model="item"> <!-- Wrong -->
  [...]
</ui-select>
```

You need to write:
```HTML
<ui-select ng-model="item.selected"> <!-- Correct -->
  [...]
</ui-select>
```

Or:
```HTML
<ui-select ng-model="$parent.item"> <!-- Hack -->
  [...]
</ui-select>
```

For more explanations, check [ui-select #18](https://github.com/angular-ui/ui-select/issues/18) and [angular.js #6199](https://github.com/angular/angular.js/issues/6199).

### ng-bind-html gives me "Error: [$sce:unsafe] Attempting to use an unsafe value in a safe context"

You need to use module [ngSanitize](http://docs.angularjs.org/api/ngSanitize) (recommended) or [$sce](http://docs.angularjs.org/api/ng/service/$sce):

```JavaScript
$scope.trustAsHtml = function(value) {
  return $sce.trustAsHtml(value);
};
```

```HTML
<div ng-bind-html="trustAsHtml((item | highlight: $select.search))"></div>
```

### I get "TypeError: Object [...] has no method 'indexOf' at htmlParser"

You are using ng-bind-html with a number:
```HTML
<div ng-bind-html="person.age | highlight: $select.search"></div>
```

You should write instead:
```HTML
<div ng-bind-html="''+person.age | highlight: $select.search"></div>
```

Or:
```HTML
<div ng-bind-html="person.age.toString() | highlight: $select.search"></div>
```

## Run the tests

Install [Node.js](http://nodejs.org/), then inside a console:
```
npm update # Installs all Grunt dependencies (package.json) inside node_modules directory
bower update # Installs all ui-select dependencies (bower.json) inside bower_components directory
```

To run the tests:
```
grunt build # Builds dist/select.js
grunt test # Launches Karma
```

## Contributing

- Run the tests
- Try the [examples](https://github.com/angular-ui/ui-select/blob/master/examples)

When issuing a pull request, please exclude changes from the "dist" folder to avoid merge conflicts.
