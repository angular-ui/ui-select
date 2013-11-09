angular.module('ui.select', ['ui.keypress']).directive('uiSelect', function($document,$timeout){
  return {
    restrict: 'E',
    /* jshint multistr: true */
    template:
    '<div class="select" ng-class="{open:open}"> \
      <button type="button" ng-click="activate()">{{$select.selected.title || \'Select Me \' }}</button> \
      <div class="ui-select-drop"> \
        <input class="ui-select-search" type="text" ui-keydown="{up: \'up()\', down: \'down()\', esc: \'close()\', enter: \'$select((data.items|filter: $select.search)[$select.index])\'}" ng-model="$select.search"> \
        <ul class="ui-select-choices" /> \
      </div> \
    </div>',
    replace: true,
    require: 'ngModel',
    transclude: true,
    scope: true,
    compile: function(tElement, tAttrs, transcludeFn) {
      return function($scope, $elm, $attrs, ngModel){
        transcludeFn($scope, function(clone) {

          var dropDiv = tElement.find('div.ui-select-drop');
          var choices = tElement.find('ul.ui-select-choices').append(clone);
          dropDiv.append(choices);

          input = $elm.find('input');
          $scope.activate = function(){
            $scope.open = true;
            //Give it time to appear before focus
            $timeout(function(){
              input.focus();
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
          var dismissClickHandler = function (evt) {
            //FIXME
            if ($elm[0] !== evt.target.parentElement) {
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
