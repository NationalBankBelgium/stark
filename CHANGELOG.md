<a name="10.0.0-rc.5"></a>
# [10.0.0-rc.5](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.4...10.0.0-rc.5) (2020-02-21)


### Bug Fixes

* **build-main:** `npm run install:starter` is now working well on every platform (MacOS, Windows, Linux) ([c7590b2](https://github.com/nationalbankbelgium/stark/commit/c7590b2)), closes [#1617](https://github.com/nationalbankbelgium/stark/issues/1617)
* **stark-ui:** enhance styling of date time picker component to display the 'clear' button correctly aligned in IE 11 ([3a3e832](https://github.com/nationalbankbelgium/stark/commit/3a3e832)), closes [#1430](https://github.com/nationalbankbelgium/stark/issues/1430)
* **stark-ui:** remove wrong `[@internal](https://github.com/internal)` decorator on `_globalFilterFormCtrl` in table component ([e85b810](https://github.com/nationalbankbelgium/stark/commit/e85b810)), closes [#1644](https://github.com/nationalbankbelgium/stark/issues/1644)


### Features

* **stark-all:** upgrade `[@nationalbankbelgium](https://github.com/nationalbankbelgium)/code-style` and `codelyzer` dependencies and adapt code ([77d6b29](https://github.com/nationalbankbelgium/stark/commit/77d6b29))
* **stark-all:** upgrade `stylelint` dependency to 13.0.0 and adapt code ([f4ff4dc](https://github.com/nationalbankbelgium/stark/commit/f4ff4dc))


### BREAKING CHANGES

* **stark-all:** Due to the update of the `codelyzer` dependency, multiple rules have been renamed and new rules been added, as documented on [codelyzer/CHANGELOG.md](https://github.com/mgechev/codelyzer/blob/master/CHANGELOG.md#500-2019-03-27). We strongly recommend to upgrade your `tslint` configuration to use the new rules. The [@nationalbankbelgium/code-style](https://github.com/NationalBankBelgium/code-style) library contains the NBB recommended configuration for `codelyzer@5.2.x`.



<a name="10.0.0-rc.4"></a>
# [10.0.0-rc.4](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.3...10.0.0-rc.4) (2020-02-06)


### Bug Fixes

* **build-main:** changed expected node version to 10 in gh-deploy script ([ce3819b](https://github.com/nationalbankbelgium/stark/commit/ce3819b)), closes [#1485](https://github.com/nationalbankbelgium/stark/issues/1485)
* **build-main:** fix sync scripts for starter + add 'showcase' in scopes of commitlint ([798094c](https://github.com/nationalbankbelgium/stark/commit/798094c))
* **stark-build:** don't parse Prettier Typescript parser in Webpack to prevent "Can't resolve '[@microsoft](https://github.com/microsoft)/typescript-etw'" warning ([9ebe868](https://github.com/nationalbankbelgium/stark/commit/9ebe868)), closes [#1483](https://github.com/nationalbankbelgium/stark/issues/1483)
* **stark-showcase:** add missing hammerjs dependency ([c19f4c0](https://github.com/nationalbankbelgium/stark/commit/c19f4c0))
* **stark-starter:** add missing hammerjs dependency ([b781c02](https://github.com/nationalbankbelgium/stark/commit/b781c02))
* **stark-ui:** app-data - fixed issues with detail-slot not displayed correctly on small screens ([155509a](https://github.com/nationalbankbelgium/stark/commit/155509a)), closes [#1555](https://github.com/nationalbankbelgium/stark/issues/1555)
* **stark-ui:** app-sidebar - header is now visible on iOS devices (iTouch, iPhone, iPad) ([e107c71](https://github.com/nationalbankbelgium/stark/commit/e107c71)), closes [#1338](https://github.com/nationalbankbelgium/stark/issues/1338)
* **stark-ui:** session - prevent click outside the Session Timeout Warning Dialog ([8283216](https://github.com/nationalbankbelgium/stark/commit/8283216))
* **stark-ui:** table - Multisort - fix order issue when adding/removing sort criteria ([d113d05](https://github.com/nationalbankbelgium/stark/commit/d113d05)), closes [#1478](https://github.com/nationalbankbelgium/stark/issues/1478)


### Features

* **stark-ui:** add footer to table component ([159b245](https://github.com/nationalbankbelgium/stark/commit/159b245)), closes [#1540](https://github.com/nationalbankbelgium/stark/issues/1540)
* **stark-ui:** route-search - add support for partial matching ([c9802d7](https://github.com/nationalbankbelgium/stark/commit/c9802d7)), closes [#1335](https://github.com/nationalbankbelgium/stark/issues/1335)
* **starter:** configure husky and lint-staged properly ([ce600d1](https://github.com/nationalbankbelgium/stark/commit/ce600d1))



<a name="10.0.0-rc.3"></a>
# [10.0.0-rc.3](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.2...10.0.0-rc.3) (2020-01-10)


### Bug Fixes

* **stark-testing:** don't parse 'prettier/parser-typescript.js' with karma-typescript to prevent uncaught exception thrown as from Prettier 1.19 ([a290eb9](https://github.com/nationalbankbelgium/stark/commit/a290eb9)), closes [#1434](https://github.com/nationalbankbelgium/stark/issues/1434)
* **stark-ui:** add missing componentName and ":" in debug messages in StarkAppData and StarkAppSidebar components ([79ac571](https://github.com/nationalbankbelgium/stark/commit/79ac571))
* **stark-ui:** add support for `onClickCallback` column properties in Table component ([c5e3847](https://github.com/nationalbankbelgium/stark/commit/c5e3847)), closes [#1466](https://github.com/nationalbankbelgium/stark/issues/1466)
* **stark-ui:** change the Multisort component to display the label instead of the column ([fc3863c](https://github.com/nationalbankbelgium/stark/commit/fc3863c)), closes [#1397](https://github.com/nationalbankbelgium/stark/issues/1397)
* **stark-ui:** fixed column issue when rawValue is undefined, cellFormatter is not called ([815ac6c](https://github.com/nationalbankbelgium/stark/commit/815ac6c)), closes [#1465](https://github.com/nationalbankbelgium/stark/issues/1465)
* **stark-ui:** table actions column is not displayed anymore if no row actions are defined ([b1ec04e](https://github.com/nationalbankbelgium/stark/commit/b1ec04e)), closes [#1462](https://github.com/nationalbankbelgium/stark/issues/1462)


### Features

* **stark-ui:** add support for displaying the "items per page" dropdown also in Pagination on "compact" mode ([705bb23](https://github.com/nationalbankbelgium/stark/commit/705bb23)), closes [#1248](https://github.com/nationalbankbelgium/stark/issues/1248)



<a name="10.0.0-rc.2"></a>
# [10.0.0-rc.2](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.1...10.0.0-rc.2) (2019-10-28)


### Bug Fixes

* **docs:** update BrowserStack badge to display correctly from `README.md` ([f102bed](https://github.com/nationalbankbelgium/stark/commit/f102bed)), closes [#1387](https://github.com/nationalbankbelgium/stark/issues/1387)
* **stark-core:** add missing correlation-id header in the HTTP request sent to flush the logs ([4cf5f87](https://github.com/nationalbankbelgium/stark/commit/4cf5f87)), closes [#1319](https://github.com/nationalbankbelgium/stark/issues/1319)
* **stark-demo:** replace encapsulated styles of Table Regular Component by global styles since they depend on Angular Material theming ([97b969e](https://github.com/nationalbankbelgium/stark/commit/97b969e)), closes [#1311](https://github.com/nationalbankbelgium/stark/issues/1311)
* **stark-ui:** fix missing width in the "items per page" dropdown of StarkPagination component ([7962c25](https://github.com/nationalbankbelgium/stark/commit/7962c25)), closes [#1345](https://github.com/nationalbankbelgium/stark/issues/1345)



<a name="10.0.0-rc.1"></a>
# [10.0.0-rc.1](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.0...10.0.0-rc.1) (2019-09-25)


### Bug Fixes

* **stark-ui:** app-data, set top postion of the detail pane to 100% ([abc8962](https://github.com/nationalbankbelgium/stark/commit/abc8962)), closes [#1341](https://github.com/nationalbankbelgium/stark/issues/1341)
* **stark-ui:** change the Multisort component to display the label instead of the name of the column ([fc47144](https://github.com/nationalbankbelgium/stark/commit/fc47144)), closes [#1397](https://github.com/nationalbankbelgium/stark/issues/1397)
* **stark-ui:** fix side navigation rendering behind header ([ed580f1](https://github.com/nationalbankbelgium/stark/commit/ed580f1)), closes [#1338](https://github.com/nationalbankbelgium/stark/issues/1338)
* **stark-ui:** reset line-height of input ([7289ec7](https://github.com/nationalbankbelgium/stark/commit/7289ec7)), closes [#1374](https://github.com/nationalbankbelgium/stark/issues/1374)
* **stark-ui:** select only available rows with select all on table ([6bfe4e2](https://github.com/nationalbankbelgium/stark/commit/6bfe4e2)), closes [#1392](https://github.com/nationalbankbelgium/stark/issues/1392)


### Features

* **stark-core:** include url hash part when landing on site ([ba6985a](https://github.com/nationalbankbelgium/stark/commit/ba6985a))
* **stark-demo:** add anchors to example viewer component ([29afe52](https://github.com/nationalbankbelgium/stark/commit/29afe52)), closes [#1214](https://github.com/nationalbankbelgium/stark/issues/1214)
* **stark-demo:** add ids to examples ([5b86433](https://github.com/nationalbankbelgium/stark/commit/5b86433)), closes [#1214](https://github.com/nationalbankbelgium/stark/issues/1214)
* **stark-ui:** add the possibility to display the filter of the table and the filter of their columns above or below the title ([86137fc](https://github.com/nationalbankbelgium/stark/commit/86137fc)), closes [#1352](https://github.com/nationalbankbelgium/stark/issues/1352)



<a name="10.0.0-rc.0"></a>
# [10.0.0-rc.0](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.8...10.0.0-rc.0) (2019-08-08)


### Bug Fixes

* **stark-demo:** enhance script to replace baseHref and deployUrl in any JS, CSS and JS.MAP file in Showcase when deploying to GhPages ([54ea128](https://github.com/nationalbankbelgium/stark/commit/54ea128)), closes [#1328](https://github.com/nationalbankbelgium/stark/issues/1328)
* **stark-demo:** move header outside of sidenav-content ([f7ab74b](https://github.com/nationalbankbelgium/stark/commit/f7ab74b)), closes [#1338](https://github.com/nationalbankbelgium/stark/issues/1338)
* **stark-ui:** change table actions when input changes ([0fdd43e](https://github.com/nationalbankbelgium/stark/commit/0fdd43e)), closes [#1315](https://github.com/nationalbankbelgium/stark/issues/1315)
* **stark-ui:** dropdown - fix container click + badly floating label in multiSelect ([b29c762](https://github.com/nationalbankbelgium/stark/commit/b29c762)), closes [#1369](https://github.com/nationalbankbelgium/stark/issues/1369) [#1370](https://github.com/nationalbankbelgium/stark/issues/1370)
* **stark-ui:** ui dropdown: not taking into account option emitEvent ([15eea33](https://github.com/nationalbankbelgium/stark/commit/15eea33)), closes [#1364](https://github.com/nationalbankbelgium/stark/issues/1364)


### Features

* **stark-demo:** add back Grid Layout example to Layout demo page ([e2b8e55](https://github.com/nationalbankbelgium/stark/commit/e2b8e55))
* **stark-ui:** table - add support for angular CDK selection model ([a20da4f](https://github.com/nationalbankbelgium/stark/commit/a20da4f)), closes [#1366](https://github.com/nationalbankbelgium/stark/issues/1366)


### Performance Improvements

* **stark-demo:** set ChangeDetectionStrategy.OnPush to ExampleViewer component to prevent Angular from running unnecessary change detection cycles ([709c261](https://github.com/nationalbankbelgium/stark/commit/709c261))
* **stark-ui:** set ChangeDetectionStrategy.OnPush to UI components to prevent Angular from running unnecessary change detection cycles ([dff48b9](https://github.com/nationalbankbelgium/stark/commit/dff48b9))



<a name="10.0.0-beta.8"></a>
# [10.0.0-beta.8](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.7...10.0.0-beta.8) (2019-06-06)


### Bug Fixes

* **build-main:** fix travis branches (before alpha/beta, now alpha/beta/rc) ([53987ae](https://github.com/nationalbankbelgium/stark/commit/53987ae))
* **stark-demo:** enhance change language logic in Showcase and Starter to also change Moment and date pickers locale ([75420fd](https://github.com/nationalbankbelgium/stark/commit/75420fd))
* **stark-demo:** remove workaround added in [#788](https://github.com/nationalbankbelgium/stark/issues/788) for basscss missing PCSS variables (solved in latest version: 8.1.0) ([80b7734](https://github.com/nationalbankbelgium/stark/commit/80b7734))
* **stark-ui:** coerce 'required' input in StarkDatePicker to properly show the asterisk on the field ([0fd9fca](https://github.com/nationalbankbelgium/stark/commit/0fd9fca)), closes [#1255](https://github.com/nationalbankbelgium/stark/issues/1255)
* **stark-ui:** display the invalid status only when the datepicker is touched. Adapt HTML in demo examples ([9a8318d](https://github.com/nationalbankbelgium/stark/commit/9a8318d)), closes [#1257](https://github.com/nationalbankbelgium/stark/issues/1257)
* **stark-ui:** enable 'keepCharPositions' option in internal mask config of timestamp mask directive. Fix wrong max and min values in date parts. ([e126260](https://github.com/nationalbankbelgium/stark/commit/e126260)), closes [#1260](https://github.com/nationalbankbelgium/stark/issues/1260)
* **stark-ui:** fix regression in ProgressIndicator directive introduced in [#1218](https://github.com/nationalbankbelgium/stark/issues/1218) ([2f378fd](https://github.com/nationalbankbelgium/stark/commit/2f378fd))
* **stark-ui:** fix wrong code coverage report generation path in karma CI config (bug introduced in [#1147](https://github.com/nationalbankbelgium/stark/issues/1147)) ([8d656e6](https://github.com/nationalbankbelgium/stark/commit/8d656e6))
* **stark-ui:** fix wrong imports 'from "[@nationalbankbelgium](https://github.com/nationalbankbelgium)/stark-ui"' in Table module ([e0b3ee0](https://github.com/nationalbankbelgium/stark/commit/e0b3ee0))
* **stark-ui:** overwrite viewBox value when using `starkSvgViewBox` directive ([63f82e1](https://github.com/nationalbankbelgium/stark/commit/63f82e1)), closes [#1216](https://github.com/nationalbankbelgium/stark/issues/1216)
* **stark-ui:** properly size `.stark-main-container` on different screen sizes ([f8e4441](https://github.com/nationalbankbelgium/stark/commit/f8e4441))
* **stark-ui:** table - Add support to show row index ([37af1c7](https://github.com/nationalbankbelgium/stark/commit/37af1c7)), closes [#1283](https://github.com/nationalbankbelgium/stark/issues/1283)
* **stark-ui:** table - fix sorting + fix onChanges on columnProperties ([b7f374d](https://github.com/nationalbankbelgium/stark/commit/b7f374d)), closes [#1241](https://github.com/nationalbankbelgium/stark/issues/1241)


### Chores

* **stark-build:** remove code-style from Stark in favor of @NationalBankBelgium/code-style ([3661f43](https://github.com/nationalbankbelgium/stark/commit/3661f43)), closes [#1293](https://github.com/nationalbankbelgium/stark/issues/1293)


### Code Refactoring

* **stark-ui:** move internal properties from StarkProgressIndicatorConfig to a new StarkProgressIndicatorFullConfig ([36a362a](https://github.com/nationalbankbelgium/stark/commit/36a362a))
* **stark-ui:** remove 'StarkComponentUtil.isInputEnabled' in favor of Angular CDK function 'coerceBooleanProperty' ([3889c88](https://github.com/nationalbankbelgium/stark/commit/3889c88)), closes [#1190](https://github.com/nationalbankbelgium/stark/issues/1190)


### Features

* **build:** update TypeScript configuration and TSLint configuration ([f3d00eb](https://github.com/nationalbankbelgium/stark/commit/f3d00eb)), closes [#1144](https://github.com/nationalbankbelgium/stark/issues/1144)
* **stark-all:** upgrade to TypeScript 3.2 (latest version supported in Angular 7.2) ([600f88e](https://github.com/nationalbankbelgium/stark/commit/600f88e)), closes [#1234](https://github.com/nationalbankbelgium/stark/issues/1234)
* **stark-build:** enable all strict type checking options in tsconfig.json file. Remove obsolete options ([ae3fccc](https://github.com/nationalbankbelgium/stark/commit/ae3fccc))
* **stark-build:** enhance/enable stricter rules in TSLint/codelyzer config to improve code style and consistency ([1cad77d](https://github.com/nationalbankbelgium/stark/commit/1cad77d))
* **stark-build:** tslintLoader - Disable typecheck rules to remove warnings since typeCheck is false ([ab61379](https://github.com/nationalbankbelgium/stark/commit/ab61379)), closes [#405](https://github.com/nationalbankbelgium/stark/issues/405)
* **stark-core:** allow configuring the User profile resource path used by the User Repository ([8698970](https://github.com/nationalbankbelgium/stark/commit/8698970)), closes [#956](https://github.com/nationalbankbelgium/stark/issues/956)
* **stark-core:** upgrade 'class-validator' to the latest version (0.9.1). Fix breaking changes in validations on ApplicationConfig and Backend entities ([ce4f3fb](https://github.com/nationalbankbelgium/stark/commit/ce4f3fb)), closes [#1237](https://github.com/nationalbankbelgium/stark/issues/1237)
* **stark-demo:** adapt polyfills (app and tests) according to the new structure in core-js 3.0.0 ([8da6515](https://github.com/nationalbankbelgium/stark/commit/8da6515))
* **stark-ui:** change color of global filter icon to indicate when the global filter is applied ([69d0d05](https://github.com/nationalbankbelgium/stark/commit/69d0d05)), closes [#1303](https://github.com/nationalbankbelgium/stark/issues/1303)
* **stark-ui:** implement `ControlValueAccessor` on `DateRangePicker` component ([0e78064](https://github.com/nationalbankbelgium/stark/commit/0e78064)), closes [#1197](https://github.com/nationalbankbelgium/stark/issues/1197)
* **stark-ui:** implement `stark-date-time-picker` module/component ([6075e6a](https://github.com/nationalbankbelgium/stark/commit/6075e6a)), closes [#587](https://github.com/nationalbankbelgium/stark/issues/587)
* **stark-ui:** table - Add support to show rows counter ([bdad94f](https://github.com/nationalbankbelgium/stark/commit/bdad94f)), closes [#1244](https://github.com/nationalbankbelgium/stark/issues/1244)


### BREAKING CHANGES

* **stark-build:** code style configurations have been removed from this
package and moved
to the new package **@nationalbankbelgium/code-style**. See
[@NationalBankBelgium/code-style](https://github.com/NationalBankBelgium/code-style)
for more info about how to include those configs in your project. You
can also check how they are included in the
[Showcase](https://github.com/NationalBankBelgium/stark/tree/master/showcase)
and
[Starter](https://github.com/NationalBankBelgium/stark/tree/master/starter)
apps.
* **stark-ui:** `StarkComponentUtil.isInputEnabled()` function has been removed. To coerce boolean inputs in your components you can use the `coerceBooleanProperty()` function from `@angular/cdk/coercion` instead.
* **stark-ui:** `stark-date-range-picker` is now implemented as a ControlValueAccessor to better integrate with Angular Forms:

  - new `rangeFormGroup` input to provide the start and end date form
  controls. You can handle validations and error messages via those form
  controls.
  - new `required` input to mark the control as required
  and display the required asterisk '*' in the start/end date pickers
  (same as with the `stark-date-picker`).
  - the `isDisabled` input has been renamed to `disabled`. If you use
  the new `rangeFormGroup` input to provide your start/end date form controls, then you should disable/enable those form
  controls directly yourself instead of using the `disabled` input.
* **stark-build:** Some TSLint and codelyzer stricter rules are now enabled:

  - `jsdoc-format` (TSLint)
  - `no-redundant-jsdoc` (TSLint)
  - `no-unbound-method` (TSLint)
  - `no-unnecessary-type-assertion` (TSLint)
  - `restrict-plus-operands` (TSLint)
  - `no-life-cycle-call` (codelyzer)
  - `prefer-output-readonly` (codelyzer)
  - `no-queries-parameter` (codelyzer)
  - `use-view-encapsulation` (codelyzer)

  Projects extending the TSLint config from `@nationalbankbelgium/stark-build`
  will most likely receive more TSLint warnings when running `npm run lint` or `ng lint`.

  To resolve these warnings you can first try **adding the script** below
  to your `package.json` and running `npm run lint-ts:fix`:

  ```JSON
    "lint-ts:fix": "node --max_old_space_size=4096 ./node_modules/tslint/bin/tslint --config ./tslint.json --project ./tsconfig.json --format codeFrame --fix"
  ```

  **This should fix most if not all of the new warnings you are gettting.**

  Alternatively, you can disable the stricter rules mentioned above at your convenience.
* **stark-ui:** the main container (`main.stark-main-container`) will now have a 100% width on some smaller (< 1100px) screen sizes.
* **stark-ui:** `starkSvgViewBox` will now overwrite the `viewBox` value of the svg. If this is not desired the `starkSvgViewBox` directive should be removed from the element.
* **stark-ui:** `StarkProgressIndicatorConfig` object now contains
only `topic` and `type` properties. The rest of properties (`visible`, `listenersCount` and `pendingListenersCount`) are now in a new `StarkProgressIndicatorFullConfig` object that is only used internally by the `StarkProgressIndicatorService`. This change does not affect the functionality of the `StarkProgressIndicatorDirective` since the removed properties were in fact not used by the directive.
* **build:** Projects extending the `@nationalbankbelgium/stark-build/tsconfig.json` will possibly break.
Projects extending the `@nationalbankbelgium/stark-build/config/tslint.json` will most likely receive more tslint warnings.

  - **Build breaking**

  Preferably this can be resolved by **refactoring the code** for improved quality, but if desired the effects of this update can be reverted.

  To fix your TypeScript build add the following option to your `tsconfig.json` under `"compilerOptions"`.

  ```JSON
    "strictPropertyInitialization": false
  ```

  - **TSLint warnings**

  To resolve the warnings received by TSLint when running `npm run lint` you can first try **adding the script** below to your `package.json` and running `npm run lint-ts:fix`.

  ```JSON
  "lint-ts:fix": "node --max_old_space_size=4096 ./node_modules/tslint/bin/tslint --config ./tslint.json --project ./tsconfig.json --format codeFrame --fix",
  ```

  **This should fix most if not all of the new warnings you are getting.**

  After running the scripts any additional warnings caused by this update can be solved by **adding types**.

  _Alternatively you can revert the new TSLint rules by adding the following lines to your `tslint.json` under `"rules"`._

  ```
  "no-inferrable-types": false,
  "typedef": [
    true,
    "call-signature",
    // "arrow-call-signature",
    "parameter",
    "arrow-parameter",
    "property-declaration",
    "variable-declaration",
    "member-variable-declaration",
    "object-destructuring",
    "array-destructuring"
  ]
  ```
* **stark-core:** 'class-validator' upgraded from v0.7.3 to v0.9.1. Not a breaking change in any Stark package; however, if you are using validation decorators from 'class-validator' yourself please check its [CHANGELOG](https://github.com/typestack/class-validator/blob/master/CHANGELOG.md) to know the breaking changes in versions 0.8.x and 0.9.x.



<a name="10.0.0-beta.7"></a>
# [10.0.0-beta.7](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.6...10.0.0-beta.7) (2019-04-02)


### Bug Fixes

* **release:** enhance check for stark versions in Starter to skip those packages that are not listed as dependencies ([b1b50dd](https://github.com/nationalbankbelgium/stark/commit/b1b50dd))
* **showcase:** fix subscription issue in dropdown demo page ([95bbf75](https://github.com/nationalbankbelgium/stark/commit/95bbf75))
* **stark-demo:** change default behaviour of collapsible icon ([3737371](https://github.com/nationalbankbelgium/stark/commit/3737371)), closes [#1013](https://github.com/nationalbankbelgium/stark/issues/1013)
* **stark-demo:** fix `route-search-component` tests failing with ` Uncaught TypeError: Cannot read property 'focus' of null thrown` ([1d39083](https://github.com/nationalbankbelgium/stark/commit/1d39083))
* **stark-demo:** fix reference border ([3bd81e4](https://github.com/nationalbankbelgium/stark/commit/3bd81e4))
* **stark-demo:** fix wrong reference links in Dialogs demo page ([0fe2e77](https://github.com/nationalbankbelgium/stark/commit/0fe2e77))
* **stark-ui:** change background-color of `.search-field .mat-form-field-wrapper` to variable $offWh ([87aa706](https://github.com/nationalbankbelgium/stark/commit/87aa706)), closes [#1181](https://github.com/nationalbankbelgium/stark/issues/1181)
* **stark-ui:** change default behaviour of collapsible icon ([552461f](https://github.com/nationalbankbelgium/stark/commit/552461f))
* **stark-ui:** date-picker - disabled stark-date-picker not focusable anymore ([ac3e673](https://github.com/nationalbankbelgium/stark/commit/ac3e673))


### Features

* **build:** add lodash es imports and lodash types ([7d8b2e5](https://github.com/nationalbankbelgium/stark/commit/7d8b2e5)), closes [#1129](https://github.com/nationalbankbelgium/stark/issues/1129) [monounity/karma-typescript#320](https://github.com/monounity/karma-typescript/issues/320) [#1145](https://github.com/nationalbankbelgium/stark/issues/1145) [#150](https://github.com/nationalbankbelgium/stark/issues/150)
* **stark-rbac:** implement new Stark-RBAC package including StarkRBACAuthorization module. Add demos for RBAC features in Showcase ([53d3f33](https://github.com/nationalbankbelgium/stark/commit/53d3f33)), closes [#105](https://github.com/nationalbankbelgium/stark/issues/105)
* **stark-ui:** date-picker - add support to translate placeholder internally ([63545f8](https://github.com/nationalbankbelgium/stark/commit/63545f8)), closes [#1204](https://github.com/nationalbankbelgium/stark/issues/1204)
* **stark-ui:** date-range-picker - add support for timestamp mask ([0403dea](https://github.com/nationalbankbelgium/stark/commit/0403dea)), closes [#1231](https://github.com/nationalbankbelgium/stark/issues/1231)
* **stark-ui:** dropdown - add support for ControlValueAccessor, MatFormFieldControl and Validator ([dbbcd65](https://github.com/nationalbankbelgium/stark/commit/dbbcd65)), closes [#1193](https://github.com/nationalbankbelgium/stark/issues/1193)


### BREAKING CHANGES

* **stark-ui:** Collapsible component:
  - `iconSpinningEnabled` Input has been removed. The spin effect can be
  done easily by the developer if needed
  - The default icon is now 'chevron-right' and it is rotated 90
  degrees when collapsible is expanded.
* **stark-ui:**   * **dropdownFormControl** has been removed. Please use [formControl] instead
  * **isDisabled** has been replaced by **disabled**



<a name="10.0.0-beta.6"></a>
# [10.0.0-beta.6](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.5...10.0.0-beta.6) (2019-03-18)


### Bug Fixes

* **release:** set npm tags 'latest' and 'next' correctly after every release. Fix nightly builds versioning ([e747fd0](https://github.com/nationalbankbelgium/stark/commit/e747fd0)), closes [#420](https://github.com/nationalbankbelgium/stark/issues/420) [#468](https://github.com/nationalbankbelgium/stark/issues/468)
* **stark-demo:** fix for links in table-of-contents ([01257d9](https://github.com/nationalbankbelgium/stark/commit/01257d9))
* **stark-demo:** fix warning about deprecated property ([77cbca4](https://github.com/nationalbankbelgium/stark/commit/77cbca4))
* **stark-demo:** update usage examples of stark table ([fd06086](https://github.com/nationalbankbelgium/stark/commit/fd06086)), closes [#1012](https://github.com/nationalbankbelgium/stark/issues/1012)
* **stark-ui:** fix table error when `data` not initialized ([d78ac80](https://github.com/nationalbankbelgium/stark/commit/d78ac80)), closes [#1087](https://github.com/nationalbankbelgium/stark/issues/1087)
* **stark-ui:** keep table paginator in sync with (filtered) data ([3c3a4ca](https://github.com/nationalbankbelgium/stark/commit/3c3a4ca)), closes [#1090](https://github.com/nationalbankbelgium/stark/issues/1090) [#1012](https://github.com/nationalbankbelgium/stark/issues/1012)
* **stark-ui:** update some component styling to fix bugs ([ad12b5a](https://github.com/nationalbankbelgium/stark/commit/ad12b5a)), closes [#1169](https://github.com/nationalbankbelgium/stark/issues/1169)


### Code Refactoring

* **stark-ui:** remove `starkOnEnterKey` in favor of Angulars implementation ([e363923](https://github.com/nationalbankbelgium/stark/commit/e363923)), closes [#1156](https://github.com/nationalbankbelgium/stark/issues/1156)


### Features

* **stark-ui:** add `stark-session-card` component ([4a1db25](https://github.com/nationalbankbelgium/stark/commit/4a1db25)), closes [#718](https://github.com/nationalbankbelgium/stark/issues/718)
* **stark-ui:** date-picker - add support for ControlValueAccessor, MatFormFieldControl, Validator and starkTimestampMask directive ([81dcd18](https://github.com/nationalbankbelgium/stark/commit/81dcd18)), closes [#1146](https://github.com/nationalbankbelgium/stark/issues/1146)
* **stark-ui:** implement `stark-session-card` in stark session pages ([debe387](https://github.com/nationalbankbelgium/stark/commit/debe387)), closes [#718](https://github.com/nationalbankbelgium/stark/issues/718)
* **stark-ui:** implement Material dialogs presets: alert, confirm and prompt ([a38d24a](https://github.com/nationalbankbelgium/stark/commit/a38d24a)), closes [#793](https://github.com/nationalbankbelgium/stark/issues/793)


### Performance Improvements

* **build:** add `"extractCss": true` to build options ([e212d71](https://github.com/nationalbankbelgium/stark/commit/e212d71))


### BREAKING CHANGES

* **stark-ui:** stark-date-picker now integrates ControlValueAccessor and Validator:

  - The following Input have been changed:
      - **date** is now **value**
      - **maxDate** is now **max**
      - **minDate** is now **min**
      - **label** is now **placeholder** (the date-picker does not
      translate the placeholder anymore, it has to be done by the
      developer when passing the value --> `[placeholder]="'MY_TRANSLATION_KEY' | translate"`)
      - **isDisabled** is now **disabled**
  - The output **dateChanged** is now **dateChange**
  - **dateInput** Output has been added and now the date-picker Input/Output are
    similar to the ones of MatDatepicker component
  - We respect now the Constraint validation standards. See: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
* **stark-ui:** Refactor of Session Pages (login / logout / sessionExpired / preloading).

  - **stark-ui:** css on these components to change the default Stark logo will no longer work and should be refactored.
    For example adding this to `src/styles/styles.scss`
```SCSS
.stark-app-logo i {
  background-image: url("/assets/path-to-your-logo.png");
  background-size: contain;
}
```
* **stark-ui:** the `starkOnEnterKey` directive is no longer available.

  - Angular provides this natively (see [docs](https://angular.io/guide/user-input#key-event-filtering-with-keyenter) for an example)
* **stark-ui:**   - `stark-app-sidenav-content` should not be applied to a wrapper element (`div`) anymore. Replace it with a `ng-container`.
  This ensures the footer is always at the bottom. (see Starter for an example)

  - the css selector for `.stark-main-container` has changed and can now be applied directly to the `main` element in app.component.html.
  (see Starter for an example)



<a name="10.0.0-beta.5"></a>
# [10.0.0-beta.5](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.4...10.0.0-beta.5) (2019-03-01)


### Bug Fixes

* **release:** remove all files from 'latest' folders before copying the new ones ([bce59d0](https://github.com/nationalbankbelgium/stark/commit/bce59d0)), closes [#1138](https://github.com/nationalbankbelgium/stark/issues/1138)
* **stark-demo:** change import to relative path ([468a3f1](https://github.com/nationalbankbelgium/stark/commit/468a3f1))
* **stark-demo:** remove transform from `table-of-contents` component ([03b8954](https://github.com/nationalbankbelgium/stark/commit/03b8954)), closes [#1137](https://github.com/nationalbankbelgium/stark/issues/1137)
* **stark-ui:** add methods to create/reset the search form in the Generic Search. Fix the Generic Search demo page in Showcase. ([128d8bf](https://github.com/nationalbankbelgium/stark/commit/128d8bf)), closes [#1125](https://github.com/nationalbankbelgium/stark/issues/1125)


### Features

* **stark-build:** implement integration with Angular CLI via [@angular-builders](https://github.com/angular-builders) ([9a26c00](https://github.com/nationalbankbelgium/stark/commit/9a26c00)), closes [#883](https://github.com/nationalbankbelgium/stark/issues/883) [#146](https://github.com/nationalbankbelgium/stark/issues/146) [#114](https://github.com/nationalbankbelgium/stark/issues/114)
* **stark-testing:** add browser launchers for karma: Firefox, Edge and IE ([754d0fd](https://github.com/nationalbankbelgium/stark/commit/754d0fd))
* **stark-ui:** add show/hide functionality to tables ([69b56f0](https://github.com/nationalbankbelgium/stark/commit/69b56f0)), closes [#522](https://github.com/nationalbankbelgium/stark/issues/522)
* **stark-ui:** add sticky action column to `stark-table` ([0904e94](https://github.com/nationalbankbelgium/stark/commit/0904e94)), closes [#1143](https://github.com/nationalbankbelgium/stark/issues/1143)


### BREAKING CHANGES

* **stark-ui:** new methods added to `StarkSearchFormComponent` interface:

   - **createSearchForm:** method that should contain the necessary logic to create
   the FormGroup to be bound to the search form.
   - **resetSearchForm:** method that should contain the necessary logic to
   reset the FormGroup bound to the search form.
* **stark-build:** stark-build now integrates with Angular CLI:

   - **stark-build:** now provides partial Webpack configurations to override default configuration from Angular CLI. The application's `angular.json` file must be adapted to use this partial configs from stark-build via [@angular-builders](https://github.com/meltedspark/angular-builders). See [Stark-Build: Ng CLI Customizations](./docs/stark-build/NG_CLI_BUILD_CUSTOMIZATIONS.md)
   - **stark-core:** the application's `angular.json` file must be adapted to add the assets from stark-core to be copied to the application's `assets` folder. See [Stark-Core: Getting Started](./docs/stark-core/GETTING_STARTED.md#assets)
   - **stark-ui:** the application's `angular.json` file must be adapted to add the assets from stark-ui to be copied to the application's `assets` folder. See [Stark-UI: Getting Started](./docs/stark-ui/GETTING_STARTED.md#assets)



<a name="10.0.0-beta.4"></a>
# [10.0.0-beta.4](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.3...10.0.0-beta.4) (2019-02-15)


### Bug Fixes

* **stark-all:** replace the stark logo ([7519ea3](https://github.com/nationalbankbelgium/stark/commit/7519ea3)), closes [#1115](https://github.com/nationalbankbelgium/stark/issues/1115)
* **stark-core:** correctly encode url parameters ([b55ca8b](https://github.com/nationalbankbelgium/stark/commit/b55ca8b)), closes [/github.com/angular/angular/issues/18261#issuecomment-426383787](https://github.com//github.com/angular/angular/issues/18261/issues/issuecomment-426383787) [#1130](https://github.com/nationalbankbelgium/stark/issues/1130)
* **stark-demo:** minor fixes in script that replaces baseHref and deployURL in Showcase when deploying to GhPages ([4047429](https://github.com/nationalbankbelgium/stark/commit/4047429))
* **stark-starter:** remove faulty import from angular.json ([3fcfd0d](https://github.com/nationalbankbelgium/stark/commit/3fcfd0d))


### Features

* **stark-ui:** add directive for transforming input value before passing it to a ngControl ([0cf396c](https://github.com/nationalbankbelgium/stark/commit/0cf396c)), closes [#1099](https://github.com/nationalbankbelgium/stark/issues/1099)
* **stark-ui:** implement directives for email, number and timestamp masks ([3452894](https://github.com/nationalbankbelgium/stark/commit/3452894)), closes [#681](https://github.com/nationalbankbelgium/stark/issues/681) [#682](https://github.com/nationalbankbelgium/stark/issues/682) [#683](https://github.com/nationalbankbelgium/stark/issues/683)
* **stark-ui:** implement text-mask directive ([f430ad0](https://github.com/nationalbankbelgium/stark/commit/f430ad0)), closes [#680](https://github.com/nationalbankbelgium/stark/issues/680)


### BREAKING CHANGES

* **stark-ui:** new `typings` folder in the package containing
typings for some libraries used by Stark-UI components/directives.
This must be included in the `typeRoots` of your app `tsconfig.json`:
`"typeRoots": ["./node_modules/@nationalbankbelgium/stark-ui/typings", ...]`



<a name="10.0.0-beta.3"></a>
# [10.0.0-beta.3](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.2...10.0.0-beta.3) (2019-02-06)


### Bug Fixes

* **build-main:** adapt regex pattern to include 'resolved' in package-lock.json replacement ([e07108f](https://github.com/nationalbankbelgium/stark/commit/e07108f))
* **docs:** fix typo ([c15e0cd](https://github.com/nationalbankbelgium/stark/commit/c15e0cd))
* **stark-core:** export StarkMessageImpl in public_api.ts ([6c2546b](https://github.com/nationalbankbelgium/stark/commit/6c2546b))
* **stark-core:** update typing in accordance with rxjs 6.4.0 ([2aa37d4](https://github.com/nationalbankbelgium/stark/commit/2aa37d4))
* **stark-demo:** fix 404 error when loading `pre-load-style.css` ([6fa246f](https://github.com/nationalbankbelgium/stark/commit/6fa246f)), closes [#1037](https://github.com/nationalbankbelgium/stark/issues/1037)
* **stark-demo:** fix icons not displaying correctly ([8bd9b4a](https://github.com/nationalbankbelgium/stark/commit/8bd9b4a)), closes [#504](https://github.com/nationalbankbelgium/stark/issues/504) [#1030](https://github.com/nationalbankbelgium/stark/issues/1030)
* **stark-ui:** add missing [@angular](https://github.com/angular)/forms peerDependency ([28866cf](https://github.com/nationalbankbelgium/stark/commit/28866cf))
* **stark-ui:** fix table filter implementation ([73b40b3](https://github.com/nationalbankbelgium/stark/commit/73b40b3)), closes [#1071](https://github.com/nationalbankbelgium/stark/issues/1071)


### Features

* **stark-all:** prefix all (dev)dependencies with '^' in all Stark's packages + in starter & showcase ([40c4dd6](https://github.com/nationalbankbelgium/stark/commit/40c4dd6)), closes [#1053](https://github.com/nationalbankbelgium/stark/issues/1053)
* **stark-all:** refine exports for the services ([1bf950e](https://github.com/nationalbankbelgium/stark/commit/1bf950e)), closes [#1112](https://github.com/nationalbankbelgium/stark/issues/1112)
* **stark-build:** adapt build utils and webpack config to read global styles from angular.json to align with Angular CLI ([d0876f0](https://github.com/nationalbankbelgium/stark/commit/d0876f0)), closes [#1070](https://github.com/nationalbankbelgium/stark/issues/1070)
* **stark-demo:** add `styleguide/layout` page for documenting the use of Angular Flex-layout ([e1d157c](https://github.com/nationalbankbelgium/stark/commit/e1d157c)), closes [#668](https://github.com/nationalbankbelgium/stark/issues/668)
* **stark-ui:** expose single file (src/assets/stark-ui-bundle.scss) to import all component styles/theming ([b86e190](https://github.com/nationalbankbelgium/stark/commit/b86e190)), closes [#103](https://github.com/nationalbankbelgium/stark/issues/103)
* **stark-ui:** implement generic search component in generic module ([68f7d24](https://github.com/nationalbankbelgium/stark/commit/68f7d24)), closes [#794](https://github.com/nationalbankbelgium/stark/issues/794)
* **stark-ui:** implement Route Search component ([f3dda15](https://github.com/nationalbankbelgium/stark/commit/f3dda15)), closes [#207](https://github.com/nationalbankbelgium/stark/issues/207)
* **stark-ui:** implementation of progress-indicator component ([5240bee](https://github.com/nationalbankbelgium/stark/commit/5240bee)), closes [#126](https://github.com/nationalbankbelgium/stark/issues/126)


### BREAKING CHANGES

* **stark-ui:** changed the following Output return types in Table module:
  - Table Column component:
    - filterChanged now emits `StarkColumnFilterChangedOutput` object instead of `StarkTableColumnComponent`
    - sortChanged now emits `StarkColumnSortChangedOutput` object instead of `StarkTableColumnComponent`
  - Table component:
    - filterChanged now emits `StarkTableFilter` object instead of a `string`
* **stark-build:** global styles must be included in the angular.json (standard Angular CLI behavior) instead of importing them directly in the app



<a name="10.0.0-beta.2"></a>
# [10.0.0-beta.2](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.1...10.0.0-beta.2) (2019-01-14)


### Bug Fixes

* **stark-all:** fix dependency issues in stark-ui + add hammerjs dep in stark root to fix warning during tests + improve stark-language-selector component ([47c2b4a](https://github.com/nationalbankbelgium/stark/commit/47c2b4a))
* **stark-build:** enhance regex for 3rd party libs to be transpiled to ES5 in Linux, Mac and Windows ([c4a4c36](https://github.com/nationalbankbelgium/stark/commit/c4a4c36)), closes [#918](https://github.com/nationalbankbelgium/stark/issues/918)
* **stark-build:** ignore 'System.import()' messages due to [@angular](https://github.com/angular)/core ([8ee3938](https://github.com/nationalbankbelgium/stark/commit/8ee3938))
* **stark-build:** transpile certain third party libs to ES5 only in DEV to prevent breaking support for IE 11 ([c762f8d](https://github.com/nationalbankbelgium/stark/commit/c762f8d)), closes [#900](https://github.com/nationalbankbelgium/stark/issues/900)
* **stark-core:** avoid circular dependencies by moving state names in a constants file ([abe7fe2](https://github.com/nationalbankbelgium/stark/commit/abe7fe2))
* **stark-core:** refactor Http Request builder, Http service and Session service to prevent undefined and null header values to be added to Angular Http headers. ([c728f9c](https://github.com/nationalbankbelgium/stark/commit/c728f9c)), closes [#856](https://github.com/nationalbankbelgium/stark/issues/856)
* **stark-demo:** add deployUrl to fix issue with lazy modules. Replace referenced icon asset in translations by <mat-icon> in HTML. ([d112acd](https://github.com/nationalbankbelgium/stark/commit/d112acd)), closes [#849](https://github.com/nationalbankbelgium/stark/issues/849)
* **stark-demo:** add polyfill for `web.dom.iterable` ([f57c47b](https://github.com/nationalbankbelgium/stark/commit/f57c47b)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-demo:** fix overflow issue of message pane demo on mobile and IE11 ([904c919](https://github.com/nationalbankbelgium/stark/commit/904c919)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-demo:** fix the 404 error on github pages ([d96ac1f](https://github.com/nationalbankbelgium/stark/commit/d96ac1f)), closes [#859](https://github.com/nationalbankbelgium/stark/issues/859)
* **stark-demo:** update usage of `stark-dropdown` component in pretty-print demo page ([e73766a](https://github.com/nationalbankbelgium/stark/commit/e73766a)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** add padding to table filter component ([7f73477](https://github.com/nationalbankbelgium/stark/commit/7f73477)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** change location of minimap to right ([2fb8a16](https://github.com/nationalbankbelgium/stark/commit/2fb8a16)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** fix circular dependencies due to wrong import in minimap ([9a712fa](https://github.com/nationalbankbelgium/stark/commit/9a712fa))
* **stark-ui:** fix filter issue + not translated column header issue in ([746f675](https://github.com/nationalbankbelgium/stark/commit/746f675)), closes [#954](https://github.com/nationalbankbelgium/stark/issues/954) [#955](https://github.com/nationalbankbelgium/stark/issues/955)
* **stark-ui:** fix overflow of calendar items ([4eb2acd](https://github.com/nationalbankbelgium/stark/commit/4eb2acd)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** fix table refresh issue when data changes. ([dd2eac0](https://github.com/nationalbankbelgium/stark/commit/dd2eac0)), closes [#1003](https://github.com/nationalbankbelgium/stark/issues/1003)
* **stark-ui:** implement workaround for `mat-select` bug in IE11 ([f2887ad](https://github.com/nationalbankbelgium/stark/commit/f2887ad)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** keep scroll position after closing sidenav ([7d55a3e](https://github.com/nationalbankbelgium/stark/commit/7d55a3e)), closes [#750](https://github.com/nationalbankbelgium/stark/issues/750)
* **stark-ui:** properly scale svg from mat-icon ([f6a6258](https://github.com/nationalbankbelgium/stark/commit/f6a6258)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** remove `-apple-system` from default font-family for correct rendering in IE11 ([71ca177](https://github.com/nationalbankbelgium/stark/commit/71ca177)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** remove value property from li in pagination component ([15a4a17](https://github.com/nationalbankbelgium/stark/commit/15a4a17)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)


### Features

* **stark-all:** update to Angular 7 + TypeScript 3.1 ([edd108d](https://github.com/nationalbankbelgium/stark/commit/edd108d)), closes [#871](https://github.com/nationalbankbelgium/stark/issues/871)
* **stark-demo:** add browserstack test script ([5a490a3](https://github.com/nationalbankbelgium/stark/commit/5a490a3)), closes [#274](https://github.com/nationalbankbelgium/stark/issues/274)
* **stark-starter:** add preloading screens ([844e0fe](https://github.com/nationalbankbelgium/stark/commit/844e0fe)), closes [#840](https://github.com/nationalbankbelgium/stark/issues/840) [#596](https://github.com/nationalbankbelgium/stark/issues/596) [#597](https://github.com/nationalbankbelgium/stark/issues/597)
* **stark-ui:** add custom styling to stark table component ([dd91254](https://github.com/nationalbankbelgium/stark/commit/dd91254)), closes [#523](https://github.com/nationalbankbelgium/stark/issues/523)
* **stark-ui:** add option to close sidebar after navigation ([431f1e0](https://github.com/nationalbankbelgium/stark/commit/431f1e0)), closes [#995](https://github.com/nationalbankbelgium/stark/issues/995)
* **stark-ui:** add rowClick event emitter to table component ([0182344](https://github.com/nationalbankbelgium/stark/commit/0182344)), closes [#795](https://github.com/nationalbankbelgium/stark/issues/795)
* **stark-ui:** add stark form util ([1f94d93](https://github.com/nationalbankbelgium/stark/commit/1f94d93))
* **stark-ui:** implementation of a session timeout warning ([578b8a2](https://github.com/nationalbankbelgium/stark/commit/578b8a2))
* **stark-ui:** implementation of app data component ([e87c30a](https://github.com/nationalbankbelgium/stark/commit/e87c30a))
* **stark-ui:** make dropdown component working with reactive form ([b183e72](https://github.com/nationalbankbelgium/stark/commit/b183e72))



<a name="10.0.0-beta.1"></a>
# [10.0.0-beta.1](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.0...10.0.0-beta.1) (2018-11-09)


### Bug Fixes

* **package:** update [@mdi](https://github.com/mdi)/angular-material to version 3.0.39 ([457d2a5](https://github.com/nationalbankbelgium/stark/commit/457d2a5))
* **package:** update [@ngrx](https://github.com/ngrx)/effects to version 6.1.1 ([1e7f887](https://github.com/nationalbankbelgium/stark/commit/1e7f887))
* **package:** update [@ngrx](https://github.com/ngrx)/effects to version 6.1.2 ([1e898ac](https://github.com/nationalbankbelgium/stark/commit/1e898ac))
* **package:** update [@ngrx](https://github.com/ngrx)/store to version 6.1.1 ([3ac98ab](https://github.com/nationalbankbelgium/stark/commit/3ac98ab))
* **package:** update [@ngrx](https://github.com/ngrx)/store to version 6.1.2 ([529448b](https://github.com/nationalbankbelgium/stark/commit/529448b))
* **package:** update [@ngrx](https://github.com/ngrx)/store-devtools to version 6.1.1 ([1e5758b](https://github.com/nationalbankbelgium/stark/commit/1e5758b))
* **package:** update [@ngrx](https://github.com/ngrx)/store-devtools to version 6.1.2 ([146a636](https://github.com/nationalbankbelgium/stark/commit/146a636))
* **package:** update [@types](https://github.com/types)/uglify-js to version 3.0.4 ([fce3a1d](https://github.com/nationalbankbelgium/stark/commit/fce3a1d))
* **package:** update [@types](https://github.com/types)/webpack to version 4.4.17 ([24833c6](https://github.com/nationalbankbelgium/stark/commit/24833c6))
* **package:** update [@types](https://github.com/types)/webpack to version 4.4.18 ([ec39709](https://github.com/nationalbankbelgium/stark/commit/ec39709))
* **package:** update add-asset-html-webpack-plugin to version 3.1.2 ([727791f](https://github.com/nationalbankbelgium/stark/commit/727791f))
* **package:** update angular-in-memory-web-api to version 0.7.0 ([44e800e](https://github.com/nationalbankbelgium/stark/commit/44e800e))
* **package:** update copy-webpack-plugin to version 4.5.4 ([ab76952](https://github.com/nationalbankbelgium/stark/commit/ab76952))
* **package:** update copy-webpack-plugin to version 4.6.0 ([a4aac38](https://github.com/nationalbankbelgium/stark/commit/a4aac38))
* **package:** update css-loader to version 1.0.1 ([8bbc642](https://github.com/nationalbankbelgium/stark/commit/8bbc642))
* **package:** update event-source-polyfill to version 1.0.0 ([a62cf49](https://github.com/nationalbankbelgium/stark/commit/a62cf49))
* **package:** update event-source-polyfill to version 1.0.0 ([32a0ec6](https://github.com/nationalbankbelgium/stark/commit/32a0ec6))
* **package:** update event-source-polyfill to version 1.0.3 ([ce41d15](https://github.com/nationalbankbelgium/stark/commit/ce41d15)), closes [#791](https://github.com/nationalbankbelgium/stark/issues/791)
* **package:** update event-source-polyfill to version 1.0.3 ([2dffcb0](https://github.com/nationalbankbelgium/stark/commit/2dffcb0)), closes [#791](https://github.com/nationalbankbelgium/stark/issues/791)
* **package:** update event-source-polyfill to version 1.0.4 ([0df420c](https://github.com/nationalbankbelgium/stark/commit/0df420c))
* **package:** update event-source-polyfill to version 1.0.4 ([aca911f](https://github.com/nationalbankbelgium/stark/commit/aca911f))
* **package:** update jasmine-core to version 3.3.0 ([7fec286](https://github.com/nationalbankbelgium/stark/commit/7fec286))
* **package:** update karma to version 3.1.1 ([548103e](https://github.com/nationalbankbelgium/stark/commit/548103e))
* **package:** update nouislider to version 12.1.0 ([6fd6337](https://github.com/nationalbankbelgium/stark/commit/6fd6337))
* **package:** update stylelint to version 9.7.0 ([f13de52](https://github.com/nationalbankbelgium/stark/commit/f13de52))
* **package:** update stylelint to version 9.7.1 ([8bd786d](https://github.com/nationalbankbelgium/stark/commit/8bd786d))
* **package:** update webpack to version 4.21.0 ([6ac6104](https://github.com/nationalbankbelgium/stark/commit/6ac6104))
* **package:** update webpack to version 4.22.0 ([cceb258](https://github.com/nationalbankbelgium/stark/commit/cceb258))
* **package:** update webpack to version 4.23.1 ([3fb70e5](https://github.com/nationalbankbelgium/stark/commit/3fb70e5)), closes [#790](https://github.com/nationalbankbelgium/stark/issues/790)
* **stark-build:** add cspFontSrc as configurable property to webpack dev server ([5367f69](https://github.com/nationalbankbelgium/stark/commit/5367f69))
* **stark-core:** include inherited params from ancestor routing states in navigation history. Adapt Routing Service isCurrentUiState() to take into account inherited params. ([1131acf](https://github.com/nationalbankbelgium/stark/commit/1131acf)), closes [#769](https://github.com/nationalbankbelgium/stark/issues/769)
* **stark-core:** re-create the last entry in the state history rather than add it again when a transition is dynamic. ([2af2657](https://github.com/nationalbankbelgium/stark/commit/2af2657)), closes [#773](https://github.com/nationalbankbelgium/stark/issues/773)
* **stark-starter:** add polyfill for String.prototype.trimRight ([ef51f3c](https://github.com/nationalbankbelgium/stark/commit/ef51f3c)), closes [#213](https://github.com/nationalbankbelgium/stark/issues/213)
* **stark-ui:** perform the session login in the Preloading page after fetching the user profile ([7cc9572](https://github.com/nationalbankbelgium/stark/commit/7cc9572)), closes [#726](https://github.com/nationalbankbelgium/stark/issues/726)
* **stark-ui:** style fix: footer, header and table. Adapt Showcase and Starter. ([553f0f8](https://github.com/nationalbankbelgium/stark/commit/553f0f8)), closes [#696](https://github.com/nationalbankbelgium/stark/issues/696) [#715](https://github.com/nationalbankbelgium/stark/issues/715) [#723](https://github.com/nationalbankbelgium/stark/issues/723)


### Features

* **stark-core:** add support for deep state navigation for states from lazy loaded modules. Adapt Showcase to make DemoModule and NewsModule lazy loaded ([6589846](https://github.com/nationalbankbelgium/stark/commit/6589846)), closes [#810](https://github.com/nationalbankbelgium/stark/issues/810)
* **stark-core:** allow customizing Login and Preloading states via the StarkSessionConfig ([f8112cb](https://github.com/nationalbankbelgium/stark/commit/f8112cb)), closes [#727](https://github.com/nationalbankbelgium/stark/issues/727)
* **stark-core:** implementation of a custom error handler ([74d98d0](https://github.com/nationalbankbelgium/stark/commit/74d98d0))
* **stark-demo:** creation of a getting started page ([8c98965](https://github.com/nationalbankbelgium/stark/commit/8c98965)), closes [#720](https://github.com/nationalbankbelgium/stark/issues/720)
* **stark-demo:** improvement of the showcase ([76a7d67](https://github.com/nationalbankbelgium/stark/commit/76a7d67))
* **stark-demo:** integrate "angular-in-memory-web-api" to mock backend (needed for GitHub pages) ([f698865](https://github.com/nationalbankbelgium/stark/commit/f698865))
* **stark-demo:** reimplementation of the buttons in the header ([4df6fdf](https://github.com/nationalbankbelgium/stark/commit/4df6fdf))
* **stark-ui:** add fixed header feature to table component ([73b4756](https://github.com/nationalbankbelgium/stark/commit/73b4756)), closes [#196](https://github.com/nationalbankbelgium/stark/issues/196)
* **stark-ui:** app Menu Component ([5f662fa](https://github.com/nationalbankbelgium/stark/commit/5f662fa)), closes [#240](https://github.com/nationalbankbelgium/stark/issues/240) [#710](https://github.com/nationalbankbelgium/stark/issues/710)
* **stark-ui:** implement Message Pane component ([33bf233](https://github.com/nationalbankbelgium/stark/commit/33bf233)), closes [#593](https://github.com/nationalbankbelgium/stark/issues/593)
* **stark-ui:** implementation of minimap component ([4148d7d](https://github.com/nationalbankbelgium/stark/commit/4148d7d)), closes [#758](https://github.com/nationalbankbelgium/stark/issues/758)
* **stark-ui:** implementation of reference-block component ([17e250f](https://github.com/nationalbankbelgium/stark/commit/17e250f)), closes [#622](https://github.com/nationalbankbelgium/stark/issues/622)
* **stark-ui:** integrate translation support in AppMenu component ([42a6b73](https://github.com/nationalbankbelgium/stark/commit/42a6b73)), closes [#755](https://github.com/nationalbankbelgium/stark/issues/755)
* **stark-ui:** split translations from UI components in the different modules they belong to. Split common Core and common UI translations. ([bd6fbb6](https://github.com/nationalbankbelgium/stark/commit/bd6fbb6)), closes [#511](https://github.com/nationalbankbelgium/stark/issues/511)
* **stark-ui:** stark logo added to showcase and in app-logo component ([c680d2a](https://github.com/nationalbankbelgium/stark/commit/c680d2a)), closes [#738](https://github.com/nationalbankbelgium/stark/issues/738)


### Performance Improvements

* **stark-build:** remove deprecated Angular PurifyPlugin. Enhance UglifyJs options to improve performance. ([ff621c5](https://github.com/nationalbankbelgium/stark/commit/ff621c5)), closes [#623](https://github.com/nationalbankbelgium/stark/issues/623)



<a name="10.0.0-beta.0"></a>
# [10.0.0-beta.0](https://github.com/nationalbankbelgium/stark/compare/10.0.0-alpha.5...10.0.0-beta.0) (2018-09-27)


### Bug Fixes

* **stark-core:** fix failing XSRF service test ([c3d2589](https://github.com/nationalbankbelgium/stark/commit/c3d2589))


### Features

* **all:** add session pages ([4d13687](https://github.com/nationalbankbelgium/stark/commit/4d13687)), closes [#407](https://github.com/nationalbankbelgium/stark/issues/407) [#408](https://github.com/nationalbankbelgium/stark/issues/408) [#409](https://github.com/nationalbankbelgium/stark/issues/409) [#410](https://github.com/nationalbankbelgium/stark/issues/410)
* **showcase:** improve showcase and move styles from showcase to stark-ui _base ([be80748](https://github.com/nationalbankbelgium/stark/commit/be80748))
* **stark-core:** implement Stark XSRF module ([e82ed0d](https://github.com/nationalbankbelgium/stark/commit/e82ed0d)), closes [#115](https://github.com/nationalbankbelgium/stark/issues/115)
* **stark-ui:** cards standardization ([87da0ef](https://github.com/nationalbankbelgium/stark/commit/87da0ef)), closes [#646](https://github.com/nationalbankbelgium/stark/issues/646)
* **stark-ui:** color settings ([fcd12d5](https://github.com/nationalbankbelgium/stark/commit/fcd12d5)), closes [#662](https://github.com/nationalbankbelgium/stark/issues/662)
* **stark-ui:** implement collapsible feature ([44669a1](https://github.com/nationalbankbelgium/stark/commit/44669a1)), closes [#595](https://github.com/nationalbankbelgium/stark/issues/595)
* **stark-ui:** implement Pagination component. Integrate pagination in Table component ([96ae7b2](https://github.com/nationalbankbelgium/stark/commit/96ae7b2)), closes [#539](https://github.com/nationalbankbelgium/stark/issues/539) [#514](https://github.com/nationalbankbelgium/stark/issues/514)
* **stark-ui:** implement toast notification feature ([98390c2](https://github.com/nationalbankbelgium/stark/commit/98390c2))
* **stark-ui:** implements footer component ([2fca5c8](https://github.com/nationalbankbelgium/stark/commit/2fca5c8))
* **stark-ui:** language-selector: implement component/module ([38cbd68](https://github.com/nationalbankbelgium/stark/commit/38cbd68)), closes [#564](https://github.com/nationalbankbelgium/stark/issues/564)
* **stark-ui:** typography + Spaces ([8a5675d](https://github.com/nationalbankbelgium/stark/commit/8a5675d)), closes [#475](https://github.com/nationalbankbelgium/stark/issues/475) [#671](https://github.com/nationalbankbelgium/stark/issues/671)
* **starter:** update Starter to keep in sync with Showcase ([b0ffd95](https://github.com/nationalbankbelgium/stark/commit/b0ffd95))



<a name="10.0.0-alpha.5"></a>
# [10.0.0-alpha.5](https://github.com/nationalbankbelgium/stark/compare/10.0.0-alpha.4...10.0.0-alpha.5) (2018-09-07)


### Bug Fixes

* **build:** add an argument for build prod when it is a Test CI. Adapt travis.yml to use it ([b954903](https://github.com/nationalbankbelgium/stark/commit/b954903)), closes [#572](https://github.com/nationalbankbelgium/stark/issues/572) [#566](https://github.com/nationalbankbelgium/stark/issues/566)
* **build-main:** fix version of greenkeeper-lockfile which is installed during travis build ([1970b71](https://github.com/nationalbankbelgium/stark/commit/1970b71))
* **build-main:** remove custom value for TRAVIS variable ([f00d63a](https://github.com/nationalbankbelgium/stark/commit/f00d63a)), closes [#605](https://github.com/nationalbankbelgium/stark/issues/605)
* **greenkeeper:** fix greenkeeper for updating package-lock ([000a4a5](https://github.com/nationalbankbelgium/stark/commit/000a4a5))
* **greenkeeper:** fix greenkeeper-lockfile ([865fee0](https://github.com/nationalbankbelgium/stark/commit/865fee0))
* **release:** add "package-lock.json" to the set of files to be updated by release-it ([ac7c85c](https://github.com/nationalbankbelgium/stark/commit/ac7c85c)), closes [#574](https://github.com/nationalbankbelgium/stark/issues/574)
* **release:** fix wrong pushRepo option in release-it according to the latest version ([5992603](https://github.com/nationalbankbelgium/stark/commit/5992603)), closes [#669](https://github.com/nationalbankbelgium/stark/issues/669)
* **stark-all:** change BrowserModule for CommonModule. Rearrange styles in showcase. Improve build script ([83cf5c9](https://github.com/nationalbankbelgium/stark/commit/83cf5c9))
* **stark-all:** upgrade lint-staged to 7.2.2 to fix weird validation warning ([62b0b4a](https://github.com/nationalbankbelgium/stark/commit/62b0b4a)), closes [#666](https://github.com/nationalbankbelgium/stark/issues/666)
* **stark-core:** added lodash dependency ([649ce6e](https://github.com/nationalbankbelgium/stark/commit/649ce6e)), closes [#630](https://github.com/nationalbankbelgium/stark/issues/630)
* **stark-demo:** adapt ExampleViewer to fetch example fiiles targeting the right url. Rename title input to prevent weird tooltip. ([491fd99](https://github.com/nationalbankbelgium/stark/commit/491fd99)), closes [#575](https://github.com/nationalbankbelgium/stark/issues/575) [#580](https://github.com/nationalbankbelgium/stark/issues/580)
* **stark-demo:** add AppLogo back in the header after being accidentally removed ([4a13249](https://github.com/nationalbankbelgium/stark/commit/4a13249))
* **stark-demo:** add missing files and regex to the showcase url auto-replace script ([3db3270](https://github.com/nationalbankbelgium/stark/commit/3db3270)), closes [#571](https://github.com/nationalbankbelgium/stark/issues/571)
* **stark-demo:** hTML highlighting and 'Try it yourself' ([f5114f7](https://github.com/nationalbankbelgium/stark/commit/f5114f7)), closes [#601](https://github.com/nationalbankbelgium/stark/issues/601)
* **stark-ui:** button - align icon vertically ([f9015fb](https://github.com/nationalbankbelgium/stark/commit/f9015fb)), closes [#619](https://github.com/nationalbankbelgium/stark/issues/619)
* **stark-ui:** modify CSS and add App-Logo to Showcase ([90e2e05](https://github.com/nationalbankbelgium/stark/commit/90e2e05)), closes [#583](https://github.com/nationalbankbelgium/stark/issues/583)
* **stark-ui:** removed TranslateService from breadcrumb component ([f40027f](https://github.com/nationalbankbelgium/stark/commit/f40027f))


### Features

* **stark-core:** use the browser language as the default language ([561d288](https://github.com/nationalbankbelgium/stark/commit/561d288)), closes [#578](https://github.com/nationalbankbelgium/stark/issues/578)
* **stark-demo:** add Slider component to the Showcase Demo ([0c75595](https://github.com/nationalbankbelgium/stark/commit/0c75595)), closes [#561](https://github.com/nationalbankbelgium/stark/issues/561)
* **stark-demo:** style header in the showcase ([1804ca3](https://github.com/nationalbankbelgium/stark/commit/1804ca3)), closes [#570](https://github.com/nationalbankbelgium/stark/issues/570)
* **stark-ui:** added white theme and full width for dropdown component ([c8c998e](https://github.com/nationalbankbelgium/stark/commit/c8c998e)), closes [#642](https://github.com/nationalbankbelgium/stark/issues/642) [#640](https://github.com/nationalbankbelgium/stark/issues/640)
* **stark-ui:** date Picker Component ([705358c](https://github.com/nationalbankbelgium/stark/commit/705358c)), closes [#542](https://github.com/nationalbankbelgium/stark/issues/542)
* **stark-ui:** implement date range picker ([ab06b73](https://github.com/nationalbankbelgium/stark/commit/ab06b73)), closes [#586](https://github.com/nationalbankbelgium/stark/issues/586)
* **stark-ui:** implement the logout domponent/module ([74c2bba](https://github.com/nationalbankbelgium/stark/commit/74c2bba)), closes [#588](https://github.com/nationalbankbelgium/stark/issues/588)
* **stark-ui:** implementation of breadcrumb component ([8f2f129](https://github.com/nationalbankbelgium/stark/commit/8f2f129)), closes [#591](https://github.com/nationalbankbelgium/stark/issues/591)
* **stark-ui:** implementation of stark dropdown component ([40adf24](https://github.com/nationalbankbelgium/stark/commit/40adf24)), closes [#447](https://github.com/nationalbankbelgium/stark/issues/447)
* **stark-ui:** implementation of the app sidebar ([09eeeea](https://github.com/nationalbankbelgium/stark/commit/09eeeea)), closes [#592](https://github.com/nationalbankbelgium/stark/issues/592)



<a name="10.0.0-alpha.4"></a>
# [10.0.0-alpha.4](https://github.com/nationalbankbelgium/stark/compare/10.0.0-alpha.3...10.0.0-alpha.4) (2018-07-30)


### Bug Fixes

* **build:** adding quotes arround the Prettier parameters to fix an issue on MacOS. ([ff1188b](https://github.com/nationalbankbelgium/stark/commit/ff1188b))
* **stark-core:** fix circular dependencies detected by Rollup ([0620d7b](https://github.com/nationalbankbelgium/stark/commit/0620d7b)), closes [#530](https://github.com/nationalbankbelgium/stark/issues/530)
* **stark-core:** refactor AbstractStarkMain to enable Angular prod mode before bootstraping the app ([bb319fa](https://github.com/nationalbankbelgium/stark/commit/bb319fa))
* **stark-demo:** add baseHref dynamically via Angular provider to fix Showcase when published in GitHub pages ([cfc8592](https://github.com/nationalbankbelgium/stark/commit/cfc8592)), closes [#466](https://github.com/nationalbankbelgium/stark/issues/466)
* **stark-demo:** adding StarkLoggingService to the ExampleViewer tests ([380a60d](https://github.com/nationalbankbelgium/stark/commit/380a60d)), closes [#484](https://github.com/nationalbankbelgium/stark/issues/484)
* **stark-demo:** fix baseHref in angular.json file ([2a36276](https://github.com/nationalbankbelgium/stark/commit/2a36276))
* **stark-demo:** fix pretty-print demo translations ([3999ff9](https://github.com/nationalbankbelgium/stark/commit/3999ff9))
* **stark-demo:** revert PR [#471](https://github.com/nationalbankbelgium/stark/issues/471). Adapt baseHref/deployUrl automatically via Node script to fix Showcase when published in GitHub pages ([f9dadfd](https://github.com/nationalbankbelgium/stark/commit/f9dadfd))
* **stark-ui:** fix unresolved dependencies detected by Rollup ([a1d9487](https://github.com/nationalbankbelgium/stark/commit/a1d9487)), closes [#532](https://github.com/nationalbankbelgium/stark/issues/532)
* **stark-ui:** include only "src" and "assets" folders in "lint-css" command on stark-ui and stark-core ([a1c3a4f](https://github.com/nationalbankbelgium/stark/commit/a1c3a4f))
* **stark-ui:** tooltip translation + table translation ([12dd3b3](https://github.com/nationalbankbelgium/stark/commit/12dd3b3)), closes [#502](https://github.com/nationalbankbelgium/stark/issues/502)


### Features

* **core:** integrated bootstrap ([97ca29e](https://github.com/nationalbankbelgium/stark/commit/97ca29e)), closes [#112](https://github.com/nationalbankbelgium/stark/issues/112) [#412](https://github.com/nationalbankbelgium/stark/issues/412)
* **stark-all:** enable npm ci for travis + add package-lock.json + force registry.npmjs.org as registry ([f47d610](https://github.com/nationalbankbelgium/stark/commit/f47d610)), closes [#43](https://github.com/nationalbankbelgium/stark/issues/43)
* **stark-build:** add support for environment variables at runtime (importing environment.ts file) and at compilation time (using webpack Define plugin) ([c29e36b](https://github.com/nationalbankbelgium/stark/commit/c29e36b)), closes [#50](https://github.com/nationalbankbelgium/stark/issues/50)
* **stark-build:** added html-element-webpack-plugin to handle head section in index.html ([ce089c8](https://github.com/nationalbankbelgium/stark/commit/ce089c8)), closes [#60](https://github.com/nationalbankbelgium/stark/issues/60)
* **stark-core:** add [@ngrx-store-devtools](https://github.com/ngrx-store-devtools) package. Integrate store dev tools in showcase and starter ([b9c9179](https://github.com/nationalbankbelgium/stark/commit/b9c9179)), closes [#81](https://github.com/nationalbankbelgium/stark/issues/81) [#117](https://github.com/nationalbankbelgium/stark/issues/117)
* **stark-core:** http-service: isolate NBB specifics ([e58afa7](https://github.com/nationalbankbelgium/stark/commit/e58afa7)), closes [#257](https://github.com/nationalbankbelgium/stark/issues/257)
* **stark-demo:** add pretty-print component to Showcase Demo ([93557cb](https://github.com/nationalbankbelgium/stark/commit/93557cb)), closes [#496](https://github.com/nationalbankbelgium/stark/issues/496)
* **stark-ui:** action Bar Component ([d1dd733](https://github.com/nationalbankbelgium/stark/commit/d1dd733)), closes [#481](https://github.com/nationalbankbelgium/stark/issues/481)
* **stark-ui:** add Prettier and use it for all the supported types of data ([5b06aef](https://github.com/nationalbankbelgium/stark/commit/5b06aef)), closes [#500](https://github.com/nationalbankbelgium/stark/issues/500)
* **stark-ui:** add stark-action-bar into stark-table ([d3a2c6d](https://github.com/nationalbankbelgium/stark/commit/d3a2c6d)), closes [#512](https://github.com/nationalbankbelgium/stark/issues/512)
* **stark-ui:** example Viewer + basic showcase layout ([ff675c8](https://github.com/nationalbankbelgium/stark/commit/ff675c8)), closes [#458](https://github.com/nationalbankbelgium/stark/issues/458) [#459](https://github.com/nationalbankbelgium/stark/issues/459)
* **stark-ui:** implement OnEnterKey directive. Create KeyboardDirectives module ([0696959](https://github.com/nationalbankbelgium/stark/commit/0696959)), closes [#538](https://github.com/nationalbankbelgium/stark/issues/538)
* **stark-ui:** implement RestrictInput directive and module ([b8bd5be](https://github.com/nationalbankbelgium/stark/commit/b8bd5be)), closes [#546](https://github.com/nationalbankbelgium/stark/issues/546) [#550](https://github.com/nationalbankbelgium/stark/issues/550)
* **stark-ui:** implement the Stark-Pretty-Print component ([22f84b6](https://github.com/nationalbankbelgium/stark/commit/22f84b6)), closes [#494](https://github.com/nationalbankbelgium/stark/issues/494) [#496](https://github.com/nationalbankbelgium/stark/issues/496)
* **stark-ui:** implement the Stark-Slider component ([fd6d03d](https://github.com/nationalbankbelgium/stark/commit/fd6d03d)), closes [#448](https://github.com/nationalbankbelgium/stark/issues/448)
* **stark-ui:** implementation of the button's theme ([c49b6ef](https://github.com/nationalbankbelgium/stark/commit/c49b6ef)), closes [#476](https://github.com/nationalbankbelgium/stark/issues/476)
* **stark-ui:** import old stark ui global theming ([9ac8dde](https://github.com/nationalbankbelgium/stark/commit/9ac8dde)), closes [#456](https://github.com/nationalbankbelgium/stark/issues/456) [#472](https://github.com/nationalbankbelgium/stark/issues/472)
* **stark-ui:** improve example viewer styling ([bad3746](https://github.com/nationalbankbelgium/stark/commit/bad3746)), closes [#515](https://github.com/nationalbankbelgium/stark/issues/515)
* **stark-ui:** initial implementation of Stark Table component (supporting nested data, sorting and filtering) ([80e86c3](https://github.com/nationalbankbelgium/stark/commit/80e86c3))


### Performance Improvements

* **build-main:** adapt "npm install" commands to prevent optional dependencies from being installed. Enable parallelization in webpack prod config. ([020a5f4](https://github.com/nationalbankbelgium/stark/commit/020a5f4))



<a name="10.0.0-alpha.3"></a>
# [10.0.0-alpha.3](https://github.com/nationalbankbelgium/stark/compare/10.0.0-alpha.2...10.0.0-alpha.3) (2018-06-26)


### Bug Fixes

* **build:** adapted the perl command to specify the backup file extension. This was necessary for some perl versions ([ec4afc6](https://github.com/nationalbankbelgium/stark/commit/ec4afc6))
* **build:** fix issue in build-utils with environment. Environment file was not replaced as it should. ([d21a837](https://github.com/nationalbankbelgium/stark/commit/d21a837)), closes [#439](https://github.com/nationalbankbelgium/stark/issues/439)
* **build:** fix sourcemaps in PROD and in DEV ([c8c5696](https://github.com/nationalbankbelgium/stark/commit/c8c5696)), closes [#401](https://github.com/nationalbankbelgium/stark/issues/401)
* **build:** fixed webpack config and circular-dependency-plugin config. Closes [#397](https://github.com/nationalbankbelgium/stark/issues/397), [#315](https://github.com/nationalbankbelgium/stark/issues/315) ([ea9c264](https://github.com/nationalbankbelgium/stark/commit/ea9c264))
* **build-main:** add support for circular dependency warning. Fix rollup external dependencies ([ebd0fd1](https://github.com/nationalbankbelgium/stark/commit/ebd0fd1))
* **build-main:** move ng dependencies to ROOT of Stark. Fix issue in build process. Rename tsconfig ([c7fecdb](https://github.com/nationalbankbelgium/stark/commit/c7fecdb)), closes [#361](https://github.com/nationalbankbelgium/stark/issues/361) [#362](https://github.com/nationalbankbelgium/stark/issues/362)
* **release:** adapt release-it.json and commitlint scopes to fix "release" command failure ([0e05826](https://github.com/nationalbankbelgium/stark/commit/0e05826))
* **stark-all:** add npx for the remaining script calling global rimraf package ([3ce0dac](https://github.com/nationalbankbelgium/stark/commit/3ce0dac))
* **stark-all:** fix nightly build release on Travis ([2c2445c](https://github.com/nationalbankbelgium/stark/commit/2c2445c)), closes [#357](https://github.com/nationalbankbelgium/stark/issues/357)
* **stark-all:** fix some imports and remove obsolete fixme's. Format code with Prettier. Fix stark-ui linting. ([daf258b](https://github.com/nationalbankbelgium/stark/commit/daf258b))
* **stark-all:** packages: building the stark-core and stark-ui packages with the ncg script fails ([139e47b](https://github.com/nationalbankbelgium/stark/commit/139e47b)), closes [#441](https://github.com/nationalbankbelgium/stark/issues/441)
* **stark-build:** include postcss loader+plugins to the Webpack css and scss files processing ([ffd60e7](https://github.com/nationalbankbelgium/stark/commit/ffd60e7))
* **stark-build) fix(stark-starter:** fix webpack monitor issues with reports folder and HMR ([78c799f](https://github.com/nationalbankbelgium/stark/commit/78c799f))
* **stark-core:** add missing barrel for common folder. Fix stark-core translations utils imports. ([febb69b](https://github.com/nationalbankbelgium/stark/commit/febb69b))
* **stark-starter:** fix blocking issue for reports folder ([1b7d492](https://github.com/nationalbankbelgium/stark/commit/1b7d492)), closes [#356](https://github.com/nationalbankbelgium/stark/issues/356)
* **stark-ui) fix(stark-testing:** add stark-ui package to the npm install:all script. Simplify customization of default Karma config. ([4f77730](https://github.com/nationalbankbelgium/stark/commit/4f77730))


### Features

* **build:** add support for custom baseHref and deployUrl in angular-cli.json file with BaseHrefWebpackPlugin ([cf941bd](https://github.com/nationalbankbelgium/stark/commit/cf941bd)), closes [#148](https://github.com/nationalbankbelgium/stark/issues/148)
* **build:** add support for publishing api docs and showcase using Travis. Closes [#282](https://github.com/nationalbankbelgium/stark/issues/282) ([f38ff86](https://github.com/nationalbankbelgium/stark/commit/f38ff86))
* **build:** add webpackMonitor ([ee46bef](https://github.com/nationalbankbelgium/stark/commit/ee46bef)), closes [#322](https://github.com/nationalbankbelgium/stark/issues/322)
* **build:** added changelog generation. Closes [#335](https://github.com/nationalbankbelgium/stark/issues/335) ([e06ba53](https://github.com/nationalbankbelgium/stark/commit/e06ba53))
* **core:** validate the AppConfig in every service where it is injected ([dd41aa5](https://github.com/nationalbankbelgium/stark/commit/dd41aa5)), closes [#382](https://github.com/nationalbankbelgium/stark/issues/382)
* **docs:** added API docs generation to packages and starter. Closes [#127](https://github.com/nationalbankbelgium/stark/issues/127) ([50c610f](https://github.com/nationalbankbelgium/stark/commit/50c610f))
* **docs:** added TSlint rules and adapted documentation for the project ([14cb90f](https://github.com/nationalbankbelgium/stark/commit/14cb90f)), closes [#424](https://github.com/nationalbankbelgium/stark/issues/424) [#389](https://github.com/nationalbankbelgium/stark/issues/389)
* **docs:** improved API docs generation with watch mode and coverage checks ([60701c8](https://github.com/nationalbankbelgium/stark/commit/60701c8))
* **showcase:** added showcase, cleaned up start and got rid of old testing cfg. Closes [#395](https://github.com/nationalbankbelgium/stark/issues/395) [#353](https://github.com/nationalbankbelgium/stark/issues/353). Contributes to [#130](https://github.com/nationalbankbelgium/stark/issues/130) and [#63](https://github.com/nationalbankbelgium/stark/issues/63) ([abeefe7](https://github.com/nationalbankbelgium/stark/commit/abeefe7))
* **stark-all:** add commitizen + commitlint with scripts, config & dependencies ([1cb59c2](https://github.com/nationalbankbelgium/stark/commit/1cb59c2)), closes [#290](https://github.com/nationalbankbelgium/stark/issues/290)
* **stark-all:** enable resourcesInlining once we have Angular 6 for inlining template in components ([9b33ccd](https://github.com/nationalbankbelgium/stark/commit/9b33ccd)), closes [#376](https://github.com/nationalbankbelgium/stark/issues/376)
* **stark-all:** integrate SonarTS to current TSLint checks. Refactor code to fix TSLint violations. ([8627ab4](https://github.com/nationalbankbelgium/stark/commit/8627ab4)), closes [#331](https://github.com/nationalbankbelgium/stark/issues/331)
* **stark-all:** move dev dependencies from packages to ROOT of project + Fix source-map-loader issue ([98d2bc0](https://github.com/nationalbankbelgium/stark/commit/98d2bc0)), closes [#371](https://github.com/nationalbankbelgium/stark/issues/371)
* **stark-all:** update to Angular 6, Rxjs 6, Webpack 4, TypeScript 2.7.2 ([862d10a](https://github.com/nationalbankbelgium/stark/commit/862d10a)), closes [#359](https://github.com/nationalbankbelgium/stark/issues/359) [#258](https://github.com/nationalbankbelgium/stark/issues/258) [#19](https://github.com/nationalbankbelgium/stark/issues/19)
* **stark-demo:** cleanup of Stark Showcase application ([c0a0163](https://github.com/nationalbankbelgium/stark/commit/c0a0163)), closes [#422](https://github.com/nationalbankbelgium/stark/issues/422)
* **stark-starter:** add NgIdleKeepAlive module in app module ([305989b](https://github.com/nationalbankbelgium/stark/commit/305989b)), closes [#261](https://github.com/nationalbankbelgium/stark/issues/261)
* **stark-ui:** implement SvgViewBox directive to enable resizing of Angular Material's mat-icon directive ([b4dc8ec](https://github.com/nationalbankbelgium/stark/commit/b4dc8ec)), closes [#455](https://github.com/nationalbankbelgium/stark/issues/455)
* **translation:** add functionality to enable the use of translations in Stark modules ([fbdfc25](https://github.com/nationalbankbelgium/stark/commit/fbdfc25))
* **ui:** add material theming ([9b03c06](https://github.com/nationalbankbelgium/stark/commit/9b03c06))
* **ui:** create stark-ui package. Implement AppLogo module in Stark. ([ffaeacd](https://github.com/nationalbankbelgium/stark/commit/ffaeacd)), closes [#101](https://github.com/nationalbankbelgium/stark/issues/101)
* **ui:** integrate [@mdi](https://github.com/mdi)/angular-material icons ([1e30ab7](https://github.com/nationalbankbelgium/stark/commit/1e30ab7)), closes [#123](https://github.com/nationalbankbelgium/stark/issues/123)



<a name="10.0.0-alpha.2"></a>
# [10.0.0-alpha.2](https://github.com/nationalbankbelgium/stark/compare/80d09ce...10.0.0-alpha.2) (2018-04-25)


### Bug Fixes

* **build:** Disable i18n rule for Codelyzer ([50a203d](https://github.com/nationalbankbelgium/stark/commit/50a203d))
* **build:** Fix Import bracket rule for prettier and tslint ([41562db](https://github.com/nationalbankbelgium/stark/commit/41562db))
* **build:** fixed issue with prettier config name with webpack plugin and added new scripts at root ([51be4f6](https://github.com/nationalbankbelgium/stark/commit/51be4f6))
* **core:** fix for validation module related to requested changes ([09a388d](https://github.com/nationalbankbelgium/stark/commit/09a388d))
* **core:** fix ngc issues and clean-up code in stark-core. Integrate AppMetadata in Starter ([5299842](https://github.com/nationalbankbelgium/stark/commit/5299842))
* **http:** fix unit tests. Enhance http demo in Starter ([#268](https://github.com/nationalbankbelgium/stark/issues/268)) ([6d609b8](https://github.com/nationalbankbelgium/stark/commit/6d609b8)), closes [#68](https://github.com/nationalbankbelgium/stark/issues/68) [#68](https://github.com/nationalbankbelgium/stark/issues/68) [#84](https://github.com/nationalbankbelgium/stark/issues/84) [#93](https://github.com/nationalbankbelgium/stark/issues/93) [angular/zone.js#1015](https://github.com/angular/zone.js/issues/1015) [#96](https://github.com/nationalbankbelgium/stark/issues/96)
* **lazy-loading:** Remove PreloadAllModules preloading strategy from routing coneiguration to make lazy-loaded modules to be actually lazy loaded :) ([9634dac](https://github.com/nationalbankbelgium/stark/commit/9634dac))
* **lazy-loading:** Remove PreloadAllModules preloading strategy from routing coneiguration tz makz lazz-loaded modules to be actually lazy loaded :) ([80d09ce](https://github.com/nationalbankbelgium/stark/commit/80d09ce))
* **linting:** clean stark-build/tslint.json. Remove obsolete options for 'ban' rule ([86ed26c](https://github.com/nationalbankbelgium/stark/commit/86ed26c))
* **linting:** fix some TS linting issues ([8d5d6a8](https://github.com/nationalbankbelgium/stark/commit/8d5d6a8))
* **logging:** uncomment reducer implementation in logging.module.ts ([07a5f0e](https://github.com/nationalbankbelgium/stark/commit/07a5f0e))
* **ngrx-store:** use ngrx store feature selectors in Stark Core modules. Use store-freeze and store-logger meta-reducers in Starter ([916c435](https://github.com/nationalbankbelgium/stark/commit/916c435))
* **rollup:** add ibantools to external dependencies ([9606ecc](https://github.com/nationalbankbelgium/stark/commit/9606ecc))
* Use latest rxjs forward-compat to solve ErrorObservable issues ([28c7ceb](https://github.com/nationalbankbelgium/stark/commit/28c7ceb))


### Features

* **build:** added .gitattributes. Closes [#144](https://github.com/nationalbankbelgium/stark/issues/144). ([b4c3ef2](https://github.com/nationalbankbelgium/stark/commit/b4c3ef2))
* **build:** added release and publish support. Closes [#54](https://github.com/nationalbankbelgium/stark/issues/54). Closes [#24](https://github.com/nationalbankbelgium/stark/issues/24). Closes [#27](https://github.com/nationalbankbelgium/stark/issues/27) ([101ceab](https://github.com/nationalbankbelgium/stark/commit/101ceab))
* **build:** added support for building a subset of the packages ([55ec4c1](https://github.com/nationalbankbelgium/stark/commit/55ec4c1))
* **coverage:** add support for code coverage with Coveralls ([72aefce](https://github.com/nationalbankbelgium/stark/commit/72aefce))
* **http:** correction for imports ([464566a](https://github.com/nationalbankbelgium/stark/commit/464566a))
* **http:** create StarkHttp module. Fixed imports. Implemented small demo in Starter [[#96](https://github.com/nationalbankbelgium/stark/issues/96)] ([201edb8](https://github.com/nationalbankbelgium/stark/commit/201edb8))
* **http:** implement Stark Http in stark-core (unit tests to be completed) [[#96](https://github.com/nationalbankbelgium/stark/issues/96)] ([579c59b](https://github.com/nationalbankbelgium/stark/commit/579c59b))
* **http:** implement Stark Http in stark-core (unit tests to be completed) [[#96](https://github.com/nationalbankbelgium/stark/issues/96)] ([719d92d](https://github.com/nationalbankbelgium/stark/commit/719d92d))
* **logging:** create StarkLogging module. Fixed imports ([f3684db](https://github.com/nationalbankbelgium/stark/commit/f3684db))
* **logging:** implement STARK_APP_CONFIG token and implement Stark logging in Starter ([ec09736](https://github.com/nationalbankbelgium/stark/commit/ec09736))
* **polyfills:** Update polyfills.browser.ts with the relevant polyfills needed only for IE11 and some special features from Angular. Add needed npm dependencies for those polyfils ([2b6a160](https://github.com/nationalbankbelgium/stark/commit/2b6a160))
* **routing:** adapt CSP style-src directive to allow inline styles from UI Router visualizer ([8a1a8fa](https://github.com/nationalbankbelgium/stark/commit/8a1a8fa))
* **routing:** add UI Router visualizer. Adapt CSP img-src directive to allow png images from UI Router visualizer ([3bc995b](https://github.com/nationalbankbelgium/stark/commit/3bc995b))
* **routing:** replace Angular Router by UI Router ([24b70d4](https://github.com/nationalbankbelgium/stark/commit/24b70d4))
* **session:** add actions, entities, reducers and services for session module ([2dad18c](https://github.com/nationalbankbelgium/stark/commit/2dad18c))
* **session:** Correction relative to PR requested changes for session module ([4290029](https://github.com/nationalbankbelgium/stark/commit/4290029))
* **stark-testing:** create separate stark-testing package and use it in all stark packages and starter ([#267](https://github.com/nationalbankbelgium/stark/issues/267)) ([204dc35](https://github.com/nationalbankbelgium/stark/commit/204dc35)), closes [#68](https://github.com/nationalbankbelgium/stark/issues/68) [#68](https://github.com/nationalbankbelgium/stark/issues/68) [#84](https://github.com/nationalbankbelgium/stark/issues/84) [#93](https://github.com/nationalbankbelgium/stark/issues/93) [angular/zone.js#1015](https://github.com/angular/zone.js/issues/1015)
* **user:** add entities for user module ([38c48fe](https://github.com/nationalbankbelgium/stark/commit/38c48fe))



