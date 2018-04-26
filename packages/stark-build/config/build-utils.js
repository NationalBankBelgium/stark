const ts = require("typescript");
const path = require("path");
const fs = require("fs");
const helpers = require("./helpers");

const DEFAULT_METADATA = {
	title: "Stark Application by @NationalBankBelgium",
	baseUrl: "/",
	isDevServer: helpers.isWebpackDevServer(),
	HMR: helpers.hasProcessFlag("hot"),
	AOT: process.env.BUILD_AOT || helpers.hasNpmFlag("aot"),
	E2E: !!process.env.BUILD_E2E,
	WATCH: helpers.hasProcessFlag("watch"),
	tsConfigPath: getAngularCliAppConfig().tsconfig,
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

function getEnvironmentFile(environment) {
	if (typeof environment === "string") {
		let fileName = helpers.root("src/" + getAngularCliAppConfig().environments[environment]);

		if (fs.existsSync(fileName)) {
			return fileName;
		} else if (fs.existsSync((fileName = helpers.root("src/" + getAngularCliAppConfig().environmentSource)))) {
			console.warn(`Could not find environment file for ${environment}, loading default environment file`);
			return fileName;
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

function isDirectory(path) {
	try {
		return fs.statSync(path).isDirectory();
	}
	catch (_) {
		return false;
	}
}

/**
 * Foreach installed NationalBankBelgium packages, read assets.json file in the root of the module.
 * Based on assets.json file, fill an array with the needed assets for the module.
 * Then return those to be read by CopyWebpackPlugin.
 */
function getNbbAssetsConfig() {
	let customAssets = [];

	const getDirectories = source =>
		fs.readdirSync(source).filter((name) => isDirectory(path.join(source, name)));

	const NBB_MODULES_PATH = "node_modules/@nationalbankbelgium";
	const nbbPackages = getDirectories(helpers.root(NBB_MODULES_PATH));

	for (const nbbPackage of nbbPackages) {
		
		const ngCliConfigPath = helpers.root(NBB_MODULES_PATH + "/" + nbbPackage + "/" + ".ng-cli-config.json");

		if (fs.existsSync(ngCliConfigPath)) {
			const packageCliConfig = require(ngCliConfigPath);

			if (packageCliConfig["apps"] && packageCliConfig["apps"][0]
				&& packageCliConfig["apps"][0].assets instanceof Array) {
				customAssets = [...customAssets, ...getCopyWebpackPluginConfig(packageCliConfig["apps"][0].assets)];
			} else {
				throw new Error("Ng-Cli config from " + nbbPackage + " has no assets defined. Please provide assets array or empty array.");
			}
		}
	}

	return customAssets;
}

/**
 * Returns assets set in .angular-cli.json file of the project.
 */
function getApplicationAssetsConfig() {
	const appConfig = getAngularCliAppConfig();

	if (appConfig.assets && appConfig.assets instanceof Array) {
		return getCopyWebpackPluginConfig(appConfig.assets);
	}

	return [];
}

function getAngularCliAppConfig() {
	const applicationAngularCliConfigPath = helpers.root(".angular-cli.json");
	if (fs.existsSync(applicationAngularCliConfigPath)) {
		const angularCliConfig = require(applicationAngularCliConfigPath);
		if (angularCliConfig["apps"] && angularCliConfig["apps"][0]) {
			return angularCliConfig["apps"][0];
		} else {
			throw new Error("Angular-cli config apps is wrong. Please adapt it to follow Angular CLI way.");
		}
	} else {
		throw new Error(".angular-cli.json is not present. Please add this at the root your project because stark-build needs this.");
	}
}

/**
 * Return copyWebpack config based on angular cli assets declaration
 *
 * This code is coming from @angular/cli/models/webpack-configs/common.js
 */
function getCopyWebpackPluginConfig(assets) {
	const appConfig = getAngularCliAppConfig();

	const projectRoot = helpers.root("");
	const appRoot = helpers.root(appConfig.root);

	return assets.map((asset) => {
		// Convert all string assets to object notation.
		asset = typeof asset === 'string' ? {glob: asset} : asset;
		// Add defaults.
		// Input is always resolved relative to the appRoot.
		asset.input = path.resolve(appRoot, asset.input || '').replace(/\\/g, '/');
		asset.output = asset.output || '';
		asset.glob = asset.glob || '';
		// Prevent asset configurations from writing outside of the output path, except if the user
		// specify a configuration flag.
		// Also prevent writing outside the project path. That is not overridable.
		// For info: Comparing to implementation of Angular, "buildOptions.outputPath" has been replaced by "appConfig.outDir"
		const absoluteOutputPath = path.resolve(projectRoot, appConfig.outDir);
		const absoluteAssetOutput = path.resolve(absoluteOutputPath, asset.output);
		const outputRelativeOutput = path.relative(absoluteOutputPath, absoluteAssetOutput);
		if (outputRelativeOutput.startsWith('..') || path.isAbsolute(outputRelativeOutput)) {
			const projectRelativeOutput = path.relative(projectRoot, absoluteAssetOutput);
			if (projectRelativeOutput.startsWith('..') || path.isAbsolute(projectRelativeOutput)) {
				const message = 'An asset cannot be written to a location outside the project.';
				throw new Error(message);
			}
			if (!asset.allowOutsideOutDir) {
				const message = 'An asset cannot be written to a location outside of the output path. '
					+ 'You can override this message by setting the `allowOutsideOutDir` '
					+ 'property on the asset to true in the CLI configuration.';
				throw new Error(message);
			}
		}
		// Prevent asset configurations from reading files outside of the project.
		const projectRelativeInput = path.relative(projectRoot, asset.input);
		if (projectRelativeInput.startsWith('..') || path.isAbsolute(projectRelativeInput)) {
			const message = 'An asset cannot be read from a location outside the project.';
			throw new Error(message);
		}
		// Ensure trailing slash.
		if (isDirectory(path.resolve(asset.input))) {
			asset.input += '/';
		}
		// Convert dir patterns to globs.
		if (isDirectory(path.resolve(asset.input, asset.glob))) {
			asset.glob = asset.glob + '/**/*';
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

exports.DEFAULT_METADATA = DEFAULT_METADATA;
exports.supportES2015 = supportES2015;
exports.readTsConfig = readTsConfig;
exports.getEnvironmentFile = getEnvironmentFile;
exports.rxjsAlias = rxjsAlias;
exports.getNbbAssetsConfig = getNbbAssetsConfig;
exports.getApplicationAssetsConfig = getApplicationAssetsConfig;
exports.getAngularCliAppConfig = getAngularCliAppConfig;
