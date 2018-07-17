"use strict";

// This configuration file contains common values we can reuse in the different rollup configuration files (at least parts of)

const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const sourcemaps = require("rollup-plugin-sourcemaps");

const globals = {
	"@angularclass/hmr": "angularclass.hmr",
	"@angular/cdk": "ng.cdk",
	"@angular/core": "ng.core",
	"@angular/common/http": "ng.common.http",
	"@angular/material": "ng.material",
	"@angular/platform-browser": "ng.platform.browser",
	"@nationalbankbelgium/stark-core": "stark.core",
	"@nationalbankbelgium/stark-ui": "stark.ui",
	"@ngrx/store": "@ngrx/store",
	"@ngrx/store-devtools": "@ngrx/store-devtools",
	"@ngrx/effects": "@ngrx/effects",
	"@ng-idle/core": "@ng-idle/core",
	"@ng-idle/keepalive": "@ng-idle/keepalive",
	"@ngx-translate/core": "@ngx-translate/core",
	"@uirouter/core": "@uirouter/core",
	"@uirouter/angular": "@uirouter/angular",
	"class-validator": "class-validator",
	cerialize: "cerialize",
	ibantools: "ibantools",
	moment: "moment",
	uuid: "uuid",

	rxjs: "rxjs",
	"rxjs/operators": "rxjs.operators"

	// TODO add lines such as the one below to make sure that stark modules that depend on other stark modules can find those
	// '@nationalbankbelgium/core': 'stark.core',
};

const plugins = [
	resolve(),
	commonjs(), // converts date-fns to ES modules
	sourcemaps()
];

const output = {
	globals: globals,
	format: "umd", // modules with code should be converted to umd
	exports: "named",
	sourcemap: true
};

exports.output = output;
exports.external = Object.keys(globals);
exports.plugins = plugins;
