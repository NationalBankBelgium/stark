"use strict";

/* eslint-disable import/no-unassigned-import */
import "core-js/es";
import "core-js/proposals/reflect-metadata";
/* eslint-enable import/no-unassigned-import */
// IE polyfills

// See https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
/* eslint-disable @typescript-eslint/unbound-method */
if (!Element.prototype.matches) {
	Element.prototype.matches = (<any>Element.prototype).msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// See: https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
if ((<any>window).NodeList && !NodeList.prototype.forEach) {
	(<any>NodeList.prototype).forEach = Array.prototype.forEach;
}

/* eslint-enable @typescript-eslint/unbound-method */

/* eslint-disable import/no-unassigned-import */
import "zone.js";
import "zone.js/testing";
import "zone.js/plugins/long-stack-trace-zone";
/* eslint-enable import/no-unassigned-import */

// define global environment variable (used in some places in stark-core and stark-ui)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis["ENV"] = "development";

import { getTestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
	teardown: { destroyAfterEach: false }
});
