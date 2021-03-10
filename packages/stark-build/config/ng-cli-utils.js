const path = require("path");
const fs = require("fs");
const cliUtilConfig = require("@angular/cli/utilities/config");

function isDirectory(pathToCheck) {
	try {
		return fs.statSync(pathToCheck).isDirectory();
	} catch (_) {
		return false;
	}
}

function getDirectoriesNames(source) {
	return fs.readdirSync(source).filter((name) => isDirectory(path.join(source, name)));
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

function hasNgCliCommandOption(option) {
	const stringifiedArgs = process.argv.join(" ");
	// NG CLI options could be passed in 2 ways: 1) --someOption someValue or 2)  --someOption=someValue
	const cliOptionRegex = new RegExp("--" + option + "(=|\\s)");

	return cliOptionRegex.test(stringifiedArgs);
}

function getNgCliCommandOption(option) {
	if (hasNgCliCommandOption(option)) {
		const stringifiedArgs = process.argv.join(" ");
		// NG CLI options could be passed in 2 ways: 1) --someOption someValue or 2)  --someOption=someValue
		const cliOptionValueRegex = new RegExp("--" + option + "(=|\\s)\\S*($|\\S)");

		// the value is on the right side of the "=" or " "
		return stringifiedArgs.match(cliOptionValueRegex)[0].split(/=|\s/)[1];
	} else {
		return null; // the flag was not passed to the current command
	}
}

exports.getAngularCliAppConfig = getAngularCliAppConfig;
exports.getDirectoriesNames = getDirectoriesNames;
exports.getWorkspace = getWorkspace;
exports.getNgCliCommandOption = getNgCliCommandOption;
exports.hasNgCliCommandOption = hasNgCliCommandOption;
exports.isDirectory = isDirectory;
exports.validateAngularCLIConfig = validateAngularCLIConfig;
