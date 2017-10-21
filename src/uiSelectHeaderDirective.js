uis.directive('uiSelectHeader', ['uiSelectConfig', function (uiSelectConfig) {
  return {
    templateUrl: function (tElement) {
      // Needed so the uiSelect can detect the transcluded content
      tElement.addClass('ui-select-header');

      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      return theme + '/header.tpl.html';
    },
    restrict: 'EA',
    transclude: true,
    replace: true
  };
}]);
