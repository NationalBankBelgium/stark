const helpers = require("../stark-testing/helpers");

/**
 * Load karma config from Stark
 */
const defaultKarmaCIConfig = require("../stark-testing/karma.conf.ci.js").rawKarmaConfig;
const karmaTypescriptBundlerAliasResolution = require("./karma.conf").karmaTypescriptBundlerAliasResolution;
const karmaTypescriptFiles = require("./karma.conf").karmaTypescriptFiles;

// start customizing the KarmaCI configuration from stark-testing
const starkRBACSpecificConfiguration = {
	...defaultKarmaCIConfig,
	// change the module resolution for the KarmaTypescript bundler
	karmaTypescriptConfig: {
		...defaultKarmaCIConfig.karmaTypescriptConfig,
		bundlerOptions: {
			...defaultKarmaCIConfig.karmaTypescriptConfig.bundlerOptions,
			...karmaTypescriptBundlerAliasResolution,
			transforms: [
				require("../stark-testing/node_modules/karma-typescript-angular2-transform"),
				require("../stark-testing/node_modules/karma-typescript-es6-transform")({
					presets: [helpers.root("../stark-testing/node_modules/babel-preset-env")] // add preset in a way that the package can find it
				})
			]
		}
	},
	// change the path of the report so that Coveralls takes the right path to the source files
	coverageIstanbulReporter: { ...defaultKarmaCIConfig.coverageIstanbulReporter, dir: helpers.root("reports/coverage/packages") },
	// add missing files due to "@nationalbankbelgium/stark-rbac" imports used in mock files of the testing sub-package
	files: [...defaultKarmaCIConfig.files, ...karmaTypescriptFiles]
};

// export the configuration function that karma expects and simply return the stark configuration
module.exports = config => {
	return config.set(starkRBACSpecificConfiguration);
};
