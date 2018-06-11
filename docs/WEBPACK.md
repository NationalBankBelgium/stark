# Webpack Customizations

Stark-Build uses several Webpack plugins as well as some utils in order to leverage lots of functionality and customizations to your builds (DEV and PROD).

This is the list of utils and plugins used by the stark-build package:

## Utils

#### Support for custom base URL for assets

Due to the possibility of defining a custom base url in your _index.html_ thanks to the [BaseHrefWebpackPlugin](https://github.com/dzonatan/base-href-webpack-plugin "BaseHrefWebpackPlugin"), it is also necessary to customize the path of the different assets (images, styles, etc.).

To do this, Stark uses the same custom logic implemented in the [@angular-devkit/build-angular](https://github.com/angular/devkit/blob/fe122511feada8d8c554799171e8e43bac950416/packages/angular_devkit/build_angular/src/angular-cli-files/models/webpack-configs/styles.ts "@angular-devkit/build-angular") to append the custom base url and the deploy url so you don't need to worry about the final path for every resource.

The only thing you need to do is to configure the **baseHref** and **deployUrl** options (if needed) in the _angular.json_ file as follows:

```json
{
  ...
  "projects": {
    "yourProjectName": {
      ...
      "architect": {
        "yourTargetName": {
          ...
          "options": {
            ...
            "baseHref": "/some-url",  // default value: "/"
            "deployUrl": "/some-url" // default value: ""
          }
        }
      }
    }
  }
}
```

## Plugins

#### [BaseHrefWebpackPlugin](https://github.com/dzonatan/base-href-webpack-plugin "BaseHrefWebpackPlugin")

Allows to customize the base url in the _index.html_ via the webpack config.

In Stark-Build, the custom base url provided to this plugin is the one you define in the **baseHref** option of your project's _angular.json_ file:

```json
{
  ...
  "projects": {
    "yourProjectName": {
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
