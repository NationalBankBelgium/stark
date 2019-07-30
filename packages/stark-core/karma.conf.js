const helpers = require("../stark-testing/helpers");

/**
 * Load karma config from Stark
 */
const defaultKarmaConfig = require("../stark-testing/karma.conf.js").rawKarmaConfig;

// entry files of the "@nationalbankbelgium/stark-core" module imported in mock files
const karmaTypescriptFiles = [{ pattern: helpers.root("public_api.ts") }, { pattern: helpers.root("testing/**/*.ts") }];

// start customizing the Karma configuration from stark-testing
const starkCoreSpecificConfiguration = Object.assign({}, defaultKarmaConfig, {
	// add missing files due to "@nationalbankbelgium/stark-core" imports used in mock files of the testing sub-package
	files: [...defaultKarmaConfig.files, ...karmaTypescriptFiles],
	// Overwrite the karmaTypescriptConfig to pass the correct preset to karma-typescript-es6-transform
	karmaTypescriptConfig: {
		...defaultKarmaConfig.karmaTypescriptConfig,
		bundlerOptions: {
			...defaultKarmaConfig.karmaTypescriptConfig.bundlerOptions,
			transforms: [
				require("../stark-testing/node_modules/karma-typescript-angular2-transform"),
				require("../stark-testing/node_modules/karma-typescript-es6-transform")({
					presets: [helpers.root("../stark-testing/node_modules/babel-preset-env")] // add preset in a way that the package can find it
				})
			]
		}
	}
});

// export the configuration function that karma expects and simply return the stark configuration
module.exports = {
	default: function(config) {
		return config.set(starkCoreSpecificConfiguration);
	},
	karmaTypescriptFiles: karmaTypescriptFiles
};
