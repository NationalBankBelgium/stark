"use strict";

// Helpers
const helpers = require("./helpers");

let loadedConfiguration = null;

// this object is just useful to retrieve the karma configuration object returned by our default Karma config
// we need this since the karma configuration returns a function and not
let configExtractor = {
	set: (configuration) => {
		loadedConfiguration = configuration;
	}
};

// load our default karma configuration
let defaultKarmaConfig = require("./karma.conf.js");

// get the configuration object out
defaultKarmaConfig(configExtractor);

// start customizing the configuration for stark
let starkSpecificConfiguration = loadedConfiguration;

// the spec-bundle.ts file is in a different location in stark
starkSpecificConfiguration.files = [
	{
		pattern: helpers.root("config/spec-bundle-stark.ts"),
		watched: false,
	},
	// paths to support debugging with source maps in dev tools
	{
		pattern: helpers.root("src/**/*.ts"),
		included: false,
		watched: false,
	},
];

// the spec-bundle.ts file is in a different location in stark
starkSpecificConfiguration.preprocessors = {
	"config/spec-bundle-stark.ts": [
		"webpack",
		"sourcemap",

	]
};

// export the configuration function that karma expects and simply return the stark configuration
module.exports = (config) => {
	return config.set(starkSpecificConfiguration);
};
