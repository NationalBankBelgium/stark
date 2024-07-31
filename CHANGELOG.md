# [12.0.0-alpha.1](https://github.com/nationalbankbelgium/stark/compare/10.2.0...12.0.0-alpha.1) (2024-07-31)


### Bug Fixes

* **build-main:** fix `npm run commit` script in order to fix the usage on Windows OS ([ec74726](https://github.com/nationalbankbelgium/stark/commit/ec7472647071c253323f51ea1599cf9e2d905b95))
* **stark-all:** disable `emitDecoratorMetadata` in tsconfig of stark-* packages in order to solve build warnings ([d37ba9f](https://github.com/nationalbankbelgium/stark/commit/d37ba9f42492111e909b007bbd2df2ba3636d0cf)), closes [ng-packagr/ng-packagr#2056](https://github.com/ng-packagr/ng-packagr/issues/2056)
* **stark-all:** fix compodoc dependency to v1.1.13 ([bfcd2f3](https://github.com/nationalbankbelgium/stark/commit/bfcd2f367973c26f35268288f695876e70820ccc))
* **stark-all:** remove vulnerable `event-source-polyfill` dependency ([713239f](https://github.com/nationalbankbelgium/stark/commit/713239f51d303679a4b1d273c2b8023e1903392f))
* **stark-build:** fix index-html transform script to support ng12 production build ([aab9a4f](https://github.com/nationalbankbelgium/stark/commit/aab9a4f80f78025002d73eb0185ef084fe3cd63c))
* **stark-build:** remove csp 'plugin-types' rule and adapt 'object-src' rule ([0fd48d1](https://github.com/nationalbankbelgium/stark/commit/0fd48d138c9a1a0877260c77024f7fcf43aa333b)), closes [#3086](https://github.com/nationalbankbelgium/stark/issues/3086)
* **stark-build:** remove support for obsolete `webpack-monitor` ([095117c](https://github.com/nationalbankbelgium/stark/commit/095117c3cefa39894864e24ff47cf2de4d0607f1))
* **stark-core:** add support for http 204 status code when persisting logs ([e24d92b](https://github.com/nationalbankbelgium/stark/commit/e24d92b9a5b1e6442a06fdad5b5cf85e95f4382e))
* **stark-testing:** remove useless `coveralls` dependency ([df5bed4](https://github.com/nationalbankbelgium/stark/commit/df5bed49639e820d96a62837cff35e7dc5665e30))
* **stark-ui:** dropdown - fix click event not working around the `mat-select` element ([cd29848](https://github.com/nationalbankbelgium/stark/commit/cd298488c74108d61665b1cea316f4dfd64dbfa6))
* **stark-ui:** fix `ViewDestroyedError` issue linked to formControl usage ([f0857e8](https://github.com/nationalbankbelgium/stark/commit/f0857e89c72e8fe2ff03543294f80d8bfa08a3f5)), closes [#2874](https://github.com/nationalbankbelgium/stark/issues/2874)
* **stark-ui:** handles paste and drop event on the restrict-input directive ([28791f3](https://github.com/nationalbankbelgium/stark/commit/28791f333a09999d97d349c51f34ac5cf2ecb9af)), closes [#1905](https://github.com/nationalbankbelgium/stark/issues/1905)
* **stark-ui:** minimap - fix `[class.open]="minimapMenuTrigger.menuOpen"` not changing when menu closed ([50034b3](https://github.com/nationalbankbelgium/stark/commit/50034b394ee41798b728842843a95b3020c82b18))
* **stark-ui:** pretty-print - add support for uppercase extension names ([9e1e837](https://github.com/nationalbankbelgium/stark/commit/9e1e8370cf9779a126cfb4081bbc12d2113291d8))
* **stark-ui:** remove KeybordEvent.char ([c25fec8](https://github.com/nationalbankbelgium/stark/commit/c25fec869ff9a0060a2f43eab796e5aa1410413b)), closes [#3634](https://github.com/nationalbankbelgium/stark/issues/3634)
* **stark-ui:** table action column do not works when language is NL ([20c010e](https://github.com/nationalbankbelgium/stark/commit/20c010e8afe4e31c97c0b3782d5e4150b9b4c373)), closes [#3391](https://github.com/nationalbankbelgium/stark/issues/3391)


### chore

* **stark-all:** upgrade project engine from NodeJS-12_npm-7 to NodeJS-14_npm-8 ([ca333ce](https://github.com/nationalbankbelgium/stark/commit/ca333cee87342bf7e3a998ec834004970a47fa53))
* **stark-ui:** change linting engine from `TSLint` to `ESLint` ([781d133](https://github.com/nationalbankbelgium/stark/commit/781d13370f8fc870b94b105c4c8fc3f250a50555))


### Features

* **build-main:** adapt husky configuration after husky upgrade ([b784013](https://github.com/nationalbankbelgium/stark/commit/b78401391799f6db8cf1f90705eb55621a78ba7c))
* **build-main:** upgrade npm to v7 and NodeJS to v12 ([37d400a](https://github.com/nationalbankbelgium/stark/commit/37d400a0267e54ac3a81f7395d8b3cd66a20e015))
* **showcase:** adapt generic-search demo to use public `results$` variable directly in template ([b8ca98f](https://github.com/nationalbankbelgium/stark/commit/b8ca98fcb278917229cfc979d714adc27ab6537f))
* **showcase:** add the ngx-form-errors demo to the showcase ([4a98d3c](https://github.com/nationalbankbelgium/stark/commit/4a98d3cc32bb2fe48a7203b6a4f6f824991cb2eb)), closes [#1195](https://github.com/nationalbankbelgium/stark/issues/1195)
* **showcase:** update generic-search actions style ([7dd7c09](https://github.com/nationalbankbelgium/stark/commit/7dd7c09509016aed455831264e5cea8ae69ddaa0))
* **showcase:** upgrade to Angular 12 ([26327e0](https://github.com/nationalbankbelgium/stark/commit/26327e0fed03d1688c071d0d77942a39ea6432dc))
* **stark-all:** remove `ngrx-store-freeze` dependency thanks to `@ngrx/store` 8.x upgrade ([4af3e25](https://github.com/nationalbankbelgium/stark/commit/4af3e2581af8913935da5e6ba756aed65a047c84))
* **stark-all:** upgrade npm to v7 and NodeJS to v12 ([1e127a1](https://github.com/nationalbankbelgium/stark/commit/1e127a10fafb70de7c534f68c7c1f132a77a4a35))
* **stark-build:** add Stylelint plugin in build configuration ([30a191d](https://github.com/nationalbankbelgium/stark/commit/30a191de5605b1211c251e0d798322c4950ee8fd))
* **stark-build:** enable `writeToDisk` in webpack-dev-server configuration ([95dcf2c](https://github.com/nationalbankbelgium/stark/commit/95dcf2cab5f3fcd1d84393b2618727b160da8f81))
* **stark-build:** merge webpack configurations into a single new webpack.config.js file ([7791bc2](https://github.com/nationalbankbelgium/stark/commit/7791bc2ec878881f561c6944aadab2df03f6c87b)), closes [#2558](https://github.com/nationalbankbelgium/stark/issues/2558)
* **stark-build:** replace ContextReplacementPlugin by MomentLocalesPlugin to reduce Moment.js size ([68c6489](https://github.com/nationalbankbelgium/stark/commit/68c6489711211afd098bd620bc150da957f8bac8))
* **stark-build:** update TSLint to v6.1.3 ([f77d719](https://github.com/nationalbankbelgium/stark/commit/f77d719e4815fa84d3e487d10f8bde1c9603d9b3))
* **stark-build:** upgrade to Angular 12 ([44502de](https://github.com/nationalbankbelgium/stark/commit/44502de395f87d3873b71eb3c4f50030c8670142))
* **stark-build:** upgrade to Angular 8 ([c3c83b6](https://github.com/nationalbankbelgium/stark/commit/c3c83b62abbf41db9e692473d93622ca48567964))
* **stark-core:** add support for `httpOnly` cookie in `StarkXSRFService` ([9fe3907](https://github.com/nationalbankbelgium/stark/commit/9fe39072293985b4c3e6207defa48665b55eb05c)), closes [#3136](https://github.com/nationalbankbelgium/stark/issues/3136)
* **stark-core:** removed Throw Error to create stack trace for IE ([c58408f](https://github.com/nationalbankbelgium/stark/commit/c58408fe73ec6af26de5bae2830da8b7c5fde18a)), closes [#3636](https://github.com/nationalbankbelgium/stark/issues/3636)
* **stark-core:** update `class-validator` dependency to version ~0.13.1 ([1fd6700](https://github.com/nationalbankbelgium/stark/commit/1fd6700ac921d1f598f4289b95d25db3370e9312))
* **stark-core:** update `uuid` and `@types/uuid` dependencies to version "^8.3.0" ([15b5c08](https://github.com/nationalbankbelgium/stark/commit/15b5c08bd21fa191a6cd0eb010aa4bb8dba2d657)), closes [#2759](https://github.com/nationalbankbelgium/stark/issues/2759) [#2760](https://github.com/nationalbankbelgium/stark/issues/2760)
* **stark-core:** update error handling actions style ([727c244](https://github.com/nationalbankbelgium/stark/commit/727c2445f55be512165d8416d2f2c32e5a1e567b))
* **stark-core:** update logging actions style ([3dd57d2](https://github.com/nationalbankbelgium/stark/commit/3dd57d231d284822dd8ec5656a1f95a2c0113a1c))
* **stark-core:** update routing actions style ([97b067d](https://github.com/nationalbankbelgium/stark/commit/97b067d38ffc82e3123e2d4daa1a7a0f511df2e1))
* **stark-core:** update session actions style ([810bbc1](https://github.com/nationalbankbelgium/stark/commit/810bbc17df08a4605f6e4d94af42c23cc344abc8))
* **stark-core:** update settings actions style ([f1803a8](https://github.com/nationalbankbelgium/stark/commit/f1803a884620d24ae72dfe35e0fed25dd6638859))
* **stark-core:** update user actions style ([8418efc](https://github.com/nationalbankbelgium/stark/commit/8418efc0efabac4306c90b775286d2379fce9ffe))
* **stark-core:** upgrade to Angular 12 ([367c2b2](https://github.com/nationalbankbelgium/stark/commit/367c2b2a53cdaa91fff35853c921c3265c720c79))
* **stark-core:** upgrade to Angular 8 ([3d0b6ea](https://github.com/nationalbankbelgium/stark/commit/3d0b6ea9169cbb363fe2a8452c530fe64fabfb77))
* **stark-rbac:** update rbac actions style ([c4efd6a](https://github.com/nationalbankbelgium/stark/commit/c4efd6a00ddd7e57a42754a12d49ebd1d25de0a1))
* **stark-rbac:** upgrade to Angular 12 ([d07c680](https://github.com/nationalbankbelgium/stark/commit/d07c68058903fc1205ca2ef74fcf1427f8e2fc1e))
* **stark-testing:** bump @types/jasmine in /packages/stark-testing/package.json from 3.6.4 to 3.8.2 ([758bc2c](https://github.com/nationalbankbelgium/stark/commit/758bc2c25eee84d4f9fbf262e5f4a767546c7ff6))
* **stark-testing:** improve karma config for ng test usage ([82d0bac](https://github.com/nationalbankbelgium/stark/commit/82d0bacc2728af0a5a68908df31699d7f7dddeff))
* **stark-testing:** replace `karma-typescript` by `karma` + `@angular/devkit:build-angular` ([a9e06dc](https://github.com/nationalbankbelgium/stark/commit/a9e06dcc26c534cb6bf3a0c37624f76c0eb5e41e))
* **stark-testing:** upgrade to Angular 12 + karma 6 ([2fed5d6](https://github.com/nationalbankbelgium/stark/commit/2fed5d6512c32b714767eb494bde3bde2a74106f))
* **stark-ui:** add support for Angular html templates in pretty-print component ([b9e2aa2](https://github.com/nationalbankbelgium/stark/commit/b9e2aa2639f4276b53d398f5ba4ef23232037ec4))
* **stark-ui:** generic-search - adapt `results$` variable visibility to `public` ([99d1ae8](https://github.com/nationalbankbelgium/stark/commit/99d1ae80019bd77f104e26b0e85e18f687fc99b0)), closes [#3082](https://github.com/nationalbankbelgium/stark/issues/3082)
* **stark-ui:** keep highlight the menu when go to child state ([4f55b60](https://github.com/nationalbankbelgium/stark/commit/4f55b60acb09614a37451a8d6f2429208e453db9)), closes [#3521](https://github.com/nationalbankbelgium/stark/issues/3521)
* **stark-ui:** replace `pretty-data` by `prettier`+`@sqltools/formatter` in pretty-print component ([286556e](https://github.com/nationalbankbelgium/stark/commit/286556ee8ad7b80fe1c85e645092320d74785f8a)), closes [#2543](https://github.com/nationalbankbelgium/stark/issues/2543)
* **stark-ui:** update message-pane actions style ([3ff099f](https://github.com/nationalbankbelgium/stark/commit/3ff099fca449a0687b01971b8360cb422b3192b2))
* **stark-ui:** update progress-indicator actions style ([374c429](https://github.com/nationalbankbelgium/stark/commit/374c42909e043e5f788553ac6a4eee3ddcbe79ab))
* **stark-ui:** update styles for Sass v8 usage ([1be66d3](https://github.com/nationalbankbelgium/stark/commit/1be66d38a5a67e1f92db12c87b0dbbac47847c13))
* **stark-ui:** update styles to allow theme customization ([5a2a1fb](https://github.com/nationalbankbelgium/stark/commit/5a2a1fb5fc6c1a1b5ab1cc3120499d89fefae7ae))
* **stark-ui:** upgrade to Angular 12 ([4869f11](https://github.com/nationalbankbelgium/stark/commit/4869f11d21df086fbe6ad50a52ecfd1f83a14bb9))
* **stark-ui:** upgrade to Angular 8 ([e19d4a8](https://github.com/nationalbankbelgium/stark/commit/e19d4a89a12c31a3045dd03065ea47b70671b0cb))
* **starter:** adapt husky configuration after husky upgrade ([9af712d](https://github.com/nationalbankbelgium/stark/commit/9af712d9ab4ac0528ae49ccc06f167d278c16c2f))
* **starter:** upgrade to Angular 12 ([6754a96](https://github.com/nationalbankbelgium/stark/commit/6754a96d3a6f28838f19a4653524c490d3f97b99))


### BREAKING CHANGES

* **stark-ui:** The selector of the `StarkSessionTimeoutWarningDialogComponent` component has been changed from
"session-timeout-warning-dialog" to "stark-session-timeout-warning-dialog".
* **stark-all:** The minimum versions for NodeJS and npm are now:
  - NodeJS: v14.20.0
  - npm: v8.19.1
* **stark-testing:** Adapt test ci script in "package.json":
  ```
  // BEFORE
  "test-fast:ci": "cross-env CI=1 npm run ng test --code-coverage",

  // AFTER
  "test-fast:ci": "npm run ng test -- --watch=false --code-coverage",
  ```
* **stark-ui:**   Due to upgrade to `@angular/material` v12, SCSS files should be adapted to use the
  new `@use` word instead of `@import`.

  Your current "src/styles/_theme.scss" should look like this:

  ```scss
  @import "variables";
  @import "~@nationalbankbelgium/stark-ui/assets/theming";
  ```

  After upgrading to Stark v12, you should update the file as following:

  ```scss
  @use "variables";
  @use "sass:map";

  @use "~@angular/material" as mat;
  @use "~@nationalbankbelgium/stark-ui" as stark-ui;

  @include mat.core();
  @include stark-ui.set-stark-ui-styles();
  ```

  As all the stark-ui styles are configured thanks to `set-stark-ui-styles` method, you should
  remove `@import "~@nationalbankbelgium/stark-ui/assets/stark-ui-bundle";` import
  in "src/styles/styles.scss".

  If you use Stark media queries variables such as `$tablet-query`, `$mobile-only-query`...

  You should add the following `@use` rule at the top of your files:

  ```scss
  @use "~@nationalbankbelgium/stark-ui/styles/media-queries" as *;
  ```
* **stark-build:** Remove useless babel-loader dependency + remove IE 11 support in development mode
* **stark-build:**   Due to Angular upgrade, "angular.json" file has to be updated as following:

  1. Edit `projects.<project_name>.architect.build.options`:

  Before:

  ```txt
  {
    // ...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "build": {
            "builder": "@angular-builders/custom-webpack:browser",
            "options": {
              "customWebpackConfig": {
                "path": "./node_modules/@nationalbankbelgium/stark-build/config/webpack-partial.dev.js",
                "mergeStrategies": {
                  "modules.rules": "prepend",
                  "plugins": "prepend",
                  "devServer": "prepend",
                  "replaceDuplicatePlugins": false
                }
              },
              // ...
            },
          }
        }
      }
    }
  }
  ```

  After:

  ```txt
  {
    // ...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "build": {
            "builder": "@angular-builders/custom-webpack:browser",
            "options": {
              "customWebpackConfig": {
                "path": "./node_modules/@nationalbankbelgium/stark-build/config/webpack.config.js"
              },
              // /!\ Add following line
              "indexTransform": "./node_modules/@nationalbankbelgium/stark-build/config/index-html.transform.js",
              // ...
            },
          }
        }
      }
    }
  }
  ```

  2. Edit `projects.<project_name>.architect.build.configurations.<environment>`:

  In Stark 12, there is only one "webpack.config.js" file.
  Thanks to this, this is no longer needed to have specific configurations for other environment.

  You need to remove the following lines in
  `projects.<project_name>.architect.build.configurations.<environment>`:

  Before:

  ```txt
  {
    // ...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "build": {
            "configurations": {
              "production": {
                // Remove all the "customWebpackConfig"
                "customWebpackConfig": {
                  "path": "./node_modules/@nationalbankbelgium/stark-build/config/webpack-partial.prod.js",
                  "mergeStrategies": {
                    "modules.rules": "prepend",
                    "plugins": "prepend",
                    "devServer": "prepend",
                    "replaceDuplicatePlugins": false
                  }
                },
                // ...
              },
              // ...
            },
          }
        }
      }
    }
  }
  ```

  After:

  ```txt
  {
    //...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "build": {
            "configurations": {
              "production": {
                // "customWebpackConfig" is entirely removed
                // ...
              },
              // ...
            },
          }
        }
      }
    }
  }
  ```

  3. Edit `projects.<project_name>.architect.serve.builder`:

  Before:

  ```txt
  {
    //...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "serve": {
            "builder": "@angular-builders/dev-server:generic",
            "options": {
              "browserTarget": "<project_name>:build",
              "port": 3000,
              "open": true
            },
            // ...
          }
        }
      }
    }
  }
  ```

  After:

  ```txt
  {
    //...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "serve": {
            // /!\ Edit following line
            "builder": "@angular-builders/custom-webpack:dev-server",
            "options": {
              "browserTarget": "<project_name>:build",
              "port": 3000,
              "open": true
            },
            // ...
          }
        }
      }
    }
  }
  ```

  4. Edit `projects.<project_name>.architect.test.builder`:

  Add support for stark-testing karma config with command `ng test`

  Before:

  ```txt
  {
    //...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "test": {
            "builder": "@angular-devkit/build-angular:karma",
            "options": {
              "main": "base.spec.ts",
              "karmaConfig": "./karma.conf.js",
              "tsConfig": "tsconfig.spec.json"
            }
          }
        }
      }
    }
  }
  ```

  After:

  ```txt
  {
    //...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "test": {
            // /!\ Edit following line
            "builder": "@angular-builders/custom-webpack:karma",
            "options": {
              "main": "base.spec.ts",
              "karmaConfig": "./karma.conf.js",
              "tsConfig": "tsconfig.spec.json"
            }
          }
        }
      }
    }
  }
  ```

  5. Edit `projects.<project_name>.architect.build.configurations.hmr`:

  Add support for CSS Hot Reloading by setting `extractCss` property to `false` in hmr configuration.

  Before:

  ```txt
  {
    // ...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "build": {
            "configurations": {
              "hmr": {
                "fileReplacements": [
                  {
                    "replace": "src/environments/environment.ts",
                    "with": "src/environments/environment.hmr.ts"
                  }
                ]
              },
              // ...
            },
          }
        }
      }
    }
  }
  ```

  After:

  ```txt
  {
    // ...
    "projects": {
      "<project_name>": {
        // ...
        "architect": {
          "build": {
            "configurations": {
              "hmr": {
                "extractCss": false, // <-- Line to add
                "fileReplacements": [
                  {
                    "replace": "src/environments/environment.ts",
                    "with": "src/environments/environment.hmr.ts"
                  }
                ]
              },
              // ...
            },
          }
        }
      }
    }
  }
  ```
* **stark-build:**   Adapt "src/index.html" file

  1. Adapt stark variables usage
  As `htmlWebpackPlugin` is no longer supported by Angular CLI, the options related to this plugin
  have been changed.
  Instead of using `htmlWebpackPlugin`, you need to use `starkOptions` like this:

  Before:

  ```html
  <%= htmlWebpackPlugin.options.starkAppMetadata.name %>
  <!-- or -->
  <%= htmlWebpackPlugin.options.starkAppConfig.defaultLanguage %>
  <!-- or -->
  <%= htmlWebpackPlugin.options.metadata.TITLE %>
  ```

  After:

  ```html
  <%= starkOptions.starkAppMetadata.name %>
  <!-- or -->
  <%= starkOptions.starkAppConfig.defaultLanguage %>
  <!-- or -->
  <%= starkOptions.metadata.TITLE %>
  ```

  Thanks to the following search & replace:

  - search: `htmlWebpackPlugin.options.`
  - replace: `starkOptions.`

  It should be easy to adapt the index.html file.

  2. Remove obsolete code related to webpack-dev-server

  Remove the following piece of code in "src/index.html"

  ```html
  <!-- move the block of webpack dev server to the <head> section and change the IF conditions -->
  <% if (starkOptions.starkAppMetadata.IS_DEV_SERVER && starkOptions.starkAppMetadata.HMR !== true) { %>
  <!-- Webpack Dev Server reload -->
  <script src="/webpack-dev-server.js"></script>
  <% } %>
  ```
* **stark-build:**   Adapt "package.json" file. Remove scripts with MONITOR

  Due to Angular upgrade, webpack-monitor stopped working.
  Since the package was no longer maintained (4 years),
  we decided to remove the support from `stark-build`.

  The following scripts should be removed from "package.json" file:

  ```json
  {
    "scripts": {
      "build:dev:monitor": "npx mkdirp reports && cross-env MONITOR=1 npm run build:dev",
      "server:dev:monitor": "npm run clean:dist && cross-env MONITOR=1 npm run ng -- serve",
      "start:monitor": "npx mkdirp reports && cross-env MONITOR=1 npm run server:dev"
    }
  }
  ```
* **stark-build:**   Due to Angular upgrade, webpack-monitor stopped working. Since the package was no longer maintained (4 years),
  we decided to remove the support from `stark-build`.

  The following scripts should be removed from "package.json" file:

  ```json
  {
    "scripts": {
      "build:dev:monitor": "npx mkdirp reports && cross-env MONITOR=1 npm run build:dev",
      "server:dev:monitor": "npm run clean:dist && cross-env MONITOR=1 npm run ng -- serve",
      "start:monitor": "npx mkdirp reports && cross-env MONITOR=1 npm run server:dev"
    }
  }
  ```
* **stark-all:** Stark framework now requires:
  - NodeJS >= 12.22.1
  - npm >= 7.12.1
* **stark-build:**     Due to TSLint update, it is required to adapt the usage in "tslint.json" file at the root of the project:

    ```txt
    // Before
    {
      "extends": [
        // ...
        "@nationalbankbelgium/code-style/tslint/5.20.x",
        // ...
      ]
      // ...
    }

    // After
    {
      "extends": [
        // ...
        "@nationalbankbelgium/code-style/tslint/6.1.x",
        // ...
      ]
      // ...
    }
* **stark-core:** Due to class-validator update:
  - Validatorjs releases contain some breaking changes e.g. `IsMobileNumber` or `IsHexColor`. Please
check validatorjs [CHANGELOG](https://github.com/validatorjs/validator.js/blob/master/CHANGELOG.md)
  - Validation functions was removed from `Validator` class to enable tree shaking.

    BEFORE:

    ```ts
    import { Validator } from 'class-validator';

    const validator = new Validator();
    validator.isNotIn(value, possibleValues);
    validator.isBoolean(value);
    ```

    AFTER:

    ```ts
    import { isNotIn, isBoolean } from 'class-validator';

    isNotIn(value, possibleValues);
    isBoolean(value);
    ```

  - IsNumberString decorator arguments changed to
  `@IsNumberString(ValidatorJS.IsNumericOptions, ValidationOptions)`.
* **stark-testing:** Adapt angular.json, package.json and base.spec.ts files.

  Check test config in "angular.json":
  ```
  // ...
  "test": {
    "builder": "@angular-builders/custom-webpack:karma",
    "options": {
      "main": "base.spec.ts",
      "karmaConfig": "./karma.conf.js",
      "tsConfig": "tsconfig.spec.json"
    }
  }
  ```

  Check tests scripts in "package.json":
  ```
  // BEFORE
  "test-fast": "karma start",
  "test-fast:ci": "karma start karma.conf.ci.js",

  // AFTER
  "test-fast": "npm run ng test",
  "test-fast:ci": "cross-env CI=1 npm run ng test --code-coverage",
  ```

  Adapt "base.spec.ts" file as follows:
  ```typescript
  "use strict";

  import "core-js/es";
  import "core-js/proposals/reflect-metadata";

  // IE polyfills

  // See https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
  /* tslint:disable:no-unbound-method */
  if (!Element.prototype.matches) {
  	Element.prototype.matches = (<any>Element.prototype).msMatchesSelector ||
  	  Element.prototype.webkitMatchesSelector;
  }
  /* tslint:enable:no-unbound-method */

  // See: https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
  if ((<any>window).NodeList && !NodeList.prototype.forEach) {
  	(<any>NodeList.prototype).forEach = Array.prototype.forEach;
  }

  /* tslint:disable:no-import-side-effect */
  import "zone.js/dist/zone";
  import "zone.js/dist/zone-testing";
  import "zone.js/dist/long-stack-trace-zone";
  /* tslint:enable:no-import-side-effect */

  // define global environment variable (used in some places in stark-core and stark-ui)
  global["ENV"] = "development";

  import { getTestBed } from "@angular/core/testing";
  import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
  } from "@angular/platform-browser-dynamic/testing";

  // tslint:disable:completed-docs bool-param-default
  declare const require: {
  	context(path: string, deep?: boolean, filter?: RegExp): {
  		keys(): string[];
  		<T>(id: string): T;
  	};
  };
  getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

  // Then we find all the tests.
  const context = require.context('./src', true, /\.spec\.ts$/);
  // And load the modules.
  context.keys().forEach(context);
  ```
* **stark-all:** Remove `ngrx-store-freeze` dependency in favor of new built-in runtime checks in `@ngrx/store@8.x`.

  Adapt code as follows:

  ```ts
  // Before
  import { storeFreeze } from "ngrx-store-freeze";
  //...
  export const metaReducers: MetaReducer<State>[] =
    ENV === "development" ? [logger, storeFreeze] : [];

  @NgModule({
      imports: [
        CommonModule,
        StoreModule.forRoot(reducer, {
          metaReducers: metaReducers
        }),
      ]
    })
    export class AppModule {}

  // After
  export const metaReducers: MetaReducer<State>[] = ENV === "development" ? [logger] : [];

  @NgModule({
    imports: [
      CommonModule,
      StoreModule.forRoot(rootReducer, {
        metaReducers: metaReducers,
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true
        }
      }),
    ]
  })
  export class AppModule {}
  ```

  See: https://ngrx.io/guide/migration/v8#deprecation-of-ngrx-store-freeze
* **stark-rbac:** Due to an improvement on how actions are defined, the enum `StarkRBACAuthorizationActionsTypes`
became obsolete so it has been removed.

As a result, the following actions have been changed:
- `StarkUserNavigationUnauthorized(public targetState: string)`
  -> `StarkRBACAuthorizationActions.userNavigationUnauthorized({ targetState: string })`
- `StarkUserNavigationUnauthorizedRedirected(public targetState: string,
  public redirectionState: string)` ->
  `StarkRBACAuthorizationActions.userNavigationUnauthorizedRedirected({ targetState: string;
  redirectionState: string })`

And also the previous union type has been replaced:
`StarkRBACAuthorizationActions` -> `StarkRBACAuthorizationActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkRBACNavigationUnauthorized$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkUserNavigationUnauthorized>(
            StarkRBACAuthorizationActionsTypes.RBAC_USER_NAVIGATION_UNAUTHORIZED
        ),
        map((action: StarkUserNavigationUnauthorized) => {
            // some logic
        })
    );
}

// After
public starkRBACNavigationUnauthorizedRedirected$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkRBACAuthorizationActions.userNavigationUnauthorized),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:
```typescript
// Before
this.store.dispatch(new StarkUserNavigationUnauthorized(transition.targetState().name()));

// After
this.store.dispatch(StarkRBACAuthorizationActions.userNavigationUnauthorized({
    targetState: transition.targetState().name()
}));
```
* **stark-ui:** Due to an improvement on how actions are defined, the enum `StarkMessagePaneActionsTypes`
became obsolete so it has been removed.

As a result, the following actions have been changed:
- `StarkAddMessages(public messages: StarkMessage[])`
  -> `StarkMessagePaneActions.addMessages({ messages: StarkMessage[] })`
- `StarkRemoveMessages(public messages: StarkMessage[])`
  -> `StarkMessagePaneActions.removeMessages({ messages: StarkMessage[] })`
- `StarkClearMessages()` -> `StarkMessagePaneActions.clearMessages()`
- `StarkGetAllMessages()` -> `StarkMessagePaneActions.getAllMessages()`

And also the previous union type has been replaced:
`StarkMessagePaneActions` -> `StarkMessagePaneActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkAddMessages$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkAddMessages>(StarkMessagePaneActionsTypes.ADD_MESSAGES),
        map((action: StarkAddMessages) => {
            // some logic
        })
    );
}

// After
public starkAddMessages$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkMessagePaneActions.addMessages),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkAddMessages(messages));

// After
this.store.dispatch(StarkMessagePaneActions.addMessages({ messages: messages }));
```
* **stark-ui:** Due to an improvement on how actions are defined, the enum `StarkProgressIndicatorActionsTypes`
became obsolete so it has been removed.

As a result, the following actions have been changed:
- `StarkProgressIndicatorRegister(public progressIndicatorConfig: StarkProgressIndicatorFullConfig
  )` -> `StarkProgressIndicatorActions.register({
  progressIndicatorConfig: StarkProgressIndicatorFullConfig })`
- `StarkProgressIndicatorDeregister(public topic: string)` ->
  `StarkProgressIndicatorActions.deregister({ topic: string })`
- `StarkProgressIndicatorHide(public topic: string)`
  -> `StarkProgressIndicatorActions.hide({ topic: string })`
- `StarkProgressIndicatorShow(public topic: string)`
  -> `StarkProgressIndicatorActions.show({ topic: string })`

And also the previous union type has been replaced:
`StarkProgressIndicatorActions` -> `StarkProgressIndicatorActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkProgressIndicatorShow$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkProgressIndicatorShow>(
            StarkProgressIndicatorActionsTypes.PROGRESS_INDICATOR_SHOW
        ),
        map((action: StarkProgressIndicatorShow) => {
            // some logic
        })
    );
}

// After
public starkProgressIndicatorShow$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkProgressIndicatorActions.show),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkProgressIndicatorShow(topic));

// After
this.store.dispatch(StarkProgressIndicatorActions.show({ topic: topic }));
```
* **stark-core:** Due to an improvement on how actions are defined, the enum `StarkRoutingActionsTypes`
became obsolete so it has been removed.

As a result, the following actions have been changed:
- `StarkNavigate(public currentState: string, public newState: string, public params?: RawParams,
  public options?: TransitionOptions)` -> `StarkRoutingActions.navigate({ currentState: string;
  newState: string; params?: RawParams; options?: TransitionOptions })`
- `StarkNavigateSuccess(public previousState: string, public currentState: string,
  public params?: RawParams)` -> `StarkRoutingActions.navigateSuccess({ previousState: string;
  currentState: string; params?: RawParams })`
- `StarkNavigateFailure(public currentState: string, public newState: string,
  public params: RawParams, public error: string)` -> `StarkRoutingActions.navigateFailure({
  currentState: string; newState: string; params?: RawParams; error: string })`
- `StarkNavigateRejection(public currentState: string, public newState: string,
  public params: RawParams, public reason: string)` -> `StarkRoutingActions.navigateRejection({
  currentState: string; newState: string; params: RawParams; reason: string })`
- `StarkNavigationHistoryLimitReached()` -> `StarkRoutingActions.navigationHistoryLimitReached()`
- `StarkReload(public state: string)` -> `StarkRoutingActions.reload({ state: string })`
- `StarkReloadSuccess(public state: string, public params: RawParams)`
  -> `StarkRoutingActions.reloadSuccess({ state: string; params: RawParams })`
- `StarkReloadFailure(public state: string, public params: RawParams)`
  -> `StarkRoutingActions.reloadFailure({ state: string; params: RawParams })`

And also the previous union type has been replaced:
`StarkRoutingActions` -> `StarkRoutingActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkNavigateSuccess$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkNavigateSuccess>(StarkRoutingActionsTypes.NAVIGATE_SUCCESS),
        map((action: StarkNavigateSuccess) => {
            // some logic
        })
    );
}

// After
public starkNavigateSuccess$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkRoutingActions.navigateSuccess),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkNavigateSuccess(previousState, currentState, params));

// After
this.store.dispatch(StarkRoutingActions.navigateSuccess({
    previousState: previousState,
    currentState: currentState,
    params: params
}));
```
* **stark-core:** Due to an improvement on how actions are defined, the enum `StarkLoggingActionsTypes`
became obsolete so it has been removed.

As a result, the following actions have been changed:
- `StarkSetLoggingApplicationId(public applicationId: string)`
  -> `StarkLoggingActions.setLoggingApplicationId({ applicationId: string })`
- `StarkLogMessageAction(public message: StarkLogMessage)`
  -> `StarkLoggingActions.logMessage({ message: StarkLogMessage })`
- `StarkFlushLogMessages(public numberOfMessagesToFlush: number)`
  -> `StarkLoggingActions.flushLogMessages({ numberOfMessagesToFlush: number })`

And aso the previous union type has been replaced:
`StarkLoggingActions` -> `StarkLoggingActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkLogMessageAction$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkLogMessageAction>(StarkLoggingActionsTypes.LOG_MESSAGE),
        map((action: StarkLogMessageAction) => {
            // some logic
        })
    );
}

// After
public starkLogMessageAction$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkLoggingActions.logMessage),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkLogMessageAction(message));

// After
this.store.dispatch(StarkLoggingActions.logMessage({ message: message }));
```
* **stark-core:** Due to an improvement on how actions are defined, the enum `StarkSettingsActionsTypes`
became obsolete so it has been removed.

As a result, the following actions have been changed:
- `StarkPersistPreferredLanguage(public language: string)`
  -> `StarkSettingsActions.persistPreferredLanguage({ language: string })`
- `StarkPersistPreferredLanguageSuccess()`
  -> `StarkSettingsActions.persistPreferredLanguageSuccess()`
- `StarkPersistPreferredLanguageFailure(public error: any)`
  -> `StarkSettingsActions.persistPreferredLanguageFailure({ error: any })`
- `StarkSetPreferredLanguage(public language: string)`
  -> `StarkSettingsActions.setPreferredLanguage({ language: string })`

And also the previous union type has been replaced:
`StarkSettingsActions` -> `StarkSettingsActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkSetPreferredLanguage$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkSetPreferredLanguage>(StarkSettingsActionsTypes.SET_PREFERRED_LANGUAGE),
        map((action: StarkSetPreferredLanguage) => {
            // some logic
        })
    );
}

// After
public starkSetPreferredLanguage$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkSettingsActions.setPreferredLanguage),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkSetPreferredLanguage(language));

// After
this.store.dispatch(StarkSettingsActions.StarkSetPreferredLanguage({ language: language }));
```
* **stark-core:** Due to an improvement on how actions are defined, the enum `StarkSessionActionsTypes`
became obsolete so it has been removed.

As a result, the following actions have been changed:
- `StarkChangeLanguage(public languageId: string)`
  -> `StarkSessionActions.changeLanguage({ languageId: string })`
- `StarkChangeLanguageSuccess(public languageId: string)`
  -> `StarkSessionActions.changeLanguageSuccess({ languageId: string })`
- `StarkChangeLanguageFailure(public error: any)`
  -> `StarkSessionActions.changeLanguageFailure({ error: any })`
- `StarkInitializeSession(public user: StarkUser)`
  -> `StarkSessionActions.initializeSession({ user: StarkUser })`
- `StarkInitializeSessionSuccess()` -> `StarkSessionActions.initializeSessionSuccess()`
- `StarkDestroySession()` -> `StarkSessionActions.destroySession()`
- `StarkDestroySessionSuccess()` -> `StarkSessionActions.destroySessionSuccess()`
- `StarkSessionTimeoutCountdownStart(public countdown: number)`
  -> `StarkSessionActions.sessionTimeoutCountdownStart({ countdown: number })`
- `StarkSessionTimeoutCountdownStop()` -> `StarkSessionActions.sessionTimeoutCountdownStop()`
- `StarkSessionTimeoutCountdownFinish()` -> `StarkSessionActions.sessionTimeoutCountdownFinish()`
- `StarkSessionLogout()` -> `StarkSessionActions.sessionLogout()`
- `StarkUserActivityTrackingPause()` -> `StarkSessionActions.userActivityTrackingPause()`
- `StarkUserActivityTrackingResume()` -> `StarkSessionActions.userActivityTrackingResume()`

And also the previous union type has been replaced:
`StarkSessionActions` -> `StarkSessionActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkChangeLanguageSuccess$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkChangeLanguageSuccess>(StarkSessionActionsTypes.CHANGE_LANGUAGE_SUCCESS),
        map((action: StarkChangeLanguageSuccess) => {
            // some logic
        })
    );
}

// After
public starkChangeLanguageSuccess$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkSessionActions.changeLanguageSuccess),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkChangeLanguageSuccess(languageId));

// After
this.store.dispatch(StarkSessionActions.changeLanguageSuccess({ languageId: languageId }));
```
* **stark-core:** Due to an improvement on how actions are defined, the enum `StarkErrorHandlingActionsTypes`
became obsolete so it has been removed.

As a result, the following actions have been changed:
- `StarkUnhandledError(public error: any)`
  -> `StarkErrorHandlingActions.unhandledError({ error: any })`

And also the previous union type has been replaced:
`StarkErrorHandlingActions` -> `StarkErrorHandlingActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkUnhandledError$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkUnhandledError>(StarkErrorHandlingActionTypes.UNHANDLED_ERROR),
        map((action: StarkUnhandledError) => {
            // some logic
        })
    );
}

// After
public starkUnhandledError$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkErrorHandlingActions.unhandledError),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkUnhandledError(error));

// After
this.store.dispatch(StarkErrorHandlingActions.unhandledError({ error: error }));
```
* **stark-core:** Due to an improvement on how actions are defined, the enum `StarkUserActionsTypes` became obsolete
so it has been removed.

As a result, the following actions have been changed:
- `StarkFetchUserProfile()` -> `StarkUserActions.fetchUserProfile()`
- `StarkFetchUserProfileSuccess(public user: StarkUser)`
  -> `StarkUserActions.fetchUserProfileSuccess({ user: StarkUser })`
- `StarkFetchUserProfileFailure(public error: StarkHttpErrorWrapper | Error)`
  -> `StarkUserActions.fetchUserProfileFailure({ error: StarkHttpErrorWrapper | Error })`
- `StarkGetAllUsers()` -> `StarkUserActions.getAllUsers()`
- `StarkGetAllUsersSuccess(public users: StarkUser[])`
  -> `StarkUserActions.getAllUsersSuccess({ users: StarkUser[] })`
- `StarkGetAllUsersFailure(public message: string)`
  -> `StarkUserActions.getAllUsersFailure({ message: string })`

And also the previous union type has been replaced: `StarkUserActions` -> `StarkUserActions.Types`.

Change in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkFetchUserProfileSuccess$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkFetchUserProfileSuccess>(StarkUserActionTypes.FETCH_USER_PROFILE_SUCCESS),
        map((action: StarkFetchUserProfileSuccess) => {
            // some logic
        })
    );
}

// After
public starkFetchUserProfileSuccess$ = createEffect(
    () => this.actions$.pipe(
        ofType(StarkUserActions.fetchUserProfileSuccess),
        map((action) => {
            // some logic
        })
    ),
    { dispatch: false }
);
```

Change in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkFetchUserProfileSuccess(starkUser));

// After
this.store.dispatch(StarkUserActions.fetchUserProfileSuccess({ user: starkUser }));
```
* **stark-build:**   Simplify and improve integration of stark-build inside angular projects. Need to adapt "angular.json" file.

  Before:
  ```txt
  {
    //...
    "architect": {
      "build": {
        "builder": "@angular-builders/custom-webpack:browser",
        "options": {
          "customWebpackConfig": {
            "path": "./node_modules/@nationalbankbelgium/stark-build/config/webpack-partial.dev.js",
            "mergeStrategies": {
              "modules.rules": "prepend",
              "plugins": "prepend",
              "devServer": "prepend",
              "replaceDuplicatePlugins": false
            }
          },
          // ...
        },
        "configurations": {
          // ...
          "production": {
            "customWebpackConfig": {
              "path": "./node_modules/@nationalbankbelgium/stark-build/config/webpack-partial.prod.js",
              "mergeStrategies": {
                "modules.rules": "prepend",
                "plugins": "prepend",
                "replaceDuplicatePlugins": false
              }
            },
            // ...
          }
        }
      }
    }
  }
  ```

  After:
  ```txt
  {
    //...
    "architect": {
      "build": {
        "builder": "@angular-builders/custom-webpack:browser",
        "options": {
          "customWebpackConfig": {
            "path": "./node_modules/@nationalbankbelgium/stark-build/config/webpack.config.js"
            // mergeStrategies property is removed
          },
          // ...
        },
        "configurations": {
          // ...
          "production": {
            // "customWebpackConfig" property is removed
            // ...
          }
        }
      }
    }
  }
  ```
* **stark-core:** Related to "@uirouter/angular@6.0.2":

  Removed string based lazy module loading via loadChildren
  Previously, we supported `loadChildren: './lazymodule/lazy.module.ts#LazyModule'`
  This lazy load mechanism is deprecated in Angular 8 in favor of:
  `loadChildren: (): any => import('./lazymodule/lazy.module).then(x => x.LazyModule)`

  See: https://github.com/ui-router/angular/commit/2f1506c

  Due to this change, the following `provider` should be removed from
  "src/app/app.module.ts":

  ```typescript
  @NgModule({
    // ...
    providers: [
      // ...
      // /!\ Remove the following line
      { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader }, // needed for ui-router
    ]
  })
  ```
* **stark-build:**   Support for `htmlWebpackPlugin.options` has been removed.
A new support for `starkAppMetadata`, `starkAppConfig` and `metadata` has been implemented. You can now use `starkOptions` instead of `htmlWebpackPlugin.options`.
See the following example:

  Before:

  ```html
  <%= htmlWebpackPlugin.options.starkAppMetadata.name %>
  <!-- or -->
  <%= htmlWebpackPlugin.options.starkAppConfig.defaultLanguage %>
  <!-- or -->
  <%= htmlWebpackPlugin.options.metadata.TITLE %>
  ```

  After:

  ```html
  <%= starkOptions.starkAppMetadata.name %>
  <!-- or -->
  <%= starkOptions.starkAppConfig.defaultLanguage %>
  <!-- or -->
  <%= starkOptions.metadata.TITLE %>
  ```
* **stark-build:** Adapt "angular.json" file as follows:
  ```text
  {
    //...
    "projects": {
      "<project_name>": {
        "architect": {
          "build": {
            // ...
            // /!\ Add the following line
            "indexTransform": "./node_modules/@nationalbankbelgium/stark-build/config/index-html.transform.js",
            // ...
          },
          "serve": {
            // Edit the following line.
            // Before:
            // "builder": "@angular-builders/dev-server:generic",
            // Now:
            "builder": "@angular-builders/custom-webpack:dev-server",
            // ...
          }
        }
      }
    }
  }
  ```
* **stark-build:** Adapt the "index.html" as follows:
  ```html
  <html lang="en">
    <head>
      <!-- ... -->
      <!-- Adapt the title tag as follows -->
      <!-- Before: -->
      <title><%= htmlWebpackPlugin.options.starkAppMetadata.name %></title>
      <!-- After: -->
      <title>%starkAppMetadata.name%</title>

      <!-- /!\ Remove the following lines -->
      <meta name="description" content="<%= htmlWebpackPlugin.options.starkAppMetadata.description %>" />
      <% if (webpackConfig.htmlElements.headTags) { %>
        <!--Configured Head Tags  -->
      <%= webpackConfig.htmlElements.headTags %> <% } %>
      <!-- ... -->
    </head>

    <!-- -->
  </html>
  ```
* **stark-build:** Add the "config/index-head-config.js" the "description" meta in as follows:
  ```text
  {
    links: [
      // ...
    ],
    meta: [
      // ...
      { name: "description", content: "%starkAppMetadata.description%" },
    ]
  }
  ```



# [10.2.0](https://github.com/nationalbankbelgium/stark/compare/10.1.0...10.2.0) (2021-03-10)


### Bug Fixes

* **stark-build:** fix warning messages appearing at build time ([d318519](https://github.com/nationalbankbelgium/stark/commit/d31851966a5ba779bcb47017d64b218d089ef371))
* **stark-core:** fix "class-validator" dependency to version ~0.11.0 ([ee9fc81](https://github.com/nationalbankbelgium/stark/commit/ee9fc8171b5a21484a4f95e7c8fab6607f7e468e))
* **stark-core:** fix starkIsIBAN validation method after upgrade "ibantools" dependency ([0fc2be3](https://github.com/nationalbankbelgium/stark/commit/0fc2be3fde59e04069af69995a3078436d1d1a44))
* **stark-testing:** fix karma ci configuration for Chrome Headless after puppeteer upgrade to v7 ([6d416a5](https://github.com/nationalbankbelgium/stark/commit/6d416a504ce77d0c8d0942b4c7f8f12551093f90))
* **stark-testing:** fix the version of karma-typescript-es6-transform to 5.1.0 ([a15d582](https://github.com/nationalbankbelgium/stark/commit/a15d58271d5587a81972b1c76e594ac4ad593247))
* **stark-ui:** rename `MockAppSidebarService` to `MockStarkAppSidebarService` in `@nationalbankbelgium/stark-ui/testing` subpackage ([4b51363](https://github.com/nationalbankbelgium/stark/commit/4b5136319cad8ee01c1cd454a2df0fd2ca7f2d51))


### Features

* **docs:** include the Stark UI `testing` subpackage and its classes in the API docs and Developer Guide ([9e23744](https://github.com/nationalbankbelgium/stark/commit/9e23744d613329be8dccca3f2532147ca77724ea)), closes [#1600](https://github.com/nationalbankbelgium/stark/issues/1600)
* **stark-all:** update Prettier to v2.2.1 ([7db18b9](https://github.com/nationalbankbelgium/stark/commit/7db18b93cc4b08eb02ba1c9455da783255b9f265))


### Reverts

* Revert "chore(deps): bump karma-typescript-es6-transform" ([526f88e](https://github.com/nationalbankbelgium/stark/commit/526f88e2b34a7a921f9978f52a284d7cbd6bd693))


### BREAKING CHANGES

* **stark-all:** Due to Prettier update, it is required to adapt the import in ".prettierrc.js" file at the root of the project:

```js
// Before
module.exports = require("@nationalbankbelgium/code-style/prettier/1.16.x");

// After
module.exports = require("@nationalbankbelgium/code-style/prettier/2.2.x");
```



# [10.1.0](https://github.com/nationalbankbelgium/stark/compare/10.0.0...10.1.0) (2020-07-24)


### Bug Fixes

* **showcase:** typo noopener in link rel ([da1b365](https://github.com/nationalbankbelgium/stark/commit/da1b3651141879bd9083834901ffe77e04f9facb)), closes [#1971](https://github.com/nationalbankbelgium/stark/issues/1971)
* **stark-ui:** remove all overlays by destroying the Angular CDK OverlayContainer when navigating to an 'exit' state ([8d3dee3](https://github.com/nationalbankbelgium/stark/commit/8d3dee3994e2dcb1177777cf3c9a9dfb45011440)), closes [#1570](https://github.com/nationalbankbelgium/stark/issues/1570)
* **starter:** typo noopener in link rel ([6111f5d](https://github.com/nationalbankbelgium/stark/commit/6111f5df2c4c39db25a1f66a21dc47dcb11c110d)), closes [#1971](https://github.com/nationalbankbelgium/stark/issues/1971)


### Features

* **docs:** include the Stark Core `testing` subpackage and its classes in the API docs and Developer Guide ([5563d2a](https://github.com/nationalbankbelgium/stark/commit/5563d2ae275402710976de5e69b22b393b02120c)), closes [#1600](https://github.com/nationalbankbelgium/stark/issues/1600)
* **docs:** include the Stark RBAC `testing` subpackage and its classes in the API docs and Developer Guide ([3b040dc](https://github.com/nationalbankbelgium/stark/commit/3b040dc267642089a000bbd24a842a039a5827ab)), closes [#1600](https://github.com/nationalbankbelgium/stark/issues/1600)
* **stark-testing:** upgrade `karma-typescript` packages to version 5.0.0. Replace `karma-coverage` and `karma-coverage-istanbul-reporter` by `karma-typescript` reporter. ([9d98e62](https://github.com/nationalbankbelgium/stark/commit/9d98e629f0ac7ee182745b687cc7801ac3789ce2))
* **stark-ui:** add the possibility to custom the rendering of a cell in tables ([0aab82a](https://github.com/nationalbankbelgium/stark/commit/0aab82a5aa9151ed1d3306fcc13f9590a3131dba))
* **stark-ui:** added collapsible table rows ([05a2792](https://github.com/nationalbankbelgium/stark/commit/05a279231f0bf2f3f4c7b8219b4cb81921c3b3f5)), closes [#1637](https://github.com/nationalbankbelgium/stark/issues/1637)


### Reverts

* Revert "chore(deps): bump @mdi/angular-material in /packages/stark-ui" ([30dfa4b](https://github.com/nationalbankbelgium/stark/commit/30dfa4b7bc4cd547005a62d5d34d397c7703982b)), closes [#1762](https://github.com/nationalbankbelgium/stark/issues/1762)



# [10.0.0](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.5...10.0.0) (2020-03-10)



# [10.0.0-rc.5](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.4...10.0.0-rc.5) (2020-02-21)


### Bug Fixes

* **build-main:** `npm run install:starter` is now working well on every platform (MacOS, Windows, Linux) ([c7590b2](https://github.com/nationalbankbelgium/stark/commit/c7590b23c77492e1001c0ba59cf5934dcd470687)), closes [#1617](https://github.com/nationalbankbelgium/stark/issues/1617)
* **stark-ui:** enhance styling of date time picker component to display the 'clear' button correctly aligned in IE 11 ([3a3e832](https://github.com/nationalbankbelgium/stark/commit/3a3e832e55e670b5d31320e7cb052d340401dd6f)), closes [#1430](https://github.com/nationalbankbelgium/stark/issues/1430)
* **stark-ui:** remove wrong `[@internal](https://github.com/internal)` decorator on `_globalFilterFormCtrl` in table component ([e85b810](https://github.com/nationalbankbelgium/stark/commit/e85b810b388cb0a9cddcd5bf0407d89df5ca5e27)), closes [#1644](https://github.com/nationalbankbelgium/stark/issues/1644)


### Features

* **stark-all:** upgrade `@nationalbankbelgium/code-style` and `codelyzer` dependencies and adapt code ([77d6b29](https://github.com/nationalbankbelgium/stark/commit/77d6b29d9bced8ad384cda737d245df49009bd47)), closes [/github.com/mgechev/codelyzer/blob/master/CHANGELOG.md#500-2019-03-27](https://github.com//github.com/mgechev/codelyzer/blob/master/CHANGELOG.md/issues/500-2019-03-27)
* **stark-all:** upgrade `stylelint` dependency to 13.0.0 and adapt code ([f4ff4dc](https://github.com/nationalbankbelgium/stark/commit/f4ff4dc4a03defdb425d4dd6939d38952984d697))



# [10.0.0-rc.4](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.3...10.0.0-rc.4) (2020-02-06)


### Bug Fixes

* **build-main:** changed expected node version to 10 in gh-deploy script ([ce3819b](https://github.com/nationalbankbelgium/stark/commit/ce3819ba21281327bb9b85b08d8da9ac0caf0d34)), closes [#1485](https://github.com/nationalbankbelgium/stark/issues/1485)
* **build-main:** fix sync scripts for starter + add 'showcase' in scopes of commitlint ([798094c](https://github.com/nationalbankbelgium/stark/commit/798094cfffb9da5b7811535f787922f01c6cd215))
* **stark-build:** don't parse Prettier Typescript parser in Webpack to prevent "Can't resolve '@microsoft/typescript-etw'" warning ([9ebe868](https://github.com/nationalbankbelgium/stark/commit/9ebe86894a94913b66ce17c43b2669fb0473c7a5)), closes [#1483](https://github.com/nationalbankbelgium/stark/issues/1483)
* **stark-showcase:** add missing hammerjs dependency ([c19f4c0](https://github.com/nationalbankbelgium/stark/commit/c19f4c012f5b10d4625829be865d0c9ee41ac608))
* **stark-starter:** add missing hammerjs dependency ([b781c02](https://github.com/nationalbankbelgium/stark/commit/b781c02755fd51c93b89fdf1ae985ffe7fb682fc))
* **stark-ui:** app-data - fixed issues with detail-slot not displayed correctly on small screens ([155509a](https://github.com/nationalbankbelgium/stark/commit/155509afd20ff58df1241eeea816808059127318)), closes [#1555](https://github.com/nationalbankbelgium/stark/issues/1555)
* **stark-ui:** app-sidebar - header is now visible on iOS devices (iTouch, iPhone, iPad) ([e107c71](https://github.com/nationalbankbelgium/stark/commit/e107c715fd948e1a81433e2feee68f81cf08e205)), closes [#1338](https://github.com/nationalbankbelgium/stark/issues/1338)
* **stark-ui:** session - prevent click outside the Session Timeout Warning Dialog ([8283216](https://github.com/nationalbankbelgium/stark/commit/828321641867dc1aeac100d9e0c2aeabae5f77ce))
* **stark-ui:** table - Multisort - fix order issue when adding/removing sort criteria ([d113d05](https://github.com/nationalbankbelgium/stark/commit/d113d050d6c7fbad3b06fd3950522b193c7e9223)), closes [#1478](https://github.com/nationalbankbelgium/stark/issues/1478)


### Features

* **stark-ui:** add footer to table component ([159b245](https://github.com/nationalbankbelgium/stark/commit/159b24516360b3a5fa54c18d532763020db8efac)), closes [#1540](https://github.com/nationalbankbelgium/stark/issues/1540)
* **stark-ui:** route-search - add support for partial matching ([c9802d7](https://github.com/nationalbankbelgium/stark/commit/c9802d7a5ba9bb60828bc28827673db6bb0bf05f)), closes [#1335](https://github.com/nationalbankbelgium/stark/issues/1335)
* **starter:** configure husky and lint-staged properly ([ce600d1](https://github.com/nationalbankbelgium/stark/commit/ce600d1edc0ddaeba44dbca6dad4fbab05beac9d))



# [10.0.0-rc.3](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.2...10.0.0-rc.3) (2020-01-10)


### Bug Fixes

* **stark-testing:** don't parse 'prettier/parser-typescript.js' with karma-typescript to prevent uncaught exception thrown as from Prettier 1.19 ([a290eb9](https://github.com/nationalbankbelgium/stark/commit/a290eb9da816d0fc95e467047801b4e37c566be5)), closes [#1434](https://github.com/nationalbankbelgium/stark/issues/1434)
* **stark-ui:** add missing componentName and ":" in debug messages in StarkAppData and StarkAppSidebar components ([79ac571](https://github.com/nationalbankbelgium/stark/commit/79ac571ca4c5aab37cccdcd85eef732aa63d6456))
* **stark-ui:** add support for `onClickCallback` column properties in Table component ([c5e3847](https://github.com/nationalbankbelgium/stark/commit/c5e3847e1b59595bcb8451277f193a301cbc6afc)), closes [#1466](https://github.com/nationalbankbelgium/stark/issues/1466)
* **stark-ui:** change the Multisort component to display the label instead of the column ([fc3863c](https://github.com/nationalbankbelgium/stark/commit/fc3863c2e84fe3d732037dc9623f273f9932b6de)), closes [#1397](https://github.com/nationalbankbelgium/stark/issues/1397)
* **stark-ui:** fixed column issue when rawValue is undefined, cellFormatter is not called ([815ac6c](https://github.com/nationalbankbelgium/stark/commit/815ac6c6d077fef3ed51fd53ad82a1769403ffdf)), closes [#1465](https://github.com/nationalbankbelgium/stark/issues/1465)
* **stark-ui:** table actions column is not displayed anymore if no row actions are defined ([b1ec04e](https://github.com/nationalbankbelgium/stark/commit/b1ec04e60398769d87859f410c3fb215ce51d9c7)), closes [#1462](https://github.com/nationalbankbelgium/stark/issues/1462)


### Features

* **stark-ui:** add support for displaying the "items per page" dropdown also in Pagination on "compact" mode ([705bb23](https://github.com/nationalbankbelgium/stark/commit/705bb235e60f053e8486408f0771b7b31f0cf416)), closes [#1248](https://github.com/nationalbankbelgium/stark/issues/1248)



# [10.0.0-rc.2](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.1...10.0.0-rc.2) (2019-10-28)


### Bug Fixes

* **docs:** update BrowserStack badge to display correctly from `README.md` ([f102bed](https://github.com/nationalbankbelgium/stark/commit/f102bede6612014849c6037e0fb3a346ad35183c)), closes [#1387](https://github.com/nationalbankbelgium/stark/issues/1387)
* **stark-core:** add missing correlation-id header in the HTTP request sent to flush the logs ([4cf5f87](https://github.com/nationalbankbelgium/stark/commit/4cf5f874193703cb7c4321ead5f8449f66fc0ba4)), closes [#1319](https://github.com/nationalbankbelgium/stark/issues/1319)
* **stark-demo:** replace encapsulated styles of Table Regular Component by global styles since they depend on Angular Material theming ([97b969e](https://github.com/nationalbankbelgium/stark/commit/97b969e2782a1a73a46003997c4391b87cc5a01c)), closes [#1311](https://github.com/nationalbankbelgium/stark/issues/1311)
* **stark-ui:** fix missing width in the "items per page" dropdown of StarkPagination component ([7962c25](https://github.com/nationalbankbelgium/stark/commit/7962c250ad250e8f00ca98edf39db23b5250aaad)), closes [#1345](https://github.com/nationalbankbelgium/stark/issues/1345)



# [10.0.0-rc.1](https://github.com/nationalbankbelgium/stark/compare/10.0.0-rc.0...10.0.0-rc.1) (2019-09-25)


### Bug Fixes

* **stark-ui:** app-data, set top postion of the detail pane to 100% ([abc8962](https://github.com/nationalbankbelgium/stark/commit/abc8962cd91d0186b7b6144ee64bf5728e17c496)), closes [#1341](https://github.com/nationalbankbelgium/stark/issues/1341)
* **stark-ui:** change the Multisort component to display the label instead of the name of the column ([fc47144](https://github.com/nationalbankbelgium/stark/commit/fc4714454bf50af81d63250ab964c50520d922aa)), closes [#1397](https://github.com/nationalbankbelgium/stark/issues/1397)
* **stark-ui:** fix side navigation rendering behind header ([ed580f1](https://github.com/nationalbankbelgium/stark/commit/ed580f120272cb7dd8739235652093a70aabac25)), closes [#1338](https://github.com/nationalbankbelgium/stark/issues/1338)
* **stark-ui:** reset line-height of input ([7289ec7](https://github.com/nationalbankbelgium/stark/commit/7289ec79df69a382945053a72b8a3e90b7a31d78)), closes [#1374](https://github.com/nationalbankbelgium/stark/issues/1374)
* **stark-ui:** select only available rows with select all on table ([6bfe4e2](https://github.com/nationalbankbelgium/stark/commit/6bfe4e2191c1b82744a155204ca3496f886f6671)), closes [#1392](https://github.com/nationalbankbelgium/stark/issues/1392)


### Features

* **stark-core:** include url hash part when landing on site ([ba6985a](https://github.com/nationalbankbelgium/stark/commit/ba6985adbf3058f82afaee3e0a60e45fb3eb9159))
* **stark-demo:** add anchors to example viewer component ([29afe52](https://github.com/nationalbankbelgium/stark/commit/29afe528d34db624d2978647de98466ddec26f90)), closes [#1214](https://github.com/nationalbankbelgium/stark/issues/1214)
* **stark-demo:** add ids to examples ([5b86433](https://github.com/nationalbankbelgium/stark/commit/5b8643369edc800cf4c36bf4fabeba1475151b50)), closes [#1214](https://github.com/nationalbankbelgium/stark/issues/1214)
* **stark-ui:** add the possibility to display the filter of the table and the filter of their columns above or below the title ([86137fc](https://github.com/nationalbankbelgium/stark/commit/86137fc1feb664a8f90117133f843e67afd8b338)), closes [#1352](https://github.com/nationalbankbelgium/stark/issues/1352)



# [10.0.0-rc.0](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.8...10.0.0-rc.0) (2019-08-08)


### Bug Fixes

* **stark-demo:** enhance script to replace baseHref and deployUrl in any JS, CSS and JS.MAP file in Showcase when deploying to GhPages ([54ea128](https://github.com/nationalbankbelgium/stark/commit/54ea1288f87a91af042ab49b595951bff128f503)), closes [#1328](https://github.com/nationalbankbelgium/stark/issues/1328)
* **stark-demo:** move header outside of sidenav-content ([f7ab74b](https://github.com/nationalbankbelgium/stark/commit/f7ab74bfa8aa8ee5f2087c11da3edfc7e1b9c651)), closes [#1338](https://github.com/nationalbankbelgium/stark/issues/1338)
* **stark-ui:** change table actions when input changes ([0fdd43e](https://github.com/nationalbankbelgium/stark/commit/0fdd43e0e582a37047ab00ff10baf35eb48bbafa)), closes [#1315](https://github.com/nationalbankbelgium/stark/issues/1315)
* **stark-ui:** dropdown - fix container click + badly floating label in multiSelect ([b29c762](https://github.com/nationalbankbelgium/stark/commit/b29c76219901b48f51dc65dd9cfb47ba7261b332)), closes [#1369](https://github.com/nationalbankbelgium/stark/issues/1369) [#1370](https://github.com/nationalbankbelgium/stark/issues/1370)
* **stark-ui:** ui dropdown: not taking into account option emitEvent ([15eea33](https://github.com/nationalbankbelgium/stark/commit/15eea3316edc7f0102f3f1bab9623895303fc520)), closes [#1364](https://github.com/nationalbankbelgium/stark/issues/1364)


### Features

* **stark-demo:** add back Grid Layout example to Layout demo page ([e2b8e55](https://github.com/nationalbankbelgium/stark/commit/e2b8e5553248a9c04883ddcdca8c77b8dc515e6b))
* **stark-ui:** table - add support for angular CDK selection model ([a20da4f](https://github.com/nationalbankbelgium/stark/commit/a20da4fbb7f4762347ebc7f9fc1e5d7065c7cd6c)), closes [#1366](https://github.com/nationalbankbelgium/stark/issues/1366)


### Performance Improvements

* **stark-demo:** set ChangeDetectionStrategy.OnPush to ExampleViewer component to prevent Angular from running unnecessary change detection cycles ([709c261](https://github.com/nationalbankbelgium/stark/commit/709c2616922f42964545501e1f9d7caedf49dabc))
* **stark-ui:** set ChangeDetectionStrategy.OnPush to UI components to prevent Angular from running unnecessary change detection cycles ([dff48b9](https://github.com/nationalbankbelgium/stark/commit/dff48b91783d02f55db80e303bdeee4d49c27212))



# [10.0.0-beta.8](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.7...10.0.0-beta.8) (2019-06-06)


### Bug Fixes

* **build-main:** fix travis branches (before alpha/beta, now alpha/beta/rc) ([53987ae](https://github.com/nationalbankbelgium/stark/commit/53987aec5f010dec017b41b0aba8021f5f156f40))
* **stark-demo:** enhance change language logic in Showcase and Starter to also change Moment and date pickers locale ([75420fd](https://github.com/nationalbankbelgium/stark/commit/75420fdcd8abb1ca53be0d65f8cd4c2f05a2bfa0))
* **stark-demo:** remove workaround added in [#788](https://github.com/nationalbankbelgium/stark/issues/788) for basscss missing PCSS variables (solved in latest version: 8.1.0) ([80b7734](https://github.com/nationalbankbelgium/stark/commit/80b7734e0ea1814b872837c567631dd8f8f44593))
* **stark-ui:** coerce 'required' input in StarkDatePicker to properly show the asterisk on the field ([0fd9fca](https://github.com/nationalbankbelgium/stark/commit/0fd9fca475704f405348952e497cd73d6f7381ff)), closes [#1255](https://github.com/nationalbankbelgium/stark/issues/1255)
* **stark-ui:** display the invalid status only when the datepicker is touched. Adapt HTML in demo examples ([9a8318d](https://github.com/nationalbankbelgium/stark/commit/9a8318df5d57b2f03feb849333b881cefd3c3181)), closes [#1257](https://github.com/nationalbankbelgium/stark/issues/1257)
* **stark-ui:** enable 'keepCharPositions' option in internal mask config of timestamp mask directive. Fix wrong max and min values in date parts. ([e126260](https://github.com/nationalbankbelgium/stark/commit/e126260e2efc1f6ce97a50da5f454642fb374403)), closes [#1260](https://github.com/nationalbankbelgium/stark/issues/1260)
* **stark-ui:** fix regression in ProgressIndicator directive introduced in [#1218](https://github.com/nationalbankbelgium/stark/issues/1218) ([2f378fd](https://github.com/nationalbankbelgium/stark/commit/2f378fd63382d6f7b68cea5067300810b3d31a66))
* **stark-ui:** fix wrong code coverage report generation path in karma CI config (bug introduced in [#1147](https://github.com/nationalbankbelgium/stark/issues/1147)) ([8d656e6](https://github.com/nationalbankbelgium/stark/commit/8d656e66cd69b0f926bb7f0d86884d8aebced760))
* **stark-ui:** fix wrong imports 'from "@nationalbankbelgium/stark-ui"' in Table module ([e0b3ee0](https://github.com/nationalbankbelgium/stark/commit/e0b3ee0334d8669f27366816ee1e2e8b50e2d6af))
* **stark-ui:** overwrite viewBox value when using `starkSvgViewBox` directive ([63f82e1](https://github.com/nationalbankbelgium/stark/commit/63f82e109adce8277b8d295f6ef98c319fedbfc2)), closes [#1216](https://github.com/nationalbankbelgium/stark/issues/1216)
* **stark-ui:** properly size `.stark-main-container` on different screen sizes ([f8e4441](https://github.com/nationalbankbelgium/stark/commit/f8e44417bee1826278a1c914a0089127b59ab162))
* **stark-ui:** table - Add support to show row index ([37af1c7](https://github.com/nationalbankbelgium/stark/commit/37af1c799befc4b34222395e494ba7dcfc84cf46)), closes [#1283](https://github.com/nationalbankbelgium/stark/issues/1283)
* **stark-ui:** table - fix sorting + fix onChanges on columnProperties ([b7f374d](https://github.com/nationalbankbelgium/stark/commit/b7f374dcc8030433309d6c48d354a2c5c8376da7)), closes [#1241](https://github.com/nationalbankbelgium/stark/issues/1241)


### Code Refactoring

* **stark-ui:** remove 'StarkComponentUtil.isInputEnabled' in favor of Angular CDK function 'coerceBooleanProperty' ([3889c88](https://github.com/nationalbankbelgium/stark/commit/3889c887518b4515e01481c351556c3e31fa146b)), closes [#1190](https://github.com/nationalbankbelgium/stark/issues/1190)


### Features

* **build:** update TypeScript configuration and TSLint configuration ([f3d00eb](https://github.com/nationalbankbelgium/stark/commit/f3d00ebc191de3454ab10180d029a8bcd2845cb1)), closes [#1144](https://github.com/nationalbankbelgium/stark/issues/1144)
* **stark-all:** upgrade to TypeScript 3.2 (latest version supported in Angular 7.2) ([600f88e](https://github.com/nationalbankbelgium/stark/commit/600f88ee98bc1e3f6edccfe804ff473b33542d50)), closes [#1234](https://github.com/nationalbankbelgium/stark/issues/1234)
* **stark-build:** enable all strict type checking options in tsconfig.json file. Remove obsolete options ([ae3fccc](https://github.com/nationalbankbelgium/stark/commit/ae3fcccfe8a5bfb28327d599b8d10112151c48b8))
* **stark-build:** enhance/enable stricter rules in TSLint/codelyzer config to improve code style and consistency ([1cad77d](https://github.com/nationalbankbelgium/stark/commit/1cad77d4503de7fdceeca7bf21255a9562cb0ccc))
* **stark-build:** tslintLoader - Disable typecheck rules to remove warnings since typeCheck is false ([ab61379](https://github.com/nationalbankbelgium/stark/commit/ab613791a00b5e377b4a0e3bf9f294cb3f92191e)), closes [#405](https://github.com/nationalbankbelgium/stark/issues/405)
* **stark-core:** allow configuring the User profile resource path used by the User Repository ([8698970](https://github.com/nationalbankbelgium/stark/commit/8698970ce4f848165639685733a56190d1c608f1)), closes [#956](https://github.com/nationalbankbelgium/stark/issues/956)
* **stark-core:** upgrade 'class-validator' to the latest version (0.9.1). Fix breaking changes in validations on ApplicationConfig and Backend entities ([ce4f3fb](https://github.com/nationalbankbelgium/stark/commit/ce4f3fbfe84a41a056796429f18a43a55085ee78)), closes [#1237](https://github.com/nationalbankbelgium/stark/issues/1237)
* **stark-demo:** adapt polyfills (app and tests) according to the new structure in core-js 3.0.0 ([8da6515](https://github.com/nationalbankbelgium/stark/commit/8da651584bc8d9401de834c24ff5ad24fb14a2ac))
* **stark-ui:** change color of global filter icon to indicate when the global filter is applied ([69d0d05](https://github.com/nationalbankbelgium/stark/commit/69d0d053e19ef913f56b27fc6d1833c41461644d)), closes [#1303](https://github.com/nationalbankbelgium/stark/issues/1303)
* **stark-ui:** implement `ControlValueAccessor` on `DateRangePicker` component ([0e78064](https://github.com/nationalbankbelgium/stark/commit/0e7806461e2d1e31a81f076446e290c4cbcbf0de)), closes [#1197](https://github.com/nationalbankbelgium/stark/issues/1197)
* **stark-ui:** implement `stark-date-time-picker` module/component ([6075e6a](https://github.com/nationalbankbelgium/stark/commit/6075e6a6e79fab98c75a9da2a52fc408ad10cd8f)), closes [#587](https://github.com/nationalbankbelgium/stark/issues/587)
* **stark-ui:** table - Add support to show rows counter ([bdad94f](https://github.com/nationalbankbelgium/stark/commit/bdad94f25fc8fb608ae987b7479db016639ec11f)), closes [#1244](https://github.com/nationalbankbelgium/stark/issues/1244)


### BREAKING CHANGES

* **stark-ui:** `StarkComponentUtil.isInputEnabled()` function has been removed. To coerce boolean inputs in your components you can use the `coerceBooleanProperty()` function from `@angular/cdk/coercion` instead.



# [10.0.0-beta.7](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.6...10.0.0-beta.7) (2019-04-02)


### Bug Fixes

* **release:** enhance check for stark versions in Starter to skip those packages that are not listed as dependencies ([b1b50dd](https://github.com/nationalbankbelgium/stark/commit/b1b50ddad250b58f5ebc6c264b721466396086de))
* **showcase:** fix subscription issue in dropdown demo page ([95bbf75](https://github.com/nationalbankbelgium/stark/commit/95bbf7586626d8eb7654f926942e4d81fe59a43d))
* **stark-demo:** change default behaviour of collapsible icon ([3737371](https://github.com/nationalbankbelgium/stark/commit/3737371d7c7f88474c5481d0cbd009504a942f72)), closes [#1013](https://github.com/nationalbankbelgium/stark/issues/1013)
* **stark-demo:** fix `route-search-component` tests failing with ` Uncaught TypeError: Cannot read property 'focus' of null thrown` ([1d39083](https://github.com/nationalbankbelgium/stark/commit/1d39083f8b532c37d1949a6525be9b6b8eaee380))
* **stark-demo:** fix reference border ([3bd81e4](https://github.com/nationalbankbelgium/stark/commit/3bd81e4e96ff17fe5a14b0e645c26df0a15211ac))
* **stark-demo:** fix wrong reference links in Dialogs demo page ([0fe2e77](https://github.com/nationalbankbelgium/stark/commit/0fe2e7757410e5d69b419388d54c364d6b7b6a9f))
* **stark-ui:** change background-color of `.search-field .mat-form-field-wrapper` to variable $offWh ([87aa706](https://github.com/nationalbankbelgium/stark/commit/87aa706bc5553ba575c5b1f41aa30eb3af5bea9f)), closes [#1181](https://github.com/nationalbankbelgium/stark/issues/1181)
* **stark-ui:** change default behaviour of collapsible icon ([552461f](https://github.com/nationalbankbelgium/stark/commit/552461fc85126cf25a0c7a0d7ef3a4357d5aaab3))
* **stark-ui:** date-picker - disabled stark-date-picker not focusable anymore ([ac3e673](https://github.com/nationalbankbelgium/stark/commit/ac3e673c6dae57722a726f2ce1f4a54c9f023e36))


### Features

* **build:** add lodash es imports and lodash types ([7d8b2e5](https://github.com/nationalbankbelgium/stark/commit/7d8b2e57c1dd09f180be3dac277c5378ebf806e8)), closes [#1129](https://github.com/nationalbankbelgium/stark/issues/1129) [monounity/karma-typescript#320](https://github.com/monounity/karma-typescript/issues/320) [#1145](https://github.com/nationalbankbelgium/stark/issues/1145) [#150](https://github.com/nationalbankbelgium/stark/issues/150)
* **stark-rbac:** implement new Stark-RBAC package including StarkRBACAuthorization module. Add demos for RBAC features in Showcase ([53d3f33](https://github.com/nationalbankbelgium/stark/commit/53d3f330665187cdb640f645d924d0f5af2522d4)), closes [#105](https://github.com/nationalbankbelgium/stark/issues/105)
* **stark-ui:** date-picker - add support to translate placeholder internally ([63545f8](https://github.com/nationalbankbelgium/stark/commit/63545f80182858d3b2e563ef8dc8582a54236e76)), closes [#1204](https://github.com/nationalbankbelgium/stark/issues/1204)
* **stark-ui:** date-range-picker - add support for timestamp mask ([0403dea](https://github.com/nationalbankbelgium/stark/commit/0403dea9dbd41af56e9e4ec1ee22bca347313321)), closes [#1231](https://github.com/nationalbankbelgium/stark/issues/1231)
* **stark-ui:** dropdown - add support for ControlValueAccessor, MatFormFieldControl and Validator ([dbbcd65](https://github.com/nationalbankbelgium/stark/commit/dbbcd65741a69788c051791988a420cfb939de5a)), closes [#1193](https://github.com/nationalbankbelgium/stark/issues/1193)



# [10.0.0-beta.6](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.5...10.0.0-beta.6) (2019-03-18)


### Bug Fixes

* **release:** set npm tags 'latest' and 'next' correctly after every release. Fix nightly builds versioning ([e747fd0](https://github.com/nationalbankbelgium/stark/commit/e747fd0c72796271b43da7d8a5a3bd04f80985cc)), closes [#420](https://github.com/nationalbankbelgium/stark/issues/420) [#468](https://github.com/nationalbankbelgium/stark/issues/468)
* **stark-demo:** fix for links in table-of-contents ([01257d9](https://github.com/nationalbankbelgium/stark/commit/01257d9c45c8f896d6f62a484a059b916ea95dac))
* **stark-demo:** fix warning about deprecated property ([77cbca4](https://github.com/nationalbankbelgium/stark/commit/77cbca406837d16d1ab1ae9d1d2f1d13ab6b4dad))
* **stark-demo:** update usage examples of stark table ([fd06086](https://github.com/nationalbankbelgium/stark/commit/fd06086b3e7a0ec81617322552ec833b10e64aae)), closes [#1012](https://github.com/nationalbankbelgium/stark/issues/1012)
* **stark-ui:** fix table error when `data` not initialized ([d78ac80](https://github.com/nationalbankbelgium/stark/commit/d78ac8027e42e301e0e688129694f9ee1f17f31d)), closes [#1087](https://github.com/nationalbankbelgium/stark/issues/1087)
* **stark-ui:** keep table paginator in sync with (filtered) data ([3c3a4ca](https://github.com/nationalbankbelgium/stark/commit/3c3a4cae923a36d2273244620202ae986c87ad95)), closes [#1090](https://github.com/nationalbankbelgium/stark/issues/1090) [#1012](https://github.com/nationalbankbelgium/stark/issues/1012)
* **stark-ui:** update some component styling to fix bugs ([ad12b5a](https://github.com/nationalbankbelgium/stark/commit/ad12b5a1355e2b7dbfd89c02a7d200f8e0792ddd)), closes [#1169](https://github.com/nationalbankbelgium/stark/issues/1169)


### Features

* **stark-ui:** add `stark-session-card` component ([4a1db25](https://github.com/nationalbankbelgium/stark/commit/4a1db2593463f7ba820ae7a7ed5d9407ea573c05)), closes [#718](https://github.com/nationalbankbelgium/stark/issues/718)
* **stark-ui:** date-picker - add support for ControlValueAccessor, MatFormFieldControl, Validator and starkTimestampMask directive ([81dcd18](https://github.com/nationalbankbelgium/stark/commit/81dcd1860fa0e3509461c70d22f387d6120f710d)), closes [#1146](https://github.com/nationalbankbelgium/stark/issues/1146)
* **stark-ui:** implement `stark-session-card` in stark session pages ([debe387](https://github.com/nationalbankbelgium/stark/commit/debe387ec8574ff0fbce812e9eeb179cf698865e)), closes [#718](https://github.com/nationalbankbelgium/stark/issues/718)
* **stark-ui:** implement Material dialogs presets: alert, confirm and prompt ([a38d24a](https://github.com/nationalbankbelgium/stark/commit/a38d24ae36bf893bbd0580cbf8a79382bf87c0e9)), closes [#793](https://github.com/nationalbankbelgium/stark/issues/793)


### Performance Improvements

* **build:** add `"extractCss": true` to build options ([e212d71](https://github.com/nationalbankbelgium/stark/commit/e212d71bf15855b548261b3e42703ecca8f03aa8))


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



# [10.0.0-beta.5](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.4...10.0.0-beta.5) (2019-03-01)


### Bug Fixes

* **release:** remove all files from 'latest' folders before copying the new ones ([bce59d0](https://github.com/nationalbankbelgium/stark/commit/bce59d05a3f14e68838daf0a4b6591169c1d891d)), closes [#1138](https://github.com/nationalbankbelgium/stark/issues/1138)
* **stark-demo:** change import to relative path ([468a3f1](https://github.com/nationalbankbelgium/stark/commit/468a3f11b83e047958330bd7231011c3a1deea96))
* **stark-demo:** remove transform from `table-of-contents` component ([03b8954](https://github.com/nationalbankbelgium/stark/commit/03b8954318638816efb2cd62d37f1d56c8a298e6)), closes [#1137](https://github.com/nationalbankbelgium/stark/issues/1137)
* **stark-ui:** add methods to create/reset the search form in the Generic Search. Fix the Generic Search demo page in Showcase. ([128d8bf](https://github.com/nationalbankbelgium/stark/commit/128d8bffb7d9f8eac8b1d39b61763e84e52df13f)), closes [#1125](https://github.com/nationalbankbelgium/stark/issues/1125)


### Features

* **stark-build:** implement integration with Angular CLI via [@angular-builders](https://github.com/angular-builders) ([9a26c00](https://github.com/nationalbankbelgium/stark/commit/9a26c00d3a6cfa247cbe60bb3c6bace24058f198)), closes [#883](https://github.com/nationalbankbelgium/stark/issues/883) [#146](https://github.com/nationalbankbelgium/stark/issues/146) [#114](https://github.com/nationalbankbelgium/stark/issues/114)
* **stark-testing:** add browser launchers for karma: Firefox, Edge and IE ([754d0fd](https://github.com/nationalbankbelgium/stark/commit/754d0fd39da5c64eb198f64b26ceca8a5b184065))
* **stark-ui:** add show/hide functionality to tables ([69b56f0](https://github.com/nationalbankbelgium/stark/commit/69b56f0a243a6225637ca6e822cf66340dc5db8c)), closes [#522](https://github.com/nationalbankbelgium/stark/issues/522)
* **stark-ui:** add sticky action column to `stark-table` ([0904e94](https://github.com/nationalbankbelgium/stark/commit/0904e947bb225f56a950874d99951a685ff99197)), closes [#1143](https://github.com/nationalbankbelgium/stark/issues/1143)


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



# [10.0.0-beta.4](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.3...10.0.0-beta.4) (2019-02-15)


### Bug Fixes

* **stark-all:** replace the stark logo ([7519ea3](https://github.com/nationalbankbelgium/stark/commit/7519ea38ad12bb628d815877a24baf6f6fab0e53)), closes [#1115](https://github.com/nationalbankbelgium/stark/issues/1115)
* **stark-core:** correctly encode url parameters ([b55ca8b](https://github.com/nationalbankbelgium/stark/commit/b55ca8b0f68cebabd5820ab092150fe37465311a)), closes [/github.com/angular/angular/issues/18261#issuecomment-426383787](https://github.com//github.com/angular/angular/issues/18261/issues/issuecomment-426383787) [#1130](https://github.com/nationalbankbelgium/stark/issues/1130)
* **stark-demo:** minor fixes in script that replaces baseHref and deployURL in Showcase when deploying to GhPages ([4047429](https://github.com/nationalbankbelgium/stark/commit/4047429fdf89f97382c08bb691f4b0a366b5fea1))
* **stark-starter:** remove faulty import from angular.json ([3fcfd0d](https://github.com/nationalbankbelgium/stark/commit/3fcfd0dcad2835d0bb0a33bc66535a2c7aaed307))


### Features

* **stark-ui:** add directive for transforming input value before passing it to a ngControl ([0cf396c](https://github.com/nationalbankbelgium/stark/commit/0cf396c8f3b478ebb4e45a4e2a3369105fd38c27)), closes [#1099](https://github.com/nationalbankbelgium/stark/issues/1099)
* **stark-ui:** implement directives for email, number and timestamp masks ([3452894](https://github.com/nationalbankbelgium/stark/commit/34528949c004136a8cde1de69d01c3054d59b278)), closes [#681](https://github.com/nationalbankbelgium/stark/issues/681) [#682](https://github.com/nationalbankbelgium/stark/issues/682) [#683](https://github.com/nationalbankbelgium/stark/issues/683)
* **stark-ui:** implement text-mask directive ([f430ad0](https://github.com/nationalbankbelgium/stark/commit/f430ad0c8ab16fa49fabfadb90611a26584d1dba)), closes [#680](https://github.com/nationalbankbelgium/stark/issues/680)


### BREAKING CHANGES

* **stark-ui:** new `typings` folder in the package containing
typings for some libraries used by Stark-UI components/directives.
This must be included in the `typeRoots` of your app `tsconfig.json`:
`"typeRoots": ["./node_modules/@nationalbankbelgium/stark-ui/typings", ...]`



# [10.0.0-beta.3](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.2...10.0.0-beta.3) (2019-02-06)


### Bug Fixes

* **build-main:** adapt regex pattern to include 'resolved' in package-lock.json replacement ([e07108f](https://github.com/nationalbankbelgium/stark/commit/e07108fcfff66b00922302a518fcc688570f4103))
* **docs:** fix typo ([c15e0cd](https://github.com/nationalbankbelgium/stark/commit/c15e0cd1a6213b23073a67e8ad571d43ecef8ef2))
* **stark-core:** export StarkMessageImpl in public_api.ts ([6c2546b](https://github.com/nationalbankbelgium/stark/commit/6c2546bcb9b414dd2386ad0b607440d3985d814a))
* **stark-core:** update typing in accordance with rxjs 6.4.0 ([2aa37d4](https://github.com/nationalbankbelgium/stark/commit/2aa37d49675b362929dac24f7b13d5c6e30cac2a))
* **stark-demo:** fix 404 error when loading `pre-load-style.css` ([6fa246f](https://github.com/nationalbankbelgium/stark/commit/6fa246f16e4d8a3dbdc1b70d3a0f21cd7c32166f)), closes [#1037](https://github.com/nationalbankbelgium/stark/issues/1037)
* **stark-demo:** fix icons not displaying correctly ([8bd9b4a](https://github.com/nationalbankbelgium/stark/commit/8bd9b4ac4bcaabd789cbf5f6dfea4a7a9d28dc11)), closes [#504](https://github.com/nationalbankbelgium/stark/issues/504) [#1030](https://github.com/nationalbankbelgium/stark/issues/1030)
* **stark-ui:** add missing @angular/forms peerDependency ([28866cf](https://github.com/nationalbankbelgium/stark/commit/28866cf8897800c691d7a849b009534d66ed5f8c))
* **stark-ui:** fix table filter implementation ([73b40b3](https://github.com/nationalbankbelgium/stark/commit/73b40b39ecf38cf34efb6222a826569c902e555e)), closes [#1071](https://github.com/nationalbankbelgium/stark/issues/1071)


### Features

* **stark-all:** prefix all (dev)dependencies with '^' in all Stark's packages + in starter & showcase ([40c4dd6](https://github.com/nationalbankbelgium/stark/commit/40c4dd6b19e8e55f9fcf37d95cee211d59c36d8a)), closes [#1053](https://github.com/nationalbankbelgium/stark/issues/1053)
* **stark-all:** refine exports for the services ([1bf950e](https://github.com/nationalbankbelgium/stark/commit/1bf950e7f324ee6a17e4eaceb5f3225d2585526c)), closes [#1112](https://github.com/nationalbankbelgium/stark/issues/1112)
* **stark-build:** adapt build utils and webpack config to read global styles from angular.json to align with Angular CLI ([d0876f0](https://github.com/nationalbankbelgium/stark/commit/d0876f0113d69c719f3b958df010877ae1432abe)), closes [#1070](https://github.com/nationalbankbelgium/stark/issues/1070)
* **stark-demo:** add `styleguide/layout` page for documenting the use of Angular Flex-layout ([e1d157c](https://github.com/nationalbankbelgium/stark/commit/e1d157cf4346245bf756f370651b1efca07a28ca)), closes [#668](https://github.com/nationalbankbelgium/stark/issues/668)
* **stark-ui:** expose single file (src/assets/stark-ui-bundle.scss) to import all component styles/theming ([b86e190](https://github.com/nationalbankbelgium/stark/commit/b86e1904844f0b413b5788a08af06a646c3cde8d)), closes [#103](https://github.com/nationalbankbelgium/stark/issues/103)
* **stark-ui:** implement generic search component in generic module ([68f7d24](https://github.com/nationalbankbelgium/stark/commit/68f7d2445c9b90152a4e1b3da2f63041b3edba78)), closes [#794](https://github.com/nationalbankbelgium/stark/issues/794)
* **stark-ui:** implement Route Search component ([f3dda15](https://github.com/nationalbankbelgium/stark/commit/f3dda15c3a75f5494149081325a6d814c84f7034)), closes [#207](https://github.com/nationalbankbelgium/stark/issues/207)
* **stark-ui:** implementation of progress-indicator component ([5240bee](https://github.com/nationalbankbelgium/stark/commit/5240bee91dbcd0677af6166f73c28674d301d125)), closes [#126](https://github.com/nationalbankbelgium/stark/issues/126)


### BREAKING CHANGES

* **stark-ui:** changed the following Output return types in Table module:
  - Table Column component:
    - filterChanged now emits `StarkColumnFilterChangedOutput` object instead of `StarkTableColumnComponent`
    - sortChanged now emits `StarkColumnSortChangedOutput` object instead of `StarkTableColumnComponent`
  - Table component:
    - filterChanged now emits `StarkTableFilter` object instead of a `string`
* **stark-build:** global styles must be included in the angular.json (standard Angular CLI behavior) instead of importing them directly in the app



# [10.0.0-beta.2](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.1...10.0.0-beta.2) (2019-01-14)


### Bug Fixes

* **stark-all:** fix dependency issues in stark-ui + add hammerjs dep in stark root to fix warning during tests + improve stark-language-selector component ([47c2b4a](https://github.com/nationalbankbelgium/stark/commit/47c2b4aaf38143adafe268ed86b4f3035c237e99))
* **stark-build:** enhance regex for 3rd party libs to be transpiled to ES5 in Linux, Mac and Windows ([c4a4c36](https://github.com/nationalbankbelgium/stark/commit/c4a4c3609337adc2b528c68c37c8a2c1388824be)), closes [#918](https://github.com/nationalbankbelgium/stark/issues/918)
* **stark-build:** ignore 'System.import()' messages due to @angular/core ([8ee3938](https://github.com/nationalbankbelgium/stark/commit/8ee3938451316a20a705fabdc28011260f73ea28))
* **stark-build:** transpile certain third party libs to ES5 only in DEV to prevent breaking support for IE 11 ([c762f8d](https://github.com/nationalbankbelgium/stark/commit/c762f8defb2de0a1d0c48fcedaaea70d991e1fc6)), closes [#900](https://github.com/nationalbankbelgium/stark/issues/900)
* **stark-core:** avoid circular dependencies by moving state names in a constants file ([abe7fe2](https://github.com/nationalbankbelgium/stark/commit/abe7fe21cac3d138ea08e225acf3a16c33523904))
* **stark-core:** refactor Http Request builder, Http service and Session service to prevent undefined and null header values to be added to Angular Http headers. ([c728f9c](https://github.com/nationalbankbelgium/stark/commit/c728f9cf2c68f6413dd0f349c43fd3dd9fbdf586)), closes [#856](https://github.com/nationalbankbelgium/stark/issues/856)
* **stark-demo:** add deployUrl to fix issue with lazy modules. Replace referenced icon asset in translations by <mat-icon> in HTML. ([d112acd](https://github.com/nationalbankbelgium/stark/commit/d112acd633f14887089c53a954f64a127ba1f183)), closes [#849](https://github.com/nationalbankbelgium/stark/issues/849)
* **stark-demo:** add polyfill for `web.dom.iterable` ([f57c47b](https://github.com/nationalbankbelgium/stark/commit/f57c47bbb3547517864d7d0647487e8839f8063f)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-demo:** fix overflow issue of message pane demo on mobile and IE11 ([904c919](https://github.com/nationalbankbelgium/stark/commit/904c9196b2a133ca6d368c6e7248d464ee23b7d7)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-demo:** fix the 404 error on github pages ([d96ac1f](https://github.com/nationalbankbelgium/stark/commit/d96ac1f0abf3ab3843b96b3c45742232a093af86)), closes [#859](https://github.com/nationalbankbelgium/stark/issues/859)
* **stark-demo:** update usage of `stark-dropdown` component in pretty-print demo page ([e73766a](https://github.com/nationalbankbelgium/stark/commit/e73766a21e179d3bdeb47a2602569713dbbe7e4f)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** add padding to table filter component ([7f73477](https://github.com/nationalbankbelgium/stark/commit/7f7347710c288220b9e6b91ba156ec652333aa2c)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** change location of minimap to right ([2fb8a16](https://github.com/nationalbankbelgium/stark/commit/2fb8a160f6160148d7e3c0e51aed76f0cd8bbfca)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** fix circular dependencies due to wrong import in minimap ([9a712fa](https://github.com/nationalbankbelgium/stark/commit/9a712fa641c7ab8dad640ee642ac587aa4118b9a))
* **stark-ui:** fix filter issue + not translated column header issue in ([746f675](https://github.com/nationalbankbelgium/stark/commit/746f675d07910893f31d90071a7c4eb5db6cf996)), closes [#954](https://github.com/nationalbankbelgium/stark/issues/954) [#955](https://github.com/nationalbankbelgium/stark/issues/955)
* **stark-ui:** fix overflow of calendar items ([4eb2acd](https://github.com/nationalbankbelgium/stark/commit/4eb2acd5938e23a8d1b3de4ab22593e7076ae1b8)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** fix table refresh issue when data changes. ([dd2eac0](https://github.com/nationalbankbelgium/stark/commit/dd2eac00649bf2116969d23abe956b0e77e6d2fc)), closes [#1003](https://github.com/nationalbankbelgium/stark/issues/1003)
* **stark-ui:** implement workaround for `mat-select` bug in IE11 ([f2887ad](https://github.com/nationalbankbelgium/stark/commit/f2887ad0372437de7abb0b569e20a563b793c066)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** keep scroll position after closing sidenav ([7d55a3e](https://github.com/nationalbankbelgium/stark/commit/7d55a3e95cc577bfe321c8acee503a0b8ad6805a)), closes [#750](https://github.com/nationalbankbelgium/stark/issues/750)
* **stark-ui:** properly scale svg from mat-icon ([f6a6258](https://github.com/nationalbankbelgium/stark/commit/f6a625881c20f7a5073076bbc66ed2f2c1dfb44d)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** remove `-apple-system` from default font-family for correct rendering in IE11 ([71ca177](https://github.com/nationalbankbelgium/stark/commit/71ca17753a5c3362b8f48e19ab884fb10968cee5)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)
* **stark-ui:** remove value property from li in pagination component ([15a4a17](https://github.com/nationalbankbelgium/stark/commit/15a4a17196f531e106f7a7c22621ae91c33da5dd)), closes [#732](https://github.com/nationalbankbelgium/stark/issues/732)


### Features

* **stark-all:** update to Angular 7 + TypeScript 3.1 ([edd108d](https://github.com/nationalbankbelgium/stark/commit/edd108da6bac85652402fe0a0034590963e4fb86)), closes [#871](https://github.com/nationalbankbelgium/stark/issues/871)
* **stark-demo:** add browserstack test script ([5a490a3](https://github.com/nationalbankbelgium/stark/commit/5a490a378f0439ddac9fb04292f2ce1307d304c2)), closes [#274](https://github.com/nationalbankbelgium/stark/issues/274)
* **stark-starter:** add preloading screens ([844e0fe](https://github.com/nationalbankbelgium/stark/commit/844e0fe45a81c978ef1601d5858bcc55a4ada38d)), closes [#840](https://github.com/nationalbankbelgium/stark/issues/840) [#596](https://github.com/nationalbankbelgium/stark/issues/596) [#597](https://github.com/nationalbankbelgium/stark/issues/597)
* **stark-ui:** add custom styling to stark table component ([dd91254](https://github.com/nationalbankbelgium/stark/commit/dd912544c32b22a83d489621f1f0f9f75b7213a3)), closes [#523](https://github.com/nationalbankbelgium/stark/issues/523)
* **stark-ui:** add option to close sidebar after navigation ([431f1e0](https://github.com/nationalbankbelgium/stark/commit/431f1e09d4834bb3389a704138a33f4945fda7ce)), closes [#995](https://github.com/nationalbankbelgium/stark/issues/995)
* **stark-ui:** add rowClick event emitter to table component ([0182344](https://github.com/nationalbankbelgium/stark/commit/01823445161258fe4432f8101370ff4151bb0871)), closes [#795](https://github.com/nationalbankbelgium/stark/issues/795)
* **stark-ui:** add stark form util ([1f94d93](https://github.com/nationalbankbelgium/stark/commit/1f94d93cd7b0963a301b8f3f0988ce6928b53a1f))
* **stark-ui:** implementation of a session timeout warning ([578b8a2](https://github.com/nationalbankbelgium/stark/commit/578b8a2ce8b02637278beb63910d4366b75316fd))
* **stark-ui:** implementation of app data component ([e87c30a](https://github.com/nationalbankbelgium/stark/commit/e87c30a3912db3e31aea38b28561e2b05e02701c))
* **stark-ui:** make dropdown component working with reactive form ([b183e72](https://github.com/nationalbankbelgium/stark/commit/b183e7286b2fa07234a5edaf5987fbda60a07644))



# [10.0.0-beta.1](https://github.com/nationalbankbelgium/stark/compare/10.0.0-beta.0...10.0.0-beta.1) (2018-11-09)


### Bug Fixes

* **package:** update @mdi/angular-material to version 3.0.39 ([457d2a5](https://github.com/nationalbankbelgium/stark/commit/457d2a5de4335eeb4cb1453992fcd03a0c830bac))
* **package:** update @ngrx/effects to version 6.1.1 ([1e7f887](https://github.com/nationalbankbelgium/stark/commit/1e7f8874c0571ad9fa8a4d373759673b6b02eeff))
* **package:** update @ngrx/effects to version 6.1.2 ([1e898ac](https://github.com/nationalbankbelgium/stark/commit/1e898acea69e92a4cee8db0dbce57e108249b0bd))
* **package:** update @ngrx/store to version 6.1.1 ([3ac98ab](https://github.com/nationalbankbelgium/stark/commit/3ac98ab17b7d573e2a049b097f3b01cc0d656f48))
* **package:** update @ngrx/store to version 6.1.2 ([529448b](https://github.com/nationalbankbelgium/stark/commit/529448b603d7066000d04cae5a6b04b68b554e6e))
* **package:** update @ngrx/store-devtools to version 6.1.1 ([1e5758b](https://github.com/nationalbankbelgium/stark/commit/1e5758bd25f33a694d0bbdb5cc3f4595df10fded))
* **package:** update @ngrx/store-devtools to version 6.1.2 ([146a636](https://github.com/nationalbankbelgium/stark/commit/146a636c13a9fc9ba570fc83597c174e391bca3f))
* **package:** update @types/uglify-js to version 3.0.4 ([fce3a1d](https://github.com/nationalbankbelgium/stark/commit/fce3a1d2f71f5a5d1cd37317259d93ededabb8a8))
* **package:** update @types/webpack to version 4.4.17 ([24833c6](https://github.com/nationalbankbelgium/stark/commit/24833c6fb0d521e3feefbaf05d2bfc52fa98c0c0))
* **package:** update @types/webpack to version 4.4.18 ([ec39709](https://github.com/nationalbankbelgium/stark/commit/ec397094199b18ad8b76c302de5936cc9185d886))
* **package:** update add-asset-html-webpack-plugin to version 3.1.2 ([727791f](https://github.com/nationalbankbelgium/stark/commit/727791f7f53c3ddb91652ee6f42470055e757653))
* **package:** update angular-in-memory-web-api to version 0.7.0 ([44e800e](https://github.com/nationalbankbelgium/stark/commit/44e800ee947aa827430515079be709716727f9cb))
* **package:** update copy-webpack-plugin to version 4.5.4 ([ab76952](https://github.com/nationalbankbelgium/stark/commit/ab76952943463c139476299712eed926060256b0))
* **package:** update copy-webpack-plugin to version 4.6.0 ([a4aac38](https://github.com/nationalbankbelgium/stark/commit/a4aac3864d082a48d7ff04fe5cd24ce407c302a2))
* **package:** update css-loader to version 1.0.1 ([8bbc642](https://github.com/nationalbankbelgium/stark/commit/8bbc6423878cc0a249d53b92cc0965150a18a443))
* **package:** update event-source-polyfill to version 1.0.0 ([a62cf49](https://github.com/nationalbankbelgium/stark/commit/a62cf4969034c7c61505ff63c3754215195a5b77))
* **package:** update event-source-polyfill to version 1.0.0 ([32a0ec6](https://github.com/nationalbankbelgium/stark/commit/32a0ec682151aa1ad8203098645f54f0036828c5))
* **package:** update event-source-polyfill to version 1.0.3 ([ce41d15](https://github.com/nationalbankbelgium/stark/commit/ce41d15a30e414f5b92496f1ee76fbaa18560bb6)), closes [#791](https://github.com/nationalbankbelgium/stark/issues/791)
* **package:** update event-source-polyfill to version 1.0.3 ([2dffcb0](https://github.com/nationalbankbelgium/stark/commit/2dffcb05fd55d3899fdb10aad8aa40b04745b04a)), closes [#791](https://github.com/nationalbankbelgium/stark/issues/791)
* **package:** update event-source-polyfill to version 1.0.4 ([0df420c](https://github.com/nationalbankbelgium/stark/commit/0df420c9c38fecbad1c34643a214e9ca41c55295))
* **package:** update event-source-polyfill to version 1.0.4 ([aca911f](https://github.com/nationalbankbelgium/stark/commit/aca911f2ea64561e7006a0d2052909a2c72be43c))
* **package:** update jasmine-core to version 3.3.0 ([7fec286](https://github.com/nationalbankbelgium/stark/commit/7fec28602fde2473f75125384bee1850c0bccefa))
* **package:** update karma to version 3.1.1 ([548103e](https://github.com/nationalbankbelgium/stark/commit/548103eb3edbbf4315153e1a109d6500b3024e56))
* **package:** update nouislider to version 12.1.0 ([6fd6337](https://github.com/nationalbankbelgium/stark/commit/6fd63376e303c82ea9d3219899c3993673d93205))
* **package:** update stylelint to version 9.7.0 ([f13de52](https://github.com/nationalbankbelgium/stark/commit/f13de52f0a10249b5dfd51659f0b79c1b581ee70))
* **package:** update stylelint to version 9.7.1 ([8bd786d](https://github.com/nationalbankbelgium/stark/commit/8bd786d2d1375b06c4a5d1b1d3ba91408a3e7fa8))
* **package:** update webpack to version 4.21.0 ([6ac6104](https://github.com/nationalbankbelgium/stark/commit/6ac6104d2b9956b0fa18df4c08475a34689a0c54))
* **package:** update webpack to version 4.22.0 ([cceb258](https://github.com/nationalbankbelgium/stark/commit/cceb258db5b85e506a88ec6cfde69160c561a817))
* **package:** update webpack to version 4.23.1 ([3fb70e5](https://github.com/nationalbankbelgium/stark/commit/3fb70e513b3db687f864ccd84dfaf32e94b67dcd)), closes [#790](https://github.com/nationalbankbelgium/stark/issues/790)
* **stark-build:** add cspFontSrc as configurable property to webpack dev server ([5367f69](https://github.com/nationalbankbelgium/stark/commit/5367f69d966848b4d16c584b85301cda87ad6d31))
* **stark-core:** include inherited params from ancestor routing states in navigation history. Adapt Routing Service isCurrentUiState() to take into account inherited params. ([1131acf](https://github.com/nationalbankbelgium/stark/commit/1131acf590c6bd61dfd269cfd1d1b846ae7af75c)), closes [#769](https://github.com/nationalbankbelgium/stark/issues/769)
* **stark-core:** re-create the last entry in the state history rather than add it again when a transition is dynamic. ([2af2657](https://github.com/nationalbankbelgium/stark/commit/2af26577a06a22ffe6877f0644733d071a4132c7)), closes [#773](https://github.com/nationalbankbelgium/stark/issues/773)
* **stark-starter:** add polyfill for String.prototype.trimRight ([ef51f3c](https://github.com/nationalbankbelgium/stark/commit/ef51f3c2483572d2e8e77bede9bb7009149175ac)), closes [#213](https://github.com/nationalbankbelgium/stark/issues/213)
* **stark-ui:** perform the session login in the Preloading page after fetching the user profile ([7cc9572](https://github.com/nationalbankbelgium/stark/commit/7cc95725a86fd9f548bb9751cec0b33f1a542fa2)), closes [#726](https://github.com/nationalbankbelgium/stark/issues/726)
* **stark-ui:** style fix: footer, header and table. Adapt Showcase and Starter. ([553f0f8](https://github.com/nationalbankbelgium/stark/commit/553f0f81f4cbd66703532c7486a42438ed728562)), closes [#696](https://github.com/nationalbankbelgium/stark/issues/696) [#715](https://github.com/nationalbankbelgium/stark/issues/715) [#723](https://github.com/nationalbankbelgium/stark/issues/723)


### Features

* **stark-core:** add support for deep state navigation for states from lazy loaded modules. Adapt Showcase to make DemoModule and NewsModule lazy loaded ([6589846](https://github.com/nationalbankbelgium/stark/commit/6589846c3da6c0e316b3c743b7a8f674641e4128)), closes [#810](https://github.com/nationalbankbelgium/stark/issues/810)
* **stark-core:** allow customizing Login and Preloading states via the StarkSessionConfig ([f8112cb](https://github.com/nationalbankbelgium/stark/commit/f8112cbd1bdb20df9911adbd0760e9a4b6e590e4)), closes [#727](https://github.com/nationalbankbelgium/stark/issues/727)
* **stark-core:** implementation of a custom error handler ([74d98d0](https://github.com/nationalbankbelgium/stark/commit/74d98d0b8c431aade4b12c378910df269f0e2b53))
* **stark-demo:** creation of a getting started page ([8c98965](https://github.com/nationalbankbelgium/stark/commit/8c98965d28578a0e7a3f7313cf0a1aed5582b8e4)), closes [#720](https://github.com/nationalbankbelgium/stark/issues/720)
* **stark-demo:** improvement of the showcase ([76a7d67](https://github.com/nationalbankbelgium/stark/commit/76a7d67e70a5caa6a97bf02fdfc75666c2eea6f6))
* **stark-demo:** integrate "angular-in-memory-web-api" to mock backend (needed for GitHub pages) ([f698865](https://github.com/nationalbankbelgium/stark/commit/f69886512c16259b29a20f13d3f60e5a5a917bea))
* **stark-demo:** reimplementation of the buttons in the header ([4df6fdf](https://github.com/nationalbankbelgium/stark/commit/4df6fdf7808ea5e0a123d807ab1a646b9085fa36))
* **stark-ui:** add fixed header feature to table component ([73b4756](https://github.com/nationalbankbelgium/stark/commit/73b47561966bec3f1c3e95ef700d15ca88c84e6a)), closes [#196](https://github.com/nationalbankbelgium/stark/issues/196)
* **stark-ui:** app Menu Component ([5f662fa](https://github.com/nationalbankbelgium/stark/commit/5f662fa40812ecb4bfd0224e329a2aa83c6d21d1)), closes [#240](https://github.com/nationalbankbelgium/stark/issues/240) [#710](https://github.com/nationalbankbelgium/stark/issues/710)
* **stark-ui:** implement Message Pane component ([33bf233](https://github.com/nationalbankbelgium/stark/commit/33bf233ceb2939bbf7fac65f5a9627406e6be66b)), closes [#593](https://github.com/nationalbankbelgium/stark/issues/593)
* **stark-ui:** implementation of minimap component ([4148d7d](https://github.com/nationalbankbelgium/stark/commit/4148d7db79c5d7df11a3f6fe96b186343e0f8280)), closes [#758](https://github.com/nationalbankbelgium/stark/issues/758)
* **stark-ui:** implementation of reference-block component ([17e250f](https://github.com/nationalbankbelgium/stark/commit/17e250f45fa051a8bd89d0764bc6d43625a89006)), closes [#622](https://github.com/nationalbankbelgium/stark/issues/622)
* **stark-ui:** integrate translation support in AppMenu component ([42a6b73](https://github.com/nationalbankbelgium/stark/commit/42a6b73e7f8a5f2e9a5eda21905cb5d33d402e63)), closes [#755](https://github.com/nationalbankbelgium/stark/issues/755)
* **stark-ui:** split translations from UI components in the different modules they belong to. Split common Core and common UI translations. ([bd6fbb6](https://github.com/nationalbankbelgium/stark/commit/bd6fbb6b133beaf33b1acb3a49237e228e8a14a1)), closes [#511](https://github.com/nationalbankbelgium/stark/issues/511)
* **stark-ui:** stark logo added to showcase and in app-logo component ([c680d2a](https://github.com/nationalbankbelgium/stark/commit/c680d2a0b8cdbbb7b508238501bb5f606c24039c)), closes [#738](https://github.com/nationalbankbelgium/stark/issues/738)


### Performance Improvements

* **stark-build:** remove deprecated Angular PurifyPlugin. Enhance UglifyJs options to improve performance. ([ff621c5](https://github.com/nationalbankbelgium/stark/commit/ff621c59aeb52de7dec5c607229febb1038d1fb4)), closes [#623](https://github.com/nationalbankbelgium/stark/issues/623)



# [10.0.0-beta.0](https://github.com/nationalbankbelgium/stark/compare/10.0.0-alpha.5...10.0.0-beta.0) (2018-09-27)


### Bug Fixes

* **stark-core:** fix failing XSRF service test ([c3d2589](https://github.com/nationalbankbelgium/stark/commit/c3d2589a19f6378457f1a33a2c346e27d6195d84))


### Features

* **all:** add session pages ([4d13687](https://github.com/nationalbankbelgium/stark/commit/4d13687a08531e2a680106dc8efc01faf15c6282)), closes [#407](https://github.com/nationalbankbelgium/stark/issues/407) [#408](https://github.com/nationalbankbelgium/stark/issues/408) [#409](https://github.com/nationalbankbelgium/stark/issues/409) [#410](https://github.com/nationalbankbelgium/stark/issues/410)
* **showcase:** improve showcase and move styles from showcase to stark-ui _base ([be80748](https://github.com/nationalbankbelgium/stark/commit/be807484e0e27a805f21a465217c9408e5958d2b))
* **stark-core:** implement Stark XSRF module ([e82ed0d](https://github.com/nationalbankbelgium/stark/commit/e82ed0d5dc759f4305637c2f4ae83aa62d5bc2ff)), closes [#115](https://github.com/nationalbankbelgium/stark/issues/115)
* **stark-ui:** cards standardization ([87da0ef](https://github.com/nationalbankbelgium/stark/commit/87da0ef4c6252f733287bc813c8501b5ef8d6978)), closes [#646](https://github.com/nationalbankbelgium/stark/issues/646)
* **stark-ui:** color settings ([fcd12d5](https://github.com/nationalbankbelgium/stark/commit/fcd12d5123ecea30a788097db7a8f61d547fbb00)), closes [#662](https://github.com/nationalbankbelgium/stark/issues/662)
* **stark-ui:** implement collapsible feature ([44669a1](https://github.com/nationalbankbelgium/stark/commit/44669a18f425949332e406c3870894991983f551)), closes [#595](https://github.com/nationalbankbelgium/stark/issues/595)
* **stark-ui:** implement Pagination component. Integrate pagination in Table component ([96ae7b2](https://github.com/nationalbankbelgium/stark/commit/96ae7b274199ae434c61f48fa5e3521bd284be71)), closes [#539](https://github.com/nationalbankbelgium/stark/issues/539) [#514](https://github.com/nationalbankbelgium/stark/issues/514)
* **stark-ui:** implement toast notification feature ([98390c2](https://github.com/nationalbankbelgium/stark/commit/98390c2a3b696315cfcae4edca8b87e31349f889))
* **stark-ui:** implements footer component ([2fca5c8](https://github.com/nationalbankbelgium/stark/commit/2fca5c816ecbdd9ecaadf440a429611363ae4412))
* **stark-ui:** language-selector: implement component/module ([38cbd68](https://github.com/nationalbankbelgium/stark/commit/38cbd6814deb6fd665e3e2393f5d52bbbae24e25)), closes [#564](https://github.com/nationalbankbelgium/stark/issues/564)
* **stark-ui:** typography + Spaces ([8a5675d](https://github.com/nationalbankbelgium/stark/commit/8a5675d70793e13a3506eb4cc893a603d0fa53d9)), closes [#475](https://github.com/nationalbankbelgium/stark/issues/475) [#671](https://github.com/nationalbankbelgium/stark/issues/671)
* **starter:** update Starter to keep in sync with Showcase ([b0ffd95](https://github.com/nationalbankbelgium/stark/commit/b0ffd95f9f229147c620b4e8bbd07a375848fccf))



# [10.0.0-alpha.5](https://github.com/nationalbankbelgium/stark/compare/10.0.0-alpha.4...10.0.0-alpha.5) (2018-09-07)


### Bug Fixes

* **build-main:** fix version of greenkeeper-lockfile which is installed during travis build ([1970b71](https://github.com/nationalbankbelgium/stark/commit/1970b71f776c160eb2df873d4986a8a5638c0dae))
* **build-main:** remove custom value for TRAVIS variable ([f00d63a](https://github.com/nationalbankbelgium/stark/commit/f00d63a730d5f9dba62ae7523cb1bbf3bbed966d)), closes [#605](https://github.com/nationalbankbelgium/stark/issues/605)
* **build:** add an argument for build prod when it is a Test CI. Adapt travis.yml to use it ([b954903](https://github.com/nationalbankbelgium/stark/commit/b954903fc474aaf20ba9a70bdc1eb428c96f19b3)), closes [#572](https://github.com/nationalbankbelgium/stark/issues/572) [#566](https://github.com/nationalbankbelgium/stark/issues/566)
* **greenkeeper:** fix greenkeeper for updating package-lock ([000a4a5](https://github.com/nationalbankbelgium/stark/commit/000a4a503f1d0072bffebef1849b4624352a5c4b))
* **greenkeeper:** fix greenkeeper-lockfile ([865fee0](https://github.com/nationalbankbelgium/stark/commit/865fee06e1e104b59bd54f9b7008daef16967987))
* **release:** add "package-lock.json" to the set of files to be updated by release-it ([ac7c85c](https://github.com/nationalbankbelgium/stark/commit/ac7c85c4eac624eca1e922a71cf4963f7e384bb2)), closes [#574](https://github.com/nationalbankbelgium/stark/issues/574)
* **release:** fix wrong pushRepo option in release-it according to the latest version ([5992603](https://github.com/nationalbankbelgium/stark/commit/5992603dc2d85f76d873ac8da7106c9499e27773)), closes [#669](https://github.com/nationalbankbelgium/stark/issues/669)
* **stark-all:** change BrowserModule for CommonModule. Rearrange styles in showcase. Improve build script ([83cf5c9](https://github.com/nationalbankbelgium/stark/commit/83cf5c9acde179cc092d467ad1b28900c75e8902))
* **stark-all:** upgrade lint-staged to 7.2.2 to fix weird validation warning ([62b0b4a](https://github.com/nationalbankbelgium/stark/commit/62b0b4afe896fe9c9e4b3cdc641e8ab8108fdc30)), closes [#666](https://github.com/nationalbankbelgium/stark/issues/666)
* **stark-core:** added lodash dependency ([649ce6e](https://github.com/nationalbankbelgium/stark/commit/649ce6e16ca27df3509b4890d93a7bb07dfd411b)), closes [#630](https://github.com/nationalbankbelgium/stark/issues/630)
* **stark-demo:** adapt ExampleViewer to fetch example fiiles targeting the right url. Rename title input to prevent weird tooltip. ([491fd99](https://github.com/nationalbankbelgium/stark/commit/491fd9994a90625b3da13a0e83133706f3813fdd)), closes [#575](https://github.com/nationalbankbelgium/stark/issues/575) [#580](https://github.com/nationalbankbelgium/stark/issues/580)
* **stark-demo:** add AppLogo back in the header after being accidentally removed ([4a13249](https://github.com/nationalbankbelgium/stark/commit/4a132496cdc1f1a10ca10c851140a00fe2c4e88a))
* **stark-demo:** add missing files and regex to the showcase url auto-replace script ([3db3270](https://github.com/nationalbankbelgium/stark/commit/3db3270b7ad4a9d68a5dc892ce009af312c881e9)), closes [#571](https://github.com/nationalbankbelgium/stark/issues/571)
* **stark-demo:** hTML highlighting and 'Try it yourself' ([f5114f7](https://github.com/nationalbankbelgium/stark/commit/f5114f75460e122b2bd644c3a596acc6fff7354d)), closes [#601](https://github.com/nationalbankbelgium/stark/issues/601)
* **stark-ui:** button - align icon vertically ([f9015fb](https://github.com/nationalbankbelgium/stark/commit/f9015fbdc5a3d9178282efc95717ec818da07831)), closes [#619](https://github.com/nationalbankbelgium/stark/issues/619)
* **stark-ui:** modify CSS and add App-Logo to Showcase ([90e2e05](https://github.com/nationalbankbelgium/stark/commit/90e2e050fc053df6a151b1841ee85247767913f5)), closes [#583](https://github.com/nationalbankbelgium/stark/issues/583)
* **stark-ui:** removed TranslateService from breadcrumb component ([f40027f](https://github.com/nationalbankbelgium/stark/commit/f40027f873089a8d752897fc395712b153fb38bf))


### Features

* **stark-core:** use the browser language as the default language ([561d288](https://github.com/nationalbankbelgium/stark/commit/561d288833cfd336f3d0cd243047e2d23de27427)), closes [#578](https://github.com/nationalbankbelgium/stark/issues/578)
* **stark-demo:** add Slider component to the Showcase Demo ([0c75595](https://github.com/nationalbankbelgium/stark/commit/0c7559599ac568c029ea2454579d244c151a2e9a)), closes [#561](https://github.com/nationalbankbelgium/stark/issues/561)
* **stark-demo:** style header in the showcase ([1804ca3](https://github.com/nationalbankbelgium/stark/commit/1804ca3e169a53e76a7ca362c03e98546fc5ad68)), closes [#570](https://github.com/nationalbankbelgium/stark/issues/570)
* **stark-ui:** added white theme and full width for dropdown component ([c8c998e](https://github.com/nationalbankbelgium/stark/commit/c8c998eba8f2bc936110acd694d9b5d2cbf5c3e5)), closes [#642](https://github.com/nationalbankbelgium/stark/issues/642) [#640](https://github.com/nationalbankbelgium/stark/issues/640)
* **stark-ui:** date Picker Component ([705358c](https://github.com/nationalbankbelgium/stark/commit/705358c3bc1e19a463322a6207ee2e164a86c2a2)), closes [#542](https://github.com/nationalbankbelgium/stark/issues/542)
* **stark-ui:** implement date range picker ([ab06b73](https://github.com/nationalbankbelgium/stark/commit/ab06b73a6f503a128ec3cb4ef8cb5895e0419165)), closes [#586](https://github.com/nationalbankbelgium/stark/issues/586)
* **stark-ui:** implement the logout domponent/module ([74c2bba](https://github.com/nationalbankbelgium/stark/commit/74c2bbadf562953d3bccd956e7dd04e0798e1113)), closes [#588](https://github.com/nationalbankbelgium/stark/issues/588)
* **stark-ui:** implementation of breadcrumb component ([8f2f129](https://github.com/nationalbankbelgium/stark/commit/8f2f129ffdf0adad40e0f51e66b70011537cbd80)), closes [#591](https://github.com/nationalbankbelgium/stark/issues/591)
* **stark-ui:** implementation of stark dropdown component ([40adf24](https://github.com/nationalbankbelgium/stark/commit/40adf244f1ba99abaa00dbb6833492da1ae7d607)), closes [#447](https://github.com/nationalbankbelgium/stark/issues/447)
* **stark-ui:** implementation of the app sidebar ([09eeeea](https://github.com/nationalbankbelgium/stark/commit/09eeeeaa22cca30e19fa27a1b7a377c206738e80)), closes [#592](https://github.com/nationalbankbelgium/stark/issues/592)



# [10.0.0-alpha.4](https://github.com/nationalbankbelgium/stark/compare/10.0.0-alpha.3...10.0.0-alpha.4) (2018-07-30)


### Bug Fixes

* **build:** adding quotes arround the Prettier parameters to fix an issue on MacOS. ([ff1188b](https://github.com/nationalbankbelgium/stark/commit/ff1188bcdb7e4dfa049845b7dbb1438181830dd4))
* **stark-core:** fix circular dependencies detected by Rollup ([0620d7b](https://github.com/nationalbankbelgium/stark/commit/0620d7bd96a86b15abb3b81df6113723889d23d8)), closes [#530](https://github.com/nationalbankbelgium/stark/issues/530)
* **stark-core:** refactor AbstractStarkMain to enable Angular prod mode before bootstraping the app ([bb319fa](https://github.com/nationalbankbelgium/stark/commit/bb319fab4ac9770be0d2568570d24ab140961690))
* **stark-demo:** add baseHref dynamically via Angular provider to fix Showcase when published in GitHub pages ([cfc8592](https://github.com/nationalbankbelgium/stark/commit/cfc85926755fd00a421a8b1940e548430e8fc8cf)), closes [#466](https://github.com/nationalbankbelgium/stark/issues/466)
* **stark-demo:** adding StarkLoggingService to the ExampleViewer tests ([380a60d](https://github.com/nationalbankbelgium/stark/commit/380a60d34d2acc9e0e9eefd5fd50b21875734a42)), closes [#484](https://github.com/nationalbankbelgium/stark/issues/484)
* **stark-demo:** fix baseHref in angular.json file ([2a36276](https://github.com/nationalbankbelgium/stark/commit/2a362761970e3dec0d8ec048eb2760df95432524))
* **stark-demo:** fix pretty-print demo translations ([3999ff9](https://github.com/nationalbankbelgium/stark/commit/3999ff9db6d063b2e97fe7918b1a43e3d4bacb3d))
* **stark-demo:** revert PR [#471](https://github.com/nationalbankbelgium/stark/issues/471). Adapt baseHref/deployUrl automatically via Node script to fix Showcase when published in GitHub pages ([f9dadfd](https://github.com/nationalbankbelgium/stark/commit/f9dadfda37cc1ffd4ef5fbd095a8f37116d5f7fe))
* **stark-ui:** fix unresolved dependencies detected by Rollup ([a1d9487](https://github.com/nationalbankbelgium/stark/commit/a1d94879f088e7b7a3f3fb9e2bc26dd0984a7d9d)), closes [#532](https://github.com/nationalbankbelgium/stark/issues/532)
* **stark-ui:** include only "src" and "assets" folders in "lint-css" command on stark-ui and stark-core ([a1c3a4f](https://github.com/nationalbankbelgium/stark/commit/a1c3a4f78084911a4c0c64ad15e2f0e04a875caa))
* **stark-ui:** tooltip translation + table translation ([12dd3b3](https://github.com/nationalbankbelgium/stark/commit/12dd3b32426f1fd4daad3187741e5541e1e65ff6)), closes [#502](https://github.com/nationalbankbelgium/stark/issues/502)


### Features

* **core:** integrated bootstrap ([97ca29e](https://github.com/nationalbankbelgium/stark/commit/97ca29e3818e7c05a95e9279de7f87afefca11d2)), closes [#112](https://github.com/nationalbankbelgium/stark/issues/112) [#412](https://github.com/nationalbankbelgium/stark/issues/412)
* **stark-all:** enable npm ci for travis + add package-lock.json + force registry.npmjs.org as registry ([f47d610](https://github.com/nationalbankbelgium/stark/commit/f47d610865bf1b524afb338fe422293067eeb27a)), closes [#43](https://github.com/nationalbankbelgium/stark/issues/43)
* **stark-build:** add support for environment variables at runtime (importing environment.ts file) and at compilation time (using webpack Define plugin) ([c29e36b](https://github.com/nationalbankbelgium/stark/commit/c29e36b1bec21af004f035c9aa4b133887ce606b)), closes [#50](https://github.com/nationalbankbelgium/stark/issues/50)
* **stark-build:** added html-element-webpack-plugin to handle head section in index.html ([ce089c8](https://github.com/nationalbankbelgium/stark/commit/ce089c8b669d3d8be0e5cbd00242fcc9bce4cdaf)), closes [#60](https://github.com/nationalbankbelgium/stark/issues/60)
* **stark-core:** add [@ngrx-store-devtools](https://github.com/ngrx-store-devtools) package. Integrate store dev tools in showcase and starter ([b9c9179](https://github.com/nationalbankbelgium/stark/commit/b9c9179ef332fe2acf4beff3be6735e414b4a7ff)), closes [#81](https://github.com/nationalbankbelgium/stark/issues/81) [#117](https://github.com/nationalbankbelgium/stark/issues/117)
* **stark-core:** http-service: isolate NBB specifics ([e58afa7](https://github.com/nationalbankbelgium/stark/commit/e58afa792b15f4ae59b684841cf72e717408d2f6)), closes [#257](https://github.com/nationalbankbelgium/stark/issues/257)
* **stark-demo:** add pretty-print component to Showcase Demo ([93557cb](https://github.com/nationalbankbelgium/stark/commit/93557cb25209f9de58d8dfd26e166f5af17880f5)), closes [#496](https://github.com/nationalbankbelgium/stark/issues/496)
* **stark-ui:** action Bar Component ([d1dd733](https://github.com/nationalbankbelgium/stark/commit/d1dd7338131caf54edb1d2230a36ea22ea75c7cc)), closes [#481](https://github.com/nationalbankbelgium/stark/issues/481)
* **stark-ui:** add Prettier and use it for all the supported types of data ([5b06aef](https://github.com/nationalbankbelgium/stark/commit/5b06aefdc14c08bedaa48016662ee2514f63606d)), closes [#500](https://github.com/nationalbankbelgium/stark/issues/500)
* **stark-ui:** add stark-action-bar into stark-table ([d3a2c6d](https://github.com/nationalbankbelgium/stark/commit/d3a2c6de488c22ffb4c84cc32179862e4ec6b64d)), closes [#512](https://github.com/nationalbankbelgium/stark/issues/512)
* **stark-ui:** example Viewer + basic showcase layout ([ff675c8](https://github.com/nationalbankbelgium/stark/commit/ff675c8f5ac2015193ade5f63eeeca6820d35170)), closes [#458](https://github.com/nationalbankbelgium/stark/issues/458) [#459](https://github.com/nationalbankbelgium/stark/issues/459)
* **stark-ui:** implement OnEnterKey directive. Create KeyboardDirectives module ([0696959](https://github.com/nationalbankbelgium/stark/commit/0696959b4cbe5203582393c400dba834f2eaa398)), closes [#538](https://github.com/nationalbankbelgium/stark/issues/538)
* **stark-ui:** implement RestrictInput directive and module ([b8bd5be](https://github.com/nationalbankbelgium/stark/commit/b8bd5befed7b8edc85f94165d0e08befec38a4cf)), closes [#546](https://github.com/nationalbankbelgium/stark/issues/546) [#550](https://github.com/nationalbankbelgium/stark/issues/550)
* **stark-ui:** implement the Stark-Pretty-Print component ([22f84b6](https://github.com/nationalbankbelgium/stark/commit/22f84b6a1edb71631afc6410004bb39b5b34fb4c)), closes [#494](https://github.com/nationalbankbelgium/stark/issues/494) [#496](https://github.com/nationalbankbelgium/stark/issues/496)
* **stark-ui:** implement the Stark-Slider component ([fd6d03d](https://github.com/nationalbankbelgium/stark/commit/fd6d03d3c2a3f51b6644588cd25e565d2778bd93)), closes [#448](https://github.com/nationalbankbelgium/stark/issues/448)
* **stark-ui:** implementation of the button's theme ([c49b6ef](https://github.com/nationalbankbelgium/stark/commit/c49b6ef55441f605247425a3444a939e030849d4)), closes [#476](https://github.com/nationalbankbelgium/stark/issues/476)
* **stark-ui:** import old stark ui global theming ([9ac8dde](https://github.com/nationalbankbelgium/stark/commit/9ac8dde7ecd6f324f05afd7a8611baef3e59ea32)), closes [#456](https://github.com/nationalbankbelgium/stark/issues/456) [#472](https://github.com/nationalbankbelgium/stark/issues/472)
* **stark-ui:** improve example viewer styling ([bad3746](https://github.com/nationalbankbelgium/stark/commit/bad37468ee8f2fb4b481130cb558f290d9da5e19)), closes [#515](https://github.com/nationalbankbelgium/stark/issues/515)
* **stark-ui:** initial implementation of Stark Table component (supporting nested data, sorting and filtering) ([80e86c3](https://github.com/nationalbankbelgium/stark/commit/80e86c3fe29325decf4188766378522c217b5ff5))


### Performance Improvements

* **build-main:** adapt "npm install" commands to prevent optional dependencies from being installed. Enable parallelization in webpack prod config. ([020a5f4](https://github.com/nationalbankbelgium/stark/commit/020a5f4735a74ee41e2ce87ae7cd9fb2b1b60f54))



# [10.0.0-alpha.3](https://github.com/nationalbankbelgium/stark/compare/10.0.0-alpha.2...10.0.0-alpha.3) (2018-06-26)


### Bug Fixes

* **build-main:** add support for circular dependency warning. Fix rollup external dependencies ([ebd0fd1](https://github.com/nationalbankbelgium/stark/commit/ebd0fd113504cf6d9c38707944241ac93436de28))
* **build-main:** move ng dependencies to ROOT of Stark. Fix issue in build process. Rename tsconfig ([c7fecdb](https://github.com/nationalbankbelgium/stark/commit/c7fecdb22eb99cfe26feded2a459df220fcc7f05)), closes [#361](https://github.com/nationalbankbelgium/stark/issues/361) [#362](https://github.com/nationalbankbelgium/stark/issues/362)
* **build:** adapted the perl command to specify the backup file extension. This was necessary for some perl versions ([ec4afc6](https://github.com/nationalbankbelgium/stark/commit/ec4afc627dc1260757bd5188794ff18e1083fb62))
* **build:** fix issue in build-utils with environment. Environment file was not replaced as it should. ([d21a837](https://github.com/nationalbankbelgium/stark/commit/d21a837e8dfa94f065ec3825f7c3878700cd6b23)), closes [#439](https://github.com/nationalbankbelgium/stark/issues/439)
* **build:** fix sourcemaps in PROD and in DEV ([c8c5696](https://github.com/nationalbankbelgium/stark/commit/c8c56960925a4c843e6ad9ba2dc6be799905746b)), closes [#401](https://github.com/nationalbankbelgium/stark/issues/401)
* **build:** fixed webpack config and circular-dependency-plugin config. Closes [#397](https://github.com/nationalbankbelgium/stark/issues/397), [#315](https://github.com/nationalbankbelgium/stark/issues/315) ([ea9c264](https://github.com/nationalbankbelgium/stark/commit/ea9c26483af1d09974c1350ed8b30bcbce739125))
* **release:** adapt release-it.json and commitlint scopes to fix "release" command failure ([0e05826](https://github.com/nationalbankbelgium/stark/commit/0e058269dcca485460410e022a008cb4d71a748e))
* **stark-all:** add npx for the remaining script calling global rimraf package ([3ce0dac](https://github.com/nationalbankbelgium/stark/commit/3ce0dac9f7862123ecf006e4ae590583cf71563e))
* **stark-all:** fix nightly build release on Travis ([2c2445c](https://github.com/nationalbankbelgium/stark/commit/2c2445c2f1531320e3a605dee0602dc3613b7547)), closes [#357](https://github.com/nationalbankbelgium/stark/issues/357)
* **stark-all:** fix some imports and remove obsolete fixme's. Format code with Prettier. Fix stark-ui linting. ([daf258b](https://github.com/nationalbankbelgium/stark/commit/daf258b9b1d827ab589c0b240d5763eea66239d9))
* **stark-all:** packages: building the stark-core and stark-ui packages with the ncg script fails ([139e47b](https://github.com/nationalbankbelgium/stark/commit/139e47bcbe09a4d581be7e4e52a113dad32406e9)), closes [#441](https://github.com/nationalbankbelgium/stark/issues/441)
* **stark-build) fix(stark-starter:** fix webpack monitor issues with reports folder and HMR ([78c799f](https://github.com/nationalbankbelgium/stark/commit/78c799f0111240857f59ed46fd4294b0d19cbe9b))
* **stark-build:** include postcss loader+plugins to the Webpack css and scss files processing ([ffd60e7](https://github.com/nationalbankbelgium/stark/commit/ffd60e73a45f4bde602e2c97b80c0fa99ef9b756))
* **stark-core:** add missing barrel for common folder. Fix stark-core translations utils imports. ([febb69b](https://github.com/nationalbankbelgium/stark/commit/febb69b05b97e99d321340d7521f9980c6f1902a))
* **stark-starter:** fix blocking issue for reports folder ([1b7d492](https://github.com/nationalbankbelgium/stark/commit/1b7d49230ef6e806c519a8083363240d261e359c)), closes [#356](https://github.com/nationalbankbelgium/stark/issues/356)
* **stark-ui) fix(stark-testing:** add stark-ui package to the npm install:all script. Simplify customization of default Karma config. ([4f77730](https://github.com/nationalbankbelgium/stark/commit/4f77730815f9ded19973d0363bf54e8d652fab50))


### Features

* **build:** add support for custom baseHref and deployUrl in angular-cli.json file with BaseHrefWebpackPlugin ([cf941bd](https://github.com/nationalbankbelgium/stark/commit/cf941bd0dfda330a81e3f69ccf74d539dd80b2a6)), closes [#148](https://github.com/nationalbankbelgium/stark/issues/148)
* **build:** add support for publishing api docs and showcase using Travis. Closes [#282](https://github.com/nationalbankbelgium/stark/issues/282) ([f38ff86](https://github.com/nationalbankbelgium/stark/commit/f38ff861dc4c9e81f1cab253fb34de5dab81af76))
* **build:** add webpackMonitor ([ee46bef](https://github.com/nationalbankbelgium/stark/commit/ee46befd15de1d234a147dca05803338f1154200)), closes [#322](https://github.com/nationalbankbelgium/stark/issues/322)
* **build:** added changelog generation. Closes [#335](https://github.com/nationalbankbelgium/stark/issues/335) ([e06ba53](https://github.com/nationalbankbelgium/stark/commit/e06ba533938b750f82d31f07d1bbcbaac3159725))
* **core:** validate the AppConfig in every service where it is injected ([dd41aa5](https://github.com/nationalbankbelgium/stark/commit/dd41aa580b87a38ad624ffff010934f0ad270a1b)), closes [#382](https://github.com/nationalbankbelgium/stark/issues/382)
* **docs:** added API docs generation to packages and starter. Closes [#127](https://github.com/nationalbankbelgium/stark/issues/127) ([50c610f](https://github.com/nationalbankbelgium/stark/commit/50c610f74d9898fbf740e85b31883f8ef368dd6e))
* **docs:** added TSlint rules and adapted documentation for the project ([14cb90f](https://github.com/nationalbankbelgium/stark/commit/14cb90ff5948150f3e6bd92e419de904bfeae583)), closes [#424](https://github.com/nationalbankbelgium/stark/issues/424) [#389](https://github.com/nationalbankbelgium/stark/issues/389)
* **docs:** improved API docs generation with watch mode and coverage checks ([60701c8](https://github.com/nationalbankbelgium/stark/commit/60701c845526cb8b7c60284532735bbf83d56cae))
* **showcase:** added showcase, cleaned up start and got rid of old testing cfg. Closes [#395](https://github.com/nationalbankbelgium/stark/issues/395) [#353](https://github.com/nationalbankbelgium/stark/issues/353). Contributes to [#130](https://github.com/nationalbankbelgium/stark/issues/130) and [#63](https://github.com/nationalbankbelgium/stark/issues/63) ([abeefe7](https://github.com/nationalbankbelgium/stark/commit/abeefe761acb158abb0edd849aa0ad30dd7f7479))
* **stark-all:** add commitizen + commitlint with scripts, config & dependencies ([1cb59c2](https://github.com/nationalbankbelgium/stark/commit/1cb59c2423d6582b78618f3112eb89c7ff810cee)), closes [#290](https://github.com/nationalbankbelgium/stark/issues/290)
* **stark-all:** enable resourcesInlining once we have Angular 6 for inlining template in components ([9b33ccd](https://github.com/nationalbankbelgium/stark/commit/9b33ccd0be01e85467335661b1f2898458d1bd65)), closes [#376](https://github.com/nationalbankbelgium/stark/issues/376)
* **stark-all:** integrate SonarTS to current TSLint checks. Refactor code to fix TSLint violations. ([8627ab4](https://github.com/nationalbankbelgium/stark/commit/8627ab4c8d63c991902a1ccc5a8af9a77041d321)), closes [#331](https://github.com/nationalbankbelgium/stark/issues/331)
* **stark-all:** move dev dependencies from packages to ROOT of project + Fix source-map-loader issue ([98d2bc0](https://github.com/nationalbankbelgium/stark/commit/98d2bc0df8b6495ab63b9d8babe83973c3ef8d18)), closes [#371](https://github.com/nationalbankbelgium/stark/issues/371)
* **stark-all:** update to Angular 6, Rxjs 6, Webpack 4, TypeScript 2.7.2 ([862d10a](https://github.com/nationalbankbelgium/stark/commit/862d10afa26876c7133ca13ecb785c663b55b805)), closes [#359](https://github.com/nationalbankbelgium/stark/issues/359) [#258](https://github.com/nationalbankbelgium/stark/issues/258) [#19](https://github.com/nationalbankbelgium/stark/issues/19)
* **stark-demo:** cleanup of Stark Showcase application ([c0a0163](https://github.com/nationalbankbelgium/stark/commit/c0a0163344af741d2641be9186e50f4e01e5d2b4)), closes [#422](https://github.com/nationalbankbelgium/stark/issues/422)
* **stark-starter:** add NgIdleKeepAlive module in app module ([305989b](https://github.com/nationalbankbelgium/stark/commit/305989bcd788ae4712cba7a19e6736e0d03df98e)), closes [#261](https://github.com/nationalbankbelgium/stark/issues/261)
* **stark-ui:** implement SvgViewBox directive to enable resizing of Angular Material's mat-icon directive ([b4dc8ec](https://github.com/nationalbankbelgium/stark/commit/b4dc8ecccfc704aa288fbea5bfe02d66ac6b7980)), closes [#455](https://github.com/nationalbankbelgium/stark/issues/455)
* **translation:** add functionality to enable the use of translations in Stark modules ([fbdfc25](https://github.com/nationalbankbelgium/stark/commit/fbdfc2561b25fabeedf836ca7bb70e4363a57ff0))
* **ui:** add material theming ([9b03c06](https://github.com/nationalbankbelgium/stark/commit/9b03c0666ec321318ec7a38d5247543d4f8d5845))
* **ui:** create stark-ui package. Implement AppLogo module in Stark. ([ffaeacd](https://github.com/nationalbankbelgium/stark/commit/ffaeacd718fc8563e63d84f396dc81814c93a3ed)), closes [#101](https://github.com/nationalbankbelgium/stark/issues/101)
* **ui:** integrate @mdi/angular-material icons ([1e30ab7](https://github.com/nationalbankbelgium/stark/commit/1e30ab789f41f4821cd98e7c8c7e87eb7a2f81e1)), closes [#123](https://github.com/nationalbankbelgium/stark/issues/123)



# [10.0.0-alpha.2](https://github.com/nationalbankbelgium/stark/compare/80d09cee72f5a053015db0f977f96860744bbab6...10.0.0-alpha.2) (2018-04-25)


### Bug Fixes

* **build:** Disable i18n rule for Codelyzer ([50a203d](https://github.com/nationalbankbelgium/stark/commit/50a203d7aa7e4d936e694595d59c54f49f5588f4))
* **build:** Fix Import bracket rule for prettier and tslint ([41562db](https://github.com/nationalbankbelgium/stark/commit/41562db4fb1d47c35d5d889e13ecf76db240a426))
* **build:** fixed issue with prettier config name with webpack plugin and added new scripts at root ([51be4f6](https://github.com/nationalbankbelgium/stark/commit/51be4f67b6b0ef0f150aecc975690d5216e48bc8))
* **core:** fix for validation module related to requested changes ([09a388d](https://github.com/nationalbankbelgium/stark/commit/09a388d99a94f58fd574beef5cd341eea56bb792))
* **core:** fix ngc issues and clean-up code in stark-core. Integrate AppMetadata in Starter ([5299842](https://github.com/nationalbankbelgium/stark/commit/5299842db02d0bc270e697360b696659dbc0786f))
* **http:** fix unit tests. Enhance http demo in Starter ([#268](https://github.com/nationalbankbelgium/stark/issues/268)) ([6d609b8](https://github.com/nationalbankbelgium/stark/commit/6d609b8a83d81264e6bb6a20db9a9475d1ee7b6e)), closes [#68](https://github.com/nationalbankbelgium/stark/issues/68) [#68](https://github.com/nationalbankbelgium/stark/issues/68) [#84](https://github.com/nationalbankbelgium/stark/issues/84) [#93](https://github.com/nationalbankbelgium/stark/issues/93) [angular/zone.js#1015](https://github.com/angular/zone.js/issues/1015) [#96](https://github.com/nationalbankbelgium/stark/issues/96)
* **lazy-loading:** Remove PreloadAllModules preloading strategy from routing coneiguration to make lazy-loaded modules to be actually lazy loaded :) ([9634dac](https://github.com/nationalbankbelgium/stark/commit/9634dacae5503979e812c3b4b1ace88cf46f756c))
* **lazy-loading:** Remove PreloadAllModules preloading strategy from routing coneiguration tz makz lazz-loaded modules to be actually lazy loaded :) ([80d09ce](https://github.com/nationalbankbelgium/stark/commit/80d09cee72f5a053015db0f977f96860744bbab6))
* **linting:** clean stark-build/tslint.json. Remove obsolete options for 'ban' rule ([86ed26c](https://github.com/nationalbankbelgium/stark/commit/86ed26c551d469ff966f6067d6a46663fa7ec506))
* **linting:** fix some TS linting issues ([8d5d6a8](https://github.com/nationalbankbelgium/stark/commit/8d5d6a8426c243a2d077a005b0297ec322cd1f17))
* **logging:** uncomment reducer implementation in logging.module.ts ([07a5f0e](https://github.com/nationalbankbelgium/stark/commit/07a5f0e2efa5791253aa32888061da5cd324392c))
* **ngrx-store:** use ngrx store feature selectors in Stark Core modules. Use store-freeze and store-logger meta-reducers in Starter ([916c435](https://github.com/nationalbankbelgium/stark/commit/916c43514f29d017045f3fb4943375a7a9fd1ef8))
* **rollup:** add ibantools to external dependencies ([9606ecc](https://github.com/nationalbankbelgium/stark/commit/9606ecc8fc349dadbe090f5523e624374c77fa31))
* Use latest rxjs forward-compat to solve ErrorObservable issues ([28c7ceb](https://github.com/nationalbankbelgium/stark/commit/28c7ceb8bf7ff3f2a2a6e7d102f9b67ff4b52fea))


### Features

* **build:** added .gitattributes. Closes [#144](https://github.com/nationalbankbelgium/stark/issues/144). ([b4c3ef2](https://github.com/nationalbankbelgium/stark/commit/b4c3ef22fa03a84d4363e9399d488a1793da9d08))
* **build:** added release and publish support. Closes [#54](https://github.com/nationalbankbelgium/stark/issues/54). Closes [#24](https://github.com/nationalbankbelgium/stark/issues/24). Closes [#27](https://github.com/nationalbankbelgium/stark/issues/27) ([101ceab](https://github.com/nationalbankbelgium/stark/commit/101ceab45a45bdac57c08226dc8bfcc96766e7e7))
* **build:** added support for building a subset of the packages ([55ec4c1](https://github.com/nationalbankbelgium/stark/commit/55ec4c169aa9b3831c859784aa56ac5984fe68eb))
* **coverage:** add support for code coverage with Coveralls ([72aefce](https://github.com/nationalbankbelgium/stark/commit/72aefce1ecf3214894c2eb7052d78456ad2a72b3))
* **http:** correction for imports ([464566a](https://github.com/nationalbankbelgium/stark/commit/464566a94a8673cb18500244355653ecf24e5b1f))
* **http:** create StarkHttp module. Fixed imports. Implemented small demo in Starter [[#96](https://github.com/nationalbankbelgium/stark/issues/96)] ([201edb8](https://github.com/nationalbankbelgium/stark/commit/201edb86700dadb1d5266b14b28115a946b99929))
* **http:** implement Stark Http in stark-core (unit tests to be completed) [[#96](https://github.com/nationalbankbelgium/stark/issues/96)] ([579c59b](https://github.com/nationalbankbelgium/stark/commit/579c59b76bf215ca722ff8cd0dc70b0ab4189427))
* **http:** implement Stark Http in stark-core (unit tests to be completed) [[#96](https://github.com/nationalbankbelgium/stark/issues/96)] ([719d92d](https://github.com/nationalbankbelgium/stark/commit/719d92d81d3f1d19bdc72a350a978bc28002dd75))
* **logging:** create StarkLogging module. Fixed imports ([f3684db](https://github.com/nationalbankbelgium/stark/commit/f3684db6a31ed1cca291858601a693f3faf8111c))
* **logging:** implement STARK_APP_CONFIG token and implement Stark logging in Starter ([ec09736](https://github.com/nationalbankbelgium/stark/commit/ec097368c92d50a7ac101d5abaf9a48a35a1d57c))
* **polyfills:** Update polyfills.browser.ts with the relevant polyfills needed only for IE11 and some special features from Angular. Add needed npm dependencies for those polyfils ([2b6a160](https://github.com/nationalbankbelgium/stark/commit/2b6a1606a50bcd02a409661c0dfe7e100be10a3a))
* **routing:** adapt CSP style-src directive to allow inline styles from UI Router visualizer ([8a1a8fa](https://github.com/nationalbankbelgium/stark/commit/8a1a8fa2baf766461f0d4a41df94fce16d464b0f))
* **routing:** add UI Router visualizer. Adapt CSP img-src directive to allow png images from UI Router visualizer ([3bc995b](https://github.com/nationalbankbelgium/stark/commit/3bc995baa448ef4ba80006831a4c30b28ade72f5))
* **routing:** replace Angular Router by UI Router ([24b70d4](https://github.com/nationalbankbelgium/stark/commit/24b70d4612a99f4fe0b0312ef4efa6996ae11b2e))
* **session:** add actions, entities, reducers and services for session module ([2dad18c](https://github.com/nationalbankbelgium/stark/commit/2dad18cca64e2d04d23b579fa4ddd76a00968109))
* **session:** Correction relative to PR requested changes for session module ([4290029](https://github.com/nationalbankbelgium/stark/commit/4290029aaf9c573c40b1387e2a89b14da0cb560f))
* **stark-testing:** create separate stark-testing package and use it in all stark packages and starter ([#267](https://github.com/nationalbankbelgium/stark/issues/267)) ([204dc35](https://github.com/nationalbankbelgium/stark/commit/204dc354600d12c92a638f631a5a97ff498d3812)), closes [#68](https://github.com/nationalbankbelgium/stark/issues/68) [#68](https://github.com/nationalbankbelgium/stark/issues/68) [#84](https://github.com/nationalbankbelgium/stark/issues/84) [#93](https://github.com/nationalbankbelgium/stark/issues/93) [angular/zone.js#1015](https://github.com/angular/zone.js/issues/1015)
* **user:** add entities for user module ([38c48fe](https://github.com/nationalbankbelgium/stark/commit/38c48fee2ab30041bf65f18139e0b99bb9b17b8a))



