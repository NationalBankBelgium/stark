const helpers = require("./helpers");
const ngCliUtils = require("./ng-cli-utils");

const angularCliAppConfig = ngCliUtils.getAngularCliAppConfig(helpers.root("angular.json"));

// default values for baseHref and deployUrl are taken from
// node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/styles.js
const ANGULAR_APP_CONFIG = {
	config: angularCliAppConfig,
	deployUrl: angularCliAppConfig.architect.build.options.deployUrl || "",
	baseHref: angularCliAppConfig.architect.build.options.baseHref || "",
	sourceRoot: angularCliAppConfig.sourceRoot,
	outputPath: angularCliAppConfig.architect.build.options.outputPath,
	buildOptions: angularCliAppConfig.architect.build.options || {},
	buildConfigurations: angularCliAppConfig.architect.build.configurations || {},
	serveOptions: angularCliAppConfig.architect.serve.options || {},
	serveConfigurations: angularCliAppConfig.architect.serve.configurations || {}
};

/**
 * Based on "angular.json" file, gets the value for the `property` in specified `environment` in build configuration.
 * If there is no definition in the `environment`, fallback gets default value in build configuration.
 *
 * @param {string} property The property name
 * @param {string} environment The environment (usually "production" or "development")
 * @returns {*} Returns the value related to the property
 */
function getAngularWorkspaceBuildProperty(property, environment) {
	if (
		typeof ANGULAR_APP_CONFIG.buildConfigurations[environment] !== "undefined" &&
		typeof ANGULAR_APP_CONFIG.buildConfigurations[environment][property] !== "undefined"
	) {
		return ANGULAR_APP_CONFIG.buildConfigurations[environment][property];
	} else {
		return ANGULAR_APP_CONFIG.buildOptions[property];
	}
}

/**
 * Based on "angular.json" file, gets the value for the `property` in specified `environment` in serve configuration.
 * If there is no definition in the `environment`, fallback gets default value in serve configuration.
 *
 * @param {string} property The property name
 * @param {string} environment The environment (usually "production" or "development")
 * @returns {*} Returns the value related to the property
 */
function getAngularWorkspaceServeProperty(property, environment) {
	if (
		typeof ANGULAR_APP_CONFIG.serveConfigurations[environment] !== "undefined" &&
		typeof ANGULAR_APP_CONFIG.serveConfigurations[environment][property] !== "undefined"
	) {
		return ANGULAR_APP_CONFIG.serveConfigurations[environment][property];
	} else {
		return ANGULAR_APP_CONFIG.serveOptions[property];
	}
}

exports.ANGULAR_APP_CONFIG = ANGULAR_APP_CONFIG;
exports.getAngularWorkspaceBuildProperty = getAngularWorkspaceBuildProperty;
exports.getAngularWorkspaceServeProperty = getAngularWorkspaceServeProperty;
