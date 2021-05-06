const fs = require("fs");
const StreamConcat = require("stream-concat");

// add the reports of all the different Stark packages to be combined
const fileNames = [
	"reports/coverage/packages/stark-core/lcov.info",
	"reports/coverage/packages/stark-ui/lcov.info",
	"reports/coverage/packages/stark-rbac/lcov.info"
];

function replaceValuesInFile(fileName, valueReplacements) {
	fs.readFile(fileName, "utf8", function (err, data) {
		if (err) {
			return console.error("Error while reading file => " + err);
		}

		let result = data;

		for (const replacement of valueReplacements) {
			const searchValueRegex = new RegExp(replacement.searchValue, "g");
			result = result.replace(searchValueRegex, replacement.replaceValue);
		}

		fs.writeFile(fileName, result, "utf8", function (err) {
			if (err) {
				return console.error(err);
			} else {
				return console.log(`${fileName} updated successfully`);
			}
		});
	});
}

let fileIndex = 0;

const nextStream = function () {
	if (fileIndex === fileNames.length) {
		return null;
	}

	const file = fileNames[fileIndex++];

	console.log("Concatenating coverage report: ", file);
	return fs.createReadStream(file);
};

// then concatenate the files (but wait X milliseconds for the files to be overwritten in the previous step)
setTimeout(() => {
	const combinedStream = new StreamConcat(nextStream);
	const combinedLcovFileName = fs.createWriteStream("combined-lcov.info");

	combinedStream.pipe(combinedLcovFileName);
}, 250);
