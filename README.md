ui-select [![Build Status](https://travis-ci.org/angular-ui/ui-select.png)](https://travis-ci.org/angular-ui/ui-select)
=========

A native version of select2.

Requires ui.keypress from ui-utils


### Prototype usage:

```html
<ui-select ng-model="data.custom">
  <li 
    ng-repeat="item in data.items | filter : $search" 
    ng-class="{highlight:highlight==$index}" 
    ng-click="$select(item)" 
    ng-mouseover="$parent.highlight=$index">
    <h4>{{item.title}}</h4>
  </li>
</ui-select>
```
