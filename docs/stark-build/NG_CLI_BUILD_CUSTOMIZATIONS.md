# NG CLI integration

Since **Stark** is a framework fully based on Angular, it also integrates with the [Angular CLI](https://angular.io/cli).
This means that you can lint ([`ng lint`](https://angular.io/cli/lint)), build ([`ng build`](https://angular.io/cli/build)), run ([`ng serve`](https://angular.io/cli/serve))
and test ([`ng test`](https://angular.io/cli/test) and [`ng e2e`](https://angular.io/cli/e2e)) your app as you would do in any other project directly generated with the CLI.

## CLI Limitations

There is however a small limitation in the Angular CLI `ng lint` command compared to what **Stark** provides: such command only runs [TSLint](https://palantir.github.io/tslint/)
whereas Stark-Build gives you the possibility to lint your app with [TSLint](https://palantir.github.io/tslint/) for Typescript code and with [Stylelint](https://stylelint.io/)
for Stylesheets (CSS, SASS, SCSS, etc).

So, in order to lint your app using both linting tools, you should create some NPM scripts in your `package.json`to run them, for example:

```text
"scripts": {
    "lint": "npm run lint-ts && npm run lint-css",
    "lint-ts": "tslint --config ./tslint.json --project ./tsconfig.json --format codeFrame",
    "lint-css": "stylelint \"./src/**/*.?(pc|sc|c|sa)ss\" --formatter \"string\"",
}
```

# Build Customizations

Stark-Build provides all the necessary customizations for the default Angular CLI build configuration for any application based on **Stark**.

This is done via partial Webpack configurations that override certain options in the default configuration from the Angular CLI
thanks to [@angular-builders](https://github.com/meltedspark/angular-builders).

## Including Stark-Build customizations in your App

Any app using **Stark** should include the customizations provided by Stark-Build via the `angular.json` file:

```text
// Only the relevant modifications are shown, the rest of options are omitted for brevity

"projects": {
    ...
    "your-app": {
        ...
        "architect": {
            ...
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
                    ...
                },
                "configurations": {
                    "hmr": {
                        "fileReplacements": [
                            {
                                "replace": "src/environments/environment.ts",
                                "with": "src/environments/environment.hmr.ts"
                            }
                        ]
                    },
                    "production": {
                        "customWebpackConfig": {
                            "path": "./node_modules/@nationalbankbelgium/stark-build/config/webpack-partial.prod.js",
                            "mergeStrategies": {
                                "modules.rules": "prepend",
                                "plugins": "prepend",
                                "replaceDuplicatePlugins": false
                            }
                        },
                        ...
                        "fileReplacements": [
                            {
                                "replace": "src/environments/environment.ts",
                                "with": "src/environments/environment.prod.ts"
                            }
                        ]
                    }
                }
            },
            "serve": {
                "builder": "@angular-builders/dev-server:generic",
                "options": {
                    "browserTarget": "your-app:build"
                },
                "configurations": {
                    "hmr": {
                        "browserTarget": "your-app:build:hmr"
                    },
                    "production": {
                        "browserTarget": "your-app:build:production"
                    },
                    "e2e.prod": {
                        "browserTarget": "your-app:build:e2e.prod"
                    }
                }
            },
            ...
        }
    }
}
```

Notice that the custom Webpack partial configurations are set to the dev and prod configurations in the `build` and the `serve` targets.

This must be done by using the `@angular-builders/custom-webpack:browser` builder in the `build` target and set the `customWebpackConfig` options.
For the `serve` target this must be done by using `@angular-builders/dev-server:generic` builder.

## Webpack Customizations

As mentioned before, Stark-Build provides all the necessary customizations for the Angular CLI build configuration. This is done by using several
Webpack plugins as well as some utils in order to leverage some functionality to your builds (DEV and PROD).

This is the list of utils and plugins used by the Stark-Build package:

### Loaders

#### [tslint-loader](https://github.com/wbuchwalter/tslint-loader)

This loader [lints](https://palantir.github.io/tslint/) your TypeScript files based on the configuration in your `tslint.json`.

**Because at this moment disabling `typeCheck` in this loader drasticly improves build time we opted to overwrite and disable all [tslint rules](https://palantir.github.io/tslint/rules/) that require Type Info.**

### Plugins

#### [DefinePlugin](https://webpack.js.org/plugins/define-plugin)

Allows to define global variables that will be available during the compilation and building of the application bundles.

In this case, Stark-Build provides some global variables that are available at compilation time, which means that you can implement some checks in
your code and this will be analyzed when your application bundle is being built by Webpack.

The global variables available at compilation time are the following:

- `ENV` which indicates the current environment: `"development"` or `"production"`
- `HMR` which indicates whether the Hot Module Replacement support is enabled (true/false).

Since the DefinePlugin defines those variables as global, you can use them everywhere in your code so you can, for example, determine on which
environment your app is currently running and execute some logic only on that specific environment:

```typescript
// if true, your app is running in development environment
if (ENV === "development") {
  /* the code inside this block will be executed only in development */
}
```

To avoid Typescript compilation issues regarding these global variables, make sure that you include the typings from the Stark-Build package in your app `tsconfig.json`:

```text
{
    "extends": "./node_modules/@nationalbankbelgium/stark-build/tsconfig.json",
    "compilerOptions": {
        ...
        "typeRoots": [
            "./node_modules/@types",
            "./node_modules/@nationalbankbelgium/stark-build/typings"  // typings from stark-build
        ],
        ...
    },
    ...
}
```

#### Why do you need the target environment at compilation time?

Sometimes you might need to add some logic or import some files only when your application is running in development or production.

**In this case, when Webpack builds your application, the final bundle will contain also that code and/or imports that will only be used on a specific environment.
For example, the specific code related to development will never be executed in production and yet it will be included in your production build which will increase the size of your bundle.**

This is why knowing the target environment at compilation time is useful. You can put the logic inside an if block and then such code will be tree-shaken by Webpack as it will recognize it as dead code:

```typescript
// this check is translated to "if (false)" when ENV is "production"
// allowing Webpack to identify it as dead code and so remove it
if (ENV === "development") {
  /* the code inside this block will only be included in development */
}
```

#### [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin "HtmlWebpackPlugin")

Simplifies the creation of the main _index.html_ file in the application bundle. This plugin will generate the final _index.html_ based on
the `src/index.html` file in your project.

This plugin is configured to use the [ejs-loader](https://github.com/okonet/ejs-loader) for [Underscore/LoDash Templates](https://lodash.com/docs#template).
Which means that you can use that templating syntax in your `src/index.html`. This is really powerful given the information from the HtmlWebpackPlugin
that you can access in your template to customize it. For example:

```html
<html lang="en">
  <head>
    <!-- Use the application name from StarkAppMetadata as the Page title -->
    <title><%= htmlWebpackPlugin.options.starkAppMetadata.name %></title>
  </head>
  <body>
    Some content here
  </body>
</html>
```

This is the information from HtmlWebpackPlugin that is accessible in the template:

- **options:** all options that were passed to the plugin including plugin's own options as well as Stark custom data containing the following:
  - **metadata:**
    - **TITLE:** Default title for Stark based apps: "Stark Application by @NationalBankBelgium"
    - **BASE_URL:** The base URL of the current build
    - **IS_DEV_SERVER:** Whether the current build is served locally with the development server
    - **HMR:** Whether the current build has HMR enabled
    - **AOT:** Whether the current build was generated with AOT compilation enabled
    - **E2E:** Whether the current build was generated with the E2E configuration
    - **WATCH:** Whether the option to rebuild on changes is enabled
    - **TS_CONFIG_PATH:** Path to the application's `tsconfig` file as defined in the `angular.json`
    - **ENV:** The environment of the current build: `production` or `development`
    - **environment:** The specific target used for the current build: `hmr`, `dev`, `e2e.prod` or `prod`
  - **starkAppMetadata:** the Stark metadata of the application available in the `src/stark-app-metadata.json` file
  - **starkAppConfig:** the Stark specific configuration for the application available in the `src/stark-app-config.json` file

#### [BaseHrefWebpackPlugin](https://github.com/dzonatan/base-href-webpack-plugin "BaseHrefWebpackPlugin")

Allows to customize the base url in the _index.html_ via the Webpack config.

In Stark-Build, the custom base url provided to this plugin is the one you define in the **baseHref** option of your project's `angular.json` file:

```text
{
    ...
    "projects": {
        "your-app": {
            ...
            "architect": {
                "yourTargetName": {
                    ...
                    "options": {
                        ...
                        "baseHref": "/some-url"  // default value: "/"
                    }
                }
            }
        }
    }
}
```

This plugin will automatically add the base tag `<base href="<custom-base-url>">` to the _index.html_ so you don't need to add it manually yourself.

#### [HtmlElementWebpackPlugin](https://github.com/fulls1z3/html-elements-webpack-plugin "HtmlElementWebpackPlugin")

This plugin appends head elements during the creation of _index.html_.

To use it, you'll have to create the `index-head-config.js` file to specify the `<link>` and `<meta>` you want to include in the `<head>` section of your _index.html_.

Create your file at the following location:

```text
|
+---yourApp
|   +---config
|	|	index-head-config.js
|   ...
```

Then, declare your file as follows:

```
module.exports = {
    link: [
        { rel: "manifest", href: "manifest.json" },
        { rel: "shortcut icon", type: "image/x-icon", href: "favicon.ico" },
        { rel: "apple-touch-icon", sizes: "120x120", href: "assets/images/app-icons/apple-icon-120x120.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "assets/images/app-icons/favicon-32x32.png" },
        ...
    ],
    meta: [
        ...
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black" },
        { name: "apple-mobile-web-app-title", content: "template" },
        { name: "msapplication-config", content: "none" },
        ...
    ]
}
```

Finally, to include in your _index.html_ file the elements defined in this new file, you will have to add
the following lines in your `<head>` section:

<!-- prettier-ignore-start -->
```html
<head>
	...
	<% if (webpackConfig.htmlElements.headTags) { %>
	<%= webpackConfig.htmlElements.headTags %>
	<% } %>
	...
</head>
```
<!-- prettier-ignore-end -->

_If you do not intend to use this feature, simply don't create the `index-head-config.js` file and
don't include the check for `webpackConfig.htmlElements.headTags` in the `<head>` section of index.html._

#### [ContextReplacementPlugin](https://webpack.js.org/plugins/context-replacement-plugin/)

Allows to override the inferred information in a 'require' context. This is used in Stark-Build to limit the locales from [MomentJs](https://momentjs.com/)
that will be included in the bundles: `de`, `fr`, `en-gb`, `nl` and `nl-be`.

This is needed because MomentJS package provides all locales available without the possibility to select only some of them.

#### [WebpackMonitor](https://github.com/webpackmonitor/webpackmonitor)

Gives information about the bundle's size. This plugin is not enabled by default in Stark-Build so you need to pass the environment variable `MONITOR=1` to enable it.

You can do this by setting the environment variable yourself before running the `ng serve` command or you can use [cross-env](https://github.com/kentcdodds/cross-env) and use it in an NPM script to set
the environment variable temporarily only for this command:

```text
"scripts": {
    "serve:dev:monitor": "cross-env MONITOR=1 ng serve",
    "serve:prod:monitor": "cross-env MONITOR=1 ng serve --prod=true",
}
```

The WebpackMonitor app (for example: http://webpackmonitor.com/demo.html) showing all the bundles relevant information will be served automatically on port 3030.
Also all the stats generated by WebpackMonitor will be available in a `stats.json` file under `reports/webpack-monitor`.

#### [BundleAnalyzerPlugin](https://github.com/webpack-contrib/webpack-bundle-analyzer)

Similar to WebpackMonitor, this plugin also gives information about the bundle's size with the difference that this is more interactive thanks to a zoomable tree map.
This plugin is not enabled by default in Stark-Build so you need to pass the environment variable `BUNDLE_ANALYZER=1` to enable it.

You can do this by setting the environment variable yourself before running the `ng serve` command or you can use [cross-env](https://github.com/kentcdodds/cross-env) and use it in an NPM script to set
the environment variable temporarily only for this command:

```text
"scripts": {
    "serve:dev:bundle-analyzer": "cross-env BUNDLE_ANALYZER=1 ng serve",
    "serve:prod:bundle-analyzer": "cross-env BUNDLE_ANALYZER=1 ng serve --prod=true",
}
```

The interactive treemap visualization showing the contents of all the app bundles will be served automatically on port 3030.
Also all the stats generated by WebpackBundleAnalyzer will be available in a `stats.json` file under `reports/bundle-analyzer`.
