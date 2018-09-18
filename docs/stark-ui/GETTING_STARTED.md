# Getting started

The recommended way to get started with **Stark** is to download the [starter](../../starter) and run `npm install`.

## Styling

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

## Typings

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
