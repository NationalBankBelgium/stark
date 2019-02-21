"use strict";

const helpers = require("./helpers");
const buildUtils = require("./build-utils");
const webpackMerge = require("webpack-merge"); // used to merge webpack configs
const commonConfig = require("./webpack-partial.common.js"); // the settings that are common to prod and dev
const ngCliUtils = require("./ng-cli-utils");

const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
	ENV: "production",
	BASE_URL: ngCliUtils.getNgCliCommandOption("baseHref") || buildUtils.ANGULAR_APP_CONFIG.buildConfigurations.production.baseHref,
	HMR:
		ngCliUtils.getNgCliCommandOption("configuration") === "hmr" ||
		ngCliUtils.hasNgCliCommandOption("hmr") ||
		buildUtils.ANGULAR_APP_CONFIG.buildConfigurations.production.hmr,
	AOT: ngCliUtils.hasNgCliCommandOption("aot") || buildUtils.ANGULAR_APP_CONFIG.buildConfigurations.production.aot,
	WATCH:
		!(ngCliUtils.hasNgCliCommandOption("watch") && ngCliUtils.getNgCliCommandOption("watch") === "false") &&
		!(buildUtils.ANGULAR_APP_CONFIG.buildConfigurations.production.watch === false), // by default is true
	environment: helpers.hasProcessFlag("e2e") ? "e2e.prod" : "prod", // NG CLI command 'e2e"
	IS_DEV_SERVER: false
	// PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT  // TODO check if needed/useful in our case?
});

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
