const path = require("path");
const fs = require("fs");
const cliUtilConfig = require("@angular/cli/utilities/config");
const { formatDiagnostics } = require("@angular/compiler-cli/ngtools2");

/**
 * The Separator for normalized path.
 * @type {string}
 */
const normalizedSep = "/";

/**
 * The root of a normalized path.
 * @type {string}
 */
const normalizedRoot = normalizedSep;

/**
 * normalize() cache to reduce computation. For now this grows and we never flush it, but in the
 * future we might want to add a few cache flush to prevent this from growing too large.
 */
let normalizedCache = new Map();

function isDirectory(pathToCheck) {
	try {
		return fs.statSync(pathToCheck).isDirectory();
	} catch (_) {
		return false;
	}
}

function getDirectoriesNames(source) {
	return fs.readdirSync(source).filter(name => isDirectory(path.join(source, name)));
}

function getAngularCliAppConfig(angularCliAppConfigPath) {
	if (fs.existsSync(angularCliAppConfigPath)) {
		const angularCliConfig = require(angularCliAppConfigPath);
		const cliConfig = validateAngularCLIConfig(angularCliConfig);
		if (cliConfig) {
			if (cliConfig.defaultProject && cliConfig.projects[cliConfig.defaultProject]) {
				return cliConfig.projects[cliConfig.defaultProject];
			} else {
				throw new Error(
					"The configuration of the default project in angular.json is wrong. Please adapt it to follow Angular CLI guidelines."
				);
			}
		} else {
			throw new Error("Parsing " + angularCliAppConfigPath + " failed. Please make sure that the file is valid JSON.");
		}
	} else {
		throw new Error("angular.json is not present. Please add this at the root your project because stark-build needs this.");
	}
}

/**
 * Validate passed angular cli config based on schema: @angular/cli/lib/config/schema.json
 * If the serialized file is equal to the passed json, return the serialized config.
 * Otherwise, it returns false.
 *
 * @param jsonConfig
 * @returns {*}
 */
function validateAngularCLIConfig(jsonConfig) {
	// FIXME Adapt usage for Angular CLI 6
	return jsonConfig;

	// const SchemaClassFactory = require("@ngtools/json-schema").SchemaClassFactory;
	// const schema = require("@angular/cli/lib/config/schema.json");
	//
	// const config = new (SchemaClassFactory(schema))(jsonConfig);
	// try {
	// 	const serializedConfig = JSON.parse(config.$$serialize("application/json"));
	// 	return serializedConfig;
	// } catch (error) {
	// 	return false;
	// }
}

function getWorkspace() {
	return cliUtilConfig.getWorkspace();
}

/**
 * Code taken from @angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/utils.js
 *
 * @param extraEntryPoints
 * @param defaultBundleName
 * @returns {*}
 */
function normalizeExtraEntryPoints(extraEntryPoints, defaultBundleName) {
	return extraEntryPoints.map(entry => {
		let normalizedEntry;
		if (typeof entry === "string") {
			normalizedEntry = { input: entry, lazy: false, bundleName: defaultBundleName };
		} else {
			let bundleName;
			if (entry.bundleName) {
				bundleName = entry.bundleName;
			} else if (entry.lazy) {
				// Lazy entry points use the file name as bundle name.
				bundleName = basename(normalize(entry.input.replace(/\.(js|css|scss|sass|less|styl)$/i, "")));
			} else {
				bundleName = defaultBundleName;
			}
			normalizedEntry = Object.assign({}, entry, { bundleName });
		}
		return normalizedEntry;
	});
}

/**
 * Code taken from @angular-devkit/core/src/virtual-fs/path.js
 *
 * Return the basename of the path, as a Path. See path.basename
 */
function basename(path) {
	const i = path.lastIndexOf(normalizedSep);
	if (i === -1) {
		return fragment(path);
	} else {
		return fragment(path.substr(path.lastIndexOf(normalizedSep) + 1));
	}
}

/**
 * Code taken from @angular-devkit/core/src/virtual-fs/path.js
 */
function fragment(path) {
	if (path.indexOf("/") !== -1) {
		throw new Exception(path);
	}
	return path;
}

/**
 * Code taken from @angular-devkit/core/src/virtual-fs/path.js
 *
 * Normalize a string into a Path. This is the only mean to get a Path type from a string that
 * represents a system path. This method cache the results as real world paths tend to be
 * duplicated often.
 * Normalization includes:
 *   - Windows backslashes `\\` are replaced with `/`.
 *   - Windows drivers are replaced with `/X/`, where X is the drive letter.
 *   - Absolute paths starts with `/`.
 *   - Multiple `/` are replaced by a single one.
 *   - Path segments `.` are removed.
 *   - Path segments `..` are resolved.
 *   - If a path is absolute, having a `..` at the start is invalid (and will throw).
 * @param path The path to be normalized.
 */
function normalize(path) {
	let maybePath = normalizedCache.get(path);
	if (!maybePath) {
		maybePath = noCacheNormalize(path);
		normalizedCache.set(path, maybePath);
	}
	return maybePath;
}

/**
 * Code taken from @angular-devkit/core/src/virtual-fs/path.js
 *
 * The no cache version of the normalize() function. Used for benchmarking and testing.
 */
function noCacheNormalize(path) {
	if (path == "" || path == ".") {
		return "";
	} else if (path == normalizedRoot) {
		return normalizedRoot;
	}
	// Match absolute windows path.
	const original = path;
	if (path.match(/^[A-Z]:[\/\\]/i)) {
		path = "\\" + path[0] + "\\" + path.substr(3);
	}
	// We convert Windows paths as well here.
	const p = path.split(/[\/\\]/g);
	let relative = false;
	let i = 1;
	// Special case the first one.
	if (p[0] != "") {
		p.unshift(".");
		relative = true;
	}
	while (i < p.length) {
		if (p[i] == ".") {
			p.splice(i, 1);
		} else if (p[i] == "..") {
			if (i < 2 && !relative) {
				throw new Error(`Path ${JSON.stringify(original)} is invalid.`);
			} else if (i >= 2 && p[i - 1] != "..") {
				p.splice(i - 1, 2);
				i--;
			} else {
				i++;
			}
		} else if (p[i] == "") {
			p.splice(i, 1);
		} else {
			i++;
		}
	}
	if (p.length == 1) {
		return p[0] == "" ? normalizedSep : "";
	} else {
		if (p[0] == ".") {
			p.shift();
		}
		return p.join(normalizedSep);
	}
}

exports.getAngularCliAppConfig = getAngularCliAppConfig;
exports.getDirectoriesNames = getDirectoriesNames;
exports.getWorkspace = getWorkspace;
exports.isDirectory = isDirectory;
exports.normalizeExtraEntryPoints = normalizeExtraEntryPoints;
exports.validateAngularCLIConfig = validateAngularCLIConfig;
