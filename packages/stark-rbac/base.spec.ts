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
// FIXME: change when https://github.com/monounity/karma-typescript/issues/320 is resolved
// tslint:disable-next-line:import-blacklist
import "lodash-es"; // see https://github.com/monounity/karma-typescript/issues/150#issuecomment-318620280
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/proxy"; // since zone.js 0.6.15
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch"; // put here since zone.js 0.6.14
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
/* tslint:enable:no-import-side-effect */

import { TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// define global environment variable (used in some places in stark-ui)
global["ENV"] = "development";
