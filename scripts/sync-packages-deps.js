const fs = require("fs");
const path = require("path");
const execFileSync = require("child_process").execFileSync;

const checkOnly = process.argv.indexOf("--check") > -1;
const noCommit = process.argv.indexOf("--no-commit") > -1;
const rootDeps = require("../package.json").devDependencies;

const fileNames = {
	"stark-core": "../packages/stark-core/package.json",
	"stark-testing": "../packages/stark-testing/package.json",
	"stark-ui": "../packages/stark-ui/package.json"
};

function replaceValuesInFile(fileName, valueReplacements) {
	let data = fs.readFileSync(fileName, { encoding: "utf8", flag: "r" });

	for (const replacement of valueReplacements) {
		data = data.replace(replacement.searchValue, replacement.replaceValue);
	}

	fs.writeFileSync(fileName, data, { encoding: "utf8" });
}

for (const [packageName, fileName] of Object.entries(fileNames)) {
	const packageDeps = require(fileName).dependencies || [];
	for (const [depName, depVersion] of Object.entries(packageDeps)) {
		if (rootDeps[depName] !== depVersion) {
			if (!checkOnly) {
				const absoluteFileName = path.resolve(__dirname, fileName);
				const commitMsg = `chore(deps): bump ${depName} in ${fileName.substring(2)} from ${depVersion.replace(
					/[\^~]/,
					""
				)} to ${rootDeps[depName].replace(/[\^~]/, "")}`;
				const depVersionEscaped = depVersion.replace(/[-^~.\\\/]/, "\\$&");
				const replacement = [
					{
						searchValue: new RegExp(`"${depName}": "${depVersionEscaped}"`),
						replaceValue: `"${depName}": "${rootDeps[depName]}"`
					}
				];

				replaceValuesInFile(absoluteFileName, replacement);

				console.log(`${packageName} - Bump "${depName}" from "${depVersion}" to "${rootDeps[depName]}"`);

				if (!noCommit) {
					try {
						execFileSync("git", ["add", absoluteFileName], { encoding: "utf8" });
						console.log(`File ${fileName} has been staged for commit.`);
					} catch (error) {
						console.error(`An error happened while staging file ${fileName} for commit: `, error);
					}

					try {
						execFileSync("git", ["commit", "-m", commitMsg, "--no-verify"], { encoding: "utf8" });
						console.log(`File ${fileName} has been committed with message:\n  "${commitMsg}"`);
					} catch (error) {
						console.error(`An error happened while committing file in git: `, error);
					}
				}
			} else {
				console.error(`The dependency "${depName}" is not in sync between root and ${packageName}!`);
				console.error(`${packageName} - ${depName} version: ${depVersion}`);
				console.error(`root - ${depName} version: ${rootDeps[depName]}`);

				throw new Error(`The dependency "${depName}" is not in sync between root and ${packageName}!`);
			}
		}
	}
}
