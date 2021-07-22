const helpers = require("./stark-testing/helpers");

/**
 * Load karma config from Stark
 */
const defaultKarmaConfig = require("./stark-testing/karma.conf.js").rawKarmaConfig;

let packageDir = "/packages/";

if (helpers.currentFolder === "stark") {
	const args = process.argv.slice(2);
	for (const arg of args) {
		if (arg.match(/^stark-\w+$/)) {
			packageDir += arg;
		}
	}
} else if (helpers.currentFolder.match(/^stark-\w+$/)) {
	packageDir += helpers.currentFolder;
} else {
	console.error("No stark package defined!");
	exit(1);
}

// start customizing the KarmaCI configuration from stark-testing
const starkPackagesSpecificConfiguration = {
	...defaultKarmaConfig,
	// add missing files due to "@nationalbankbelgium/stark-*" imports used in mock files of the testing sub-package
	coverageReporter: {
		...defaultKarmaConfig.coverageReporter,
		dir:
			helpers.currentFolder === "stark"
				? helpers.root("reports/coverage" + packageDir)
				: helpers.root("../../reports/coverage" + packageDir)
	}
};

// export the configuration function that karma expects and simply return the stark configuration
module.exports = {
	default: function (config) {
		return config.set(starkPackagesSpecificConfiguration);
	},
	rawKarmaConfig: starkPackagesSpecificConfiguration
};
