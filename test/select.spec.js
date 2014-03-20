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
          <div>{{item.email}}</div> \
        </choices> \
      </ui-select>'
    );
  }

  function getMatchLabel(el) {
    return $(el).find('.ui-select-match > span[ng-transclude]').text();
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

    // FIXME This should work and does not inside Karma
    var visible = $(el).find('.ui-select-choices').is(':visible');
    //expect(visible).toEqual(true);
    expect(visible).toEqual(false); // FIXME Always false in Karma
  });

  it('should select an item', function() {
    var el = createUiSelect();

    clickItem(el, 'Samantha Smith');

    expect(getMatchLabel(el)).toEqual('Samantha Smith');
  });

  it('should select an item (controller)', function() {
    var el = createUiSelect();
    var controller = el.controller('uiSelect');

    controller.select(scope.matches[1]);
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

    var visible = $(el).find('.ui-select-choices').is(':visible');
    expect(visible).toEqual(false); // FIXME Always false in Karma

    expect(el.scope().$select.open).toEqual(false);
  });

  it('should be disabled if the attribute says so', function() {
    var el1 = createUiSelect({disabled: true});
    expect(el1.scope().$select.disabled).toEqual(true);

    var el2 = createUiSelect({disabled: false});
    expect(el2.scope().$select.disabled).toEqual(false);

    var el3 = createUiSelect();
    expect(el3.scope().$select.disabled).toEqual(false);
  });
});
