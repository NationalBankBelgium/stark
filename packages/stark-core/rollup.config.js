"use strict";

const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const sourcemaps = require("rollup-plugin-sourcemaps");

const globals = {
	// FIXME use for other modules than core
	// '@nationalbankbelgium/core': 'stark.core',
	// 'rxjs/Observable': 'Rx',
	// 'rxjs/Subject': 'Rx',
	// 'rxjs/Observer': 'Rx',
	// 'rxjs/Subscription': 'Rx',
	// 'rxjs/observable/merge': 'Rx.Observable',
	// 'rxjs/operator/share': 'Rx.Observable.prototype'
};

module.exports = {
	//export default {
	input: "../../dist/packages-dist/stark-core/esm5/stark-core.js",
	output: [
		{
			file: "../../dist/packages-dist/stark-core/bundles/stark-core.umd.js",
			globals: globals,
			format: "umd",
			exports: "named",
			name: "stark.http",
			sourcemap: true
		}
	],
	amd: {
		id: "@nationalbankbelgium/stark-core"
	},
	plugins: [
		resolve(),
		commonjs(), // converts date-fns to ES modules
		sourcemaps()
	],
	external: Object.keys(globals)
};
