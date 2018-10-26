/**
 * Load karma config from Stark
 */
const helpers = require("./node_modules/@nationalbankbelgium/stark-testing/helpers");

/**
 * Load karma config from Stark
 */
const defaultKarmaConfig = require("./node_modules/@nationalbankbelgium/stark-testing/karma.conf.js").rawKarmaConfig;

// exclude all code example files imported in the demo pages
const karmaTypescriptExclusions = [...defaultKarmaConfig.exclude, "src/assets/examples/**"];

const karmaTypescriptBundlerAliasResolution = {
	resolve: {
		alias: {
			// adapt the resolution of "angular-in-memory-web-api" modules because we don't want to add "@angular/http" to the Showcase npm dependencies!
			// see https://github.com/angular/in-memory-web-api/issues/215
			"angular-in-memory-web-api/http-client-in-memory-web-api.module":
				"./node_modules/angular-in-memory-web-api/bundles/in-memory-web-api.umd.js",
			"angular-in-memory-web-api/interfaces": "./node_modules/angular-in-memory-web-api/bundles/in-memory-web-api.umd.js",
			"@angular/http": "./node_modules/@angular/common/bundles/common-http.umd.js"
		}
	}
};

// start customizing the KarmaCI configuration from stark-testing
const starkShowcaseSpecificConfiguration = Object.assign({}, defaultKarmaConfig, {
	// change the module resolution for the KarmaTypescript bundler
	karmaTypescriptConfig: Object.assign(defaultKarmaConfig.karmaTypescriptConfig, {
		bundlerOptions: Object.assign(defaultKarmaConfig.karmaTypescriptConfig.bundlerOptions, karmaTypescriptBundlerAliasResolution)
	}),
	// list of files to exclude
	exclude: karmaTypescriptExclusions
});

// export the configuration function that karma expects and simply return the stark configuration
module.exports = {
	default: function(config) {
		return config.set(starkShowcaseSpecificConfiguration);
	},
	karmaTypescriptBundlerAliasResolution: karmaTypescriptBundlerAliasResolution,
	karmaTypescriptExclusions: karmaTypescriptExclusions
};
