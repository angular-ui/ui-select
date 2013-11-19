angular.module('ui.select', ['ui.keypress'])

.constant('uiSelectConfig', {
  defaultTheme: 'select2',
  defaultPlaceholder: 'Select Item',
})

.directive('uiSelect', function($document,$timeout,uiSelectConfig,uiSelectElements){
  return {
    restrict: 'E',
    templateUrl: function(tElement, tAttrs) {
      var theme = tAttrs.theme || uiSelectConfig.defaultTheme;
      return '../src/' + theme + '/select.tpl.html';
    },
    replace: true,
    require: 'ngModel',
    transclude: true,
    scope: true,
    compile: function(tElement, tAttrs, transcludeFn) {
      return function($scope, $elm, $attrs, ngModel){
        transcludeFn($scope, function(clone) {
          $scope.open = false;

          //Set transcluded elements to their correct position on template
          var transcluded = angular.element('<div/>').append(clone);
          var transMatch = uiSelectElements.byClassName(transcluded[0],'ui-select-match');
          var transChoices = uiSelectElements.byClassName(transcluded[0],'ui-select-choices');
          uiSelectElements.byClassName($elm[0],'ui-select-match').replaceWith(transMatch);
          uiSelectElements.byClassName($elm[0],'ui-select-choices').replaceWith(transChoices);

          var input = $elm.find('input');
          $scope.activate = function($event){
            if ($event) $event.stopPropagation(); // Prevent bubbling
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
            if ($scope.$select.index > 0){
              $scope.$select.index--;
              $scope.ensureHighlightVisible();
            }
          };
          $scope.down = function(){
            items = uiSelectElements.byClassName($elm[0],'ui-select-choices-row').length -1;
            if ($scope.$select.index < items) {
              $scope.$select.index++;
              $scope.ensureHighlightVisible();
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
            if (angular.element(evt.target).hasClass('ui-select-search')){
              return;
            }
            $scope.close();
            $scope.$digest();
          };
          $document.bind('click', dismissClickHandler);
        });
      };
    }
  };
})

.directive('choices', function($sce,uiSelectConfig,uiSelectElements) {
  return {
    // require: '^uiSelect',
    restrict: 'E',
    transclude: true,
    replace: true,
    templateUrl: function(tElement, tAttrs) {
      //Gets theme atribute from parent (ui-select)
      var theme = tElement[0].parentElement.getAttribute('theme') || uiSelectConfig.defaultTheme;
      return '../src/' + theme + '/choices.tpl.html';
    },
    compile: function(tElement, tAttrs, transcludeFn) {
      uiSelectElements.byClassName(tElement[0],'ui-select-choices-row').attr("ng-repeat", tAttrs.data);
      return function(scope, element, attrs){
        scope.trustAsHtml = function(value) {
          return $sce.trustAsHtml(value);
        };
        var container = element.hasClass('ui-select-choices-content') ? element[0] : uiSelectElements.byClassName(element[0],'ui-select-choices-content')[0];
        scope.ensureHighlightVisible = function(){
          var highlighted = uiSelectElements.byClassName(element[0],'ui-select-choices-row')[scope.$select.index],
              posY = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop,
              maxHeight = 200; //TODO Need to get this value from container.max-height 
          if (posY>maxHeight){
            container.scrollTop += posY-maxHeight;
          }else if (posY<highlighted.clientHeight){
            container.scrollTop -= highlighted.clientHeight-posY;
          }
        };
      };
    }
  };
})

.directive('match', function($compile,uiSelectConfig) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    templateUrl: function(tElement, tAttrs) {
      //Gets theme atribute from parent (ui-select)
      var theme = tElement[0].parentElement.getAttribute('theme') || uiSelectConfig.defaultTheme;
      return '../src/' + theme + '/match.tpl.html';
    },
    compile: function(tElement, tAttrs, transcludeFn) {
      return function($scope, $elm, $attrs, ngModel){
        transcludeFn($scope, function(clone) {
          $scope.placeholder = tAttrs.placeholder || uiSelectConfig.defaultPlaceholder;
          $elm.append(clone);
        });
      };
    }
  };
})

.filter('highlight', function() {
  function escapeRegexp(queryToEscape) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
  return function(matchItem, query) {
    return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
  };
})

.factory('uiSelectElements', function () {

  var getElementsByClassName = (function() {
    //To support IE8
    return document.getElementsByClassName ?
      function(context, className) {
       return angular.element(context.getElementsByClassName(className));
      } :
      function(context, className) {
       return angular.element(context.querySelectorAll('.' + className));
      };
  })();

  return {
    byClassName:function (context, className) {
      return getElementsByClassName(context, className);
    }
    
  };
});