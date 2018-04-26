const path = require("path");
const fs = require("fs");

/**
 * Helper functions.
 */
// const ROOT = path.resolve(__dirname, '..');
const _root = path.resolve(process.cwd(), "."); // project root folder

const root = path.join.bind(path, _root);

function getAngularCliAppConfig() {
	const applicationAngularCliConfigPath = root(".angular-cli.json");
	const packageAngularCliConfigPath = root(".ng-cli-config.json");
	
	let angularCliConfigPath;
	
	if (fs.existsSync(applicationAngularCliConfigPath)) {
		angularCliConfigPath = applicationAngularCliConfigPath;
	} else if (fs.existsSync(packageAngularCliConfigPath)) {
		angularCliConfigPath = packageAngularCliConfigPath;
	} else {
		throw new Error(".angular-cli.json is not present. Please add this at the root your project because stark-build needs this.")
	}

	const angularCliConfig = require(angularCliConfigPath);
	if (angularCliConfig["apps"] && angularCliConfig["apps"][0]) {
		return angularCliConfig["apps"][0];
	} else {
		throw new Error("Angular-cli config apps is wrong. Please adapt it to follow Angular CLI way.")
	}
}

exports.root = root;
exports.getAngularCliAppConfig = getAngularCliAppConfig;
