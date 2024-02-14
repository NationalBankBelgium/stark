const helpers = require("./helpers");
const ngCliUtils = require("./ng-cli-utils");

class StarkBuildUtils {
	angularCliAppConfig;
	ANGULAR_APP_CONFIG;

	constructor(projectId) {
		this.angularCliAppConfig = ngCliUtils.getAngularCliAppConfig(helpers.root("angular.json"), projectId);

		// default values for baseHref and deployUrl are taken from
		// node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/styles.js
		this.ANGULAR_APP_CONFIG = {
			config: this.angularCliAppConfig,
			deployUrl: this.angularCliAppConfig.architect.build.options.deployUrl || "",
			baseHref: this.angularCliAppConfig.architect.build.options.baseHref || "",
			sourceRoot: this.angularCliAppConfig.sourceRoot,
			outputPath: this.angularCliAppConfig.architect.build.options.outputPath,
			buildOptions: this.angularCliAppConfig.architect.build.options || {},
			buildConfigurations: this.angularCliAppConfig.architect.build.configurations || {},
			serveOptions: this.angularCliAppConfig.architect.serve.options || {},
			serveConfigurations: this.angularCliAppConfig.architect.serve.configurations || {}
		};
	}

	/**
	 * Based on "angular.json" file, gets the value for the `property` in specified `environment` in build configuration.
	 * If there is no definition in the `environment`, fallback gets default value in build configuration.
	 *
	 * @param {string} property The property name
	 * @param {string} environment The environment (usually "production" or "development")
	 * @returns {*} Returns the value related to the property
	 */
	getAngularWorkspaceBuildProperty(property, environment) {
		if (
			typeof this.ANGULAR_APP_CONFIG.buildConfigurations[environment] !== "undefined" &&
			typeof this.ANGULAR_APP_CONFIG.buildConfigurations[environment][property] !== "undefined"
		) {
			return this.ANGULAR_APP_CONFIG.buildConfigurations[environment][property];
		} else {
			return this.ANGULAR_APP_CONFIG.buildOptions[property];
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
	getAngularWorkspaceServeProperty(property, environment) {
		if (
			typeof this.ANGULAR_APP_CONFIG.serveConfigurations[environment] !== "undefined" &&
			typeof this.ANGULAR_APP_CONFIG.serveConfigurations[environment][property] !== "undefined"
		) {
			return this.ANGULAR_APP_CONFIG.serveConfigurations[environment][property];
		} else {
			return this.ANGULAR_APP_CONFIG.serveOptions[property];
		}
	}
}

exports.StarkBuildUtils = StarkBuildUtils;
