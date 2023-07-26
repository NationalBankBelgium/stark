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

/**
 * *************************************************************************************************
 * BROWSER POLYFILLS
 *
 * See: https://angular.io/guide/browser-support#optional-browser-features-to-polyfill
 */

/**
 * IE11 requires all of the following polyfills.
 *
 * Polyfill: https://github.com/zloirock/core-js
 */
/* eslint-disable import/no-unassigned-import */
// FIXME: remove the workaround added to the tsconfig.json to support core-js 3.0.0 with Angular CLI 7.x (https://github.com/angular/angular-cli/issues/13954#issuecomment-475452588)
// it will be fixed most likely in Angular 8
import "core-js/es";
import "core-js/proposals/reflect-metadata";
/**
 * IE11 does not support iteration on certain DOM collections (NodeList).
 * This polyfill is specifically needed for the animation on mat-menu used in stark-table.
 * More info: https://github.com/angular/angular/issues/27887
 */
import "core-js/modules/web.dom-collections.iterator";

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
 * Hammerjs must be imported for gestures
 */
import "hammerjs";

/**
 * Web Animations polyfill is no longer needed for standard animation support as of Angular 6
 * IMPORTANT: It is only needed in case you use the AnimationBuilder from '@angular/animations' in the application
 *
 * See: https://angular.io/guide/browser-support#optional-browser-features-to-polyfill
 * See: http://caniuse.com/#feat=web-animation
 * Polyfill: https://github.com/web-animations/web-animations-js
 */
// import "web-animations-js";

/**
 * *************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import "zone.js";
// async stack traces with zone.js included for dev
// import 'zone.js/plugins/long-stack-trace-zone'
/* eslint-enable */

/**
 * *************************************************************************************************
 * APPLICATION IMPORTS
 */
/* eslint-disable sonarjs/no-all-duplicated-branches */
if ("production" === ENV) {
	// Production
} else {
	// Development
}
/* eslint-enable */
