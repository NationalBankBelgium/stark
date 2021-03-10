const fs = require("fs");

let packageJsonPath = process.argv[2];
let validVersion = process.argv[3];
let isCorrect = true;

fs.readFile("./modules.txt", "utf8", function (err, modulesData) {
	if (err) {
		return console.error("Error while reading file => " + err);
	}

	let starkPackagesArray = modulesData.split(/\s/).filter((value) => {
		return value !== "";
	});

	fs.readFile(packageJsonPath, "utf8", function (err, packageJsonData) {
		if (err) {
			return console.error("Error while reading file => " + err);
		}

		for (const starkPackage of starkPackagesArray) {
			const packageDependency = new RegExp('\\"@nationalbankbelgium/' + starkPackage + '\\"', "gi");
			const validVersionPattern = new RegExp('\\"@nationalbankbelgium/' + starkPackage + '\\": \\"' + validVersion + '\\"', "gi");
			if (packageJsonData.match(packageDependency) && !packageJsonData.match(validVersionPattern)) {
				isCorrect = false;
				console.error("Version of package " + starkPackage + " is not correct. It should be '" + validVersion + "'");
			}
		}

		if (!isCorrect) {
			throw new Error(
				"The version of some of the Stark packages is not correct in " +
					packageJsonPath +
					". Please adapt to '" +
					validVersion +
					"'."
			);
		}
	});
});
