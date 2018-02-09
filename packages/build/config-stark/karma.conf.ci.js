"use strict";

// Helpers
const helpers = require("./helpers");

// Karma configuration
// reference: http://karma-runner.github.io/0.13/config/configuration-file.html
module.exports = (config) => {
	const testWebpackConfig = require("./webpack.test.ci.js");
	config.set({

		// base path that will be used to resolve all patterns (e.g. files, exclude)
		basePath: "",

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			"jasmine"
		],

		// list of files to exclude
		exclude: [],

		// client configuration
		client: {
			// can be used to pass arguments to tests (see spec-bundle.ts)
			args: [{
				// path to the subset of the tests to consider (used to filter the unit tests to execute (see spec-bundle.ts)
				testPath: helpers.getTestPath(process.argv)
			}],

			// other client-side config
			captureConsole: true
		},

		// list of files / patterns to load in the browser
		files: [
			{
				pattern: helpers.rootStark("config/spec-bundle.ts"),
				watched: false
			}
		],

		// list of paths mappings
		// can be used to map paths served by the Karma web server to /base/ content
		// knowing that /base corresponds to the project root folder (i.e., where this config file is located)
		proxies: {},

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			"node_modules/@nationalbankbelgium/stark/config/spec-bundle.ts": [
				"webpack",
				"sourcemap"
			]
		},

		// Webpack Config
		webpack: testWebpackConfig,

		// test coverage
		coverageIstanbulReporter: {
			dir: helpers.root("reports/coverage"),
			reports: [
				"text-summary",
				"json",
				"html",
				"lcov", // format supported by Sonar,
				"clover"
			],
			// Workaround to fix webpack source input paths on windows
			// see https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/9
			fixWebpackSourcePaths: true
		},

		// Webpack please don"t spam the console when running in karma!
		webpackServer: {
			noInfo: true
		},

		// test results reporter to use
		// possible values: "dots", "progress", "spec", "junit", "mocha", "coverage" (others if you import reporters)
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		// https://www.npmjs.com/package/karma-junit-reporter
		// https://www.npmjs.com/package/karma-spec-reporter
		reporters: [
			"mocha",
			"progress",
			"coverage-istanbul",
			"junit",
			"bamboo"
		],

		bambooReporter: {
			filename: 'reports/util.mocha.json' //optional, defaults to "mocha.json"
		},

		// Give a type to files, otherwise it will not work with Chrome > 55
		mime: {
			"text/x-typescript": ["ts", "tsx"]
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_WARN,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [
			"Chrome"
			//"Firefox",
			//"IE",
		],

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Timeout settings
		browserNoActivityTimeout: 30000,
		browserDisconnectTolerance: 1,
		browserDisconnectTimeout: 30000,

		// JUnit reporter configuration
		junitReporter: {
			outputDir: helpers.root("reports/coverage/"),
			//outputFile: "tests-unit/unit.xml",
			suite: "unit"
		}

		// How many browsers should be started simultaneously
		//concurrency: Infinity,
	});
};
