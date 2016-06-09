<a name="0.17.1"></a>
## [0.17.1](https://github.com/angular-ui/ui-select/compare/v0.17.1...v0.17.1) (2016-06-09)


### Bug Fixes

* **positioning:** stop flicker when closed ([ca4d09e](https://github.com/angular-ui/ui-select/commit/ca4d09e))
* **positioning:** wait for animation to complete ([aa90dd8](https://github.com/angular-ui/ui-select/commit/aa90dd8)), closes [#1593](https://github.com/angular-ui/ui-select/issues/1593)
* search input width resizing ([5c8cf86](https://github.com/angular-ui/ui-select/commit/5c8cf86)), closes [#1575](https://github.com/angular-ui/ui-select/issues/1575)
* **uiSelectCtrl:** Prevent error when using ngAnimate < v1.4 ([8becac3](https://github.com/angular-ui/ui-select/commit/8becac3)), closes [#1626](https://github.com/angular-ui/ui-select/issues/1626)
* **uiSelectNoChoice:** make compatible with Angular 1.5 ([c944307](https://github.com/angular-ui/ui-select/commit/c944307)), closes [#1609](https://github.com/angular-ui/ui-select/issues/1609)
* **uiSelectNoChoice:** support bootstrap-multiple ([9d29307](https://github.com/angular-ui/ui-select/commit/9d29307)), closes [#1614](https://github.com/angular-ui/ui-select/issues/1614) [#1615](https://github.com/angular-ui/ui-select/issues/1615)

### Features

* **limit:** Change multi-select limit attr (#1632) ([f5888fb](https://github.com/angular-ui/ui-select/commit/f5888fb))
* **removeSelected:** Implement removeSelected property for multiple selects ([3ad084f](https://github.com/angular-ui/ui-select/commit/3ad084f))



<a name="0.17.1"></a>
## [0.17.1](https://github.com/angular-ui/ui-select/compare/v0.17.0...v0.17.1) (2016-05-16)


### Bug Fixes

* **parserResult:** Ignore undefined parserResult when using custom tpl ([cee24e5](https://github.com/angular-ui/ui-select/commit/cee24e5)), closes [#1597](https://github.com/angular-ui/ui-select/issues/1597)
* **select2:** hide dropdown if there are no items to show (same as #1588 for bootstrap) ([4c561ac](https://github.com/angular-ui/ui-select/commit/4c561ac))



<a name="0.16.1"></a>
## [0.16.1](https://github.com/angular-ui/ui-select/compare/v0.16.1...v0.17.0) (2016-05-11)


### Bug Fixes

* **a11y:** prevent list from being focusable ([4e9ab7e](https://github.com/angular-ui/ui-select/commit/4e9ab7e)), closes [#898](https://github.com/angular-ui/ui-select/issues/898)
* **autocomplete:** change to type="search" ([48cf1ba](https://github.com/angular-ui/ui-select/commit/48cf1ba)), closes [#991](https://github.com/angular-ui/ui-select/issues/991)
* **bootstrap:** hide clear button if disabled ([fe0c0c1](https://github.com/angular-ui/ui-select/commit/fe0c0c1)), closes [#1388](https://github.com/angular-ui/ui-select/issues/1388) [#980](https://github.com/angular-ui/ui-select/issues/980)
* **bootstrap:** hide dropdown if there are no items to show ([7c8b3a0](https://github.com/angular-ui/ui-select/commit/7c8b3a0)), closes [#1588](https://github.com/angular-ui/ui-select/issues/1588)
* **build:** fix sourcemap logic ([6d4849f](https://github.com/angular-ui/ui-select/commit/6d4849f))
* **demo-tagging:** error in Object Tags for input "a" ([7963684](https://github.com/angular-ui/ui-select/commit/7963684))
* **sortable:** remove classes properly ([4b1ed47](https://github.com/angular-ui/ui-select/commit/4b1ed47)), closes [#902](https://github.com/angular-ui/ui-select/issues/902)
* **tagging:** do not remove selected items when invalid ([331f819](https://github.com/angular-ui/ui-select/commit/331f819)), closes [#1359](https://github.com/angular-ui/ui-select/issues/1359)
* **tagging groupBy:** fix group-by to work with tagging ([80be85b](https://github.com/angular-ui/ui-select/commit/80be85b))
* **tagging multiple:** hide tagging item if null returned ([2f14045](https://github.com/angular-ui/ui-select/commit/2f14045))
* **uiSelectCtrl:** correcting input focus ([6444d6b](https://github.com/angular-ui/ui-select/commit/6444d6b)), closes [#1253](https://github.com/angular-ui/ui-select/issues/1253)
* **uiSelectSingleDirective:** strictly compare matching value ([a574cd4](https://github.com/angular-ui/ui-select/commit/a574cd4)), closes [#1328](https://github.com/angular-ui/ui-select/issues/1328)
* **uiSelectSort:** update model on sort completion ([9a40b6f](https://github.com/angular-ui/ui-select/commit/9a40b6f)), closes [#974](https://github.com/angular-ui/ui-select/issues/974) [#1036](https://github.com/angular-ui/ui-select/issues/1036)
* ensure highlighted before selecting on tab ([06bbd31](https://github.com/angular-ui/ui-select/commit/06bbd31)), closes [#1030](https://github.com/angular-ui/ui-select/issues/1030)
* properly gc on destruction ([95692e7](https://github.com/angular-ui/ui-select/commit/95692e7))
* show input when search is disabled ([83132b0](https://github.com/angular-ui/ui-select/commit/83132b0)), closes [#595](https://github.com/angular-ui/ui-select/issues/595) [#453](https://github.com/angular-ui/ui-select/issues/453)
* show select element when search is disabled ([f37bafd](https://github.com/angular-ui/ui-select/commit/f37bafd)), closes [#861](https://github.com/angular-ui/ui-select/issues/861)

### Features

* **perf:** debounce resize callback ([115ebf4](https://github.com/angular-ui/ui-select/commit/115ebf4))
* **perf:** optimize width resizing ([d78ba5f](https://github.com/angular-ui/ui-select/commit/d78ba5f))

### Performance Improvements

* **tagging multiple:** transform tagging item only once when filtering ([2b4a9ea](https://github.com/angular-ui/ui-select/commit/2b4a9ea))
* **uiSelectCtrl:** moving activate events out of $timeout ([926f462](https://github.com/angular-ui/ui-select/commit/926f462))
* change test in ctrl.isActive ([d6c14d4](https://github.com/angular-ui/ui-select/commit/d6c14d4))



<a name="0.16.1"></a>
# [0.16.1](https://github.com/angular-ui/ui-select/compare/v0.16.0...v0.16.1) (2016-03-23)

### Bug Fixes

* **$window:** change input size on window resize ([ce24981](https://github.com/angular-ui/ui-select/commit/ce24981)), closes [#522](https://github.com/angular-ui/ui-select/issues/522)
* **uiSelectMultipleDirective:** add $isEmpty handler ([fccc29a](https://github.com/angular-ui/ui-select/commit/fccc29a)), closes [#850](https://github.com/angular-ui/ui-select/issues/850)
* **uiSelectMultipleDirective:** refresh choices upon selection change ([03293ff](https://github.com/angular-ui/ui-select/commit/03293ff)), closes [#1243](https://github.com/angular-ui/ui-select/issues/1243)

<a name="0.16.0"></a>
## [0.15.0](https://github.com/angular-ui/ui-select/compare/v0.15.0...v0.16.0)

<a name="0.15.0"></a>
## [0.15.0](https://github.com/angular-ui/ui-select/compare/v0.14.9...v0.15.0) (2016-03-15)

### Bug Fixes

* corrects out of scope variable ([d5e30fb](https://github.com/angular-ui/ui-select/commit/d5e30fb))

### Features

* provide a way to skip the focusser ([302e80f](https://github.com/angular-ui/ui-select/commit/302e80f)), closes [#869](https://github.com/angular-ui/ui-select/issues/869) [#401](https://github.com/angular-ui/ui-select/issues/401) [#818](https://github.com/angular-ui/ui-select/issues/818) [#603](https://github.com/angular-ui/ui-select/issues/603) [#432](https://github.com/angular-ui/ui-select/issues/432)

<a name="0.14.10"></a>
## [0.14.10](https://github.com/angular-ui/ui-select/compare/v0.14.9...v0.14.10) (2016-03-13)

### Features

* provide a way to skip the focusser ([302e80f](https://github.com/angular-ui/ui-select/commit/302e80f)), closes [#869](https://github.com/angular-ui/ui-select/issues/869) [#401](https://github.com/angular-ui/ui-select/issues/401) [#818](https://github.com/angular-ui/ui-select/issues/818) [#603](https://github.com/angular-ui/ui-select/issues/603) [#432](https://github.com/angular-ui/ui-select/issues/432)

<a name="0.14.9"></a>
## [0.14.9](https://github.com/angular-ui/ui-select/compare/v0.14.9...v0.14.9) (2016-03-06)

<a name="0.14.8"></a>
## [0.14.8](https://github.com/angular-ui/ui-select/compare/v0.14.7...v0.14.8) (2016-02-18)

<a name="0.14.7"></a>
## [0.14.7](https://github.com/angular-ui/ui-select/compare/v0.14.6...v0.14.7) (2016-02-18)

### Bug Fixes

* **IE:** selects not working on IE8 ([ee65677](https://github.com/angular-ui/ui-select/commit/ee65677)), closes [#158](https://github.com/angular-ui/ui-select/issues/158)

<a name="0.14.6"></a>
## [0.14.6](https://github.com/angular-ui/ui-select/compare/v0.14.5...v0.14.6) (2016-02-18)

### Bug Fixes

* **paste:** add paste support ([1ad6f60](https://github.com/angular-ui/ui-select/commit/1ad6f60)), closes [#910](https://github.com/angular-ui/ui-select/issues/910) [#704](https://github.com/angular-ui/ui-select/issues/704) [#789](https://github.com/angular-ui/ui-select/issues/789) [#848](https://github.com/angular-ui/ui-select/issues/848) [#429](https://github.com/angular-ui/ui-select/issues/429)
* **uiSelectSort:** fix dependency not found error ([a5a6554](https://github.com/angular-ui/ui-select/commit/a5a6554))

<a name="0.14.5"></a>
## [0.14.5](https://github.com/angular-ui/ui-select/compare/v0.14.4...v0.14.5) (2016-02-18)

### Bug Fixes

* **uiSelectMultipleDirective:** fix track by error ([ced1cc0](https://github.com/angular-ui/ui-select/commit/ced1cc0)), closes [#1343](https://github.com/angular-ui/ui-select/issues/1343)

<a name="0.14.4"></a>
## [0.14.4](https://github.com/angular-ui/ui-select/compare/v0.14.3...v0.14.4) (2016-02-18)

### Bug Fixes

* Allow setting a ngClass on <ui-select> element ([6a99b08](https://github.com/angular-ui/ui-select/commit/6a99b08)), closes [#277](https://github.com/angular-ui/ui-select/issues/277)

<a name="0.14.3"></a>
## [0.14.3](https://github.com/angular-ui/ui-select/compare/v0.14.2...v0.14.3) (2016-02-18)

<a name="0.14.2"></a>
## [0.14.2](https://github.com/angular-ui/ui-select/compare/v0.14.1...v0.14.2) (2016-02-18)

### Bug Fixes

* make compatible with Angular 1.5 and non-cached templates ([0e85670](https://github.com/angular-ui/ui-select/commit/0e85670)), closes [#1422](https://github.com/angular-ui/ui-select/issues/1422) [#1356](https://github.com/angular-ui/ui-select/issues/1356) [#1325](https://github.com/angular-ui/ui-select/issues/1325) [#1239](https://github.com/angular-ui/ui-select/issues/1239)
* **commonjs:** remove CSS require ([81b0f03](https://github.com/angular-ui/ui-select/commit/81b0f03))
* **track by:** fix "track by" ([6c52e41](https://github.com/angular-ui/ui-select/commit/6c52e41)), closes [#806](https://github.com/angular-ui/ui-select/issues/806) [#665](https://github.com/angular-ui/ui-select/issues/665)

<a name="0.14.1"></a>
## [0.14.1](https://github.com/angular-ui/ui-select/compare/v0.14.0...v0.14.1) (2016-01-27)

<a name="0.14.0"></a>
# [0.14.0](https://github.com/angular-ui/ui-select/compare/v0.13.2...v0.14.0) (2016-01-25)

### Features

* **ngAnimate:** add support for ngAnimate ([8da8a6d](https://github.com/angular-ui/ui-select/commit/8da8a6d))

<a name="0.13.3"></a>
## 0.13.3 (2016-01-25)

### Added

- Add support for commonjs and npm

<a name="0.13.2"></a>
## [0.13.2](https://github.com/angular-ui/ui-select/compare/v0.13.1...v0.13.2) (2016-01-25)

### Bug Fixes

* **CSP:** avoid inline execution of javascript in choices template. ([fb88ec8](https://github.com/angular-ui/ui-select/commit/fb88ec8))

<a name="0.13.1"></a>
## [v0.13.1](https://github.com/angular-ui/ui-select/compare/v0.13.0...v0.13.1) (2015-09-29)

### Fixed

- Remove hardcoded source name when using (key,value) syntax [#1217](https://github.com/angular-ui/ui-select/pull/1217)
- Modify regex to accept a full 'collection expression' when not using (key,value) syntax [#1216](https://github.com/angular-ui/ui-select/pull/1216)
- Avoid to recalculate position when set 'down' [#1214](https://github.com/angular-ui/ui-select/issues/1214#issuecomment-144271352)

<a name="0.13.0"></a>

## [v0.13.0](https://github.com/angular-ui/ui-select/compare/v0.12.1...v0.13.0) (2015-09-29)

### Added

- Allow to configure default dropdown position [#1213](https://github.com/angular-ui/ui-select/pull/1213)
- Can use object as source with (key,value) syntax [#1208](https://github.com/angular-ui/ui-select/pull/1208)
- CHANGELOG.md file created

### Changed

- Do not run bower after install automatically [#982](https://github.com/angular-ui/ui-select/pull/982)
- Avoid setting activeItem on mouseenter to improve performance [#1211](https://github.com/angular-ui/ui-select/pull/1211)

### Fixed

- Position dropdown UP or DOWN correctly depending on the available space [#1212](https://github.com/angular-ui/ui-select/pull/1212)
- Scroll to selected item [#976](https://github.com/angular-ui/ui-select/issues/976)
- Change `autocomplete='off'` to `autocomplete='false'` [#1210](https://github.com/angular-ui/ui-select/pull/1210)
- Fix to work correctly with debugInfoEnabled(false) [#1131](https://github.com/angular-ui/ui-select/pull/1131)
- Limit the maximum number of selections allowed in multiple mode [#1110](https://github.com/angular-ui/ui-select/pull/1110)
