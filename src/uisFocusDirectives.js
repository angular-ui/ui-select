uis.directive('uisAutofocusAttr', ['$timeout', function($timeout) {
  return {
    restrict: 'EA',
    require: '^uiSelect',
    link: function(scope, element, attrs, $select) {
      $timeout(function(){
        $select.setFocus();
      });
    }
  };
}]);

uis.directive('uisFocusOnAttr', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    require: '^uiSelect',
    link: function(scope, element, attrs, $select) {      
      scope.$on(attrs.uisFocusOnAttr, function() {
          $timeout(function(){
            $select.setFocus();
          });
      });
    }
  };
}]);
