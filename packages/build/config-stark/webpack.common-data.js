"use strict";

// The goal of this module is only to export common configuration data that the different Webpack configuration files use

// Helpers
const helpers = require("./helpers");
const path = require("path");

//const webpack = require("webpack");

// Metadata
const starkAppMetadata = require(helpers.root("src/stark-app-metadata.json"));
const starkAppConfig = require(helpers.root("src/stark-app-config.json"));

// FIXME: extract other configurations and centralize them here:
// distinguish between dev/test/prod (e.g., ts: { dev: ..., prod: ...}

module.exports = {
	// static data for index.html
	starkAppMetadata: starkAppMetadata,
	starkAppConfig: starkAppConfig,

	ts: {
		// Allows overriding TypeScript options. Should be specified in the same format as you would do for the compilerOptions property in tsconfig.json.
		compilerOptions: {
			silent: false, // default value: false
			compiler: "typescript", // default value: "typescript"
			useTranspileModule: false, // default value: false
			instance: "at-loader", // default value: "at-loader"
			configFileName: "tsconfig.json", // default value: "tsconfig.json"
			transpileOnly: false, // default value: false
			errorsAsWarnings: false, // default value: false
			forceIsolatedModules: false, // default value: false
			ignoreDiagnostics: [], // default value: []
			useBabel: false, // default value: false
			useCache: false, // default value: false
			usePrecompiledFiles: false, // default value: false
			cacheDirectory: ".awcache", // default value: ".awcache"
			reportFiles: [] // default value: []
		}
	},

	// TSLint configuration
	// Static analysis linter for TypeScript advanced options configuration
	// Description: An extensible linter for the TypeScript language.
	// reference: https://github.com/wbuchwalter/tslint-loader
	tslint: {
		dev: {
			// TSLint errors are displayed by default as warnings
			// set emitErrors to true to display them as errors
			emitErrors: false,

			// TSLint does not interrupt the compilation by default
			// if you want any file with tslint errors to fail
			// set failOnHint to true
			failOnHint: false,

			resourcePath: helpers.root("src")

			// can be used to customize the path to the directory containing formatter (optional)
			//formattersDirectory: helpers.rootStark("node_modules/tslint-loader/formatters/"),
		},

		prod: {
			// TSLint errors are displayed by default as warnings
			// set emitErrors to true to display them as errors
			emitErrors: true,

			// TSLint does not interrupt the compilation by default
			// if you want any file with tslint errors to fail
			// set failOnHint to true
			failOnHint: true,

			resourcePath: helpers.root("src")

			// can be used to customize the path to the directory containing formatter (optional)
			//formattersDirectory: helpers.rootStark("node_modules/tslint-loader/formatters/"),
		}
	},

	// Html loader for HTML minification (advanced options)
	// reference: https://github.com/webpack/html-loader#advanced-options
	htmlLoader: {
		dev: {
			removeAttributeQuotes: false,
			caseSensitive: true,
			customAttrSurround: [
				[/#/, /(?:)/],
				[/\*/, /(?:)/],
				[/\[?\(?/, /(?:)/]
			],
			customAttrAssign: [/\)?\]?=/]
		},

		prod: {
			minimize: true,
			removeAttributeQuotes: false,
			caseSensitive: true,
			customAttrSurround: [
				[/#/, /(?:)/],
				[/\*/, /(?:)/],
				[/\[?\(?/, /(?:)/]
			],
			customAttrAssign: [/\)?\]?=/]
		}
	},

	babel: {
		presets: [
			["env", {
				"targets": {
					"browsers": [
						"last 2 versions",
						"ie >= 11",
						"Chrome >= 56",
						"Firefox >= 48",
						"Safari >= 7"
					]
				},
				"modules": false
			}]
		]
	}
};

