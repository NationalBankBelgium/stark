"use strict";

const webpackMerge = require("webpack-merge"); // used to merge webpack configs
const commonConfig = require("./webpack-partial.common.js"); // the settings that are common to prod and dev
const METADATA = require("./webpack-metadata").METADATA;

/**
 * Webpack configuration
 *
 * See: https://webpack.js.org/configuration/
 */
module.exports = webpackMerge(commonConfig(METADATA), {
	/**
	 * Stats lets you precisely control what bundle information gets displayed
	 * reference: https://webpack.js.org/configuration/stats/
	 */
	stats: {
		chunkModules: true,
		chunkOrigins: true,
		reasons: true,
		maxModules: Infinity, // examine all modules (ModuleConcatenationPlugin debugging)
		optimizationBailout: true // display bailout reasons (ModuleConcatenationPlugin debugging)
	}
});
