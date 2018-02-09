"use strict";

const helpers = require("./helpers");
const fs = require('fs');
const packageJSONPath = helpers.root("/package.json");

console.log("Preparation of the package.json for the nighly build...");

var packageJSON = require(packageJSONPath);
packageJSON["version"] = getNightlyVersionString(packageJSON["version"]);
fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON));

// Code from https://github.com/Microsoft/TypeScript/blob/master/scripts/configureNightly.ts
function getNightlyVersionString(versionString) {
	// If the version string already contains "-dev",
	// then get the base string and update based on that.
	const dashNightlyPos = versionString.indexOf("-dev");
	if (dashNightlyPos >= 0) {
		versionString = versionString.slice(0, dashNightlyPos);
	}

	// We're going to append a representation of the current time at the end of the current version.
	// String.prototype.toISOString() returns a 24-character string formatted as 'YYYY-MM-DDTHH:mm:ss.sssZ',
	// but we'd prefer to just remove separators and limit ourselves to YYYYMMDD.
	// UTC time will always be implicit here.
	const now = new Date();
	const timeStr = now.toISOString().replace(/:|T|\.|-/g, "").slice(0, 8);

	return `${versionString}-dev.${timeStr}`;
}
