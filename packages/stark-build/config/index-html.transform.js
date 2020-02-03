const helpers = require("./helpers");
const fs = require("fs");
const commonData = require("./webpack.common-data.js"); // common configuration between environments
const HtmlHeadElements = require("./html-head-elements");
const ngCliUtils = require("./ng-cli-utils");
const buildUtils = require("./build-utils");

const isProd = ngCliUtils.getNgCliCommandOption("prod");
const isHMR =
	ngCliUtils.getNgCliCommandOption("configuration") === "hmr" ||
	ngCliUtils.hasNgCliCommandOption("hmr") ||
	buildUtils.ANGULAR_APP_CONFIG.buildOptions.hmr;

const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
	ENV: isProd ? "production" : "development",
	BASE_URL: ngCliUtils.getNgCliCommandOption("baseHref") || buildUtils.ANGULAR_APP_CONFIG.buildOptions.baseHref,
	HMR: isHMR,
	AOT: ngCliUtils.hasNgCliCommandOption("aot") || buildUtils.ANGULAR_APP_CONFIG.buildOptions.aot,
	WATCH:
		!(ngCliUtils.hasNgCliCommandOption("watch") && ngCliUtils.getNgCliCommandOption("watch") === "false") &&
		!(buildUtils.ANGULAR_APP_CONFIG.buildOptions.watch === false), // by default is true
	environment: isHMR ? "hmr" : "dev",
	IS_DEV_SERVER: helpers.hasProcessFlag("serve") && !isProd // NG CLI command 'serve"
	// PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT  // TODO check if needed/useful in our case?
});

/**
 * Check if one or more placeholders are present in the generated "index.html" and replace them
 * with the associated value if exists in "starkAppMetadata", "starkAppConfig" or "metatada"
 *
 * The placeholder should be like this:
```html
<%= starkOptions.starkAppMetadata.name %>
<!-- or -->
<%= starkOptions.starkAppConfig.defaultLanguage %>
<!-- or -->
<%= starkOptions.metadata.TITLE %>
```
 *
 * @param indexHtml
 * @returns {string}
 */
function replacePlaceholdersByValues(indexHtml) {
	const regex = /<%=\sstarkOptions\.(starkAppMetadata|starkAppConfig|metadata)\.\w+\s%>/g;

	const getRealValue = placeholder => {
		const str = placeholder.slice(4, -3).split(".");
		if (str.length === 3) {
			const configName = str[1];
			const property = str[2];

			let value;

			if (configName === "metadata") {
				value = METADATA[property];
			} else {
				value = commonData[configName][property];
			}

			if (value) {
				return value;
			}
		}

		return placeholder;
	};

	return indexHtml.replace(regex, getRealValue);
}

module.exports = (targetOptions, indexHtml) => {
	let indexHtmlToReturn = indexHtml;

	/**
	 * Generate html tags based on javascript maps.
	 *
	 * If a publicPath is set in the webpack output configuration, it will be automatically added to
	 * href attributes, you can disable that by adding a "=href": false property.
	 * You can also enable it to other attribute by settings "=attName": true.
	 *
	 * The configuration supplied is map between a location (key) and an element definition object
	 */
	if (fs.existsSync(helpers.root("config/index-head-config.js"))) {
		const i = indexHtml.indexOf("</head>");
		indexHtmlToReturn = `${indexHtml.slice(0, i)}
	    ${HtmlHeadElements.getHtmlElementString(require(helpers.root("config/index-head-config")), METADATA.BASE_URL)}
	    ${indexHtml.slice(i)}`;
	}

	return replacePlaceholdersByValues(indexHtmlToReturn);
};
