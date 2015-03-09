uis.directive('uiSelect',
  ['$document', 'uiSelectConfig', 'uiSelectMinErr', '$compile', '$parse', '$timeout',
  function($document, uiSelectConfig, uiSelectMinErr, $compile, $parse, $timeout) {

  return {
    restrict: 'EA',
    templateUrl: function(tElement, tAttrs) {
      var theme = tAttrs.theme || uiSelectConfig.theme;
      return theme + (angular.isDefined(tAttrs.multiple) ? '/select-multiple.tpl.html' : '/select.tpl.html');
    },
    replace: true,
    transclude: true,
    require: ['uiSelect', '^ngModel'],
    scope: true,

    controller: 'uiSelectCtrl',
    controllerAs: '$select',
    link: function(scope, element, attrs, ctrls, transcludeFn) {
      var $select = ctrls[0];
      var ngModel = ctrls[1];

      var searchInput = element.querySelectorAll('input.ui-select-search');

      $select.generatedId = uiSelectConfig.generateId();
      $select.baseTitle = attrs.title || 'Select box';
      $select.focusserTitle = $select.baseTitle + ' focus';
      $select.focusserId = 'focusser-' + $select.generatedId;

      $select.multiple = angular.isDefined(attrs.multiple) && (
          attrs.multiple === '' ||
          attrs.multiple.toLowerCase() === 'multiple' ||
          attrs.multiple.toLowerCase() === 'true'
      );

      $select.closeOnSelect = function() {
        if (angular.isDefined(attrs.closeOnSelect)) {
          return $parse(attrs.closeOnSelect)();
        } else {
          return uiSelectConfig.closeOnSelect;
        }
      }();

      $select.onSelectCallback = $parse(attrs.onSelect);
      $select.onRemoveCallback = $parse(attrs.onRemove);

      //From view --> model
      ngModel.$parsers.unshift(function (inputValue) {
        var locals = {},
            result;
        if ($select.multiple){
          var resultMultiple = [];
          for (var j = $select.selected.length - 1; j >= 0; j--) {
            locals = {};
            locals[$select.parserResult.itemName] = $select.selected[j];
            result = $select.parserResult.modelMapper(scope, locals);
            resultMultiple.unshift(result);
          }
          return resultMultiple;
        }else{
          locals = {};
          locals[$select.parserResult.itemName] = inputValue;
          result = $select.parserResult.modelMapper(scope, locals);
          return result;
        }
      });

      //From model --> view
      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
            locals = {},
            result;
        if (data){
          if ($select.multiple){
            var resultMultiple = [];
            var checkFnMultiple = function(list, value){
              //if the list is empty add the value to the list
              if (!list || !list.length){
                  resultMultiple.unshift(value);
                  return true;
              }
              for (var p = list.length - 1; p >= 0; p--) {
                locals[$select.parserResult.itemName] = list[p];
                result = $select.parserResult.modelMapper(scope, locals);
                if($select.parserResult.trackByExp){
                    var matches = /\.(.+)/.exec($select.parserResult.trackByExp);
                    if(matches.length>0 && result[matches[1]] == value[matches[1]]){
                        resultMultiple.unshift(list[p]);
                        return true;
                    }
                }
                if (result == value){
                  resultMultiple.unshift(list[p]);
                  return true;
                }
              }
              return false;
            };
            if (!inputValue) return resultMultiple; //If ngModel was undefined
            for (var k = inputValue.length - 1; k >= 0; k--) {
              if (!checkFnMultiple($select.selected, inputValue[k])){
                checkFnMultiple(data, inputValue[k]);
              }
            }
            return resultMultiple;
          }else{
            var checkFnSingle = function(d){
              locals[$select.parserResult.itemName] = d;
              result = $select.parserResult.modelMapper(scope, locals);
              return result == inputValue;
            };
            //If possible pass same object stored in $select.selected
            if ($select.selected && checkFnSingle($select.selected)) {
              return $select.selected;
            }
            for (var i = data.length - 1; i >= 0; i--) {
              if (checkFnSingle(data[i])) return data[i];
            }
          }
        }
        return inputValue;
      });

      //Set reference to ngModel from uiSelectCtrl
      $select.ngModel = ngModel;

      $select.choiceGrouped = function(group){
        return $select.isGrouped && group && group.name;
      };

      //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
      var focusser = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' id='{{ $select.focusserId }}' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");

      if(attrs.tabindex){
        //tabindex might be an expression, wait until it contains the actual value before we set the focusser tabindex
        attrs.$observe('tabindex', function(value) {
          //If we are using multiple, add tabindex to the search input
          if($select.multiple){
            searchInput.attr("tabindex", value);
          } else {
            focusser.attr("tabindex", value);
          }
          //Remove the tabindex on the parent so that it is not focusable
          element.removeAttr("tabindex");
        });
      }

      $compile(focusser)(scope);
      $select.focusser = focusser;

      if (!$select.multiple){

        element.append(focusser);
        focusser.bind("focus", function(){
          scope.$evalAsync(function(){
            $select.focus = true;
          });
        });
        focusser.bind("blur", function(){
          scope.$evalAsync(function(){
            $select.focus = false;
          });
        });
        focusser.bind("keydown", function(e){

          if (e.which === KEY.BACKSPACE) {
            e.preventDefault();
            e.stopPropagation();
            $select.select(undefined);
            scope.$apply();
            return;
          }

          if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
            return;
          }

          if (e.which == KEY.DOWN  || e.which == KEY.UP || e.which == KEY.ENTER || e.which == KEY.SPACE){
            e.preventDefault();
            e.stopPropagation();
            $select.activate();
          }

          scope.$digest();
        });

        focusser.bind("keyup input", function(e){

          if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || e.which === KEY.BACKSPACE) {
            return;
          }

          $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
          focusser.val('');
          scope.$digest();

        });

      }


      scope.$watch('searchEnabled', function() {
          var searchEnabled = scope.$eval(attrs.searchEnabled);
          $select.searchEnabled = searchEnabled !== undefined ? searchEnabled : uiSelectConfig.searchEnabled;
      });

      scope.$watch('sortable', function() {
          var sortable = scope.$eval(attrs.sortable);
          $select.sortable = sortable !== undefined ? sortable : uiSelectConfig.sortable;
      });

      attrs.$observe('disabled', function() {
        // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
        $select.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
        if ($select.multiple) {
          // As the search input field may now become visible, it may be necessary to recompute its size
          $select.sizeSearchInput();
        }
      });

      attrs.$observe('resetSearchInput', function() {
        // $eval() is needed otherwise we get a string instead of a boolean
        var resetSearchInput = scope.$eval(attrs.resetSearchInput);
        $select.resetSearchInput = resetSearchInput !== undefined ? resetSearchInput : true;
      });

      attrs.$observe('tagging', function() {
        if(attrs.tagging !== undefined)
        {
          // $eval() is needed otherwise we get a string instead of a boolean
          var taggingEval = scope.$eval(attrs.tagging);
          $select.tagging = {isActivated: true, fct: taggingEval !== true ? taggingEval : undefined};
        }
        else
        {
          $select.tagging = {isActivated: false, fct: undefined};
        }
      });

      attrs.$observe('taggingLabel', function() {
        if(attrs.tagging !== undefined )
        {
          // check eval for FALSE, in this case, we disable the labels
          // associated with tagging
          if ( attrs.taggingLabel === 'false' ) {
            $select.taggingLabel = false;
          }
          else
          {
            $select.taggingLabel = attrs.taggingLabel !== undefined ? attrs.taggingLabel : '(new)';
          }
        }
      });

      attrs.$observe('taggingTokens', function() {
        if (attrs.tagging !== undefined) {
          var tokens = attrs.taggingTokens !== undefined ? attrs.taggingTokens.split('|') : [',','ENTER'];
          $select.taggingTokens = {isActivated: true, tokens: tokens };
        }
      });

      //Automatically gets focus when loaded
      if (angular.isDefined(attrs.autofocus)){
        $timeout(function(){
          $select.setFocus();
        });
      }

      //Gets focus based on scope event name (e.g. focus-on='SomeEventName')
      if (angular.isDefined(attrs.focusOn)){
        scope.$on(attrs.focusOn, function() {
            $timeout(function(){
              $select.setFocus();
            });
        });
      }

      if ($select.multiple){
        scope.$watchCollection(function(){ return ngModel.$modelValue; }, function(newValue, oldValue) {
          if (oldValue != newValue)
            ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
        });
        $select.firstPass = true; // so the form doesn't get dirty as soon as it loads
        scope.$watchCollection('$select.selected', function() {
          if (!$select.firstPass) {
            ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
          } else {
            $select.firstPass = false;
          }
        });
        focusser.prop('disabled', true); //Focusser isn't needed if multiple
      }else{
        scope.$watch('$select.selected', function(newValue) {
          if (ngModel.$viewValue !== newValue) {
            ngModel.$setViewValue(newValue);
          }
        });
      }

      ngModel.$render = function() {
        if($select.multiple){
          // Make sure that model value is array
          if(!angular.isArray(ngModel.$viewValue)){
            // Have tolerance for null or undefined values
            if(angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null){
              $select.selected = [];
            } else {
              throw uiSelectMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
            }
          }
        }
        $select.selected = ngModel.$viewValue;
      };

      function onDocumentClick(e) {
        if (!$select.open) return; //Skip it if dropdown is close

        var contains = false;

        if (window.jQuery) {
          // Firefox 3.6 does not support element.contains()
          // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
          contains = window.jQuery.contains(element[0], e.target);
        } else {
          contains = element[0].contains(e.target);
        }

        if (!contains && !$select.clickTriggeredSelect) {
          //Will lose focus only with certain targets
          var focusableControls = ['input','button','textarea'];
          var targetScope = angular.element(e.target).scope(); //To check if target is other ui-select
          var skipFocusser = targetScope && targetScope.$select && targetScope.$select !== $select; //To check if target is other ui-select
          if (!skipFocusser) skipFocusser =  ~focusableControls.indexOf(e.target.tagName.toLowerCase()); //Check if target is input, button or textarea
          $select.close(skipFocusser);
          scope.$digest();
        }
        $select.clickTriggeredSelect = false;
      }

      // See Click everywhere but here event http://stackoverflow.com/questions/12931369
      $document.on('click', onDocumentClick);

      scope.$on('$destroy', function() {
        $document.off('click', onDocumentClick);
      });

      // Move transcluded elements to their correct position in main template
      transcludeFn(scope, function(clone) {
        // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

        // One day jqLite will be replaced by jQuery and we will be able to write:
        // var transcludedElement = clone.filter('.my-class')
        // instead of creating a hackish DOM element:
        var transcluded = angular.element('<div>').append(clone);

        var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
        transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
        transcludedMatch.removeAttr('data-ui-select-match'); // Properly handle HTML5 data-attributes
        if (transcludedMatch.length !== 1) {
          throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
        }
        element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

        var transcludedChoices = transcluded.querySelectorAll('.ui-select-choices');
        transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
        transcludedChoices.removeAttr('data-ui-select-choices'); // Properly handle HTML5 data-attributes
        if (transcludedChoices.length !== 1) {
          throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
        }
        element.querySelectorAll('.ui-select-choices').replaceWith(transcludedChoices);
      });
    }
  };
}]);
