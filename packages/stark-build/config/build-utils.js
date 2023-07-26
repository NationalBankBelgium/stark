const ts = require("typescript");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");

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

function supportES2015(tsConfigPath) {
	if (!supportES2015.hasOwnProperty("supportES2015")) {
		const tsTarget = readTsConfig(tsConfigPath).options.target;
		supportES2015["supportES2015"] = tsTarget !== ts.ScriptTarget.ES3 && tsTarget !== ts.ScriptTarget.ES5;
	}
	return supportES2015["supportES2015"];
}

function readTsConfig(tsConfigPath) {
	const configResult = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
	return ts.parseJsonConfigFileContent(configResult.config, ts.sys, path.dirname(tsConfigPath), undefined, tsConfigPath);
}

/**
 * Read the content of angular.json to get the path of the environment file.
 * It returns the path of the replacement file defined in "fileReplacements" of the environment or the default file
 * in case the replacement file does not exist.
 *
 * See: https://github.com/angular/angular-cli/wiki/angular-workspace
 *
 * @param environment
 * @returns {string} - The path of the environment file of the given environment.
 */
function getEnvironmentFile(environment) {
	if (typeof environment === "string") {
		let fileName = helpers.root("src/environments/environment.ts");
		let fileNameAlt;

		// the production config is under "production" section instead of "prod" in angular.json
		// see https://github.com/angular/angular-cli/wiki/stories-application-environments
		if (environment === "prod") {
			environment = "production";
		}

		let angularCliEnvConfig = ANGULAR_APP_CONFIG.config.architect.build.configurations[environment];

		if (angularCliEnvConfig && angularCliEnvConfig.fileReplacements instanceof Array) {
			for (let fileReplacement of angularCliEnvConfig.fileReplacements) {
				if (fileReplacement.replace.match(/environment/)) {
					fileName = helpers.root(angularCliEnvConfig.fileReplacements[0].with);
					fileNameAlt = helpers.root(angularCliEnvConfig.fileReplacements[0].replace);
				}
			}
		} else {
			// for "dev" environment the default environment.ts file is used
			if (environment !== "dev") {
				throw new Error(
					`Configuration for '${environment}' not found in angular.json or it contains invalid fileReplacements section.`
				);
			}
		}

		if (fs.existsSync(fileName)) {
			return fileName;
		} else if (fs.existsSync(fileNameAlt)) {
			console.warn(`Could not find environment file for '${environment}', loading default environment file`);
			return fileNameAlt;
		} else {
			throw new Error("Environment file not found.");
		}
	}
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @param {Object} obj The object to query.
 * @param {string|Array} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 */
function get(obj, path, defaultValue) {
	let args;
	if (typeof path === "string") {
		args = path.split(".");
	} else {
		args = path;
	}

	for (let i = 0; i < args.length; i++) {
		if (!obj || !obj.hasOwnProperty(args[i])) {
			return defaultValue;
		}
		obj = obj[args[i]];
	}
	return obj;
}

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
exports.getEnvironmentFile = getEnvironmentFile;
exports.readTsConfig = readTsConfig;
exports.supportES2015 = supportES2015;
exports.get = get;
