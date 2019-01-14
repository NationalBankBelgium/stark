const fs = require("fs");

let packageJsonPath = process.argv[2];
let starkVersion = process.argv[3];
let isCorrect = true;

fs.readFile("./modules.txt", "utf8", function(err, modulesData) {
	if (err) {
		return console.error("Error while reading file => " + err);
	}

	let starkPackagesArray = modulesData.split(/\s/).filter(value => {
		return value !== "";
	});

	fs.readFile(packageJsonPath, "utf8", function(err, packageJsonData) {
		if (err) {
			return console.error("Error while reading file => " + err);
		}

		for (const starkPackage of starkPackagesArray) {
			const validVersionPattern = new RegExp('\\"@nationalbankbelgium/' + starkPackage + '\\": \\"' + starkVersion + '\\"', "gi");
			if (!packageJsonData.match(validVersionPattern)) {
				isCorrect = false;
				console.error("Version of package " + starkPackage + " is not correct. It should be `" + starkVersion + "`");
			}
		}

		if (!isCorrect) {
			throw new Error("The version of some of the Stark packages is not correct in the Starter. Please adapt to a valid version.");
		}
	});
});
