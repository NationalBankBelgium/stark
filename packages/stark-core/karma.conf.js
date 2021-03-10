const helpers = require("../stark-testing/helpers");

/**
 * Load packages karma config
 */
const rawKarmaConfig = require("../karma.conf.js").rawKarmaConfig;

// export the configuration function that karma expects and simply return the stark configuration
module.exports = (config) => {
	return config.set(rawKarmaConfig);
};
