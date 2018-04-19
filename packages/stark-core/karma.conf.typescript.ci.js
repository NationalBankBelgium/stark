const helpers = require("./node_modules/@nationalbankbelgium/stark-testing/helpers");

let loadedConfiguration = null;

// this object is just useful to retrieve the karma configuration object returned by our default Karma config
// we need this since the karma configuration returns a function and not an object
let configExtractor = {
	set: configuration => {
		loadedConfiguration = configuration;
	}
};

/**
 * Look in stark-testing for karma.conf.typescript.ci.js
 */
let defaultKarmaCIConfig = require("./node_modules/@nationalbankbelgium/stark-testing/karma.conf.typescript.ci.js");

// get the configuration object out
defaultKarmaCIConfig(configExtractor);

// start customizing the KarmaCI configuration from stark-testing
let starkCoreSpecificConfiguration = loadedConfiguration;

// change the path of the report so that Coveralls takes the right path to the source files
starkCoreSpecificConfiguration.coverageIstanbulReporter = Object.assign(
	starkCoreSpecificConfiguration.coverageIstanbulReporter,
	{
		dir: helpers.root("reports/coverage/packages"),
	}
);

// export the configuration function that karma expects and simply return the stark configuration
module.exports = config => {
	return config.set(starkCoreSpecificConfiguration);
};
