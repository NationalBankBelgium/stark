const helpers = require("./stark-testing/helpers");

/**
 * Load karma config from Stark
 */
const defaultKarmaCIConfig = require("./stark-testing/karma.conf.ci.js").rawKarmaConfig;
const { karmaTypescriptBundlerAlias, karmaTypescriptFiles } = require("./karma.conf");

const customReportsConfig = { ...defaultKarmaCIConfig.karmaTypescriptConfig.reports };

// change the path of the reports to put them all in the same parent folder
// this makes it easier to make all adaptations needed for Coveralls later on (see combine-packages-coverage.js)
for (const report of Object.keys(customReportsConfig)) {
	customReportsConfig[report].directory = helpers.root("../../reports"); // at the stark root folder
	customReportsConfig[report].subdirectory = `coverage/packages/${helpers.currentFolder}`;
}

// start customizing the KarmaCI configuration from stark-testing
const starkPackagesSpecificConfiguration = {
	...defaultKarmaCIConfig,
	// add missing files due to "@nationalbankbelgium/stark-ui" imports used in mock files of the testing sub-package
	files: [...defaultKarmaCIConfig.files, ...karmaTypescriptFiles],
	karmaTypescriptConfig: {
		...defaultKarmaCIConfig.karmaTypescriptConfig,
		bundlerOptions: {
			...defaultKarmaCIConfig.karmaTypescriptConfig.bundlerOptions,
			// change the module resolution for the KarmaTypescript bundler
			resolve: {
				alias: karmaTypescriptBundlerAlias
			},
			// Overwrite the karmaTypescriptConfig to pass the correct preset to karma-typescript-es6-transform
			transforms: [
				require(helpers.root("../stark-testing/node_modules/karma-typescript-angular2-transform")),
				require(helpers.root("../stark-testing/node_modules/karma-typescript-es6-transform"))({
					presets: [helpers.root("../stark-testing/node_modules/@babel/preset-env")] // add preset in a way that the package can find it
				})
			]
		},
		reports: customReportsConfig
	}
};

// export the configuration function that karma expects and simply return the stark configuration
module.exports = {
	default: function(config) {
		return config.set(starkPackagesSpecificConfiguration);
	},
	rawKarmaConfig: starkPackagesSpecificConfiguration
};
