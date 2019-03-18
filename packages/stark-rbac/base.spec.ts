"use strict";

import "core-js/es6";
import "core-js/es7/reflect";
import "core-js/es7/string";
import "core-js/stage/4";

// IE polyfills

// See https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
if (!Element.prototype.matches) {
	// @ts-ignore
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// See: https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
// @ts-ignore: Window.NodeList
if (window.NodeList && !NodeList.prototype.forEach) {
	// @ts-ignore: forEach mismatching types
	NodeList.prototype.forEach = Array.prototype.forEach;
}

/* tslint:disable:no-import-side-effect */
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/proxy"; // since zone.js 0.6.15
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch"; // put here since zone.js 0.6.14
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import "zone.js/dist/zone-patch-rxjs";
import "zone.js/dist/zone-patch-rxjs-fake-async";
/* tslint:enable:no-import-side-effect */

import { TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// define global environment variable (used in some places in stark-ui)
global["ENV"] = "development";
