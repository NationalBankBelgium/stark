const browserstack = require("browserstack-local");
const { BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY, BROWSERSTACK_LOCAL_IDENTIFIER, BROWSERSTACK_PROJECT_NAME } = process.env;
const defaultConfig = require("../node_modules/@nationalbankbelgium/stark-testing/protractor.conf.js").config;

/**
 * Specifies the different capabilities for BrowserStack.
 * Here you can configure what OS / Browser you want to run your tests on.
 * See {@link https://www.browserstack.com/automate/capabilities}
 * @type {*[]}
 */
const CAPABILITIES = [
	{
		os: "Windows",
		os_version: "10",
		browserName: "IE",
		browser_version: "11.0"
	},
	{
		os: "Windows",
		os_version: "10",
		browserName: "Edge"
	},
	{
		os: "Windows",
		os_version: "10",
		browserName: "Chrome"
	},
	{
		os: "Windows",
		os_version: "10",
		browserName: "Firefox"
	},
	{
		os: "OS X",
		os_version: "Mojave",
		browserName: "Safari"
	},
	{
		device: "iPhone X",
		os_version: "11.0",
		realMobile: "true",
		browserName: "Safari"
	},
	{
		device: "iPad Pro 12.9",
		realMobile: "true",
		os_version: "11.4",
		browserName: "Safari"
	},
	{
		device: "Google Pixel 2",
		realMobile: "true",
		os_version: "9.0",
		browserName: "Chrome"
	}
];

/**
 * The config object for protractor. @see {@link https://github.com/angular/protractor/blob/master/lib/config.ts}
 * This combines the default config from stark-build and configurations needed to run on {@link https://automate.browserstack.com}
 * @type {{[p: string]: *}}
 */
const config = {
	...defaultConfig,
	/**
	 * Overwrites baseUrl of defaultConfig.
	 * This is used as the entry point for browser.get() in the tests.
	 * http://bs-local.com:3000 maps to localhost when tests are run in BrowserStack.
	 */
	baseUrl: "http://bs-local.com:3000",

	directConnect: false,
	browserstackUser: BROWSERSTACK_USERNAME,
	browserstackKey: BROWSERSTACK_ACCESS_KEY,

	/**
	 * commonCapabilities are copied over all items in the multiCapabilities array.
	 */
	commonCapabilities: {
		"browserstack.local": "true",
		"browserstack.debug": "true",
		"browserstack.console": "errors",
		"browserstack.networkLogs": "true",
		"browserstack.localIdentifier": BROWSERSTACK_LOCAL_IDENTIFIER,

		project: BROWSERSTACK_PROJECT_NAME,
		build: BROWSERSTACK_LOCAL_IDENTIFIER
	},

	/**
	 * Specifies all the different environments in which the tests are ran.
	 */
	multiCapabilities: CAPABILITIES
};

exports.config = {
	...config,
	// Map the common capabilities to all the multi capabilities
	multiCapabilities: config.multiCapabilities.map((caps) => ({ ...config.commonCapabilities, ...caps }))
};
