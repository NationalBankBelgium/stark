"use strict";

const commonData = require("../rollup.config.common-data.js"); // common configuration between environments

module.exports = {
	input: "../../dist/packages-dist/stark-rbac/fesm5/stark-rbac.js",
	external: commonData.external,
	plugins: commonData.plugins,
	output: [
		{
			file: "../../dist/packages-dist/stark-rbac/bundles/stark-rbac.umd.js",
			globals: commonData.output.globals,
			format: commonData.output.format,
			exports: commonData.output.exports,
			name: "stark.rbac",
			sourcemap: commonData.output.sourcemap,
			amd: {
				id: "@nationalbankbelgium/stark-rbac"
			}
		}
	]
};
