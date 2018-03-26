// Helpers
const helpers = require("./helpers");

module.exports = function(config) {
	const testWebpackConfig = require("./webpack.test.js")();

	const configuration = {
		/**
		 * Base path that will be used to resolve all patterns (e.g. files, exclude).
		 */
		basePath: "",

		/**
		 * Frameworks to use
		 *
		 * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		 */
		frameworks: ["jasmine"],

		/**
		 * List of files to exclude.
		 */
		exclude: [],

		// client configuration
		client: {
			// can be used to pass arguments to tests (see spec-bundle.ts)
			args: [
				{
					// path to the subset of the tests to consider (used to filter the unit tests to execute (see spec-bundle.ts)
					testPath: helpers.getTestPath(process.argv)
				}
			],

			// other client-side config
			captureConsole: true
		},

		/**
		 * List of files / patterns to load in the browser
		 *
		 * we are building the test environment in ./spec-bundle.js
		 */
		files: [
			{
				pattern: helpers.rootStark("./config/spec-bundle.js"),
				watched: false
			},
			// paths to support debugging with source maps in dev tools
			{
				pattern: "./src/assets/**/*",
				watched: false,
				included: false,
				served: true,
				nocache: false
			}
		],

		/**
		 * By default all assets are served at http://localhost:[PORT]/base/
		 * can be used to map paths served by the Karma web server to /base/ content
		 * knowing that /base corresponds to the project root folder (i.e., where this config file is located)
		 */
		proxies: {
			"/assets/": "/base/src/assets/"
		},

		/**
		 * Preprocess matching files before serving them to the browser
		 * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		 */
		// TODO Change this absolute path to a relative one (with helpers ?)
		preprocessors: {
			"./node_modules/@nationalbankbelgium/stark-build/config/spec-bundle.js": ["coverage", "webpack", "sourcemap"]
		},

		/**
		 * Webpack Config at ./webpack.test.js
		 */
		webpack: testWebpackConfig,

		coverageReporter: {
			type: "in-memory"
		},

		remapCoverageReporter: {
			"text-summary": null,
			json: "./reports/coverage/coverage.json",
			html: "./reports/coverage/html"
		},

		/**
		 * Webpack please don't spam the console when running in karma!
		 */
		webpackMiddleware: {
			/**
			 * webpack-dev-middleware configuration
			 * i.e.
			 */
			noInfo: true,
			/**
			 * and use stats to turn off verbose output
			 */
			stats: {
				/**
				 * options i.e.
				 */
				chunks: false
			}
		},

		/**
		 * Test results reporter to use
		 *
		 * possible values: 'dots', 'progress'
		 * available reporters: https://npmjs.org/browse/keyword/karma-reporter
		 */
		reporters: ["mocha", "coverage", "progress", "remap-coverage"],

		// Give a type to files, otherwise it will not work with Chrome > 55
		mime: {
			"text/x-typescript": ["ts", "tsx"]
		},

		/**
		 * Web server port.
		 */
		port: 9876,

		/**
		 * enable / disable colors in the output (reporters and logs)
		 */
		colors: true,

		/**
		 * Level of logging
		 * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		 */
		logLevel: config.LOG_WARN,

		/**
		 * enable / disable watching file and executing tests whenever any file changes
		 */
		autoWatch: true,

		/**
		 * start these browsers
		 * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		 */
		browsers: [
			"Chrome"
			//"Firefox",
			//"IE",
		],

		customLaunchers: {
			ChromeTravisCi: {
				base: "Chrome",
				flags: ["--no-sandbox"]
			}
		},

		/**
		 * Continuous Integration mode
		 * if true, Karma captures browsers, runs the tests and exits
		 */
		singleRun: false,

		// Timeout settings
		browserNoActivityTimeout: 30000,
		browserDisconnectTolerance: 1,
		browserDisconnectTimeout: 30000
	};

	if (process.env.TRAVIS) {
		configuration.browsers = ["ChromeTravisCi"];
	}

	config.set(configuration);
};
