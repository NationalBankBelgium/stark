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
* **http:** implement Stark Http in stark-core (unit tests to be completed) [[#96](https://github.com/nationalbankbelgium/stark/issues/96)] ([719d92d](https://github.com/nationalbankbelgium/stark/commit/719d92d))
* **http:** implement Stark Http in stark-core (unit tests to be completed) [[#96](https://github.com/nationalbankbelgium/stark/issues/96)] ([579c59b](https://github.com/nationalbankbelgium/stark/commit/579c59b))
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



