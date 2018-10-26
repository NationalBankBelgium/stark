/**
 * Load karma config from Stark
 */
const defaultKarmaCIConfig = require("./node_modules/@nationalbankbelgium/stark-testing/karma.conf.ci.js").rawKarmaConfig;
const karmaTypescriptBundlerAliasResolution = require("./karma.conf").karmaTypescriptBundlerAliasResolution;
const karmaTypescriptExclusions = require("./karma.conf").karmaTypescriptExclusions;

// start customizing the KarmaCI configuration from stark-testing
const starkShowcaseSpecificConfiguration = Object.assign({}, defaultKarmaCIConfig, {
	// change the module resolution for the KarmaTypescript bundler
	karmaTypescriptConfig: Object.assign(defaultKarmaCIConfig.karmaTypescriptConfig, {
		bundlerOptions: Object.assign(defaultKarmaCIConfig.karmaTypescriptConfig.bundlerOptions, karmaTypescriptBundlerAliasResolution)
	}),
	exclude: [...defaultKarmaCIConfig.exclude, ...karmaTypescriptExclusions]
});

// export the configuration function that karma expects and simply return the stark configuration
module.exports = config => {
	return config.set(starkShowcaseSpecificConfiguration);
};
