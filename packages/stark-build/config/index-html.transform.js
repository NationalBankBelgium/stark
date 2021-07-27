const helpers = require("./helpers");
const fs = require("fs");
const commonData = require("./common-data.js"); // common configuration between environments
const HtmlHeadElements = require("./html-head-elements");
const METADATA = require("./webpack-metadata").METADATA;

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
	const regex = /(?:<|&lt;)%=\s+starkOptions\.(starkAppMetadata|starkAppConfig|metadata)\.(\w+)\s+%(?:>|&gt;)/g;

	const getRealValue = (placeholder, ...args) => {
		const configName = args[0];
		const property = args[1];

		let value;

		if (configName === "metadata") {
			value = METADATA[property];
		} else {
			value = commonData[configName][property];
		}

		if (value) {
			return value;
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
