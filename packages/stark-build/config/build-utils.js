const ts = require("typescript");
const path = require("path");
const fs = require("fs");
const helpers = require("./helpers");
const ngCliUtils = require("./ng-cli-utils");

const _getAngularCliAppConfig = getAngularCliAppConfig();
const ANGULAR_APP_CONFIG = {
	config: _getAngularCliAppConfig,
	deployUrl: _getAngularCliAppConfig.architect.build.options.deployUrl || "",
	baseHref: _getAngularCliAppConfig.architect.build.options.baseHref || "/",
	sourceRoot: _getAngularCliAppConfig.sourceRoot,
	outputPath: _getAngularCliAppConfig.architect.build.options.outputPath
};

const DEFAULT_METADATA = {
	title: "Stark Application by @NationalBankBelgium",
	baseUrl: "/",
	isDevServer: helpers.isWebpackDevServer(),
	HMR: helpers.hasProcessFlag("hot"),
	AOT: process.env.BUILD_AOT || helpers.hasNpmFlag("aot"),
	E2E: !!process.env.BUILD_E2E,
	WATCH: helpers.hasProcessFlag("watch"),
	tsConfigPath: ANGULAR_APP_CONFIG.config.architect.build.options.tsConfig,
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
 * The method reads the content of angular.json for getting the path (read with value or replace in "fileReplacements" of environment.
 *
 * See: https://github.com/angular/angular-cli/wiki/angular-workspace
 *
 * @param environment
 * @returns {*} - the path of the environment file of the received environment.
 */
function getEnvironmentFile(environment) {
	if (typeof environment === "string") {
		let fileName = helpers.root("src/environments/environment.ts");
		let fileNameAlt;
		let angularCliEnvConfig = ANGULAR_APP_CONFIG.config.architect.build.configurations[environment];

		if (angularCliEnvConfig && angularCliEnvConfig.fileReplacements instanceof Array) {
			for (let fileReplacement of angularCliEnvConfig.fileReplacements) {
				if (fileReplacement.replace.match(/environment/)) {
					fileName = helpers.root(angularCliEnvConfig.fileReplacements[0].with);
					fileNameAlt = helpers.root(angularCliEnvConfig.fileReplacements[0].replace);
				}
			}
		}

		if (fs.existsSync(fileName)) {
			return fileName;
		} else if (fs.existsSync(fileNameAlt)) {
			console.warn(`Could not find environment file for ${environment}, loading default environment file`);
			return fileNameAlt;
		} else {
			throw new Error("Environment file not found.");
		}
	}
}

/**
 * Read the tsconfig to determine if we should prefer ES2015 modules.
 * Load rxjs path aliases.
 * https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md#build-and-treeshaking
 * @param supportES2015 Set to true when the output of typescript is >= ES6
 */
function rxjsAlias(supportES2015) {
	try {
		const rxjsPathMappingImport = supportES2015 ? "rxjs/_esm2015/path-mapping" : "rxjs/_esm5/path-mapping";
		const rxPaths = require(rxjsPathMappingImport);
		return rxPaths();
	} catch (e) {
		console.warn(e);
		return {};
	}
}

/**
 * Foreach installed NationalBankBelgium packages, read angular.json file in the root of the module.
 * Based on angular.json file, fill an array with the needed assets for the module.
 * Then return those to be read by CopyWebpackPlugin.
 */
function getNbbAssetsConfig() {
	let customAssets = [];

	const NBB_MODULES_PATH = "node_modules/@nationalbankbelgium";
	const nbbPackages = ngCliUtils.getDirectoriesNames(helpers.root(NBB_MODULES_PATH));

	for (const nbbPackage of nbbPackages) {
		const ngCliConfigPath = helpers.root(NBB_MODULES_PATH + "/" + nbbPackage + "/" + "angular.json");

		if (fs.existsSync(ngCliConfigPath)) {
			const packageCliConfig = require(ngCliConfigPath);
			const cliConfig = ngCliUtils.validateAngularCLIConfig(packageCliConfig);
			if (cliConfig) {
				if (cliConfig.defaultProject) {
					// Because of angular.json architecture, we have to get the defaultProject value for reading, inside
					// "projects" object the content of the project.
					// ie: {
					//       "defaultProject": "stark-ui",
					//       "projects": {
					//         "stark-ui": { ... }
					//       }
					//     }
					let cliProjectConfig = cliConfig.projects[cliConfig.defaultProject];

					if (cliProjectConfig) {
						customAssets = [...customAssets, ...getCopyWebpackPluginConfig(cliProjectConfig.architect.build.options.assets)];
					}
				}
			}
		}
	}

	return customAssets;
}

/**
 * Returns assets set in angular.json file of the project.
 * See: https://github.com/angular/angular-cli/wiki/angular-workspace
 */
function getApplicationAssetsConfig() {
	const appConfig = ANGULAR_APP_CONFIG.config;

	if (appConfig.architect && appConfig.architect.build && appConfig.architect.build.options && appConfig.architect.build.options.assets) {
		return getCopyWebpackPluginConfig(appConfig.architect.build.options.assets);
	}

	return [];
}

function getAngularCliAppConfig() {
	const applicationAngularCliConfigPath = helpers.root("angular.json");
	if (fs.existsSync(applicationAngularCliConfigPath)) {
		const angularCliConfig = require(applicationAngularCliConfigPath);
		const cliConfig = ngCliUtils.validateAngularCLIConfig(angularCliConfig);
		if (cliConfig) {
			if (cliConfig.defaultProject && cliConfig.projects[cliConfig.defaultProject]) {
				return cliConfig.projects[cliConfig.defaultProject];
			} else {
				throw new Error("Angular-cli config apps is wrong. Please adapt it to follow Angular CLI way.");
			}
		} else {
			throw new Error("Parsing " + applicationAngularCliConfigPath + " failed. Ensure the file is valid JSON.");
		}
	} else {
		throw new Error("angular.json is not present. Please add this at the root your project because stark-build needs this.");
	}
}

/**
 * Return copyWebpack config based on angular cli assets declaration
 *
 * This code is coming from @angular/cli/models/webpack-configs/common.js
 */
function getCopyWebpackPluginConfig(assets) {
	const appConfig = ANGULAR_APP_CONFIG.config;

	const projectRoot = helpers.root(appConfig.root);
	const appRoot = helpers.root(appConfig.sourceRoot);

	return assets.map(asset => {
		// Convert all string assets to object notation.
		asset = typeof asset === "string" ? { glob: asset } : asset;
		// Add defaults.
		// Input is always resolved relative to the appRoot.
		asset.input = path.resolve(appRoot, asset.input || "").replace(/\\/g, "/");
		asset.output = asset.output || "";
		asset.glob = asset.glob || "";
		// Prevent asset configurations from writing outside of the output path, except if the user
		// specify a configuration flag.
		// Also prevent writing outside the project path. That is not overridable.
		// For info: Comparing to implementation of Angular, "buildOptions.outputPath" has been replaced by "appConfig.outDir"
		const absoluteOutputPath = path.resolve(projectRoot, appConfig.architect.build.options.outputPath);
		const absoluteAssetOutput = path.resolve(absoluteOutputPath, asset.output);
		const outputRelativeOutput = path.relative(absoluteOutputPath, absoluteAssetOutput);
		if (outputRelativeOutput.startsWith("..") || path.isAbsolute(outputRelativeOutput)) {
			const projectRelativeOutput = path.relative(projectRoot, absoluteAssetOutput);
			if (projectRelativeOutput.startsWith("..") || path.isAbsolute(projectRelativeOutput)) {
				const message = "An asset cannot be written to a location outside the project.";
				throw new Error(message);
			}
			if (!asset.allowOutsideOutDir) {
				const message =
					"An asset cannot be written to a location outside of the output path. " +
					"You can override this message by setting the `allowOutsideOutDir` " +
					"property on the asset to true in the CLI configuration.";
				throw new Error(message);
			}
		}
		// Prevent asset configurations from reading files outside of the project.
		const projectRelativeInput = path.relative(projectRoot, asset.input);
		if (projectRelativeInput.startsWith("..") || path.isAbsolute(projectRelativeInput)) {
			const message = "An asset cannot be read from a location outside the project.";
			throw new Error(message);
		}
		// Ensure trailing slash.
		if (ngCliUtils.isDirectory(path.resolve(asset.input))) {
			asset.input += "/";
		}
		// Convert dir patterns to globs.
		if (ngCliUtils.isDirectory(path.resolve(asset.input, asset.glob))) {
			asset.glob = asset.glob + "/**/*";
		}
		return {
			context: asset.input,
			to: asset.output,
			from: {
				glob: asset.glob,
				dot: true
			}
		};
	});
}

exports.ANGULAR_APP_CONFIG = ANGULAR_APP_CONFIG;
exports.DEFAULT_METADATA = DEFAULT_METADATA;
exports.supportES2015 = supportES2015;
exports.readTsConfig = readTsConfig;
exports.getEnvironmentFile = getEnvironmentFile;
exports.rxjsAlias = rxjsAlias;
exports.getNbbAssetsConfig = getNbbAssetsConfig;
exports.getApplicationAssetsConfig = getApplicationAssetsConfig;
