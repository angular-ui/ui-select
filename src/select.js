angular.module('ui.select', [])

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
    require: ['uiSelect', 'ngModel'],
    transclude: true,
    scope: true,
    controller: ['$scope', '$element', '$attrs',
      function uiSelectCtrl($scope, $element, $attrs) {

        var ctrl = this;

        this.activate = function($event){
          if ($event) $event.stopPropagation(); // Prevent bubbling
          $scope.open = true;
          //Give it time to appear before focus
          $timeout(function(){
            ctrl.input[0].focus();
          });
        };

        this.select = function(item){
          $scope.$select.selected = item;
          this.close();
          // Using a watch instead of $scope.ngModel.$setViewValue(item)
        };

        this.close = function() {
          $scope.open = false;
          $scope.$select.search = "";
        };

        this.input = $element.find('input'); //TODO could break if input is at other template

    }],
    controllerAs: 'uiSelectCtrl',
    link: function(scope, element, attrs, controllers, transcludeFn){

      scope.open = false;
      scope.$select = {}; //Namespace

      var uiSelectCtrl = controllers[0];
      var ngModelCtrl = controllers[1];

      scope.$watch('$select.selected',function(newVal,oldVal){
        if (ngModelCtrl.$viewValue != newVal) ngModelCtrl.$setViewValue(newVal);
      });

      ngModelCtrl.$render = function() {
        scope.$select.selected = ngModelCtrl.$viewValue;
      };

      $document.bind('click', function (evt) {
        if (angular.element(evt.target).hasClass('ui-select-search')){
          return;
        }
        uiSelectCtrl.close(); //Close if clicking outside
        scope.$digest();
      });

      //Move transcluded elements to their correct position on main template
      transcludeFn(scope, function(clone) {

        var transcluded = angular.element('<div/>').append(clone);

        //Child directives could be uncompiled at this point, so we check both alternatives,
        //first for compiled version (by class) or uncompiled (by tag). We place the directives
        //at the insertion points that are marked with ui-select-* classes at select.tpl.html
        //TODO: If we change directive restrict attribute to EA, we should do some changes here.

        var transMatch = uiSelectElements.byClassName(transcluded[0],'ui-select-match');
        transMatch = !transMatch.length ? transcluded.find('match') : transMatch;
        uiSelectElements.byClassName(element[0],'ui-select-match').replaceWith(transMatch);

        var transChoices = uiSelectElements.byClassName(transcluded[0],'ui-select-choices');
        transChoices = !transChoices.length ? transcluded.find('choices') : transChoices;
        uiSelectElements.byClassName(element[0],'ui-select-choices').replaceWith(transChoices);

      });

    }
  };
})

.directive('choices', function($sce,uiSelectConfig,uiSelectElements) {
  var HOT_KEYS = [9, 13, 27, 38, 40];
  return {
    require: '^uiSelect',
    restrict: 'E',
    transclude: true,
    replace: true,
    templateUrl: function(tElement, tAttrs) {
      //Gets theme atribute from parent (ui-select)
      var theme = tElement[0].parentElement.getAttribute('theme') || uiSelectConfig.defaultTheme;
      return '../src/' + theme + '/choices.tpl.html';
    },
    compile: function(tElement, tAttrs) {

      uiSelectElements.byClassName(tElement[0],'ui-select-choices-row')
        .attr("ng-repeat", 'item in ' + tAttrs.data)
        .attr("ng-mouseenter", '$select.activeIdx=$index')
        .attr("ng-click", 'uiSelectCtrl.select(item)');

      return function(scope, element, attrs, uiSelectCtrl){

        scope.trustAsHtml = function(value) {
          return $sce.trustAsHtml(value);
        };

        var container = element.hasClass('ui-select-choices-content') ? element[0] : uiSelectElements.byClassName(element[0],'ui-select-choices-content')[0];
        var ensureHighlightVisible = function(){
          var rows = uiSelectElements.byClassName(element[0],'ui-select-choices-row');
          if (!rows.length) return; //In case its empty
          var highlighted = rows[scope.$select.activeIdx],
              posY = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop,
              maxHeight = 200; //TODO Need to get this value from container.max-height 
          if (posY > maxHeight){
            container.scrollTop += posY-maxHeight;
          }else if (posY < highlighted.clientHeight){
            container.scrollTop -= highlighted.clientHeight-posY;
          }
        };

        scope.$watch('$select.search', function(){
          scope.$select.activeIdx = 0;
          ensureHighlightVisible();
        });

        //Bind keyboard events related to choices
        uiSelectCtrl.input.bind('keydown', function (evt) {

          if (HOT_KEYS.indexOf(evt.which) === -1) return; //Exit on regular key
          evt.preventDefault();

          var rows = uiSelectElements.byClassName(element[0],'ui-select-choices-row');

          if (evt.which === 40) { // down(40)
            if (scope.$select.activeIdx < rows.length) {
              scope.$select.activeIdx = (scope.$select.activeIdx + 1) % rows.length || rows.length - 1 ;
              ensureHighlightVisible();
              scope.$digest();
            }

          } else if (evt.which === 38) { // up(38)
            if (scope.$select.activeIdx > 0){
              scope.$select.activeIdx--;
              ensureHighlightVisible();
              scope.$digest();
            }

          } else if (evt.which === 13 || evt.which === 9) { // enter(13) and tab(9)
              rows[scope.$select.activeIdx].click();

          } else if (evt.which === 27) { // esc(27)
            evt.stopPropagation();
            uiSelectCtrl.close();
            scope.$digest();

          }
        });

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
    link: function(scope, element, attrs){
      scope.placeholder = attrs.placeholder || uiSelectConfig.defaultPlaceholder;
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