# Getting started

The recommended way to get started with **Stark** is to download the [starter](https://github.com/NationalBankBelgium/stark/tree/master/starter) and run `npm install`.

## <a name="styling"></a>Styling

The starter comes with most things preconfigured meaning that all SCSS files needed for Stark-UI are imported by default via `~@nationalbankbelgium/stark-ui/assets/stark-ui-bundle`:

```scss
/*
IMPORTANT: Stark styles are provided as SCSS styles so they should be imported in a SCSS file!
*/
@import "theme";
@import "~@nationalbankbelgium/stark-ui/assets/stark-ui-bundle";
/* App */
@import "../app/app.component";
```

You can also pick and choose which parts of the Stark-UI styling/theming you want to use.
Simply remove `@import "~@nationalbankbelgium/stark-ui/assets/stark-ui-bundle";` from `src/styles/styles.scss` and import only the desired files.

**IMPORTANT:** Import `base.scss` and `base-theme.scss` since these provide you with a clean basis and some basics for styling/theming your app.

```scss
/*
IMPORTANT: Stark-UI styles are provided as SCSS styles so they should be imported in a SCSS file!
*/
@import "theme";
/* Stark-UI styles */
@import "~@nationalbankbelgium/stark-ui/assets/styles/base";
@import "~@nationalbankbelgium/stark-ui/assets/theming/base-theme";
/* Stark-UI component styles */
@import "~@nationalbankbelgium/stark-ui/src/modules/app-logo/components/app-logo-theme";
@import "~@nationalbankbelgium/stark-ui/src/modules/app-logo/components/app-logo.component";
/* App */
@import "../app/app.component";
```

Or you can replace the Stark-UI styling with your own:

```scss
/*
IMPORTANT: Stark-UI styles are provided as SCSS styles so they should be imported in a SCSS file!
*/
@import "theme";
/* Stark-UI styles */
@import "~@nationalbankbelgium/stark-ui/assets/styles/base";
@import "~@nationalbankbelgium/stark-ui/assets/theming/base-theme";
/* Stark-UI component styles */
@import "~@nationalbankbelgium/stark-ui/src/modules/app-logo/components/app-logo-theme";
/* Custom Stark-UI component styles */
@import "your-custom-stark-ui-styles/app-logo.component";
/* App */
@import "../app/app.component";
```

## <a name="typings"></a>Typings

Stark-UI also provides some typings for some libraries that are used internally by some components/directives. This are located under the `typings` folder.
For this reason, you must add these typings to the `typeRoots` in the `tsconfig.json` of your app so that Angular compiler can build your application correctly:

```text
{
  ...
  "compilerOptions": {
 	...
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@nationalbankbelgium/stark-build/typings",
      "./node_modules/@nationalbankbelgium/stark-ui/typings"  // typings folder from Stark-UI
    ],
    ...
  },
  ...
}
```

**IMPORTANT:** This should always be done even if you don't use such types yourself. As mentioned above, this is used by Stark-UI internally.

## <a name="assets"></a>Assets

### Material Icons

The different features provided by Stark-UI (components and directives) follow the Material Design specs as much as possible. This is the reason why all the components
are implemented with [Angular Material](https://material.angular.io/) and the icons used are also from the Material Design specs.

In this case, the icons used in Stark-UI are provided by [MaterialDesign-Angular-Material](https://github.com/Templarian/MaterialDesign-Angular-Material) which is an SVG icon set specially
bundled for Angular Material. You can see the different icons that are available in this icon set at https://materialdesignicons.com/.

Therefore you must add this SVG icon set in your `angular.json` so that it is copied to your application `assets` folder and the Stark-UI components can be rendered correctly:

```text
"projects": {
    ...
    "your-app": {
        ...
        "architect": {
            ...
            "build": {
                "options": {
                    "assets": [
                        {
                            "glob": "mdi.svg",
                            "input": "node_modules/@mdi/angular-material",
                            "output": "assets/material-icons"
                        },
                        ...
                    ],
                    ...
                },
                ...
            },
            ...
        }
    }
}
```

**IMPORTANT:** This should be done always even if you don't use any of these icons yourself. As mentioned above, these are used by Stark-UI internally.

### Component assets

Some Stark-UI components use certain predefined assets (mainly images) which are provided under the `assets` folder of the package. Therefore in case you use such components than
you should include those assets in your `angular.json` so that they are copied to your application `assets` folder and the Stark-UI components can be rendered correctly:

```text
"projects": {
    ...
    "your-app": {
        ...
        "architect": {
            ...
            "build": {
                "options": {
                    "assets": [
                        {
                            "glob": "**/*",
                            "input": "node_modules/@nationalbankbelgium/stark-ui/assets/",
                            "output": "assets/stark-ui"
                        },
                        ...
                    ],
                    ...
                },
                ...
            },
            ...
        }
    }
}
```

**IMPORTANT:** This should be done only in case the Stark-UI component(s) you use requires any of these assets. In case you want to copy just certain assets from Stark-UI,
make sure that you copy them following this structure in your application `assets` folder:

```text
|
+---yourApp
|   +---assets
|   |   +---stark-ui  // assets from Stark-UI should be available at this location
|   ...
```

This will ensure that your application `assets` folder will contain only the assets that are actually used in your app.
