const path = require("path");
const fs = require("fs");
const cliUtilConfig = require("@angular/cli/utilities/config");
const { formatDiagnostics } = require("@angular/compiler-cli/ngtools2");

function isDirectory(path) {
	try {
		return fs.statSync(path).isDirectory();
	} catch (_) {
		return false;
	}
}

function getDirectoriesNames(source) {
	return fs.readdirSync(source).filter(name => isDirectory(path.join(source, name)));
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

exports.getDirectoriesNames = getDirectoriesNames;
exports.isDirectory = isDirectory;
exports.validateAngularCLIConfig = validateAngularCLIConfig;
exports.getWorkspace = getWorkspace;
