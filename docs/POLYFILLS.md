# Polyfills

In the case you want your application to be compatible with non modern browsers (i.e. Internet Explorer) or browsers that don't support some of the latest standards,  you might be interested in polyfills. 
Stark doesn't use any polyfills by default, but in case you need them, you can follow the steps mentioned below. 

## Creating the polyfills file

An empty file called `polyfills.browser.ts` should be created at the following location: 
`src > polyfills.browser.ts`

## Importing all the polyfills needed

The following polyfills are suitable for most of the cases, especially when targeting Internet Explorer:

```typescript
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 *
 * See: https://angular.io/guide/browser-support#optional-browser-features-to-polyfill
 */

/**
 * IE11 requires all of the following polyfills.
 *
 * Polyfill: https://github.com/zloirock/core-js
 */
/* tslint:disable:no-import-side-effect */
import "core-js/es6";
import "core-js/es7/reflect";
import "core-js/es7/string";
import "core-js/stage/4";

/**
 * IE11 and Edge require this to support Server-sent events
 * https://caniuse.com/#feat=eventsource
 *
 * Polyfill: https://github.com/Yaffle/EventSource
 */
import "event-source-polyfill";

/**
 * IE11 requires Element.classList for NgClass support on SVG elements
 * See: https://caniuse.com/#feat=classlist
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * https://angular.io/guide/browser-support#classlist
 * Polyfill: https://github.com/eligrey/classList.js
 */
import "eligrey-classlist-js-polyfill";

/**
 * Web Animations polyfill is no longer needed for standard animation support as of Angular 6
 * IMPORTANT: It is only needed in case you use the AnimationBuilder from '@angular/animations' in the application
 *
 * See: https://angular.io/guide/browser-support#optional-browser-features-to-polyfill
 * See: http://caniuse.com/#feat=web-animation
 * Polyfill: https://github.com/web-animations/web-animations-js
 */
// import "web-animations-js";

/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
// workaround for IE11 before loading zone.ks (see: https://github.com/angular/zone.js/issues/933)
(window as any).__Zone_enable_cross_context_check = true;
import "zone.js/dist/zone";
// async stack traces with zone.js included for dev
// import 'zone.js/dist/long-stack-trace-zone'
/* tslint:enable */
```
For more information about which polyfills are required to support the Angular feature you want to use, 
feel free to refer to [Angular browser support guide](https://angular.io/guide/browser-support#mandatory-polyfills). 


## Adding the polyfills file to the angular.json

Adapt (if needed) the path of your `polyfills.browsers.ts` file in the `angular.json` file of your project.
 
```
{ 
  "projects": {
    "starter": {
      ...
      "architect": {
        "build": {
          ...
          "options": {
           ...
            "polyfills": "src/polyfills.browser.ts",
            ...}
            }
         }
      }
   }
}
```
