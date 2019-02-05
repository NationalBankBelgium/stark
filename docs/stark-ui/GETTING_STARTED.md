# Getting started

The recommended way to get started with **Stark** is to download the [starter](../../starter) and run `npm install`.

## Styling

The starter comes with most things preconfigured and all SCSS files needed for stark-ui are imported by default via `~@nationalbankbelgium/stark-ui/assets/stark-ui-bundle`:

```scss
/*
IMPORTANT: Stark styles are provided as SCSS styles so they should be imported in a SCSS file!
*/
@import "theme";
@import "~@nationalbankbelgium/stark-ui/assets/stark-ui-bundle";
/* App */
@import "../app/app.component";
```

You can also pick and choose which parts of the Stark styling/theming you want to use. Simply remove `@import "~@nationalbankbelgium/stark-ui/assets/stark-ui-bundle";` from `src/styles/styles.scss` and import only the desired files.

**IMPORTANT:** Import `base.scss` and `base-theme.scss` since these provide you with a clean basis and some basics for styling/theming your app.

```scss
/*
IMPORTANT: Stark styles are provided as SCSS styles so they should be imported in a SCSS file!
*/
@import "theme";
/* Stark styles */
@import "~@nationalbankbelgium/stark-ui/assets/styles/base";
@import "~@nationalbankbelgium/stark-ui/assets/theming/base-theme";
/* Stark component styles */
@import "~@nationalbankbelgium/stark-ui/src/modules/app-logo/components/app-logo-theme";
@import "~@nationalbankbelgium/stark-ui/src/modules/app-logo/components/app-logo.component";
/* App */
@import "../app/app.component";
```

Or you can replace the Stark styling with your own:

```scss
/*
IMPORTANT: Stark styles are provided as SCSS styles so they should be imported in a SCSS file!
*/
@import "theme";
/* Stark styles */
@import "~@nationalbankbelgium/stark-ui/assets/styles/base";
@import "~@nationalbankbelgium/stark-ui/assets/theming/base-theme";
/* Stark component styles */
@import "~@nationalbankbelgium/stark-ui/src/modules/app-logo/components/app-logo-theme";
/* Custom Stark component styles */
@import "your-custom-stark-styles/app-logo.component";
/* App */
@import "../app/app.component";
```
