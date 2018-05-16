const helpers = require("./node_modules/@nationalbankbelgium/stark-testing/helpers");

/**
 * Look in stark-testing for karma.conf.typescript.ci.js
 */
const defaultKarmaCIConfig = require("./node_modules/@nationalbankbelgium/stark-testing/karma.conf.typescript.ci.js").rawKarmaConfig;

// start customizing the KarmaCI configuration from stark-testing
const starkCoreSpecificConfiguration = Object.assign({}, defaultKarmaCIConfig, {
	// change the path of the report so that Coveralls takes the right path to the source files
	coverageIstanbulReporter: Object.assign(defaultKarmaCIConfig.coverageIstanbulReporter, {
		dir: helpers.root("reports/coverage/packages")
	})
});

// export the configuration function that karma expects and simply return the stark configuration
module.exports = config => {
	return config.set(starkCoreSpecificConfiguration);
};
