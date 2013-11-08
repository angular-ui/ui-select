angular.module('ui.select', ['ui.keypress']).directive('uiSelect', function($document){
  return {
    restrict: 'E',
    /* jshint multistr: true */
    template: '<div class="select" ng-class="{open:open}"> \
      <input type="{{type}}" ui-keydown="{up: \'up()\', down: \'down()\', esc: \'close()\', enter: \'$select((data.items|filter: $select.search)[$select.index].title)\'}" ng-model="$select.search" ng-click="activate()"> \
    </div>',
    replace: true,
    require: 'ngModel',
    transclude: true,
    scope: true,
    compile: function(tElement, tAttrs, transcludeFn) {
      return function($scope, $elm, $attrs, ngModel){
        transcludeFn($scope, function(clone) {
          var choices = $("<ul/>").append(clone);
          tElement.append(choices);
          input = $elm.find('input');
          $scope.type = 'button';
          $scope.activate = function(){
            $scope.open = true;
            $scope.type = 'text';
            input.focus();
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
            ngModel.$setViewValue(item);
            ngModel.$render(item);
            $scope.close();
          };
          $scope.close = function() {
            $scope.open = false;
            $scope.type = 'button';
          };
          var dismissClickHandler = function (evt) {
            if ($elm[0] !== evt.target.parentElement) {
              $scope.close();
              $scope.$digest();
            }
          };
          $document.bind('click', dismissClickHandler);
          ngModel.$render = function(){
            $scope.$select.search = ngModel.$viewValue;
          };
        });
      };
    }
  };
});
