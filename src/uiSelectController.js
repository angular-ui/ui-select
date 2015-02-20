/**
 * Contains ui-select "intelligence".
 *
 * The goal is to limit dependency on the DOM whenever possible and
 * put as much logic in the controller (instead of the link functions) as possible so it can be easily tested.
 */
uis.controller('uiSelectCtrl',
  ['$scope', '$element', '$timeout', '$filter', 'RepeatParser', 'uiSelectMinErr', 'uiSelectConfig',
  function($scope, $element, $timeout, $filter, RepeatParser, uiSelectMinErr, uiSelectConfig) {

  var ctrl = this;

  var EMPTY_SEARCH = '';

  ctrl.placeholder = undefined;
  ctrl.search = EMPTY_SEARCH;
  ctrl.activeIndex = 0;
  ctrl.activeMatchIndex = -1;
  ctrl.items = [];
  ctrl.selected = undefined;
  ctrl.open = false;
  ctrl.focus = false;
  ctrl.focusser = undefined; //Reference to input element used to handle focus events
  ctrl.disabled = undefined; // Initialized inside uiSelect directive link function
  ctrl.searchEnabled = undefined; // Initialized inside uiSelect directive link function
  ctrl.sortable = undefined; // Initialized inside uiSelect directive link function
  ctrl.resetSearchInput = undefined; // Initialized inside uiSelect directive link function
  ctrl.refreshDelay = undefined; // Initialized inside uiSelectChoices directive link function
  ctrl.multiple = false; // Initialized inside uiSelect directive link function
  ctrl.disableChoiceExpression = undefined; // Initialized inside uiSelect directive link function
  ctrl.tagging = {isActivated: false, fct: undefined};
  ctrl.taggingTokens = {isActivated: false, tokens: undefined};
  ctrl.lockChoiceExpression = undefined; // Initialized inside uiSelect directive link function
  ctrl.closeOnSelect = true; // Initialized inside uiSelect directive link function
  ctrl.clickTriggeredSelect = false;
  ctrl.$filter = $filter;

  ctrl.isEmpty = function() {
    return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
  };

  var _searchInput = $element.querySelectorAll('input.ui-select-search');
  if (_searchInput.length !== 1) {
    throw uiSelectMinErr('searchInput', "Expected 1 input.ui-select-search but got '{0}'.", _searchInput.length);
  }

  // Most of the time the user does not want to empty the search input when in typeahead mode
  function _resetSearchInput() {
    if (ctrl.resetSearchInput || (ctrl.resetSearchInput === undefined && uiSelectConfig.resetSearchInput)) {
      ctrl.search = EMPTY_SEARCH;
      //reset activeIndex
      if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
        ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
      }
    }
  }

  // When the user clicks on ui-select, displays the dropdown list
  ctrl.activate = function(initSearchValue, avoidReset) {
    if (!ctrl.disabled  && !ctrl.open) {
      if(!avoidReset) _resetSearchInput();
      ctrl.focusser.prop('disabled', true); //Will reactivate it on .close()
      ctrl.open = true;
      ctrl.activeMatchIndex = -1;

      ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;

      // ensure that the index is set to zero for tagging variants
      // that where first option is auto-selected
      if ( ctrl.activeIndex === -1 && ctrl.taggingLabel !== false ) {
        ctrl.activeIndex = 0;
      }

      // Give it time to appear before focus
      $timeout(function() {
        ctrl.search = initSearchValue || ctrl.search;
        _searchInput[0].focus();
      });
    }
  };

  ctrl.findGroupByName = function(name) {
    return ctrl.groups && ctrl.groups.filter(function(group) {
      return group.name === name;
    })[0];
  };

  ctrl.parseRepeatAttr = function(repeatAttr, groupByExp) {
    function updateGroups(items) {
      ctrl.groups = [];
      angular.forEach(items, function(item) {
        var groupFn = $scope.$eval(groupByExp);
        var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
        var group = ctrl.findGroupByName(groupName);
        if(group) {
          group.items.push(item);
        }
        else {
          ctrl.groups.push({name: groupName, items: [item]});
        }
      });
      ctrl.items = [];
      ctrl.groups.forEach(function(group) {
        ctrl.items = ctrl.items.concat(group.items);
      });
    }

    function setPlainItems(items) {
      ctrl.items = items;
    }

    var setItemsFn = groupByExp ? updateGroups : setPlainItems;

    ctrl.parserResult = RepeatParser.parse(repeatAttr);

    ctrl.isGrouped = !!groupByExp;
    ctrl.itemProperty = ctrl.parserResult.itemName;

    // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
    $scope.$watchCollection(ctrl.parserResult.source, function(items) {

      if (items === undefined || items === null) {
        // If the user specifies undefined or null => reset the collection
        // Special case: items can be undefined if the user did not initialized the collection on the scope
        // i.e $scope.addresses = [] is missing
        ctrl.items = [];
      } else {
        if (!angular.isArray(items)) {
          throw uiSelectMinErr('items', "Expected an array but got '{0}'.", items);
        } else {
          if (ctrl.multiple){
            //Remove already selected items (ex: while searching)
            var filteredItems = items.filter(function(i) {return ctrl.selected.indexOf(i) < 0;});
            setItemsFn(filteredItems);
          }else{
            setItemsFn(items);
          }
          ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters

        }
      }

    });

    if (ctrl.multiple){
      //Remove already selected items
      $scope.$watchCollection('$select.selected', function(selectedItems){
        var data = ctrl.parserResult.source($scope);
        if (!selectedItems.length) {
          setItemsFn(data);
        }else{
          if ( data !== undefined ) {
            var filteredItems = data.filter(function(i) {return selectedItems.indexOf(i) < 0;});
            setItemsFn(filteredItems);
          }
        }
        ctrl.sizeSearchInput();
      });
    }

  };

  var _refreshDelayPromise;

  /**
   * Typeahead mode: lets the user refresh the collection using his own function.
   *
   * See Expose $select.search for external / remote filtering https://github.com/angular-ui/ui-select/pull/31
   */
  ctrl.refresh = function(refreshAttr) {
    if (refreshAttr !== undefined) {

      // Debounce
      // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
      // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
      if (_refreshDelayPromise) {
        $timeout.cancel(_refreshDelayPromise);
      }
      _refreshDelayPromise = $timeout(function() {
        $scope.$eval(refreshAttr);
      }, ctrl.refreshDelay);
    }
  };

  ctrl.setActiveItem = function(item) {
    ctrl.activeIndex = ctrl.items.indexOf(item);
  };

  ctrl.isActive = function(itemScope) {
    if ( !ctrl.open ) {
      return false;
    }
    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isActive =  itemIndex === ctrl.activeIndex;

    if ( !isActive || ( itemIndex < 0 && ctrl.taggingLabel !== false ) ||( itemIndex < 0 && ctrl.taggingLabel === false) ) {
      return false;
    }

    if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
      itemScope.$eval(ctrl.onHighlightCallback);
    }

    return isActive;
  };

  ctrl.isDisabled = function(itemScope) {

    if (!ctrl.open) return;

    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isDisabled = false;
    var item;

    if (itemIndex >= 0 && !angular.isUndefined(ctrl.disableChoiceExpression)) {
      item = ctrl.items[itemIndex];
      isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression)); // force the boolean value
      item._uiSelectChoiceDisabled = isDisabled; // store this for later reference
    }

    return isDisabled;
  };


  // When the user selects an item with ENTER or clicks the dropdown
  ctrl.select = function(item, skipFocusser, $event) {
    if (item === undefined || !item._uiSelectChoiceDisabled) {

      if ( ! ctrl.items && ! ctrl.search ) return;

      if (!item || !item._uiSelectChoiceDisabled) {
        if(ctrl.tagging.isActivated) {
          // if taggingLabel is disabled, we pull from ctrl.search val
          if ( ctrl.taggingLabel === false ) {
            if ( ctrl.activeIndex < 0 ) {
              item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
              if (!item || angular.equals( ctrl.items[0], item ) ) {
                return;
              }
            } else {
              // keyboard nav happened first, user selected from dropdown
              item = ctrl.items[ctrl.activeIndex];
            }
          } else {
            // tagging always operates at index zero, taggingLabel === false pushes
            // the ctrl.search value without having it injected
            if ( ctrl.activeIndex === 0 ) {
              // ctrl.tagging pushes items to ctrl.items, so we only have empty val
              // for `item` if it is a detected duplicate
              if ( item === undefined ) return;

              // create new item on the fly if we don't already have one;
              // use tagging function if we have one
              if ( ctrl.tagging.fct !== undefined && typeof item === 'string' ) {
                item = ctrl.tagging.fct(ctrl.search);
                if (!item) return;
              // if item type is 'string', apply the tagging label
              } else if ( typeof item === 'string' ) {
                // trim the trailing space
                item = item.replace(ctrl.taggingLabel,'').trim();
              }
            }
          }
          // search ctrl.selected for dupes potentially caused by tagging and return early if found
          if ( ctrl.selected && angular.isArray(ctrl.selected) && ctrl.selected.filter( function (selection) { return angular.equals(selection, item); }).length > 0 ) {
            ctrl.close(skipFocusser);
            return;
          }
        }

        var locals = {};
        locals[ctrl.parserResult.itemName] = item;

        if(ctrl.multiple) {
          ctrl.selected.push(item);
          ctrl.sizeSearchInput();
        } else {
          ctrl.selected = item;
        }

        $timeout(function(){
          ctrl.onSelectCallback($scope, {
            $item: item,
            $model: ctrl.parserResult.modelMapper($scope, locals)
          });
        });

        if (!ctrl.multiple || ctrl.closeOnSelect) {
          ctrl.close(skipFocusser);
        }
        if ($event && $event.type === 'click') {
          ctrl.clickTriggeredSelect = true;
        }
      }
    }
  };

  // Closes the dropdown
  ctrl.close = function(skipFocusser) {
    if (!ctrl.open) return;
    if (ctrl.ngModel && ctrl.ngModel.$setTouched) ctrl.ngModel.$setTouched();
    _resetSearchInput();
    ctrl.open = false;
    if (!ctrl.multiple){
      $timeout(function(){
        ctrl.focusser.prop('disabled', false);
        if (!skipFocusser) ctrl.focusser[0].focus();
      },0,false);
    }
  };

  ctrl.clear = function($event) {
    ctrl.select(undefined);
    $event.stopPropagation();
    ctrl.focusser[0].focus();
  };

  // Toggle dropdown
  ctrl.toggle = function(e) {
    if (ctrl.open) {
      ctrl.close();
      e.preventDefault();
      e.stopPropagation();
    } else {
      ctrl.activate();
    }
  };

  ctrl.isLocked = function(itemScope, itemIndex) {
      var isLocked, item = ctrl.selected[itemIndex];

      if (item && !angular.isUndefined(ctrl.lockChoiceExpression)) {
          isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression)); // force the boolean value
          item._uiSelectChoiceLocked = isLocked; // store this for later reference
      }

      return isLocked;
  };

  // Remove item from multiple select
  ctrl.removeChoice = function(index){
    var removedChoice = ctrl.selected[index];

    // if the choice is locked, can't remove it
    if(removedChoice._uiSelectChoiceLocked) return;

    var locals = {};
    locals[ctrl.parserResult.itemName] = removedChoice;

    ctrl.selected.splice(index, 1);
    ctrl.activeMatchIndex = -1;
    ctrl.sizeSearchInput();

    // Give some time for scope propagation.
    $timeout(function(){
      ctrl.onRemoveCallback($scope, {
        $item: removedChoice,
        $model: ctrl.parserResult.modelMapper($scope, locals)
      });
    });
  };

  ctrl.getPlaceholder = function(){
    //Refactor single?
    if(ctrl.multiple && ctrl.selected.length) return;
    return ctrl.placeholder;
  };

  var containerSizeWatch;
  ctrl.sizeSearchInput = function(){
    var input = _searchInput[0],
        container = _searchInput.parent().parent()[0];
    _searchInput.css('width','10px');
    var calculate = function(){
      var newWidth = container.clientWidth - input.offsetLeft - 10;
      if(newWidth < 50) newWidth = container.clientWidth;
      _searchInput.css('width',newWidth+'px');
    };
    $timeout(function(){ //Give tags time to render correctly
      if (container.clientWidth === 0 && !containerSizeWatch){
        containerSizeWatch = $scope.$watch(function(){ return container.clientWidth;}, function(newValue){
          if (newValue !== 0){
            calculate();
            containerSizeWatch();
            containerSizeWatch = null;
          }
        });
      }else if (!containerSizeWatch) {
        calculate();
      }
    }, 0, false);
  };

  function _handleDropDownSelection(key) {
    var processed = true;
    switch (key) {
      case KEY.DOWN:
        if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        else if (ctrl.activeIndex < ctrl.items.length - 1) { ctrl.activeIndex++; }
        break;
      case KEY.UP:
        if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1)) { ctrl.activeIndex--; }
        break;
      case KEY.TAB:
        if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
        break;
      case KEY.ENTER:
        if(ctrl.open && ctrl.activeIndex >= 0){
          ctrl.select(ctrl.items[ctrl.activeIndex]); // Make sure at least one dropdown item is highlighted before adding.
        } else {
          ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        }
        break;
      case KEY.ESC:
        ctrl.close();
        break;
      default:
        processed = false;
    }
    return processed;
  }

  // Handles selected options in "multiple" mode
  function _handleMatchSelection(key){
    var caretPosition = _getCaretPosition(_searchInput[0]),
        length = ctrl.selected.length,
        // none  = -1,
        first = 0,
        last  = length-1,
        curr  = ctrl.activeMatchIndex,
        next  = ctrl.activeMatchIndex+1,
        prev  = ctrl.activeMatchIndex-1,
        newIndex = curr;

    if(caretPosition > 0 || (ctrl.search.length && key == KEY.RIGHT)) return false;

    ctrl.close();

    function getNewActiveMatchIndex(){
      switch(key){
        case KEY.LEFT:
          // Select previous/first item
          if(~ctrl.activeMatchIndex) return prev;
          // Select last item
          else return last;
          break;
        case KEY.RIGHT:
          // Open drop-down
          if(!~ctrl.activeMatchIndex || curr === last){
            ctrl.activate();
            return false;
          }
          // Select next/last item
          else return next;
          break;
        case KEY.BACKSPACE:
          // Remove selected item and select previous/first
          if(~ctrl.activeMatchIndex){
            ctrl.removeChoice(curr);
            return prev;
          }
          // Select last item
          else return last;
          break;
        case KEY.DELETE:
          // Remove selected item and select next item
          if(~ctrl.activeMatchIndex){
            ctrl.removeChoice(ctrl.activeMatchIndex);
            return curr;
          }
          else return false;
      }
    }

    newIndex = getNewActiveMatchIndex();

    if(!ctrl.selected.length || newIndex === false) ctrl.activeMatchIndex = -1;
    else ctrl.activeMatchIndex = Math.min(last,Math.max(first,newIndex));

    return true;
  }

  // Bind to keyboard shortcuts
  _searchInput.on('keydown', function(e) {

    var key = e.which;

    // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
    //   //TODO: SEGURO?
    //   ctrl.close();
    // }

    $scope.$apply(function() {
      var processed = false;
      var tagged = false;

      if(ctrl.multiple && KEY.isHorizontalMovement(key)){
        processed = _handleMatchSelection(key);
      }

      if (!processed && (ctrl.items.length > 0 || ctrl.tagging.isActivated)) {
        processed = _handleDropDownSelection(key);
        if ( ctrl.taggingTokens.isActivated ) {
          for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
            if ( ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode] ) {
              // make sure there is a new value to push via tagging
              if ( ctrl.search.length > 0 ) {
                tagged = true;
              }
            }
          }
          if ( tagged ) {
            $timeout(function() {
              _searchInput.triggerHandler('tagged');
              var newItem = ctrl.search.replace(KEY.MAP[e.keyCode],'').trim();
              if ( ctrl.tagging.fct ) {
                newItem = ctrl.tagging.fct( newItem );
              }
              if (newItem) ctrl.select(newItem, true);
            });
          }
        }
      }

      if (processed  && key != KEY.TAB) {
        //TODO Check si el tab selecciona aun correctamente
        //Crear test
        e.preventDefault();
        e.stopPropagation();
      }
    });

    if(KEY.isVerticalMovement(key) && ctrl.items.length > 0){
      _ensureHighlightVisible();
    }

  });

  // If tagging try to split by tokens and add items
  _searchInput.on('paste', function (e) {
    var data = e.originalEvent.clipboardData.getData('text/plain');
    if (data && data.length > 0 && ctrl.taggingTokens.isActivated && ctrl.tagging.fct) {
      var items = data.split(ctrl.taggingTokens.tokens[0]); // split by first token only
      if (items && items.length > 0) {
        angular.forEach(items, function (item) {
          var newItem = ctrl.tagging.fct(item);
          if (newItem) {
            ctrl.select(newItem, true);
          }
        });
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  _searchInput.on('keyup', function(e) {
    if ( ! KEY.isVerticalMovement(e.which) ) {
      $scope.$evalAsync( function () {
        ctrl.activeIndex = ctrl.taggingLabel === false ? -1 : 0;
      });
    }
    // Push a "create new" item into array if there is a search string
    if ( ctrl.tagging.isActivated && ctrl.search.length > 0 ) {

      // return early with these keys
      if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which) ) {
        return;
      }
      // always reset the activeIndex to the first item when tagging
      ctrl.activeIndex = ctrl.taggingLabel === false ? -1 : 0;
      // taggingLabel === false bypasses all of this
      if (ctrl.taggingLabel === false) return;

      var items = angular.copy( ctrl.items );
      var stashArr = angular.copy( ctrl.items );
      var newItem;
      var item;
      var hasTag = false;
      var dupeIndex = -1;
      var tagItems;
      var tagItem;

      // case for object tagging via transform `ctrl.tagging.fct` function
      if ( ctrl.tagging.fct !== undefined) {
        tagItems = ctrl.$filter('filter')(items,{'isTag': true});
        if ( tagItems.length > 0 ) {
          tagItem = tagItems[0];
        }
        // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
        if ( items.length > 0 && tagItem ) {
          hasTag = true;
          items = items.slice(1,items.length);
          stashArr = stashArr.slice(1,stashArr.length);
        }
        newItem = ctrl.tagging.fct(ctrl.search);
        newItem.isTag = true;
        // verify the the tag doesn't match the value of an existing item
        if ( stashArr.filter( function (origItem) { return angular.equals( origItem, ctrl.tagging.fct(ctrl.search) ); } ).length > 0 ) {
          return;
        }
        newItem.isTag = true;
      // handle newItem string and stripping dupes in tagging string context
      } else {
        // find any tagging items already in the ctrl.items array and store them
        tagItems = ctrl.$filter('filter')(items,function (item) {
          return item.match(ctrl.taggingLabel);
        });
        if ( tagItems.length > 0 ) {
          tagItem = tagItems[0];
        }
        item = items[0];
        // remove existing tag item if found (should only ever be one tag item)
        if ( item !== undefined && items.length > 0 && tagItem ) {
          hasTag = true;
          items = items.slice(1,items.length);
          stashArr = stashArr.slice(1,stashArr.length);
        }
        newItem = ctrl.search+' '+ctrl.taggingLabel;
        if ( _findApproxDupe(ctrl.selected, ctrl.search) > -1 ) {
          return;
        }
        // verify the the tag doesn't match the value of an existing item from
        // the searched data set or the items already selected
        if ( _findCaseInsensitiveDupe(stashArr.concat(ctrl.selected)) ) {
          // if there is a tag from prev iteration, strip it / queue the change
          // and return early
          if ( hasTag ) {
            items = stashArr;
            $scope.$evalAsync( function () {
              ctrl.activeIndex = 0;
              ctrl.items = items;
            });
          }
          return;
        }
        if ( _findCaseInsensitiveDupe(stashArr) ) {
          // if there is a tag from prev iteration, strip it
          if ( hasTag ) {
            ctrl.items = stashArr.slice(1,stashArr.length);
          }
          return;
        }
      }
      if ( hasTag ) dupeIndex = _findApproxDupe(ctrl.selected, newItem);
      // dupe found, shave the first item
      if ( dupeIndex > -1 ) {
        items = items.slice(dupeIndex+1,items.length-1);
      } else {
        items = [];
        items.push(newItem);
        items = items.concat(stashArr);
      }
      $scope.$evalAsync( function () {
        ctrl.activeIndex = 0;
        ctrl.items = items;
      });
    }
  });

  _searchInput.on('tagged', function() {
    $timeout(function() {
      _resetSearchInput();
    });
  });

  _searchInput.on('blur', function() {
    $timeout(function() {
      ctrl.activeMatchIndex = -1;
    });
  });

  function _findCaseInsensitiveDupe(arr) {
    if ( arr === undefined || ctrl.search === undefined ) {
      return false;
    }
    var hasDupe = arr.filter( function (origItem) {
      if ( ctrl.search.toUpperCase() === undefined || origItem === undefined ) {
        return false;
      }
      return origItem.toUpperCase() === ctrl.search.toUpperCase();
    }).length > 0;

    return hasDupe;
  }

  function _findApproxDupe(haystack, needle) {
    var dupeIndex = -1;
  if(angular.isArray(haystack)) {
    var tempArr = angular.copy(haystack);
    for (var i = 0; i <tempArr.length; i++) {
    // handle the simple string version of tagging
    if ( ctrl.tagging.fct === undefined ) {
      // search the array for the match
      if ( tempArr[i]+' '+ctrl.taggingLabel === needle ) {
      dupeIndex = i;
      }
    // handle the object tagging implementation
    } else {
      var mockObj = tempArr[i];
      mockObj.isTag = true;
      if ( angular.equals(mockObj, needle) ) {
      dupeIndex = i;
      }
    }
    }
  }
    return dupeIndex;
  }

  function _getCaretPosition(el) {
    if(angular.isNumber(el.selectionStart)) return el.selectionStart;
    // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
    else return el.value.length;
  }

  // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
  function _ensureHighlightVisible() {
    var container = $element.querySelectorAll('.ui-select-choices-content');
    var choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
    }

    if (ctrl.activeIndex < 0) {
      return;
    }

    var highlighted = choices[ctrl.activeIndex];
    var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
    var height = container[0].offsetHeight;

    if (posY > height) {
      container[0].scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      if (ctrl.isGrouped && ctrl.activeIndex === 0)
        container[0].scrollTop = 0; //To make group header visible when going all the way up
      else
        container[0].scrollTop -= highlighted.clientHeight - posY;
    }
  }

  $scope.$on('$destroy', function() {
    _searchInput.off('keyup keydown tagged blur paste');
  });
}]);
