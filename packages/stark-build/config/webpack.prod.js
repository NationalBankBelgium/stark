"use strict";

const helpers = require("./helpers");
const buildUtils = require("./build-utils");

/**
 * Used to merge webpack configs
 */
const webpackMerge = require("webpack-merge");
/**
 * The settings that are common to prod and dev
 */
const commonConfig = require("./webpack.common.js");
const commonData = require("./webpack.common-data.js");

/**
 * Webpack Plugins
 */
const SourceMapDevToolPlugin = require("webpack/lib/SourceMapDevToolPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HashedModuleIdsPlugin = require("webpack/lib/HashedModuleIdsPlugin");
const PurifyPlugin = require("@angular-devkit/build-optimizer").PurifyPlugin;
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

function getUglifyOptions(supportES2015) {
	const uglifyCompressOptions = {
		pure_getters: true /* buildOptimizer */,
		// PURE comments work best with 3 passes.
		// See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
		passes: 3 /* buildOptimizer */
	};

	return {
		ecma: supportES2015 ? 6 : 5,
		warnings: false, // TODO verbose based on option?
		ie8: false,
		mangle: true,
		compress: uglifyCompressOptions,
		output: {
			ascii_only: true,
			comments: false
		},
		beautify: false // set to true for debugging
	};
}

module.exports = function() {
	const ENV = (process.env.NODE_ENV = process.env.ENV = "production");
	const supportES2015 = buildUtils.supportES2015(buildUtils.DEFAULT_METADATA.tsConfigPath);
	const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
		host: process.env.HOST || "localhost",
		port: process.env.PORT || 8080,
		ENV: ENV,
		HMR: false
	});

	// set environment suffix so these environments are loaded.
	METADATA.envFileSuffix = METADATA.E2E ? "e2e.prod" : "prod";

	return webpackMerge(commonConfig({ ENV: ENV, metadata: METADATA }), {
		/**
		 * Options affecting the output of the compilation.
		 *
		 * See: http://webpack.github.io/docs/configuration.html#output
		 */
		output: {
			/**
			 * The output directory as absolute path (required).
			 *
			 * See: http://webpack.github.io/docs/configuration.html#output-path
			 */
			path: helpers.root("dist"),

			/**
			 * Specifies the name of each output file on disk.
			 * IMPORTANT: You must not specify an absolute path here!
			 *
			 * See: http://webpack.github.io/docs/configuration.html#output-filename
			 */
			filename: "[name].[chunkhash].bundle.js",

			/**
			 * The filename of the SourceMaps for the JavaScript files.
			 * They are inside the output.path directory.
			 *
			 * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
			 */
			sourceMapFilename: "[file].map",

			/**
			 * The filename of non-entry chunks as relative path
			 * inside the output.path directory.
			 *
			 * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
			 */
			chunkFilename: "[name].[chunkhash].chunk.js"
		},

		module: {
			rules: [
				/**
				 * Extract CSS files from .src/styles directory to external CSS file
				 */
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: "css-loader"
					}),
					include: [helpers.root("src", "styles")]
				},

				/**
				 * Extract and compile SCSS files from .src/styles directory to external CSS file
				 */
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: "css-loader!sass-loader"
					}),
					include: [helpers.root("src", "styles")]
				},

				/**
				 * Extract and compile PCSS files from .src/styles directory to external CSS file
				 */
				{
					test: /\.pcss$/,
					loader: ExtractTextPlugin.extract({
						fallback: "style-loader",
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
									plugins: commonData.postcssPlugins
								}
							}
						]
					}),
					include: [helpers.root("src", "styles")]
				}
			]
		},

		/**
		 * Add additional plugins to the compiler.
		 *
		 * See: http://webpack.github.io/docs/configuration.html#plugins
		 */
		plugins: [
			/**
			 * Plugin: SourceMapDevToolPlugin
			 * Description: enables more fine grained control of source map generation
			 * See: https://webpack.js.org/plugins/source-map-dev-tool-plugin/
			 *
			 * This config gives the same results as using devtool: "devtool: 'source-map'"
			 * A full SourceMap is emitted as a separate file. It adds a reference comment to the bundle so development tools know where to find it.
			 * See: https://webpack.js.org/configuration/devtool
			 *
			 * IMPORTANT: this should be used instead of EvalSourceMapDevToolPlugin to avoid using eval() which violates CSP
			 */
			new SourceMapDevToolPlugin({
				filename: "[file].map[query]",
				moduleFilenameTemplate: "[resource-path]",
				fallbackModuleFilenameTemplate: "[resource-path]?[hash]",
				module: true, // default: true
				columns: true, // default: true
				sourceRoot: "webpack:///"
			}),

			/**
			 * Plugin: ExtractTextPlugin
			 * Description: Extracts imported CSS files into external stylesheet
			 *
			 * See: https://github.com/webpack/extract-text-webpack-plugin
			 */
			new ExtractTextPlugin("[name].[contenthash].css"),

			// TODO remove since it's probably useless here (defined in webpack.common.js)
			new PurifyPlugin() /* buildOptimizer */,

			/**
			 * See: https://webpack.js.org/plugins/hashed-module-ids-plugin/
			 */
			new HashedModuleIdsPlugin(),
			new ModuleConcatenationPlugin(),

			/**
			 * Plugin: UglifyJsPlugin
			 * Description: Minimize all JavaScript output of chunks.
			 * Loaders are switched into minimizing mode.
			 *
			 * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
			 *
			 * NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
			 */
			new UglifyJsPlugin({
				sourceMap: true,
				uglifyOptions: getUglifyOptions(supportES2015)
			})
		]
	});
};
