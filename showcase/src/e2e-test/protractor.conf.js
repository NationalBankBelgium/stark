const browserstack = require("browserstack-local");
const { BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY, TRAVIS_BUILD_NUMBER } = process.env;

/**
 * Code to start BrowserStack local before start of test
 */
const beforeLaunch = () => {
	console.log("Connection to BrowserStack local");
	return new Promise(function(resolve, reject) {
		exports.bs_local = new browserstack.Local();

		exports.bs_local.start({ key: BROWSERSTACK_ACCESS_KEY }, function(error) {
			if (error) return reject(error);

			console.log("BrowserStack local connected. Now testing...");
			resolve();
		});
	});
};

/**
 * Code to stop BrowserStack local after end of test
 */
const afterLaunch = () => {
	return new Promise(function(resolve) {
		exports.bs_local.stop(resolve);
		console.log("More info and videos available at https://automate.browserstack.com");
	});
};

/**
 * @see {@link https://github.com/angular/protractor/blob/master/lib/config.ts}
 */
const config = {
	seleniumAddress: "http://hub-cloud.browserstack.com/wd/hub",

	commonCapabilities: {
		"browserstack.user": BROWSERSTACK_USERNAME || "BROWSERSTACK_USERNAME",
		"browserstack.key": BROWSERSTACK_ACCESS_KEY || "BROWSERSTACK_ACCESS_KEY",
		"browserstack.local": true,
		"browserstack.networkLogs": true,
		"browserstack.console": "errors",

		project: "stark",
		build: TRAVIS_BUILD_NUMBER || "local"
	},

	multiCapabilities: [
		{
			os: "Windows",
			os_version: "10",
			browserName: "IE",
			browser_version: "11.0"
		},
		{
			os: "Windows",
			os_version: "10",
			browserName: "Edge",
			browser_version: "17.0"
		},
		{
			os: "OS X",
			os_version: "Mojave",
			browserName: "Safari",
			browser_version: "12.0"
		},
		{
			device: "iPhone X",
			realMobile: "true",
			os_version: "11.0",
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
	],

	framework: "jasmine",
	specs: "./**/*.spec.js",

	beforeLaunch,
	afterLaunch
};

exports.config = {
	...config,
	// Map the common capabilities (the BrowserStack defaults) to all the multi capabilities
	multiCapabilities: config.multiCapabilities.map(caps => ({ ...config.commonCapabilities, ...caps }))
};
