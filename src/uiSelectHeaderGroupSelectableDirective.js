uis.directive('uiSelectHeaderGroupSelectable', ['$timeout', function($timeout) {
  return {
    restrict: 'EA',
    require: ['^uiSelect'],
    scope: true,
    link: function ($scope, $element, attrs, select) {
      // TODO Why that???
      var $select = select[0];

      $scope.$watch('$select.groups', function() {
        if ($select.multiple && $select.groups) {
          var elements = $element.querySelectorAll('.ui-select-choices-group-label');

          angular.forEach(elements, function(e) {
            var element = angular.element(e);

            // Check the onClick event is not already listen
            if (!element.hasClass('ui-select-header-group-selectable')) {
              element.addClass('ui-select-header-group-selectable');

              element.on('click', function () {
                // TODO It's the good way?
                var group = $select.findGroupByName(element.text(), true);

                angular.forEach(group.items, function(item) {
                  $timeout(function() {
                    $select.select(item, false, ' ');
                  });
                });
              });
            }
          });
        } else {
          console.error('Use uiSelectHeaderGroupSelectable with no multiple uiSelect or without groupBy');
        }
      });
    }
  };
}]);
