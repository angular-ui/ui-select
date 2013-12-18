ui-select [![Build Status](https://travis-ci.org/angular-ui/ui-select.png)](https://travis-ci.org/angular-ui/ui-select)
=========

A native version of select2.

### Prototype usage:

```html
<ui-select ng-model="data.custom" style="width:300px">
  <match placeholder="Pick one...">{{$select.selected.name}}</match>
  <choices data="data.items | filter : $select.search">
      <div ng-bind-html="trustAsHtml((item.name | highlight:$select.search))"/></div>
      <div> {{item.email}} </div>
  </choices>
</ui-select>
```
