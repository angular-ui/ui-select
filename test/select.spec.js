describe('ui-select tests', function() {

    var scope, $rootScope, $compile;

    beforeEach(module('ui.select'));
    beforeEach(module('../src/select2/choices.tpl.html'));
    beforeEach(module('../src/select2/match.tpl.html'));
    beforeEach(module('../src/select2/select.tpl.html'));
    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $compile = _$compile_;
        scope.matches = [
          {"id": 1, "name": "Wladimir Coka", "email": "wcoka@email.com" },
          {"id": 2, "name": "Samantha Smith", "email": "sam@email.com" },
          {"id": 3, "name": "Estefanía Smith", "email": "esmith@email.com" },
          {"id": 4, "name": "Natasha Jones", "email": "ncoka@email.com" },
          {"id": 5, "name": "Nicole Smith", "email": "nicky@email.com" }
        ];
    }));

    //Utility functions
    var prepareUiSelectEl = function(inputTpl) {
        var el = $compile(angular.element(inputTpl))(scope);
        scope.$digest();
        return el;
    };

    var uiSelectElInstance1 = function(inputTpl) {
      var element = prepareUiSelectEl(
        '<ui-select ng-model="selection" style="width:300px"> \
          <match placeholder="Pick one...">{{$select.selected.name}}</match> \
          <choices data="matches | filter : $select.search"> \
              <div ng-bind-html="trustAsHtml((item.name | highlight:$select.search))"/></div> \
              <div> {{item.email}} </div> \
          </choices> \
        </ui-select> \
        ');
        return element;
    };

    it('should compile child directives', function() {

        var el = uiSelectElInstance1();

        var searchEl = $(el).find('.ui-select-search');
        expect(searchEl.length).toEqual(1);

        var matchEl = $(el).find('.ui-select-match');
        expect(matchEl.length).toEqual(1);

        var choicesContentEl = $(el).find('.ui-select-choices-content');
        expect(choicesContentEl.length).toEqual(1);

        var choicesContainerEl = $(el).find('.ui-select-choices');
        expect(choicesContainerEl.length).toEqual(1);

        var choicesElems = $(el).find('.ui-select-choices-row');
        expect(choicesElems.length).toEqual(5);

    });

});