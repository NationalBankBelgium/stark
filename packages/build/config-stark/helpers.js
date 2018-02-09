"use strict";

const path = require("path");

// Helper functions
// dirname is equals to the location of the script that is running
// cwd is the process current working directory
const _root = path.resolve(process.cwd(), "."); // project root folder
const _rootStark = path.resolve(process.cwd(), "node_modules/@nationalbankbelgium/stark"); // stark root folder

function hasProcessFlag(flag) {
	return process.argv.join("").indexOf(flag) > -1;
}

function rootStark(args){
	args = Array.prototype.slice.call(arguments, 0);
	//console.log("dirname "+ __dirname);
	//console.log("process.cwd " + process.cwd());
	//console.log("stark path: ",path.join.apply(path, [_rootStark].concat(args)));
	return path.join.apply(path, [_rootStark].concat(args));
}

function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	//console.log("dirname "+ __dirname);
	//console.log("process.cwd " + process.cwd());
	//console.log("app path: ",path.join.apply(path, [_root].concat(args)));
	return path.join.apply(path, [_root].concat(args));
}

function rootNode(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return root.apply(path, ["node_modules"].concat(args));
}

function prependExt(extensions, args) {
	args = args || [];
	if (!Array.isArray(args)) { args = [args] }
	return extensions.reduce((memo, val) => {
		return memo.concat(val, args.map((prefix) => {
			return prefix + val;
		}));
	}, [""]);
}

function packageSort(packages) {
	const len = packages.length - 1;
	const first = packages[0];
	const last = packages[len];
	return function sort(a, b) {
		// polyfills always first
		if (a.names[0] === first) {
			return -1;
		}
		// main always last
		if (a.names[0] === last) {
			return 1;
		}
		// vendor before app
		if (a.names[0] !== first && b.names[0] === last) {
			return -1;
		} else {
			return 1;
		}
		// a must be equal to b
		return 0;
	}
}

function reverse(arr) {
	return arr.reverse();
}

/**
 * Method for removing object properties
 */
const removeObjectProperties = (obj, props) => {
	for(let i = 0; i < props.length; i++) {
		if(obj.hasOwnProperty(props[i])) {
			delete obj[props[i]];
		}
	}
};

/**
 * Retrieve the relative path from the config directory to the path argument value (if provided). That path argument can be passed to only execute a subset of the unit tests (see spec-bundle.ts)
 * @param args the arguments to look into
 * @returns {*} The relative path from this directory (config) to the location pointed at by the path argument value (if provided), an empty string otherwise
 */
function getTestPath(args) {
	for (let i = 0; i < args.length; ++i) {
		if (args[i] === "--path--") {
			let providedPath = args[i+1] || "";
			if(!providedPath.toLocaleLowerCase().startsWith("src/")){
				throw new Error("If you want to execute a subset of the unit tests, then the path you provide MUST start with 'src/'");
			}
			//return path.relative(__dirname, providedPath);
			// posix style to get the expected path separator
			return path.posix.relative(__dirname, providedPath);
		}
	}
	return "";
}

exports.reverse = reverse;
exports.hasProcessFlag = hasProcessFlag;
exports.root = root;
exports.rootStark = rootStark;
exports.rootNode = rootNode;
exports.prependExt = prependExt;
exports.prepend = prependExt;
exports.packageSort = packageSort;
exports.getTestPath = getTestPath;
exports.removeObjectProperties = removeObjectProperties;
