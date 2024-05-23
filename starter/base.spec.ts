"use strict";

import "core-js/es";
import "core-js/proposals/reflect-metadata";

// IE polyfills

// See https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
/* tslint:disable:no-unbound-method */
if (!Element.prototype.matches) {
	Element.prototype.matches = (<any>Element.prototype).msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
/* tslint:enable:no-unbound-method */

// See: https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
if ((<any>window).NodeList && !NodeList.prototype.forEach) {
	(<any>NodeList.prototype).forEach = Array.prototype.forEach;
}

/* tslint:disable:no-import-side-effect */
import "zone.js";
import "zone.js/testing";
import "zone.js/plugins/long-stack-trace-zone";
/* tslint:enable:no-import-side-effect */

// define global environment variable (used in some places in stark-core and stark-ui)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis["ENV"] = "development";

import { getTestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
	teardown: { destroyAfterEach: false }
});
