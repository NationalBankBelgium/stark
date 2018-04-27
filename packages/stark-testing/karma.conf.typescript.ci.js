// Helpers
const helpers = require("./helpers");
const istanbulLibInstrument = require("istanbul-lib-instrument");
const convert = require("convert-source-map");

// Puppeteer: https://github.com/GoogleChrome/puppeteer/
// takes care of download Chrome and making it available (can do much more :p)
process.env.CHROME_BIN = require("puppeteer").executablePath();

// IMPORTANT: use a custom instrumenter which uses the latest Istanbul (1.x  => istanbul-lib-instrument)
// This mimics the same functionality provided by the istanbul-instrumenter-loader for Webpack
// see: https://github.com/webpack-contrib/istanbul-instrumenter-loader/blob/master/src/index.js
const IstanbulInstrumenter = (function() {
	function IstanbulInstrumenter(options) {
		this.instrumenter = istanbulLibInstrument.createInstrumenter(options);
	}

	// custom instrumentation logic (finds the sourcemap in the source file if not found yet)
	IstanbulInstrumenter.prototype.instrument = function(code, filename, callback, inputSourceMap) {
		const instrumenter = this.instrumenter;
		let srcMap = inputSourceMap;
		// use inline source map, if any
		if (!srcMap) {
			const inlineSourceMap = convert.fromSource(code);
			if (inlineSourceMap) {
				srcMap = inlineSourceMap.sourcemap;
			}
		}

		return this.instrumenter.instrument(
			code,
			filename,
			function(error, instrumentedSource) {
				callback(error, instrumentedSource, instrumenter.lastSourceMap());
			},
			srcMap
		);
	};
	IstanbulInstrumenter.prototype.lastSourceMap = function() {
		return this.instrumenter.lastSourceMap();
	};
	IstanbulInstrumenter.prototype.lastFileCoverage = function() {
		return this.instrumenter.lastFileCoverage();
	};

	return IstanbulInstrumenter;
})();

// Karma configuration
// reference: http://karma-runner.github.io/2.0/config/configuration-file.html
module.exports = function(config) {
	const configuration = {
		// base path that will be used to resolve all patterns (e.g. files, exclude)
		basePath: "",

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["jasmine", "karma-typescript"],

		// list of files / patterns to load in the browser
		files: [
			{ pattern: helpers.root(helpers.getAngularCliAppConfig().test) },
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
			"**/*.ts": ["karma-typescript", "sourcemap", "coverage"]
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
			tsconfig: helpers.getAngularCliAppConfig().testTsconfig
		},

		// IMPORTANT: define the custom instrumenter here to support the latest Istanbul API
		// see: https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md
		coverageReporter: {
			type: "in-memory",
			instrumenters: {
				istanbulV1: {
					Instrumenter: IstanbulInstrumenter
				}
			},
			instrumenter: {
				"**/*.ts": "istanbulV1"
			},
			instrumenterOptions: {
				istanbulV1: {
					// options for the istanbul instrumenter here
				}
			}
		},

		coverageIstanbulReporter: {
			dir: helpers.root("reports/coverage"),
			reports: [
				"text-summary",
				"json",
				"html",
				"lcov", // format supported by Sonar and Coveralls
				"clover"
			]
		},

		// test results reporter to use
		// possible values: "dots", "progress", "spec", "junit", "mocha", "coverage" (others if you import reporters)
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		// https://www.npmjs.com/package/karma-junit-reporter
		// https://www.npmjs.com/package/karma-spec-reporter
		// IMPORTANT: "karma-typescript" reporter should not be included here because it uses the old Istanbul (0.x)
		// which throws an error when generating lcov reports for Coveralls
		reporters: ["mocha", "progress", "coverage", "coverage-istanbul"],

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
		browsers: ["ChromeHeadlessNoSandbox"],

		// you can define custom flags
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: "ChromeHeadless",
				// necessary for travis: https://chromium.googlesource.com/chromium/src/+/master/docs/linux_suid_sandbox_development.md
				// as it runs in a container-based environment
				flags: ["--no-sandbox"]
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

	// Interesting idea to avoid having multiple config files
	// if (process.env.TRAVIS || process.env.CIRCLECI) {
	// 	config.browsers = ['ChromeHeadlessNoSandbox'];
	// 	config.singleRun = true;
	// }

	config.set(configuration);
};
