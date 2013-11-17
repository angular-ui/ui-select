angular.module('ui.select', ['ui.keypress']).directive('uiSelect', function($document,$timeout){
  return {
    restrict: 'E',
    /* jshint multistr: true */
    template:
    '<div class="ui-select-container" ng-class="{\'ui-select-container-active ui-select-dropdown-open\':open}"> \
      <a class="ui-select-choice"></a> \
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
          //Helper functions (no jQuery)
          var hasClass = function (elem, klass) {
            if (!elem) return;
            return (" " + elem.className + " " ).indexOf( " "+klass+" " ) > -1;
          };
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

          //Set transcluded elements to their correct position on template
          var transcluded = angular.element('<div/>').append(clone);
          var transChoices = getElementsByClassName(transcluded[0],'ui-select-results');
          var transMatch = getElementsByClassName(transcluded[0],'ui-select-choice');
          getElementsByClassName($elm[0],'ui-select-results').replaceWith(transChoices[0]);
          getElementsByClassName($elm[0],'ui-select-choice').replaceWith(transMatch[0]);

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
            if ($scope.$select.index > 0){
              $scope.$select.index--;
              $scope.ensureHighlightVisible();
            }
          };
          $scope.down = function(){
            items = $elm.find('ul').children().length -1;
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
          var choiceArrow = getElementsByClassName(tElement[0],'ui-select-arrow');
          var searchDiv = getElementsByClassName(tElement[0],'ui-select-search');
          var dismissClickHandler = function (evt) {
            if (
              hasClass(evt.target,'ui-select-choice') || //Chosen label for selection
              hasClass(evt.target.parentElement,'ui-select-choice') || //No selection (Placeholder)
              choiceArrow[0] === evt.target.parentElement ||
              searchDiv[0] === evt.target.parentElement) {
              return;
            }
            $scope.close();
            $scope.$digest();
          };
          $document.bind('click', dismissClickHandler);
          ngModel.$render = function(){
            //$scope.$select.search = ngModel.$viewValue;
          };
        });
      };
    }
  };
})

.directive('choices', function($sce) {
  return {
    // require: '^uiSelect',
    restrict: 'E',
    transclude: true,
    replace: true,
    template:
      '<ul class="ui-select-results">' +
      '<li ng-class="{\'ui-select-highlighted\':$select.index==$index}"' +
      ' ng-click="$select(item)"' +
      ' ng-mousemove="$select.index=$index"' +
      ' ng-repeat="empty">' +
      ' <div class="ui-select-result-label" ng-transclude></div>' +
      '</li></ul>',
    compile: function(tElement, tAttrs, transcludeFn) {
      tElement[0].children[0].setAttribute("ng-repeat", tAttrs.data);
      return function(scope, element, attrs){
        scope.trustAsHtml = function(value) {
          return $sce.trustAsHtml(value);
        };
        scope.ensureHighlightVisible = function(){
          var highlighted = element[0].children[scope.$select.index],
              ul = element[0],
              posY = highlighted.offsetTop + highlighted.clientHeight - ul.scrollTop,
              maxHeight = 200; //Same as css
          if (posY>maxHeight){
            ul.scrollTop += posY-maxHeight;
          }else if (posY<highlighted.clientHeight){
            ul.scrollTop -= highlighted.clientHeight-posY;
          }
        };
      };
    }
  };
})

.directive('match', function($compile) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    /* jshint multistr: true */
    template:
      '<a href="javascript:void(0)" class="ui-select-choice" ng-click="activate()"> \
        <span class="ui-select-arrow"><b></b></span> \
        <span class="select2-chosen">{{selectedLabel}}</span> \
      </a>',
    compile: function(tElement, tAttrs, transcludeFn) {
      return function($scope, $elm, $attrs, ngModel){
        transcludeFn($scope, function(clone) {
          var labelWrap = angular.element("<div ng-hide='$select.selected'>" + tAttrs.placeholder + "</div>");
          var labelWrapCompiled = $compile(labelWrap)($scope);
          $elm.append(labelWrapCompiled);
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
    return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
  };
});
