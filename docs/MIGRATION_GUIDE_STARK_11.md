# Guide for migration from Stark 10 to Stark 11

This guide contains all the changes required to migrate an application
from Stark 10 (Angular 7) to Stark 11 (Angular 11).

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

In Stark 11, there is only one "webpack.config.js" file.
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

### 2. Adapt "src/index.html" file

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

## Stark-RBAC

To complete

## Stark-Testing

To complete

## Starl-UI

To complete