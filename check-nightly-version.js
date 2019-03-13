const fs = require("fs");

let packageJsonPath = process.argv[2];
let latestVersion = process.argv[3];
let isCorrect = true;

fs.readFile(packageJsonPath, "utf8", function(err, packageJsonData) {
	if (err) {
		return console.error("Error while reading file => " + err);
	}

	const validVersionPattern = new RegExp('\\"nightlyVersion\\": \\"' + latestVersion + '\\"', "gi");
	if (packageJsonData.match(validVersionPattern)) {
		isCorrect = false;
		console.error("Nightly version of Stark packages is not correct. It should be higher than the latest version: '" + latestVersion + "'");
	}

	if (!isCorrect) {
		throw new Error(
			"The version set for nightly builds ('config.nightlyVersion') is not correct in " +
				packageJsonPath +
				". Please adapt to a valid version (higher than '" +
				latestVersion +
				"')."
		);
	}
});
