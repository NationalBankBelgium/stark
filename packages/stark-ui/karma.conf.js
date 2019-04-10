const helpers = require("../stark-testing/helpers");

/**
 * Load karma config from Stark
 */
const defaultKarmaConfig = require("../stark-testing/karma.conf.js").rawKarmaConfig;

// entry files of the "@nationalbankbelgium/stark-ui" module imported in mock files
const karmaTypescriptFiles = [{ pattern: helpers.root("index.ts") }, { pattern: helpers.root("public_api.ts") }];

const karmaTypescriptBundlerAlias = {
	// adapt the resolution of the stark-core module to the UMD module
	"@nationalbankbelgium/stark-core": "../../dist/packages-dist/stark-core/bundles/stark-core.umd.js",
	"@nationalbankbelgium/stark-core/testing": "../../dist/packages-dist/stark-core/bundles/stark-core-testing.umd.js",
	// adapt the resolution of the 3rd party modules used in stark-core
	"@angularclass/hmr": "../stark-core/node_modules/@angularclass/hmr/dist/index.js",
	"@ng-idle/core": "../stark-core/node_modules/@ng-idle/core/bundles/core.umd.js",
	"@ng-idle/keepalive": "../stark-core/node_modules/@ng-idle/keepalive/bundles/keepalive.umd.js",
	"@ngrx/store": "../stark-core/node_modules/@ngrx/store/bundles/store.umd.js",
	"@ngrx/effects": "../stark-core/node_modules/@ngrx/effects/bundles/effects.umd.js",
	"@ngx-translate/core": "../stark-core/node_modules/@ngx-translate/core/bundles/ngx-translate-core.umd.js",
	"@uirouter/angular": "../stark-core/node_modules/@uirouter/angular/_bundles/ui-router-ng2.js",
	"@uirouter/core": "../stark-core/node_modules/@uirouter/core/lib/index.js",
	"@uirouter/rx": "../stark-core/node_modules/@uirouter/rx/lib/index.js",
	cerialize: "../stark-core/node_modules/cerialize/index.js",
	"class-validator": "../stark-core/node_modules/class-validator/index.js",
	"deep-freeze-strict": "../stark-core/node_modules/deep-freeze-strict/index.js",
	moment: "../stark-core/node_modules/moment/moment.js",
	"lodash-es": "../stark-core/node_modules/lodash-es/lodash.js",
	"lodash-es/cloneDeep": "../stark-core/node_modules/lodash-es/cloneDeep.js",
	"lodash-es/find": "../stark-core/node_modules/lodash-es/find.js",
	"lodash-es/findIndex": "../stark-core/node_modules/lodash-es/findIndex.js",
	"lodash-es/floor": "../stark-core/node_modules/lodash-es/floor.js",
	"lodash-es/get": "../stark-core/node_modules/lodash-es/get.js",
	"lodash-es/isEmpty": "../stark-core/node_modules/lodash-es/isEmpty.js",
	"lodash-es/isEqual": "../stark-core/node_modules/lodash-es/isEqual.js",
	"lodash-es/merge": "../stark-core/node_modules/lodash-es/merge.js",
	"lodash-es/noop": "../stark-core/node_modules/lodash-es/noop.js",
	"lodash-es/sortBy": "../stark-core/node_modules/lodash-es/sortBy.js",
	"lodash-es/reduce": "../stark-core/node_modules/lodash-es/reduce.js",
	"lodash-es/startCase": "../stark-core/node_modules/lodash-es/startCase.js",
	"lodash-es/uniqueId": "../stark-core/node_modules/lodash-es/uniqueId.js",
	ibantools: "../stark-core/node_modules/ibantools/build/ibantools.js"
};

// start customizing the KarmaCI configuration from stark-testing
const starkUiSpecificConfiguration = Object.assign({}, defaultKarmaConfig, {
	// change the module resolution for the KarmaTypescript bundler
	karmaTypescriptConfig: {
		...defaultKarmaConfig.karmaTypescriptConfig,
		bundlerOptions: {
			...defaultKarmaConfig.karmaTypescriptConfig.bundlerOptions,
			resolve: {
				alias: karmaTypescriptBundlerAlias
			},
			transforms: [
				require("../stark-testing/node_modules/karma-typescript-angular2-transform"),
				require("../stark-testing/node_modules/karma-typescript-es6-transform")({
					presets: [helpers.root("../stark-testing/node_modules/babel-preset-env")] // add preset in a way that the package can find it
				})
			]
		}
	},
	// add missing files due to "@nationalbankbelgium/stark-ui" imports used in mock files of the testing sub-package
	files: [...defaultKarmaConfig.files, ...karmaTypescriptFiles]
});

// export the configuration function that karma expects and simply return the stark configuration
module.exports = {
	default: function(config) {
		return config.set(starkUiSpecificConfiguration);
	},
	karmaTypescriptBundlerAlias,
	karmaTypescriptFiles: karmaTypescriptFiles
};
