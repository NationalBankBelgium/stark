"use strict";

const webpack = require("webpack");

// Helpers
const helpers = require("./helpers");

// Stark App Config
const starkAppConfig = require(helpers.root("src/stark-app-config.json"));

// Webpack Plugins
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const WebpackSHAHash = require("webpack-sha-hash");
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
const NoEmitOnErrorsPlugin = require("webpack/lib/NoEmitOnErrorsPlugin");
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
// const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");

// awesome-typescript-loader specific:
const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;

/*
 * Config
 * reference: https://webpack.js.org/configuration
 */
module.exports = {
	stats: {
		colors: true,
		reasons: true,
		errorDetails: true // display error details. Same as the --show-error-details flag
		// maxModules: Infinity, // examine all modules (ModuleConcatenationPlugin debugging)
		// optimizationBailout: true  // display bailout reasons (ModuleConcatenationPlugin debugging)
	},

	// Tell webpack which environment the application is targeting.
	// reference: https://webpack.js.org/configuration/target/
	// reference: https://webpack.js.org/concepts/targets/
	target: "web", // <== can be omitted as default is "web"

	// Options affecting the output of the compilation
	// reference: https://webpack.js.org/configuration/output
	output: {
		// Mandatory but not actually useful since everything remains in memory with webpack-dev-server
		// reference: https://webpack.js.org/configuration/output/#output-path
		path: helpers.root("dist"),
		// We need to tell Webpack to serve our bundled application
		// from the build path. When proxying:
		// http://localhost:3000/ -> http://localhost:8080/
		publicPath: starkAppConfig.baseUrl,
		// Adding hashes to files for cache busting
		// IMPORTANT: You must not specify an absolute path here!
		// reference: https://webpack.js.org/configuration/output/#output-filename
		filename: "[name].[hash].bundle.js",
		// The filename of the SourceMaps for the JavaScript files.
		// They are inside the output.path directory.
		// reference: https://webpack.js.org/configuration/output/#output-sourcemapfilename
		sourceMapFilename: "[name].[hash].map",
		// The filename of non-entry chunks as relative path
		// inside the output.path directory.
		// reference: https://webpack.js.org/configuration/output/#output-chunkfilename
		chunkFilename: "[id].[hash].chunk.js"
	},

	// Options affecting the resolving of modules.
	// reference: https://webpack.js.org/configuration/resolve
	resolve: {
		// an array of extensions that should be used to resolve modules.
		// reference: https://webpack.js.org/configuration/resolve/#resolve-extensions
		extensions: [".ts", ".js", ".json", ".css", ".pcss", ".html"],

		plugins: [
			// Awesome Typescript Loader
			new TsConfigPathsPlugin({
				configFileName: helpers.root("tsconfig.json"),
				compiler: "typescript"
			})
		]
	},

	// Options affecting the normal modules.
	// reference: https://webpack.js.org/configuration/module
	module: {
		// An array of applied loaders.
		// IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
		// This means they are not resolved relative to the configuration file.
		// reference: https://webpack.js.org/configuration/module/#module-rules
		rules: [
			// TsLint loader support for *.ts files
			// reference: https://github.com/wbuchwalter/tslint-loader
			{
				enforce: "pre",
				test: /\.ts$/,
				use: [
					"tslint-loader"
				],
				exclude: [
					helpers.root("node_modules"),
					helpers.rootStark("node_modules")
				]
			},

			// Source map loader support for *.js files
			// Extracts SourceMaps for source files that as added as sourceMappingURL comment.
			// reference: https://github.com/webpack/source-map-loader
			{
				enforce: "pre",
				test: /\.js$/,
				use: [
					"source-map-loader"
				],
				exclude: [
					helpers.rootStark("node_modules/rxjs"),
					helpers.root("node_modules/rxjs")
				]
			},

			// Support for CSS as raw text
			// reference: https://github.com/webpack/raw-loader
			{
				test: /\.css$/,
				use: ExtractTextWebpackPlugin.extract({
					use: "raw-loader"
				})
			},

			// Support for PostCSS
			{
				test: /\.pcss$/,
				use: ExtractTextWebpackPlugin.extract({
					fallback: "style-loader",
					// "use" entries have an "options" property
					// but could also have a "query" property which is an alias for the "options" property
					// https://webpack.js.org/configuration/module/#useentry
					use: [
						{
							loader: "css-loader",
							options: {
								//modules: true, // to check if needed
								//minimize: true,
								// even if disabled, sourceMaps gets generated
								sourceMap: false, // true
								autoprefixer: false,
								// see https://github.com/webpack-contrib/css-loader#importloaders)
								importLoaders: 1 // 1 => postcss-loader
							}
						},
						{
							loader: "postcss-loader",
							options: {
								sourceMap: true,
								plugins: [
									// reference: https://github.com/postcss/postcss-import
									// https://github.com/postcss/postcss-import/issues/244
									require("postcss-import")(),

									// plugin to rebase, inline or copy on url().
									// https://github.com/postcss/postcss-url
									require("postcss-url")(),

									require("postcss-nesting")(),
									require("postcss-simple-extend")(),
									require("postcss-cssnext")({
										// see https://github.com/MoOx/postcss-cssnext/issues/268 for example
										browsers: ["last 3 versions", "Chrome >= 45"]
									})
								]
							}
						}
					]
				})
			},

			// Support for .html
			{
				test: /\.html$/,
				use: [
					"html-loader"
				],
				exclude: [
					helpers.root("src/index.html")
				]
			}
		]
	},

	// Add additional plugins to the compiler.
	// reference: https://webpack.js.org/plugins
	plugins: [
		// Plugin: NoEmitOnErrorsPlugin
		// Description: Only emit files when there are no errors.
		// reference: https://webpack.js.org/plugins/no-emit-on-errors-plugin
		new NoEmitOnErrorsPlugin(),

		// Plugin: ForkCheckerPlugin
		// Description: Do type checking in a separate process, so webpack don't need to wait.
		// reference: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
		// TODO: remove this in the future depending on the output of https://github.com/webpack/webpack/issues/3460
		new CheckerPlugin(),

		// Plugin: CopyWebpackPlugin
		// Description: Copy files and directories in webpack.
		// Copies project static assets.
		// reference: https://www.npmjs.com/package/copy-webpack-plugin
		new CopyWebpackPlugin(
			[
				// Stark assets
				{
					from: helpers.rootStark("assets"),
					to: "assets"
				},
				// those assets are copied to the root of the target folder
				{
					from: helpers.rootStark("assets-base"),
					to: ""
				},

				// Mdi svg file
				{
					from: "node_modules/@nationalbankbelgium/angular-mdi-svg/mdi.svg",
					to: "assets/icons/mdi.svg"
				},

				// Application assets
				{
					from: helpers.root("assets"),
					to: "assets",
					force: "true" // overwrite files already copied from Stark
				},
				// those assets are copied to the root of the target folder
				{
					from: helpers.root("assets-base"),
					to: "",
					force: "true" // overwrite files already copied from Stark
				}
			],
			{
				ignore: [
					"translations/*", // skip translation since they will be copied in the next round (see block below)
					"*.md",
					//See https://github.com/kevlened/copy-webpack-plugin/issues/54#issuecomment-223205388
					{
						dot: true,
						glob: ".svn/**/*"
					}
				]

				// By default the plugin only copies modified files during
				// a watch or webpack-dev-server build
				// Setting this to true copies all files
				// copyUnmodified: true
			}
		),

		// Plugin: CopyWebpackPlugin
		// Description: Copy files and directories in webpack.
		// Copies project static assets.
		// reference: https://www.npmjs.com/package/copy-webpack-plugin
		new CopyWebpackPlugin(
			[
				// Stark assets
				{
					from: helpers.rootStark("assets/translations"),
					to: "assets/translations/stark"
				},

				// Application assets
				{
					from: helpers.root("assets/translations"),
					to: "assets/translations/app"
				}
			],
			{}
		),

		// Plugin: WebpackSHAHash
		// Description: Generate SHA content hashes
		new WebpackSHAHash(),

		// Plugin: ContextReplacementPlugin
		// Description: allows to override the inferred information in a 'require' context
		// Including only a certain set of Moment locales
		// reference: https://webpack.js.org/plugins/context-replacement-plugin/
		new ContextReplacementPlugin(/moment[\/\\]locale$/, /(de|fr|en-gb|nl|nl-be)\.js/)

		// Webpack 3 feature: scope hoisting
		// Description: Hoist or concatenate the scope of all your modules into one closure and allow for your code
		// to have a faster execution time in the browser.
		// This plugin this allows to concatenate all modules and rename variables in a smart way to fulfill
		// the EcmaScript Modules (ESM) spec semantics.
		// reference: https://webpack.js.org/plugins/module-concatenation-plugin/
		// reference: https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b
		// reference: https://medium.com/webpack/webpack-freelancing-log-book-week-5-7-4764be3266f5
		// new ModuleConcatenationPlugin()
	],

	// Include polyfills or mocks for various node stuff
	// Description: Node configuration
	// reference: https://webpack.js.org/configuration/node
	node: {
		global: true,
		process: false,
		crypto: "empty",
		module: false,
		clearImmediate: false,
		setImmediate: false
	}
};
