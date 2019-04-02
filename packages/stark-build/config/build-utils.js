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
	buildConfigurations: angularCliAppConfig.architect.build.configurations || {}
};

const DEFAULT_METADATA = {
	TITLE: "Stark Application by @NationalBankBelgium",
	E2E: helpers.hasProcessFlag("e2e"), // NG CLI comand 'e2e'
	HOST: ngCliUtils.getNgCliCommandOption("host") || ANGULAR_APP_CONFIG.config.architect.serve.options.host || "localhost", // by default is "localhost"
	PORT: ngCliUtils.getNgCliCommandOption("port") || ANGULAR_APP_CONFIG.config.architect.serve.options.port || 4200, // by default is 4200
	TS_CONFIG_PATH: ANGULAR_APP_CONFIG.buildOptions.tsConfig,
	environment: ""
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
 * Makes a new tslint.json file that extends the default (tslint.json) and disables all the tslint rules that require typechecking
 * @see FIXME on webpack-partial.common.js (module.exports().module.rules)
 *
 * @param {string} tslintConfig The path to the projects tslint.json
 * @return {string} Returns the path to the temporary tslint configuration for tslint-loader
 */
function getFixedTSLintConfig(tslintConfig) {
	// Windows style separators need to be replaced before injecting it into the new tslint.json
	const tslintConfigPath = helpers.root(tslintConfig).replace(/\\/g, "/");

	const noTypeCheckTSLintConfig = fs
		.readFileSync(helpers.rootStark("config/tslint-disabled-typecheck-rules.json"), "utf8")
		.replace(/TSLINT_CONFIG_PLACEHOLDER/, tslintConfigPath);

	const contentHash = crypto
		.createHash("md5")
		.update(noTypeCheckTSLintConfig)
		.digest("hex");

	const noTypeCheckTSLintConfigPath = path.resolve(os.tmpdir(), `national-bank-belgium_stark-build_tslint-${contentHash}.json`);

	// check if file already exists before writing it
	if (!fs.existsSync(noTypeCheckTSLintConfigPath)) {
		console.log(`Writing TSLint configuration to ${noTypeCheckTSLintConfigPath}`);
		fs.writeFileSync(noTypeCheckTSLintConfigPath, noTypeCheckTSLintConfig, "utf8");
	}

	return noTypeCheckTSLintConfigPath;
}

exports.ANGULAR_APP_CONFIG = ANGULAR_APP_CONFIG;
exports.DEFAULT_METADATA = DEFAULT_METADATA;
exports.getEnvironmentFile = getEnvironmentFile;
exports.readTsConfig = readTsConfig;
exports.getFixedTSLintConfig = getFixedTSLintConfig;
exports.supportES2015 = supportES2015;
exports.get = get;
