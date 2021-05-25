// Helpers
const helpers = require("./helpers");
const ciDetect = require("@npmcli/ci-detect");
const watch = process.argv.indexOf("--watch=false") < 0 && !ciDetect();

const rawKarmaConfig = {
	// base path that will be used to resolve all patterns (e.g. files, exclude)
	basePath: "",

	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ["jasmine", "@angular-devkit/build-angular"],

	// list of files to exclude
	exclude: [
		helpers.root("src/index.html") // not needed for unit testing
	],

	client: {
		clearContext: false // leave Jasmine Spec Runner output visible in browser
	},

	plugins: [
		// Default karma plugins configuration: require("karma-*")
		"karma-*",
		require("@angular-devkit/build-angular/plugins/karma")
	],

	// test results reporter to use
	// possible values: "dots", "progress", "spec", "junit", "mocha", "coverage" (others if you import reporters)
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	// https://www.npmjs.com/package/karma-junit-reporter
	// https://www.npmjs.com/package/karma-spec-reporter
	reporters: !!ciDetect() ? ["mocha", "progress"] : ["mocha", "progress", "kjhtml"],

	// web server port
	port: 9876,

	// enable / disable colors in the output (reporters and logs)
	colors: true,

	// level of logging
	// see: http://karma-runner.github.io/2.0/config/configuration-file.html
	// possible values:
	// 		"OFF" = config.LOG_DISABLE
	// 		"ERROR" = config.LOG_ERROR
	// 		"WARN" = config.LOG_WARN
	// 		"INFO" = config.LOG_INFO
	// 		"DEBUG" = config.LOG_DEBUG
	// raw value defined in node_modules/karma/lib/constants.js
	logLevel: "WARN",

	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,

	// start these browsers
	// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
	browsers: !!ciDetect() ? ["ChromeHeadlessNoSandbox"] : ["Chrome"],

	// Continuous Integration mode
	// if true, Karma captures browsers, runs the tests and exits
	singleRun: !watch,

	// If true, tests restart automatically if a file is changed
	restartOnFileChange: watch,

	// Timeout settings
	browserNoActivityTimeout: 30000,
	browserDisconnectTolerance: 1,
	browserDisconnectTimeout: 30000,

	// Configuration for coverage-istanbul reporter
	coverageIstanbulReporter: {
		// reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib
		reports: ["html", "lcovonly", "text-summary", "clover", "json"],

		// base output directory. If you include %browser% in the path it will be replaced with the karma browser name
		dir: helpers.root("reports/coverage"),

		// Combines coverage information from multiple browsers into one report rather than outputting a report
		// for each browser.
		combineBrowserReports: true,

		// if using webpack and pre-loaders, work around webpack breaking the source path
		fixWebpackSourcePaths: true,

		// Omit files with no statements, no functions and no branches covered from the report
		skipFilesWithNoCoverage: true,

		verbose: !!ciDetect() // output config used by istanbul for debugging
	},

	// Custom launcher configuration for ChromeHeadless (with Puppeteer)
	customLaunchers: {
		ChromeHeadlessNoSandbox: {
			base: "ChromeHeadless",
			// necessary for travis: https://github.com/puppeteer/puppeteer/blob/v7.1.0/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
			// as it runs in a container-based environment
			flags: ["--no-sandbox", "--disable-setuid-sandbox"]
		}
	}
};

module.exports = {
	// Karma configuration
	// reference: http://karma-runner.github.io/2.0/config/configuration-file.html
	default: function (config) {
		config.set(rawKarmaConfig);
	},
	rawKarmaConfig: rawKarmaConfig
};
