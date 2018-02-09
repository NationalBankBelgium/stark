"use strict";

const webpack = require("webpack");

const webpackMerge = require("webpack-merge"); // Used to merge webpack configs
const commonConfig = require("./webpack.common.js"); // common configuration between environments
const commonData = require("./webpack.common-data.js"); // common configuration between environments

// Helpers
const helpers = require("./helpers");

// Webpack Plugins
const CompressionPlugin = require("compression-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

// Metadata
const METADATA = {
	host: process.env.HOST || "localhost",
	port: parseInt(process.env.PORT, 10) || 8080,
	ENV: process.env.NODE_ENV = process.env.ENV = "production",
	PRODUCTION: true,
	DEVELOPMENT: false
};

/*
 * Config
 * IMPORTANT: notice that the configuration below is MERGED with the common configuration (commonConfig)
 * reference: https://webpack.js.org/configuration/
 */
module.exports = webpackMerge(commonConfig, {
	// Developer tool to enhance debugging
	// reference: https://webpack.js.org/configuration/devtool
	// reference: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
	devtool: "source-map",

	// the entry point for the bundles
	// reference: https://webpack.js.org/configuration/entry-context/#entry
	entry: {
		"polyfills": helpers.root("src/polyfills.ts"),
		"vendor": helpers.root("src/vendor.ts"),
		"main": helpers.root("src/main.ts") // our angular app
	},

	// Options affecting the normal modules.
	// reference: https://webpack.js.org/configuration/module
	module: {
		// An array of applied loaders.
		// IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
		// This means they are not resolved relative to the configuration file.
		// reference: https://webpack.js.org/configuration/module/#module-rules
		rules: [
			// Support for .ts files.
			// reference: https://github.com/s-panferov/awesome-typescript-loader
			{
				test: /\.ts$/,
				use: [
					{
						loader: "babel-loader",
						options: commonData.babel
					},
					{
						loader: "awesome-typescript-loader",
						options: commonData.ts
					}
				],
				exclude: [
					/\.e2e-spec\.ts$/, // exclude end-to-end tests
					/\.spec\.ts$/ // exclude unit tests
				]
			}
		]
	},

	// Add additional plugins to the compiler.
	// reference: https://webpack.js.org/plugins
	plugins: [
		// Environment helpers (when adding more properties make sure you include them in environment.d.ts)
		// Plugin: DefinePlugin
		// Description: Define free variables.
		// Useful for having development builds with debug logging or adding global constants.
		// reference: https://webpack.js.org/plugins/define-plugin
		// NOTE: when adding more properties make sure you include them in custom-typings.d.ts
		new DefinePlugin({
			"ENV": JSON.stringify(METADATA.ENV),
			"NODE_ENV": JSON.stringify(METADATA.ENV),
			"HMR": false,
			"PRODUCTION": METADATA.PRODUCTION,
			"DEVELOPMENT": METADATA.DEVELOPMENT,
			"process.env": {
				"ENV": JSON.stringify(METADATA.ENV),
				"NODE_ENV": JSON.stringify(METADATA.ENV),
				"HMR": false,
				"PRODUCTION": METADATA.PRODUCTION,
				"DEVELOPMENT": METADATA.DEVELOPMENT
			}
		}),

		// Plugin: CommonsChunkPlugin
		// Description: Shares common code between the pages.
		// It identifies common modules and put them into a commons chunk.
		// reference: https://webpack.js.org/plugins/commons-chunk-plugin
		// reference: https://github.com/webpack/docs/wiki/optimization#multi-page-app
		new CommonsChunkPlugin({
			name: helpers.reverse([
				"polyfills",
				"vendor",
				"main"
			]),
			// the filename configured in the output section is reused
			//filename: "[name].[hash].bundle.js",
			chunks: Infinity
		}),

		// Plugin: Uglify
		// Description: minify code, compress, ...
		// reference: https://webpack.js.org/plugins/uglifyjs-webpack-plugin
		new UglifyJsPlugin({
			beautify: false, // set to true for debugging
			//dead_code: false, // uncomment for debugging
			//unused: false, // uncomment for debugging
			mangle: { // reference: https://github.com/mishoo/UglifyJS2#mangle-options
				screw_ie8: true,
				keep_fnames: true,
				except: [
					// list strings that should not be mangled here
				]
			},
			compress: { // reference: https://github.com/mishoo/UglifyJS2#compress-options
				screw_ie8: true,
				warnings: false
				// uncomment for debugging
				//,
				//keep_fnames: true,
				//drop_debugger: false,
				//dead_code: false,
				//unused: false
			},
			comments: false, // set to true for debugging
			sourceMap: false
		}),

		// Plugin: CompressionPlugin
		// Description: Prepares compressed versions of assets to serve
		// them with Content-Encoding
		// reference: https://github.com/webpack/compression-webpack-plugin
		new CompressionPlugin({
			regExp: /\.css$|\.html$|\.js$|\.map$/,
			threshold: 2 * 1024
		}),

		// Plugin: ExtractTextWebpackPlugin
		// Description: Extract css file contents
		// reference: https://github.com/webpack/extract-text-webpack-plugin
		new ExtractTextWebpackPlugin({
			filename: "[name].[hash].css",
			disable: false
		}),

		// Plugin: HtmlWebpackPlugin
		// Description: Simplifies creation of HTML files to serve your webpack bundles.
		// This is especially useful for webpack bundles that include a hash in the filename
		// which changes every compilation.
		// reference: https://github.com/jantimon/html-webpack-plugin
		new HtmlWebpackPlugin({
			template: helpers.root("src/index.html"),
			chunksSortMode: helpers.packageSort([
				"polyfills",
				"vendor",
				"main"
			]),
			metadata: METADATA,
			inject: "body", //  true (default) or  "body" are the same
			starkAppMetadata: commonData.starkAppMetadata,
			starkAppConfig: commonData.starkAppConfig
		}),

		// reference: https://webpack.js.org/plugins/loader-options-plugin
		new LoaderOptionsPlugin({
			// Switch loaders to debug mode
			debug: false,
			options: {
				// Html loader for HTML minification (advanced options)
				// reference: https://github.com/webpack/html-loader#advanced-options
				htmlLoader: commonData.htmlLoader.prod,

				// TSLint configuration
				// Static analysis linter for TypeScript advanced options configuration
				// Description: An extensible linter for the TypeScript language.
				// reference: https://github.com/wbuchwalter/tslint-loader
				tslint: commonData.tslint.prod
			}
		})
	]
});
