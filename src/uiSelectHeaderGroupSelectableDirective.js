uis.directive('uiSelectHeaderGroupSelectable', ['$timeout', function($timeout) {
  return {
    restrict: 'EA',
    require: ['^uiSelect'],
    scope: {
      isEnabled: "<?uiSelectHeaderGroupSelectable"
    },
    link: function ($scope, $element, attrs, select) {
      // TODO Why that???
      var $select = select[0];
      if (angular.isUndefined($scope.isEnabled)) {
        $scope.isEnabled = true;
      }

      function isEnabled() {
        return angular.isUndefined($scope.isEnabled) || $scope.isEnabled;
      }

      function getElements() {
        if ($select.multiple && $select.groups) {
          return $element.querySelectorAll('.ui-select-choices-group-label');
        } else {
          console.error('Use uiSelectHeaderGroupSelectable with no multiple uiSelect or without groupBy');
          return [];
        }
      }

      function enableClick() {
        if (isEnabled()) {
          angular.forEach(getElements(), function(e) {
            var element = angular.element(e);

            // Check the onClick event is not already listen
            if (!element.hasClass('ui-select-header-group-selectable')) {
              element.addClass('ui-select-header-group-selectable');

              element.on('click', function () {
                if (isEnabled()) {
                  var group = $select.findGroupByName(element.text(), true);

                  angular.forEach(group.items, function(item) {
                    $timeout(function() {
                      $select.select(item, false, ' ');
                    });
                  });
                }
              });
            }
          });
        }
      }

      function disableClick() {
        if (!isEnabled()) {
          angular.forEach(getElements(), function(e) {
            var element = angular.element(e);
            element.removeClass('ui-select-header-group-selectable');
            element.off('click');
          });
        }
      }

      // Watch element to trigger select event
      $scope.$watch('isEnabled', function() {
        if (!isEnabled()) {
          disableClick();
        } else {
          enableClick();
        }
      });

      $scope.$watch('$select.groups', enableClick);
      $scope.$watch(function() {
        return $select.selected && $select.selected.length ? $select.selected.length : -1;
      }, enableClick);
    }
  };
}]);
