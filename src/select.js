angular.module('ui.select', ['ui.keypress']).directive('uiSelect', function(){
  return {
    restrict: 'E',
    template: '<div class="select" ng-class="{open:open}"> \
      <input type="{{type}}" ui-keydown="keybindings" ng-model="$search" ng-click="activate()"> \
      <ul ng-transclude></ul> \
    </div>',
    replace: true,
    require: 'ngModel',
    transclude: true,
    link: function($scope, $elm, $attrs, ngModel){
      $scope.keybindings = {up: 'up()', down: 'down()'};
      input = $elm.find('input');
      $scope.type = 'button';
      $scope.activate = function(){
        $scope.open = true;
        $scope.type = 'text';
        input.focus();
      };
      $scope.$watch('$search', function(){
        $scope.highlight = 0;
      });
      $scope.up = function(){
        if ($scope.highlight > 0)
          $scope.highlight--;
      };
      $scope.down = function(){
        items = $elm.find('ul').children().length;
        if ($scope.highlight < items) {
          $scope.highlight++;
        } else {
          $scope.highlight = items;
        }
      };
      $scope.select = function(item){
        ngModel.$setViewValue(item);
      };
      ngModel.$render = function(){
        $scope.$search = ngModel.$viewValue;
      };
      input.bind('blur', function(){
        $scope.$apply('open=false;type="button"');
      });
    }
  };
});
