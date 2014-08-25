'use strict';

describe('ui-select tests', function() {
  var scope, $rootScope, $compile, $timeout;

  beforeEach(module('ngSanitize', 'ui.select'));
  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
	  scope.selection = {}
    scope.getGroupLabel = function(person) {
      return person.age % 2 ? 'even' : 'odd';
    };

    scope.people = [
      { name: 'Adam',      email: 'adam@email.com',      group: 'Foo', age: 12 },
      { name: 'Amalie',    email: 'amalie@email.com',    group: 'Foo', age: 12 },
      { name: 'Estefanía', email: 'estefanía@email.com', group: 'Foo', age: 21 },
      { name: 'Adrian',    email: 'adrian@email.com',    group: 'Foo', age: 21 },
      { name: 'Wladimir',  email: 'wladimir@email.com',  group: 'Foo', age: 30 },
      { name: 'Samantha',  email: 'samantha@email.com',  group: 'bar', age: 30 },
      { name: 'Nicole',    email: 'nicole@email.com',    group: 'bar', age: 43 },
      { name: 'Natasha',   email: 'natasha@email.com',   group: 'Baz', age: 54 }
    ];

    scope.someObject = {};
    scope.someObject.people = [
      { name: 'Adam',      email: 'adam@email.com',      group: 'Foo', age: 12 },
      { name: 'Amalie',    email: 'amalie@email.com',    group: 'Foo', age: 12 },
      { name: 'Estefanía', email: 'estefanía@email.com', group: 'Foo', age: 21 },
      { name: 'Adrian',    email: 'adrian@email.com',    group: 'Foo', age: 21 },
      { name: 'Wladimir',  email: 'wladimir@email.com',  group: 'Foo', age: 30 },
      { name: 'Samantha',  email: 'samantha@email.com',  group: 'bar', age: 30 },
      { name: 'Nicole',    email: 'nicole@email.com',    group: 'bar', age: 43 },
      { name: 'Natasha',   email: 'natasha@email.com',   group: 'Baz', age: 54 }
    ];
  }));


  // DSL (domain-specific language)

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
      '<ui-select ng-model="selection.selected"' + attrsHtml + '> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
  }

  function getMatchLabel(el) {
    return $(el).find('.ui-select-match > span[ng-transclude]:not(.ng-hide)').text();
  }

  function clickItem(el, text) {
    $(el).find('.ui-select-choices-row div:contains("' + text + '")').click();
    scope.$digest();
  }

  function clickMatch(el) {
    $(el).find('.ui-select-match').click();
    scope.$digest();
  }

  function isDropdownOpened(el) {
    // Does not work with jQuery 2.*, have to use jQuery 1.11.*
    // This will be fixed in AngularJS 1.3
    // See issue with unit-testing directive using karma https://github.com/angular/angular.js/issues/4640#issuecomment-35002427
    return el.scope().$select.open && el.hasClass('open');
  }

  function triggerKeydown(element, keyCode) {
    var e = jQuery.Event("keydown");
    e.which = keyCode;
    e.keyCode = keyCode;
    element.trigger(e);
  }

  // Tests

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

    var choicesEls = $(el).find('.ui-select-choices-row');
    expect(choicesEls.length).toEqual(8);
  });

  it('should correctly render initial state', function() {
    scope.selection.selected = scope.people[0];

    var el = createUiSelect();

    expect(getMatchLabel(el)).toEqual('Adam');
  });

  it('should display the choices when activated', function() {
    var el = createUiSelect();

    expect(isDropdownOpened(el)).toEqual(false);

    clickMatch(el);

    expect(isDropdownOpened(el)).toEqual(true);
  });

  it('should select an item', function() {
    var el = createUiSelect();

    clickItem(el, 'Samantha');

    expect(getMatchLabel(el)).toEqual('Samantha');
  });

  it('should select an item (controller)', function() {
    var el = createUiSelect();

    el.scope().$select.select(scope.people[1]);
    scope.$digest();

    expect(getMatchLabel(el)).toEqual('Amalie');
  });

  it('should not select a non existing item', function() {
    var el = createUiSelect();

    clickItem(el, "I don't exist");

    expect(getMatchLabel(el)).toEqual('');
  });

  it('should close the choices when an item is selected', function() {
    var el = createUiSelect();

    clickMatch(el);

    expect(isDropdownOpened(el)).toEqual(true);

    clickItem(el, 'Samantha');

    expect(isDropdownOpened(el)).toEqual(false);
  });

  it('should be disabled if the attribute says so', function() {
    var el1 = createUiSelect({disabled: true});
    expect(el1.scope().$select.disabled).toEqual(true);
    clickMatch(el1);
    expect(isDropdownOpened(el1)).toEqual(false);

    var el2 = createUiSelect({disabled: false});
    expect(el2.scope().$select.disabled).toEqual(false);
    clickMatch(el2);
    expect(isDropdownOpened(el2)).toEqual(true);

    var el3 = createUiSelect();
    expect(el3.scope().$select.disabled).toEqual(false);
    clickMatch(el3);
    expect(isDropdownOpened(el3)).toEqual(true);
  });

  // See when an item that evaluates to false (such as "false" or "no") is selected, the placeholder is shown https://github.com/angular-ui/ui-select/pull/32
  it('should not display the placeholder when item evaluates to false', function() {
    scope.items = ['false'];

    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match>{{$select.selected}}</ui-select-match> \
        <ui-select-choices repeat="item in items | filter: $select.search"> \
          <div ng-bind-html="item | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    expect(el.scope().$select.selected).toEqual(undefined);

    clickItem(el, 'false');

    expect(el.scope().$select.selected).toEqual('false');
    expect(getMatchLabel(el)).toEqual('false');
  });

  describe('choices group', function() {
    function getGroupLabel(item) {
      return item.parent('.ui-select-choices-group').find('.ui-select-choices-group-label');
    }
    function createUiSelect() {
      return compileTemplate(
          '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices group-by="\'group\'" repeat="person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
      );
    }

    it('should create items group', function() {
      var el = createUiSelect();
      expect(el.find('.ui-select-choices-group').length).toBe(3);
    });

    it('should show label before each group', function() {
      var el = createUiSelect();
      expect(el.find('.ui-select-choices-group .ui-select-choices-group-label').map(function() {
        return this.textContent;
      }).toArray()).toEqual(['Baz', 'Foo', 'bar']);
    });

    it('should hide empty groups', function() {
      var el = createUiSelect();
      el.scope().$select.search = 'd';
      scope.$digest();

      expect(el.find('.ui-select-choices-group .ui-select-choices-group-label').map(function() {
        return this.textContent;
      }).toArray()).toEqual(['Foo']);
    });

    it('should change activeItem through groups', function() {
      var el = createUiSelect();
      el.scope().$select.search = 'n';
      scope.$digest();
      var choices = el.find('.ui-select-choices-row');
      expect(choices.eq(0)).toHaveClass('active');
      expect(getGroupLabel(choices.eq(0)).text()).toBe('Baz');

      triggerKeydown(el.find('input'), 40 /*Down*/);
      scope.$digest();
      expect(choices.eq(1)).toHaveClass('active');
      expect(getGroupLabel(choices.eq(1)).text()).toBe('Foo');
    });
  });

  describe('choices group by function', function() {
    function createUiSelect() {
      return compileTemplate(
        '<ui-select ng-model="selection.selected"> \
      <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
      <ui-select-choices group-by="getGroupLabel" repeat="person in people | filter: $select.search"> \
        <div ng-bind-html="person.name | highlight: $select.search"></div> \
      </ui-select-choices> \
    </ui-select>'
      );
    }
    it("should extract group value through function", function () {
      var el = createUiSelect();
      expect(el.find('.ui-select-choices-group .ui-select-choices-group-label').map(function() {
        return this.textContent;
      }).toArray()).toEqual(['even', 'odd']);
    });
  });

  it('should throw when no ui-select-choices found', function() {
    expect(function() {
      compileTemplate(
        '<ui-select ng-model="selection.selected"> \
          <ui-select-match></ui-select-match> \
        </ui-select>'
      );
    }).toThrow(new Error('[ui.select:transcluded] Expected 1 .ui-select-choices but got \'0\'.'));
  });

  it('should throw when no repeat attribute is provided to ui-select-choices', function() {
    expect(function() {
      compileTemplate(
        '<ui-select ng-model="selection.selected"> \
          <ui-select-choices></ui-select-choices> \
        </ui-select>'
      );
    }).toThrow(new Error('[ui.select:repeat] Expected \'repeat\' expression.'));
  });

  it('should throw when repeat attribute has incorrect format ', function() {
    expect(function() {
      compileTemplate(
        '<ui-select ng-model="selection.selected"> \
          <ui-select-match></ui-select-match> \
          <ui-select-choices repeat="incorrect format people"></ui-select-choices> \
      </ui-select>'
      );
    }).toThrow(new Error('[ui.select:iexp] Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'incorrect format people\'.'));
  });

  it('should throw when no ui-select-match found', function() {
    expect(function() {
      compileTemplate(
        '<ui-select ng-model="selection.selected"> \
          <ui-select-choices repeat="item in items"></ui-select-choices> \
        </ui-select>'
      );
    }).toThrow(new Error('[ui.select:transcluded] Expected 1 .ui-select-match but got \'0\'.'));
  });

  it('should format the model correctly using alias', function() {
    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person as person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    clickItem(el, 'Samantha');
	  expect(scope.selection.selected).toBe(scope.people[5]);
  });
  
  it('should parse the model correctly using alias', function() {
    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person as person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    scope.selection.selected = scope.people[5];
    scope.$digest();
    expect(getMatchLabel(el)).toEqual('Samantha');
  });
  
  it('should format the model correctly using property of alias', function() {
    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person.name as person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    clickItem(el, 'Samantha');
	  expect(scope.selection.selected).toBe('Samantha');
  });
  
  it('should parse the model correctly using property of alias', function() {
    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person.name as person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    scope.selection.selected = 'Samantha';
    scope.$digest();
    expect(getMatchLabel(el)).toEqual('Samantha');
  });
  
  it('should parse the model correctly using property of alias with async choices data', function() {
    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person.name as person in peopleAsync | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    $timeout(function() {
      scope.peopleAsync = scope.people;
    });

    scope.selection.selected = 'Samantha';
    scope.$digest();
    expect(getMatchLabel(el)).toEqual('');

    $timeout.flush(); //After choices populated (async), it should show match correctly
    expect(getMatchLabel(el)).toEqual('Samantha');

  });

  //TODO Is this really something we should expect?
  it('should parse the model correctly using property of alias but passed whole object', function() {
    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person.name as person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    scope.selection.selected = scope.people[5];
    scope.$digest();
    expect(getMatchLabel(el)).toEqual('Samantha');
  });
  
  it('should format the model correctly without alias', function() {
    var el = createUiSelect();
    clickItem(el, 'Samantha');
	  expect(scope.selection.selected).toBe(scope.people[5]);
  });
  
  it('should parse the model correctly without alias', function() {
    var el = createUiSelect();
    scope.selection.selected = scope.people[5];
    scope.$digest();
    expect(getMatchLabel(el)).toEqual('Samantha');
  });

  it('should display choices correctly with child array', function() {
    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person in someObject.people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    scope.selection.selected = scope.people[5];
    scope.$digest();
    expect(getMatchLabel(el)).toEqual('Samantha');
  });

  it('should format the model correctly using property of alias and when using child array for choices', function() {
    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person.name as person in someObject.people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );
    clickItem(el, 'Samantha');
    expect(scope.selection.selected).toBe('Samantha');
  });

  it('should invoke select callback on select', function () {

    scope.onSelectFn = function ($item, $model, $label) {
      scope.$item = $item;
      scope.$model = $model;
    };
    var el = compileTemplate(
      '<ui-select on-select="onSelectFn($item, $model)" ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person.name as person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );

    expect(scope.$item).toBeFalsy();
    expect(scope.$model).toBeFalsy();

    clickItem(el, 'Samantha');
    expect(scope.selection.selected).toBe('Samantha');

    expect(scope.$item).toEqual(scope.people[5]);
    expect(scope.$model).toEqual('Samantha');

  });

  it('should set $item & $model correctly when invoking callback on select and no single prop. binding', function () {

    scope.onSelectFn = function ($item, $model, $label) {
      scope.$item = $item;
      scope.$model = $model;
    };

    var el = compileTemplate(
      '<ui-select on-select="onSelectFn($item, $model)" ng-model="selection.selected"> \
        <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
        <ui-select-choices repeat="person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-bind-html="person.email | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );

    expect(scope.$item).toBeFalsy();
    expect(scope.$model).toBeFalsy();

    clickItem(el, 'Samantha');
    expect(scope.$item).toEqual(scope.$model);

  });

  it('should append/transclude content (with correct scope) that users add at <match> tag', function () {

    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match> \
          <span ng-if="$select.selected.name!==\'Wladimir\'">{{$select.selected.name}}</span>\
          <span ng-if="$select.selected.name===\'Wladimir\'">{{$select.selected.name | uppercase}}</span>\
        </ui-select-match> \
        <ui-select-choices repeat="person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
        </ui-select-choices> \
      </ui-select>'
    );

    clickItem(el, 'Samantha');
    expect(getMatchLabel(el).trim()).toEqual('Samantha');

    clickItem(el, 'Wladimir');
    expect(getMatchLabel(el).trim()).not.toEqual('Wladimir');
    expect(getMatchLabel(el).trim()).toEqual('WLADIMIR');

  });
  it('should append/transclude content (with correct scope) that users add at <choices> tag', function () {

    var el = compileTemplate(
      '<ui-select ng-model="selection.selected"> \
        <ui-select-match> \
        </ui-select-match> \
        <ui-select-choices repeat="person in people | filter: $select.search"> \
          <div ng-bind-html="person.name | highlight: $select.search"></div> \
          <div ng-if="person.name==\'Wladimir\'"> \
            <span class="only-once">I should appear only once</span>\
          </div> \
        </ui-select-choices> \
      </ui-select>'
    );

    expect($(el).find('.only-once').length).toEqual(1);


  });

  describe('search-enabled option', function() {

    var el;

    function setupSelectComponent(searchEnabled, theme) {
      el = compileTemplate(
        '<ui-select ng-model="selection.selected" theme="' + theme + '" search-enabled="' + searchEnabled + '"> \
          <ui-select-match placeholder="Pick one...">{{$select.selected.name}}</ui-select-match> \
          <ui-select-choices repeat="person in people | filter: $select.search"> \
            <div ng-bind-html="person.name | highlight: $select.search"></div> \
            <div ng-bind-html="person.email | highlight: $select.search"></div> \
          </ui-select-choices> \
        </ui-select>'
      );
    }

    describe('selectize theme', function() {

      it('should show search input when true', function() {
        setupSelectComponent('true', 'selectize');
        expect($(el).find('.ui-select-search')).not.toHaveClass('ng-hide');
      });

      it('should hide search input when false', function() {
        setupSelectComponent('false', 'selectize');
        expect($(el).find('.ui-select-search')).toHaveClass('ng-hide');
      });

    });

    describe('select2 theme', function() {

      it('should show search input when true', function() {
        setupSelectComponent('true', 'select2');
        expect($(el).find('.select2-search')).not.toHaveClass('ng-hide');
      });

      it('should hide search input when false', function() {
        setupSelectComponent('false', 'select2');
        expect($(el).find('.select2-search')).toHaveClass('ng-hide');
      });

    });

    describe('bootstrap theme', function() {

      it('should show search input when true', function() {
        setupSelectComponent('true', 'bootstrap');
        clickMatch(el);
        expect($(el).find('.ui-select-search')).not.toHaveClass('ng-hide');
      });

      it('should hide search input when false', function() {
        setupSelectComponent('false', 'bootstrap');
        clickMatch(el);
        expect($(el).find('.ui-select-search')).toHaveClass('ng-hide');
      });

    });

  });

});
