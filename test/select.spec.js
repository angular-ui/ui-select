'use strict';

describe('ui-select tests', function() {
  var scope, $rootScope, $compile;

  beforeEach(module('ui.select'));
  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.matches = [
      { name: 'Wladimir Coka',   email: 'wcoka@email.com' },
      { name: 'Samantha Smith',  email: 'sam@email.com' },
      { name: 'Estefanía Smith', email: 'esmith@email.com' },
      { name: 'Natasha Jones',   email: 'ncoka@email.com' },
      { name: 'Nicole Smith',    email: 'nicky@email.com' },
      { name: 'Adrian Jones',    email: 'asmith@email.com' }
    ];
  }));


  // Utility functions

  function compileTemplate(template) {
    var el = $compile(angular.element(template))(scope);
    scope.$digest();
    return el;
  }

  function createUiSelect(attrs) {
    var attrsHtml = '';
    if (attrs !== undefined) {
      if (attrs.disabled !== undefined) { attrsHtml += ' ng-disabled="' + attrs.disabled + '"'; }
      if (attrs.required !== undefined) { attrsHtml += ' ng-required="' + attrs.required + '"'; }
    }

    return compileTemplate(
      '<ui-select ng-model="selection"' + attrsHtml + '> \
        <match placeholder="Pick one...">{{$select.selected.name}}</match> \
        <choices repeat="item in matches | filter: $select.search"> \
          <div ng-bind-html="trustAsHtml((item.name | highlight: $select.search))"></div> \
          <div ng-bind-html="trustAsHtml((item.email | highlight: $select.search))"></div> \
        </choices> \
      </ui-select>'
    );
  }

  function getMatchLabel(el) {
    return $(el).find('.ui-select-match > span[ng-transclude]:not(.ng-hide)').text();
  }

  function clickItem(el, text) {
    $(el).find('.ui-select-choices-row > div:contains("' + text + '")').click();
    scope.$digest();
  }

  function clickMatch(el) {
    $(el).find('.ui-select-match').click();
    scope.$digest();
  }


  it('should compile child directives', function() {
    var el = createUiSelect();

    var searchEl = $(el).find('.ui-select-search');
    expect(searchEl.length).toEqual(1);

    var matchEl = $(el).find('.ui-select-match');
    expect(matchEl.length).toEqual(1);

    var choicesContentEl = $(el).find('.ui-select-choices-content');
    expect(choicesContentEl.length).toEqual(1);

    var choicesContainerEl = $(el).find('.ui-select-choices');
    expect(choicesContainerEl.length).toEqual(1);

    var choicesElems = $(el).find('.ui-select-choices-row');
    expect(choicesElems.length).toEqual(6);
  });

  it('should correctly render initial state', function() {
    scope.selection = scope.matches[0];

    var el = createUiSelect();

    expect(getMatchLabel(el)).toEqual('Wladimir Coka');
  });

  it('should display the choices when activated', function() {
    var el = createUiSelect();

    // Does not work with jQuery 2.*, have to use jQuery 1.11.*
    // This will be fixed in AngularJS 1.3
    // See issue with unit-testing directive using karma https://github.com/angular/angular.js/issues/4640#issuecomment-35002427
    expect(el.scope().$select.open).toEqual(false);

    clickMatch(el);

    expect(el.scope().$select.open).toEqual(true);
    expect($(el).find('.ui-select-choices').parent().hasClass('select2-display-none')).toEqual(false);
  });

  it('should select an item', function() {
    var el = createUiSelect();

    clickItem(el, 'Samantha Smith');

    expect(getMatchLabel(el)).toEqual('Samantha Smith');
  });

  it('should select an item (controller)', function() {
    var el = createUiSelect();

    el.scope().$select.select(scope.matches[1]);
    scope.$digest();

    expect(getMatchLabel(el)).toEqual('Samantha Smith');
  });

  it('should not select a non existing item', function() {
    var el = createUiSelect();

    clickItem(el, "I don't exist");

    expect(getMatchLabel(el)).toEqual('');
  });

  it('should close the choices when an item is selected', function() {
    var el = createUiSelect();

    $(el).find('.ui-select-match').click();
    scope.$digest();

    expect(el.scope().$select.open).toEqual(true);

    clickItem(el, 'Samantha Smith');

    expect(el.scope().$select.open).toEqual(false);
    expect($(el).find('.ui-select-choices').parent().hasClass('select2-display-none')).toEqual(true);
  });

  it('should be disabled if the attribute says so', function() {
    var el1 = createUiSelect({disabled: true});
    expect(el1.scope().$select.disabled).toEqual(true);
    clickMatch(el1);
    expect(el1.scope().$select.open).toEqual(false);

    var el2 = createUiSelect({disabled: false});
    expect(el2.scope().$select.disabled).toEqual(false);
    clickMatch(el2);
    expect(el2.scope().$select.open).toEqual(true);

    var el3 = createUiSelect();
    expect(el3.scope().$select.disabled).toEqual(false);
    clickMatch(el3);
    expect(el3.scope().$select.open).toEqual(true);
  });

  // See when an item that evaluates to false (such as "false" or "no") is selected, the placeholder is shown https://github.com/angular-ui/ui-select/pull/32
  it('should not display the placeholder when item evaluates to false', function() {
    scope.matches = [ 'false' ];

    var el = compileTemplate(
      '<ui-select ng-model="selection"> \
        <match>{{$select.selected}}</match> \
        <choices repeat="item in matches | filter: $select.search"> \
          <div ng-bind-html="trustAsHtml((item | highlight: $select.search))"></div> \
        </choices> \
      </ui-select>'
    );
    expect(el.scope().$select.selected).toEqual(undefined);

    clickItem(el, 'false');

    expect(el.scope().$select.selected).toEqual('false');
    expect(getMatchLabel(el)).toEqual('false');
  });
});
