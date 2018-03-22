"use strict";

const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

module.exports = {
	//export default {
	input: "../../dist/packages-dist/stark-testing/karma.conf.typescript.js",
	output: [
		{
			file: "../../dist/packages-dist/stark-testing/stark-testing.js",
			format: "cjs",
			name: "stark.testing"
		}
	],
	plugins: [
		resolve(),
		commonjs() // converts date-fns to ES modules
	]
};
