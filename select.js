angular.module('ui.select', ['ui.keypress']).directive('uiSelect', function(){
  return {
    restrict: 'E',
    /* jshint multistr: true */
    template: '<div class="select" ng-class="{open:open}"> \
      <input type="{{type}}" ui-keydown="{up: \'up()\', down: \'down()\', enter: \'$select((data.items|filter: $select.search)[$select.index].title)\'}" ng-model="$select.search" ng-click="activate()"> \
      <ul ng-transclude></ul> \
    </div>',
    replace: true,
    require: 'ngModel',
    transclude: true,
    // scope: true,
    link: function($scope, $elm, $attrs, ngModel){

      //Setting keybindings to scope wasn't working, since ui-keydown directive
      //from the template is $compiling before getting here, so no bindings created
      //$scope.keybindings = {up: 'up()', down: 'down()'};

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
      ngModel.$render = function(){
        $scope.$select.search = ngModel.$viewValue;
      };
    }
  };
});
