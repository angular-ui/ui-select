angular.module('ui.select', ['ui.keypress']).directive('uiSelect', function($document,$timeout){
  return {
    restrict: 'E',
    /* jshint multistr: true */
    template:
    '<div class="ui-select-container" ng-class="{\'ui-select-container-active ui-select-dropdown-open\':open}"> \
      <a href="javascript:void(0)" class="ui-select-choice" ng-click="activate()"> \
        <span class="select2-chosen">{{$select.selected.title || \'Select Me \' }}</span> \
        <span class="ui-select-arrow"><b></b></span> \
      </a> \
      <div ng-class="{\'ui-select-display-none\':!open}" class="ui-select-drop ui-select-with-searchbox ui-select-drop-active"> \
        <div class="ui-select-search"> \
          <input class="ui-select-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ui-keydown="{up: \'up()\', down: \'down()\', esc: \'close()\', enter: \'$select((data.items|filter: $select.search)[$select.index])\'}" ng-model="$select.search"> \
        </div> \
        <ul class="ui-select-results" /> \
      </div> \
    </div>',
    replace: true,
    require: 'ngModel',
    transclude: true,
    scope: true,
    compile: function(tElement, tAttrs, transcludeFn) {
      return function($scope, $elm, $attrs, ngModel){
        transcludeFn($scope, function(clone) {

          $scope.open = false;

          var getElementsByClassName = (function() {
            //To support IE8
            return document.getElementsByClassdName ?
              function(context, className) {
               return angular.element(context.getElementsByClassName(className));
              } :
              function(context, className) {
               return angular.element(context.querySelectorAll('.' + className));
              };
          })();

          getElementsByClassName(tElement[0],'ui-select-results').append(clone);

          var input = $elm.find('input');
          $scope.activate = function(){
            $scope.open = true;
            //Give it time to appear before focus
            $timeout(function(){
              input[0].focus();
            });
          };
          $scope.$watch('$select.search', function(){
            $scope.$select.index = 0;
          });
          $scope.up = function(){
            if ($scope.$select.index > 0)
              $scope.$select.index--;
          };
          $scope.down = function(){
            items = $elm.find('ul').children().length;
            if ($scope.$select.index < items) {
              $scope.$select.index++;
            } else {
              $scope.$select.index = items;
            }
          };
          $scope.$select = function(item){
            $scope.$select.selected = item;
            ngModel.$setViewValue(item);
            ngModel.$render(item);
            $scope.close();
          };
          $scope.close = function() {
            $scope.open = false;
            $scope.$select.search = "";
          };
          var choiceArrow = getElementsByClassName(tElement[0],'ui-select-arrow');
          var searchDiv = getElementsByClassName(tElement[0],'ui-select-search');
          var dismissClickHandler = function (evt) {
            if ($elm[0] !== evt.target.parentElement && choiceArrow[0] !== evt.target.parentElement && searchDiv[0] !== evt.target.parentElement) {
              $scope.close();
              $scope.$digest();
            }
          };
          $document.bind('click', dismissClickHandler);
          ngModel.$render = function(){
            //$scope.$select.search = ngModel.$viewValue;
          };
        });
      };
    }
  };
});
