"use strict";

const commonData = require("../rollup.config.common-data.js"); // common configuration between environments

const globals = Object.assign(
	{},
	commonData.output.globals,
	{
		"@ngrx/store": "@ngrx/store",
		moment: "moment",
		uuid: "uuid"
	}
);

const external = Object.keys(globals);

module.exports = {
	input: "../../dist/packages-dist/stark-core/fesm5/stark-core.js",
	external: external,
	plugins: commonData.plugins,
	output: [
		{
			file: "../../dist/packages-dist/stark-core/bundles/stark-core.umd.js",
			globals: globals,
			format: commonData.output.format,
			exports: commonData.output.exports,
			name: "stark.core",
			sourcemap: commonData.output.sourcemap,
			amd: {
				id: "@nationalbankbelgium/stark-core"
			}
		}
	]
};
