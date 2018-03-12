// Helpers
const helpers = require("./helpers");

// Karma configuration
// reference: http://karma-runner.github.io/2.0/config/configuration-file.html
module.exports = function(config) {
	config.set({
		// base path that will be used to resolve all patterns (e.g. files, exclude)
		basePath: "",

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["jasmine", "karma-typescript"],

		// list of files / patterns to load in the browser
		files: [{ pattern: helpers.root("base.spec.ts") }, { pattern: helpers.root("src/**/*.ts") }],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			"**/*.ts": ["karma-typescript", "sourcemap"]
		},

		karmaTypescriptConfig: {
			bundlerOptions: {
				entrypoints: /\.spec\.ts$/,
				exclude: [
					"coffee-script", // FIXME: https://github.com/monounity/karma-typescript/issues/209
					"saucelabs", // gives an error
					"protractor", // not needed for unit testing
					"selenium-webdriver" // not needed for unit testing
				],
				transforms: [
					require("karma-typescript-angular2-transform") // see https://github.com/monounity/karma-typescript-angular2-transform
				]
			},
			tsconfig: "tsconfig.spec.json"
		},

		// test results reporter to use
		// possible values: "dots", "progress", "spec", "junit", "mocha", "coverage" (others if you import reporters)
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		// https://www.npmjs.com/package/karma-junit-reporter
		// https://www.npmjs.com/package/karma-spec-reporter
		reporters: ["mocha", "progress", "karma-typescript"],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_WARN,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ["Chrome"],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Timeout settings
		browserNoActivityTimeout: 30000,
		browserDisconnectTolerance: 1,
		browserDisconnectTimeout: 30000
	});
};
