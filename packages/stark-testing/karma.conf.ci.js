// Helpers
const helpers = require("./helpers");

// Puppeteer: https://github.com/GoogleChrome/puppeteer/
// takes care of download Chrome and making it available (can do much more :p)
process.env.CHROME_BIN = require("puppeteer").executablePath();

const rawKarmaConfig = {
	// base path that will be used to resolve all patterns (e.g. files, exclude)
	basePath: "",

	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ["jasmine", "karma-typescript"],

	// list of files / patterns to load in the browser
	files: [
		{ pattern: helpers.root(helpers.getAngularCliAppConfig().architect.test.options.main) },
		{ pattern: helpers.root("src/**/*.ts") },
		{ pattern: helpers.root("src/**/*.html") }
	],

	// list of files to exclude
	exclude: [
		"src/index.html" // not needed for unit testing
	],

	// preprocess matching files before serving them to the browser
	// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	preprocessors: {
		"**/*.ts": ["karma-typescript"]
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
			// don't parse "parser-typescript" to avoid "UncaughtException" in Karma server thrown by "karma-typescript-es6-transform"
			// see https://github.com/NationalBankBelgium/stark/issues/1434
			noParse: ["prettier/parser-typescript"],
			resolve: {},
			transforms: [
				//see https://github.com/monounity/karma-typescript/tree/master/packages/karma-typescript-angular2-transform
				require("karma-typescript-angular2-transform"),
				//see https://github.com/monounity/karma-typescript/tree/master/packages/karma-typescript-es6-transform
				require("karma-typescript-es6-transform")({
					presets: ["@babel/preset-env"] // default setting
				})
			]
		},
		reports: {
			"text-summary": {
				directory: helpers.root("reports"),
				subdirectory: "coverage"
			},
			json: {
				directory: helpers.root("reports"),
				subdirectory: "coverage"
			},
			html: {
				directory: helpers.root("reports"),
				subdirectory: "coverage"
			},
			// format supported by Sonar and Coveralls
			lcovonly: {
				directory: helpers.root("reports"),
				subdirectory: "coverage"
			},
			clover: {
				directory: helpers.root("reports"),
				subdirectory: "coverage"
			}
		},
		tsconfig: helpers.getAngularCliAppConfig().architect.test.options.tsConfig
	},

	// test results reporter to use
	// possible values: "dots", "progress", "spec", "junit", "mocha", "coverage" (others if you import reporters)
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	// https://www.npmjs.com/package/karma-junit-reporter
	// https://www.npmjs.com/package/karma-spec-reporter
	// IMPORTANT: using "karma-typescript" reporter as from karma-typescript 5.0.0 which now uses the latest Istanbul API
	reporters: ["mocha", "progress", "karma-typescript"],

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
	browsers: ["ChromeHeadlessNoSandbox"],

	// you can define custom flags
	customLaunchers: {
		ChromeHeadlessNoSandbox: {
			base: "ChromeHeadless",
			// necessary for travis: https://github.com/puppeteer/puppeteer/blob/v7.1.0/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
			// as it runs in a container-based environment
			flags: ["--no-sandbox", "--disable-setuid-sandbox"]
		}
	},

	// Continuous Integration mode
	// if true, Karma captures browsers, runs the tests and exits
	singleRun: true,

	// Timeout settings
	browserNoActivityTimeout: 30000,
	browserDisconnectTolerance: 1,
	browserDisconnectTimeout: 30000
};

module.exports = {
	// Karma configuration
	// reference: http://karma-runner.github.io/2.0/config/configuration-file.html
	default: function(config) {
		// Interesting idea to avoid having multiple config files
		// if (process.env.TRAVIS || process.env.CIRCLECI) {
		// 	config.browsers = ['ChromeHeadlessNoSandbox'];
		// 	config.singleRun = true;
		// }

		config.set(rawKarmaConfig);
	},
	rawKarmaConfig: rawKarmaConfig
};
