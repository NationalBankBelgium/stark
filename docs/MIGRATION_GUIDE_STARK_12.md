# Guide for migration from Stark 10 to Stark 12

This guide contains all the changes required to migrate an application
from Stark 10 (Angular 7) to Stark 12 (Angular 12).

## General dependencies

Upgrade the following dependencies in your "package.json" file:

- @angular/\*, from `"^7.2.0"` to `"^12.1.0"`
- @nationalbankbelgium/code-style: `"^1.6.0"`
- @nationalbankbelgium/stark-\*, from `"^10.0.0"` to `"^12.0.0-alpha.0"`
- typescript, from `"~3.5.0"` to `"~4.3.5"`
- zone.js, from `"~0.8.x"` to `"~0.11.4"`

## @Angular/CLI

### 1. Adapt "tsconfig.app.json" file

Due to angular upgrade to v12, it is required to adapt your "tsconfig.app.json" file to specify
the files used by Angular CLI to build your project.

Before:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {},
  "exclude": ["node_modules", "dist", "src/**/*.spec.ts", "src/**/*.e2e.ts", "e2e/**/*.e2e.ts", "src/assets"]
}
```

After:

```json
{
  "extends": "./tsconfig.json",
  "files": ["src/main.browser.ts", "src/polyfills.browser.ts"],
  "compilerOptions": {},
  "exclude": ["node_modules", "dist", "src/**/*.spec.ts", "src/**/*.e2e.ts", "e2e/**/*.e2e.ts", "src/assets"]
}
```

### 2. Adapt TestBed usage

Due to angular upgrade to v12, it is required to adapt TestBed usage.
`TestBed.get` has to be replaced by `TestBed.inject`.

## zone.js

### 1. Adapt "base.spec.ts" and "src/polyfills.browser.ts" files

Due to zone.js update, imports should be adapted in "base.spec.ts" and "src/polyfills.browser.ts" files:

```typescript
// Before
import "zone.js/dist/zone";
import "zone.js/dist/zone-testing";
import "zone.js/dist/long-stack-trace-zone";

// After
import "zone.js";
import "zone.js/testing";
import "zone.js/plugins/long-stack-trace-zone";
```

## Stark-Build

### 1. Adapt "angular.json" file

Due to changes in Stark-Build, it is required to make some minor changes in "angular.json".

#### 1.1. Edit `projects.<project_name>.architect.build.options`:

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

#### 1.2. Edit `projects.<project_name>.architect.build.configurations.<environment>`:

In Stark 12, there is only one "webpack.config.js" file.
Thanks to this, this is no longer needed to have specific configurations for other environment.

Please remove the following lines in `projects.<project_name>.architect.build.configurations.<environment>`:

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

#### 1.3. Edit `projects.<project_name>.architect.serve.builder`:

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

#### 1.4. Edit `projects.<project_name>.architect.test.builder`:

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

#### 1.5. Edit `projects.<project_name>.architect.build.configurations.hmr`:

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

### 2. Adapt "src/index.html" file

#### 2.1. Adapt stark variables usage

As `htmlWebpackPlugin` is no longer supported by Angular CLI, the options related to this plugin have been changed.
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

#### 2.2. Remove obsolete code related to webpack-dev-server

Remove the following piece of code in "src/index.html"

```html
<!-- move the block of webpack dev server to the <head> section and change the IF conditions -->
<% if (starkOptions.starkAppMetadata.IS_DEV_SERVER && starkOptions.starkAppMetadata.HMR !== true) { %>
<!-- Webpack Dev Server reload -->
<script src="/webpack-dev-server.js"></script>
<% } %>
```

### 3. Adapt "package.json" file

#### 3.1. Remove scripts with MONITOR

Due to Angular upgrade, webpack-monitor stopped working. Since the package was no longer maintained (4 years),
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

## Stark-Core

### 1. UI-router changes

#### 1.1. Adapt module lazy loading declarations

Removed string based lazy module loading via loadChildren
Previously, we supported `loadChildren: './lazymodule/lazy.module.ts#LazyModule'`
This lazy load mechanism is deprecated in Angular 8 in favor of:
`loadChildren: (): any => import('./lazymodule/lazy.module).then(x => x.LazyModule)`

See: https://github.com/ui-router/angular/commit/2f1506c

#### 1.2. `NgModuleFactoryLoader` is no longer needed and must be removed

Due to the previous change, the following `provider` must be removed from "src/app/app.module.ts":

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

### Update ngrx action usage

#### Remove obsolete `ngrx-store-freeze` dependency

Remove `ngrx-store-freeze` dependency in favor of new built-in runtime checks in `@ngrx/store@8.x`.

Adapt code as follows in "src/app/app.module.ts":

```ts
// Before
import { storeFreeze } from "ngrx-store-freeze";
//...
export const metaReducers: MetaReducer<State>[] = ENV === "development" ? [logger, storeFreeze] : [];

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(reducer, {
      metaReducers: metaReducers
    })
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
    })
  ]
})
export class AppModule {}
```

More information: https://ngrx.io/guide/migration/v8#deprecation-of-ngrx-store-freeze

#### Details about changes

Previous union types have been replaced as following:

- `StarkErrorHandlingActions` -> `StarkErrorHandlingActions.Types`
- `StarkLoggingActions` -> `StarkLoggingActions.Types`
- `StarkRoutingActions` -> `StarkRoutingActions.Types`
- `StarkSessionActions` -> `StarkSessionActions.Types`
- `StarkSettingsActions` -> `StarkSettingsActions.Types`
- `StarkUserActions` -> `StarkUserActions.Types`

The following actions have been changed and should be used as follows:

##### Error handling actions:

- `StarkUnhandledError(public error: any)` -> `StarkErrorHandlingActions.unhandledError({ error: any })`

Due to this change, The `StarkErrorHandlingActionsTypes` enum has been removed.

##### Logging actions:

- `StarkSetLoggingApplicationId(public applicationId: string)` -> `StarkLoggingActions.setLoggingApplicationId({ applicationId: string })`
- `StarkLogMessageAction(public message: StarkLogMessage)` -> `StarkLoggingActions.logMessage({ message: StarkLogMessage })`
- `StarkFlushLogMessages(public numberOfMessagesToFlush: number)` -> `StarkLoggingActions.flushLogMessages({ numberOfMessagesToFlush: number })`

Due to this change, The `StarkLoggingActionsTypes` enum has been removed.

##### Routing actions

- `StarkNavigate( public currentState: string, public newState: string, public params?: RawParams, public options?: TransitionOptions )`
  -> `StarkRoutingActions.navigate({ currentState: string; newState: string; params?: RawParams; options?: TransitionOptions })`
- `StarkNavigateSuccess((public previousState: string, public currentState: string, public params?: RawParams))`
  -> `StarkRoutingActions.navigateSuccess({ previousState: string; currentState: string; params?: RawParams })`
- `StarkNavigateFailure(public currentState: string, public newState: string, public params: RawParams, public error: string)`
  -> `StarkRoutingActions.navigateFailure({ currentState: string; newState: string; params?: RawParams; error: string })`
- `StarkNavigateRejection(public currentState: string, public newState: string, public params: RawParams, public reason: string)`
  -> `StarkRoutingActions.navigateRejection({ currentState: string; newState: string; params: RawParams; reason: string })`
- `StarkNavigationHistoryLimitReached()` -> `StarkRoutingActions.navigationHistoryLimitReached()`
- `StarkReload(public state: string)` -> `StarkRoutingActions.reload({ state: string })`
- `StarkReloadSuccess(public state: string, public params: RawParams)` -> `StarkRoutingActions.reloadSuccess({ state: string; params: RawParams })`
- `StarkReloadFailure(public state: string, public params: RawParams)` -> `StarkRoutingActions.reloadFailure({ state: string; params: RawParams })`

Due to this change, The `StarkRoutingActionsTypes` enum has been removed.

##### Session actions:

- `StarkChangeLanguage(public languageId: string)` -> `StarkSessionActions.changeLanguage({ languageId: string })`
- `StarkChangeLanguageSuccess(public languageId: string)` -> `StarkSessionActions.changeLanguageSuccess({ languageId: string })`
- `StarkChangeLanguageFailure(public error: any)` -> `StarkSessionActions.changeLanguageFailure({ error: any })`
- `StarkInitializeSession(public user: StarkUser)` -> `StarkSessionActions.initializeSession({ user: StarkUser })`
- `StarkInitializeSessionSuccess()` -> `StarkSessionActions.initializeSessionSuccess()`
- `StarkDestroySession()` -> `StarkSessionActions.destroySession()`
- `StarkDestroySessionSuccess()` -> `StarkSessionActions.destroySessionSuccess()`
- `StarkSessionTimeoutCountdownStart(public countdown: number)` -> `StarkSessionActions.sessionTimeoutCountdownStart({ countdown: number })`
- `StarkSessionTimeoutCountdownStop()` -> `StarkSessionActions.sessionTimeoutCountdownStop()`
- `StarkSessionTimeoutCountdownFinish()` -> `StarkSessionActions.sessionTimeoutCountdownFinish()`
- `StarkSessionLogout()` -> `StarkSessionActions.sessionLogout()`
- `StarkUserActivityTrackingPause()` -> `StarkSessionActions.userActivityTrackingPause()`
- `StarkUserActivityTrackingResume()` -> `StarkSessionActions.userActivityTrackingResume()`

Due to this change, The `StarkSessionActionsTypes` enum has been removed.

##### Settings actions:

- `StarkPersistPreferredLanguage(public language: string)` -> `StarkSettingsActions.persistPreferredLanguage({ language: string })`
- `StarkPersistPreferredLanguageSuccess()` -> `StarkSettingsActions.persistPreferredLanguageSuccess()`
- `StarkPersistPreferredLanguageFailure(public error: any)` -> `StarkSettingsActions.persistPreferredLanguageFailure({ error: any })`
- `StarkSetPreferredLanguage(public language: string)` -> `StarkSettingsActions.setPreferredLanguage({ language: string })`

Due to this change, The `StarkSettingsActionsTypes` enum has been removed.

##### User actions:

- `StarkFetchUserProfile()` -> `StarkUserActions.fetchUserProfile()`
- `StarkFetchUserProfileSuccess(public user: StarkUser)` -> `StarkUserActions.fetchUserProfileSuccess({ user: StarkUser })`
- `StarkFetchUserProfileFailure(public error: StarkHttpErrorWrapper | Error)`
  -> `StarkUserActions.fetchUserProfileFailure({ error: StarkHttpErrorWrapper | Error })`
- `StarkGetAllUsers()` -> `StarkUserActions.getAllUsers()`
- `StarkGetAllUsersSuccess(public users: StarkUser[])` -> `StarkUserActions.getAllUsersSuccess({ users: StarkUser[] })`
- `StarkGetAllUsersFailure(public message: string)` -> `StarkUserActions.getAllUsersFailure({ message: string })`

Due to this change, The `StarkUserActionTypes` enum has been removed.

##### Changes in effect:

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

#### Using regex to quickly update:

##### Error handling actions:

- StarkUnhandledError:
  - Search: `new StarkUnhandledError\((\w+)\)`
  - Replace: `StarkErrorHandlingActions.unhandledError({ error: $1 })`

##### Logging actions:

- StarkSetLoggingApplicationId:
  - Search: `new StarkSetLoggingApplicationId\((\w+)\)`
  - Replace: `StarkLoggingActions.setLoggingApplicationId({ applicationId: $1 })`
- StarkLogMessageAction:
  - Search: `new StarkLogMessageAction\((\w+)\)`
  - Replace: `StarkLoggingActions.logMessage({ message: $1 })`
- StarkFlushLogMessages:
  - Search: `new StarkFlushLogMessages\((\w+)\)`
  - Replace: `StarkLoggingActions.flushLogMessages({ numberOfMessagesToFlush: $1 })`

##### Routing actions

- StarkNavigate:
  - Search: `new StarkNavigate\((\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.navigate({ currentState: $1, newState: $2 })`
- StarkNavigate (3 parameters):
  - Search: `new StarkNavigate\((\w+), (\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.navigate({ currentState: $1, newState: $2, params: $3 })`
- StarkNavigate (4 parameters):
  - Search: `new StarkNavigate\((\w+), (\w+), (\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.navigate({ currentState: $1, newState: $2, params: $3, options: $4 })`
- StarkNavigateSuccess:
  - Search: `new StarkNavigateSuccess\((\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.navigateSuccess({ previousState: $1, currentState: $2 })`
- StarkNavigateSuccess (3 parameters):
  - Search: `new StarkNavigateSuccess\((\w+), (\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.navigateSuccess({ previousState: $1, currentState: $2, params: $3 })`
- StarkNavigateFailure:
  - Search: `new StarkNavigateFailure\((\w+), (\w+), (\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.navigateFailure({ currentState: $1, newState: $2, params: $3, error: $4 })`
- StarkNavigateRejection:
  - Search: `new StarkNavigateRejection\((\w+), (\w+), (\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.navigateFailure({ currentState: $1, newState: $2, params: $3, reason: $4 })`
- StarkNavigationHistoryLimitReached:
  - Search: `new StarkNavigationHistoryLimitReached\(\)`
  - Replace: `StarkRoutingActions.navigationHistoryLimitReached()`
- StarkReload:
  - Search: `new StarkReload\((\w+)\)`
  - Replace: `StarkRoutingActions.reload({ state: $1 })`
- StarkReloadSuccess:
  - Search: `new StarkReloadSuccess\((\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.reloadSuccess({ state: $1, params: $2 })`
- StarkReloadFailure:
  - Search: `new StarkReloadFailure\((\w+), (\w+)\)`
  - Replace: `StarkRoutingActions.reloadFailure({ state: $1, params: $2 })`

##### Session actions:

- StarkChangeLanguage:
  - Search: `new StarkChangeLanguage\((\w+)\)`
  - Replace: `StarkSessionActions.changeLanguage({ languageId: $1 })`
- StarkChangeLanguageSuccess:
  - Search: `new StarkChangeLanguageSuccess\((\w+)\)`
  - Replace: `StarkSessionActions.changeLanguageSuccess({ languageId: $1 })`
- StarkChangeLanguageFailure:
  - Search: `new StarkChangeLanguageFailure\((\w+)\)`
  - Replace: `StarkSessionActions.changeLanguageFailure({ error: $1 })`
- StarkInitializeSession:
  - Search: `new StarkInitializeSession\((\w+)\)`
  - Replace: `StarkSessionActions.initializeSession({ user: $1 })`
- StarkInitializeSessionSuccess:
  - Search: `new StarkInitializeSessionSuccess\(\)`
  - Replace: `StarkSessionActions.initializeSessionSuccess()`
- StarkDestroySession:
  - Search: `new StarkDestroySession\(\)`
  - Replace: `StarkSessionActions.destroySession()`
- StarkDestroySessionSuccess:
  - Search: `new StarkDestroySessionSuccess\(\)`
  - Replace: `StarkSessionActions.destroySessionSuccess()`
- StarkSessionTimeoutCountdownStart:
  - Search: `new StarkSessionTimeoutCountdownStart\((\w+)\)`
  - Replace: `StarkSessionActions.sessionTimeoutCountdownStart({ countdown: $1 })`
- StarkSessionTimeoutCountdownStop:
  - Search: `new StarkSessionTimeoutCountdownStop\(\)`
  - Replace: `StarkSessionActions.sessionTimeoutCountdownStop()`
- StarkSessionTimeoutCountdownFinish:
  - Search: `new StarkSessionTimeoutCountdownFinish\(\)`
  - Replace: `StarkSessionActions.sessionTimeoutCountdownFinish()`
- StarkSessionLogout:
  - Search: `new StarkSessionLogout\(\)`
  - Replace: `StarkSessionActions.sessionLogout()`
- StarkUserActivityTrackingPause:
  - Search: `new StarkUserActivityTrackingPause\(\)`
  - Replace: `StarkSessionActions.userActivityTrackingPause()`
- StarkUserActivityTrackingResume:
  - Search: `new StarkUserActivityTrackingResume\(\)`
  - Replace: `StarkSessionActions.userActivityTrackingResume()`

##### Settings actions:

- StarkPersistPreferredLanguage:
  - Search: `new StarkPersistPreferredLanguage\((\w+)\)`
  - Replace: `StarkSettingsActions.persistPreferredLanguage({ language: $1 })`
- StarkPersistPreferredLanguageSuccess:
  - Search: `new StarkPersistPreferredLanguageSuccess\(\)`
  - Replace: `StarkSettingsActions.persistPreferredLanguageSuccess()`
- StarkPersistPreferredLanguageFailure:
  - Search: `new StarkPersistPreferredLanguageFailure\((\w+)\)`
  - Replace: `StarkSettingsActions.persistPreferredLanguageFailure({ error: $1 })`
- StarkSetPreferredLanguage:
  - Search: `new StarkSetPreferredLanguage\((\w+)\)`
  - Replace: `StarkSettingsActions.setPreferredLanguage({ language: $1 })`

##### User actions:

- StarkFetchUserProfile:
  - Search: `new StarkFetchUserProfile\(\)`
  - Replace: `StarkUserActions.fetchUserProfile()`
- StarkFetchUserProfileSuccess:
  - Search: `new StarkFetchUserProfileSuccess\((\w+)\)`
  - Replace: `StarkUserActions.fetchUserProfileSuccess({ user: $1 })`
- StarkFetchUserProfileFailure:
  - Search: `new StarkFetchUserProfileFailure\((\w+)\)`
  - Replace: `StarkUserActions.fetchUserProfileSuccess({ error: $1 })`
- StarkGetAllUsers:
  - Search: `new StarkGetAllUsers\(\)`
  - Replace: `StarkUserActions.getAllUsers()`
- StarkGetAllUsersSuccess:
  - Search: `new StarkGetAllUsersSuccess\((\w+)\)`
  - Replace: `StarkUserActions.getAllUsersSuccess({ users: $1 })`
- StarkGetAllUsersSuccess (with inline array)
  - Search: `new StarkGetAllUsersSuccess\((\[\w+\])\)`
  - Replace: `StarkUserActions.getAllUsersSuccess({ users: $1 })`
- StarkGetAllUsersFailure:
  - Search: `new StarkGetAllUsersFailure\((\w+)\)`
  - Replace: `StarkUserActions.getAllUsersFailure({ message: $1 })`

## Stark-RBAC

### Update ngrx action usage

#### Details about changes

**RBAC Authorization actions:**

The following actions have been changed and should be used as follows:

- `StarkUserNavigationUnauthorized(public targetState: string)` -> `StarkRBACAuthorizationActions.userNavigationUnauthorized({ targetState: string })`
- `StarkUserNavigationUnauthorizedRedirected(public targetState: string, public redirectionState: string)` -> `StarkRBACAuthorizationActions.userNavigationUnauthorizedRedirected({ targetState: string; redirectionState: string })`

Due to this change, The `StarkRBACAuthorizationActionsTypes` enum has been removed.

Previous union type has been replaced: `StarkRBACAuthorizationActions` -> `StarkRBACAuthorizationActions.Types`.

Usage of action has changed as follows:

##### Changes in effect:

```typescript
// Before
@Effect({ dispatch: false })
public starkRBACNavigationUnauthorized$(): Observable<void> {
    return this.actions$.pipe(
        ofType<StarkUserNavigationUnauthorized>(StarkRBACAuthorizationActionsTypes.RBAC_USER_NAVIGATION_UNAUTHORIZED),
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

##### Changes in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkUserNavigationUnauthorized(transition.targetState().name()));

// After
this.store.dispatch(StarkRBACAuthorizationActions.userNavigationUnauthorized({ targetState: transition.targetState().name() }));
```

#### Using regex to quickly update:

**RBAC Authorization actions:**

- StarkUserNavigationUnauthorized:
  - Search: `new StarkUserNavigationUnauthorized\((\w+)\)`
  - Replace: `StarkRBACAuthorizationActions.userNavigationUnauthorized({ targetState: $1 })`
- StarkUserNavigationUnauthorizedRedirected:
  - Search: `new StarkUserNavigationUnauthorizedRedirected\((\w+), (\w+)\)`
  - Replace: `StarkRBACAuthorizationActions.userNavigationUnauthorizedRedirected({ targetState: $1, redirectionState: $2 })`

## Stark-Testing

### 1. Adapt test configuration

In Stark 12, Karma CI specific configuration has been merged into "karma.conf.js" file.

Thanks to this change, Karma configuration can be used easily with ng CLI.
Due to this, following changes have to be made in application using `stark-testing`:

- Remove karma.conf.ci.js
- Verify that projects.<project_name>.architect.test configuration in "angular.json" is as following:
  ```txt
  {
    // ...
    "test": {
      "builder": "@angular-builders/custom-webpack:karma",
      "options": {
        "main": "base.spec.ts",
        "karmaConfig": "karma.conf.js",
        "tsConfig": "tsconfig.spec.json"
      }
    }
    // ...
  }
  ```
- Adapt "test-fast:ci" script as following:

  ```txt
  // Before
  "test-fast:ci": "cross-env CI=1 npm run ng test --code-coverage"

  // After
  "test-fast:ci": "npm run ng -- test --watch=false --code-coverage"
  ```

-- Adapt "karma.conf.js"

```txt
	/**
 	* Load karma config from Stark
 	*/
	const defaultKarmaConfig = require("./node_modules/@nationalbankbelgium/stark-testing/karma.conf.js").rawKarmaConfig;

	//Add following lines

	// Puppeteer: https://github.com/GoogleChrome/puppeteer/
	// takes care of download Chrome and making it available (can do much more :p)
	process.env.CHROME_BIN = require("puppeteer").executablePath();
```

## Stark-UI

### 1. Update styles

Due to upgrade to `@angular/material` v12, we need to update SCSS files to use the
new `@use` word instead of `@import`.

Your current "src/styles/\_theme.scss" should look like this:

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

As all the stark-ui styles are configured thanks to `set-stark-ui-styles` method, you should remove
`@import "~@nationalbankbelgium/stark-ui/assets/stark-ui-bundle";` import
in "src/styles/styles.scss".

If you use Stark media queries variables such as `$tablet-query`, `$mobile-only-query`...

You should add the following `@use` rule at the top of your files:

```scss
@use "~@nationalbankbelgium/stark-ui/styles/media-queries" as *;
```

### 2. Update ngrx action usage

#### Details about changes

The following actions have been changed and should be used as follows:

##### Message Pane actions:

- `StarkAddMessages(public messages: StarkMessage[])` -> `StarkMessagePaneActions.addMessages({ messages: StarkMessage[] })`
- `StarkRemoveMessages(public messages: StarkMessage[])` -> `StarkMessagePaneActions.removeMessages({ messages: StarkMessage[] })`
- `StarkClearMessages()` -> `StarkMessagePaneActions.clearMessages()`
- `StarkGetAllMessages()` -> `StarkMessagePaneActions.getAllMessages()`

##### Progress Indicator actions:

- `StarkProgressIndicatorRegister(public progressIndicatorConfig: StarkProgressIndicatorFullConfig)` -> `StarkProgressIndicatorActions.register({ progressIndicatorConfig: StarkProgressIndicatorFullConfig })`
- `StarkProgressIndicatorDeregister(public topic: string)` -> `StarkProgressIndicatorActions.deregister({ topic: string })`
- `StarkProgressIndicatorHide(public topic: string)` -> `StarkProgressIndicatorActions.hide({ topic: string })`
- `StarkProgressIndicatorShow(public topic: string)` -> `StarkProgressIndicatorActions.show({ topic: string })`

Previous union type have been replaced:

- `StarkMessagePaneActions` -> `StarkMessagePaneActions.Types`.
- `StarkProgressIndicatorActions` -> `StarkProgressIndicatorActions.Types`.

##### Changes in effect:

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

##### Changes in `action` usage:

```typescript
// Before
this.store.dispatch(new StarkAddMessages(messages));

// After
this.store.dispatch(StarkMessagePaneActions.addMessages({ messages: messages }));
```

#### Using regex to quickly update:

##### Message Pane actions:

- StarkAddMessages:
  - Search: `new StarkAddMessages\((\w+)\)`
  - Replace: `StarkMessagePaneActions.addMessages({ messages: $1 })`
- StarkAddMessages (with inline array)
  - Search: `new StarkAddMessages\((\[\w+\])\)`
  - Replace: `StarkMessagePaneActions.addMessages({ messages: $1 })`
- StarkRemoveMessages:
  - Search: `new StarkRemoveMessages\((\w+)\)`
  - Replace: `StarkMessagePaneActions.removeMessages({ messages: $1 })`
- StarkClearMessages
  - Search: `new StarkClearMessages\(\)`
  - Replace: `StarkMessagePaneActions.clearMessages()`

##### Progress Indicator actions:

- StarkProgressIndicatorRegister:
  - Search: `new StarkProgressIndicatorRegister\((\w+)\)`
  - Replace: `StarkProgressIndicatorFullConfig.register({ progressIndicatorConfig: $1 })`
- StarkProgressIndicatorDeregister:
  - Search: `new StarkProgressIndicatorDeregister\((\w+)\)`
  - Replace: `StarkProgressIndicatorFullConfig.deregister({ topic: $1 })`
- StarkProgressIndicatorHide:
  - Search: `new StarkProgressIndicatorHide\((\w+)\)`
  - Replace: `StarkProgressIndicatorFullConfig.hide({ topic: $1 })`
- StarkProgressIndicatorShow
  - Search: `new StarkProgressIndicatorShow\((\w+)\)`
  - Replace: `StarkProgressIndicatorFullConfig.show({ topic: $1 })`
