const helpers = require("./stark-testing/helpers");

/**
 * Load karma config from Stark
 */
const defaultKarmaConfig = require("./stark-testing/karma.conf.js").rawKarmaConfig;

// entry files of the "@nationalbankbelgium/stark-ui" module imported in mock files
const karmaTypescriptFiles = [{ pattern: helpers.root("public_api.ts") }, { pattern: helpers.root("testing/**/*.ts") }];

const karmaTypescriptBundlerAlias = {
	// adapt the resolution of the stark-core module to the UMD module
	"@nationalbankbelgium/stark-core": "../../dist/packages/stark-core/bundles/stark-core.umd.js",
	"@nationalbankbelgium/stark-core/testing": "../../dist/packages/stark-core/bundles/stark-core-testing.umd.js"
};

// start customizing the KarmaCI configuration from stark-testing
const starkPackagesSpecificConfiguration = {
	...defaultKarmaConfig,
	// add missing files due to "@nationalbankbelgium/stark-*" imports used in mock files of the testing sub-package
	files: [...defaultKarmaConfig.files, ...karmaTypescriptFiles],
	karmaTypescriptConfig: {
		...defaultKarmaConfig.karmaTypescriptConfig,
		bundlerOptions: {
			...defaultKarmaConfig.karmaTypescriptConfig.bundlerOptions,
			// change the module resolution for the KarmaTypescript bundler
			resolve: {
				alias: karmaTypescriptBundlerAlias
			}
		}
	}
};

// export the configuration function that karma expects and simply return the stark configuration
module.exports = {
	default: function (config) {
		return config.set(starkPackagesSpecificConfiguration);
	},
	karmaTypescriptBundlerAlias,
	karmaTypescriptFiles,
	rawKarmaConfig: starkPackagesSpecificConfiguration
};
