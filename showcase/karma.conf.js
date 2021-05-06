/**
 * Load karma config from Stark
 */
const helpers = require("./node_modules/@nationalbankbelgium/stark-testing/helpers");

/**
 * Load karma config from Stark
 */
const defaultKarmaConfig = require("./node_modules/@nationalbankbelgium/stark-testing/karma.conf.js").rawKarmaConfig;

// start customizing the KarmaCI configuration from stark-testing
const starkShowcaseSpecificConfiguration = Object.assign({}, defaultKarmaConfig, {
	// list of files to exclude
	// exclude all code example files imported in the demo pages
	exclude: [...defaultKarmaConfig.exclude, "src/assets/examples/**"]
});

// export the configuration function that karma expects and simply return the stark configuration
module.exports = {
	default: function (config) {
		return config.set(starkShowcaseSpecificConfiguration);
	}
};
