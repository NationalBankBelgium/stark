"use strict";

const webpack = require("webpack");

const webpackMerge = require("webpack-merge"); // Used to merge webpack configs
const commonConfig = require("./webpack.common.js"); // common configuration between environments
const commonData = require("./webpack.common-data.js"); // common configuration between environments

// Helpers
const helpers = require("./helpers");

// Dev custom config
const webpackCustomConfig = require(helpers.root("config/webpack-custom-config.dev.json"));

// Webpack Plugins
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin');
// const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

// Metadata
const METADATA = {
	HOST: process.env.HOST || "localhost",
	PORT: parseInt(process.env.PORT, 10) || 3000,
	ENV: process.env.ENV = process.env.NODE_ENV = "development",
	HMR: helpers.hasProcessFlag("hot"),
	PRODUCTION: false,
	DEVELOPMENT: true
};

// Directives to be used in CSP header
const cspDirectives = [
	"base-uri 'self'",
	"default-src 'self'",
	"child-src 'self'",
	"connect-src 'self' ws://" + METADATA.HOST + ":" + METADATA.PORT + " " + webpackCustomConfig["cspConnectSrc"], // ws://HOST:PORT" is due to Webpack
	"font-src 'self'",
	"form-action 'self' " + webpackCustomConfig["cspFormAction"],
	"frame-src 'self'",   // deprecated. Use child-src instead. Used here because child-src is not yet supported by Firefox. Remove as soon as it is fully supported
	"frame-ancestors 'none'",  // the app will not be allowed to be embedded in an iframe (roughly equivalent to X-Frame-Options: DENY)
	"img-src 'self' data: image/png",  // data: image/png" is due to Angular Material loading PNG images in base64 encoding
	"media-src 'self'",
	"object-src 'self'",
	"plugin-types application/pdf",  // valid mime-types for plugins invoked via <object> and <embed>
	"script-src 'self' 'nonce-cefb24121ec5443c8819cc7c5e33c4a2'",
	"style-src 'self' 'nonce-cef324d21ec5483c8819cc7a5e33c4a2'" // We define the same nonce value via the $mdThemingProvider (https://material.angularjs.org/HEAD/api/service/$mdThemingProvider)
];

/*
 * Config
 * IMPORTANT: notice that the configuration below is MERGED with the common configuration (commonConfig)
 * reference: https://webpack.js.org/configuration
 */
module.exports = webpackMerge(commonConfig, {
	// Developer tool to enhance debugging
	// reference: https://webpack.js.org/configuration/devtool
	// reference: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
	devtool: "cheap-module-source-map",

	// the entry point for the bundles
	// reference: https://webpack.js.org/configuration/entry-context/#entry
	entry: {
		// main entries
		"polyfills": helpers.root("src/polyfills.ts"),
		"vendor-styles": helpers.root("src/vendor-styles.ts"),
		"main-styles": helpers.root("src/main-styles.ts"), // our angular app's styles. Useful only changing the styles bundle while working on styling
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
			"HMR": METADATA.HMR,
			"PRODUCTION": METADATA.PRODUCTION,
			"DEVELOPMENT": METADATA.DEVELOPMENT,
			"process.env": {
				"ENV": JSON.stringify(METADATA.ENV),
				"NODE_ENV": JSON.stringify(METADATA.ENV),
				"HMR": METADATA.HMR,
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
				"main",
				"vendor-styles",
				"main-styles"
			]),
			// the filename configured in the output section is reused
			//filename: "[name].[hash].bundle.js",
			chunks: Infinity
		}),

		// // Plugin: Uglify
		// // Description: minify code, compress, ...
		// // reference: https://webpack.js.org/plugins/uglifyjs-webpack-plugin
		// new UglifyJsPlugin({
		// 	beautify: false, // set to true for debugging
		// 	//dead_code: false, // uncomment for debugging
		// 	//unused: false, // uncomment for debugging
		// 	mangle: { // reference: https://github.com/mishoo/UglifyJS2#mangle-options
		// 		screw_ie8: true,
		// 		keep_fnames: true,
		// 		except: [
		// 			// list strings that should not be mangled here
		// 		]
		// 	},
		// 	compress: { // reference: https://github.com/mishoo/UglifyJS2#compress-options
		// 		screw_ie8: true,
		// 		warnings: false
		// 		// uncomment for debugging
		// 		//,
		// 		//keep_fnames: true,
		// 		//drop_debugger: false,
		// 		//dead_code: false,
		// 		//unused: false
		// 	},
		// 	comments: false, // set to true for debugging
		// 	sourceMap: false
		// }),

		// Plugin: ExtractTextWebpackPlugin
		// Description: Extract css file contents
		// reference: https://github.com/webpack/extract-text-webpack-plugin
		// notice that in DEV we do not add hashes to the stylesheet file names
		new ExtractTextWebpackPlugin({
			filename: "[name].css",
			disable: false,
			allChunks: true
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
				"main",
				"vendor-styles",
				"main-styles"
			]),
			metadata: METADATA,
			inject: "body", //  true (default) or  "body" are the same
			starkAppMetadata: commonData.starkAppMetadata,
			starkAppConfig: commonData.starkAppConfig
		}),

		// this plugin makes sure that bundles and assets are written to disk
		// this is necessary so that assets are available in dev mode
		// reference: https://www.npmjs.com/package/write-file-webpack-plugin
		new WriteFilePlugin(),

		// reference: https://webpack.js.org/plugins/loader-options-plugin
		new LoaderOptionsPlugin({
			// Switch loaders to debug mode
			debug: true,
			options: {
				context: __dirname,

				// Html loader for HTML minification (advanced options)
				// reference: https://github.com/webpack/html-loader#advanced-options
				htmlLoader: commonData.htmlLoader.dev,

				// TSLint configuration
				// Static analysis linter for TypeScript advanced options configuration
				// Description: An extensible linter for the TypeScript language.
				// reference: https://github.com/wbuchwalter/tslint-loader
				tslint: commonData.tslint.dev
			}
		}),

		// Plugin: Stylelint
		// Description: Lints the stylesheets loaded in the app (pcss, scss, css, sass)
		// reference https://github.com/JaKXz/stylelint-webpack-plugin
		new StylelintPlugin({
			configFile: ".stylelintrc",
			emitErrors: false,
			files: ["src/**/*.?(pc|sc|c|sa)ss"]  // pcss|scss|css|sass
		}),

		new CircularDependencyPlugin({
			// exclude detection of files based on a RegExp
			exclude: /node_modules/,
			// log warnings to webpack
			failOnError: false
		})

		// new webpack.HotModuleReplacementPlugin()
	],

	// Webpack Development Server configuration
	// Description: The webpack-dev-server is a little node.js Express server.
	// The server emits information about the compilation state to the client,
	// which reacts to those events.
	// reference: https://webpack.js.org/configuration/dev-server/
	devServer: {
		port: METADATA.PORT,
		host: METADATA.HOST,
		inline: true,
		compress: true,
		overlay: {
			errors: false,
			warnings: false
		},
		// hot: true,

		// HTML5 History API support: no need for # in URLs
		// automatically redirect 404 errors to the index.html page
		// uses connect-history-api-fallback behind the scenes: https://github.com/bripkens/connect-history-api-fallback
		// reference: http://jaketrent.com/post/pushstate-webpack-dev-server/
		historyApiFallback: true,

		// Due to a security fix of Webpack Server, we enable this option to permit the access to the application when running on 0.0.0.0
		// reference: https://github.com/webpack/webpack-dev-server/releases/tag/v2.4.3
		disableHostCheck: true,

		// file watch configuration
		// reference: https://webpack.js.org/configuration/watch/
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		contentBase: helpers.root("dist"), // necessary so that all the content is available (e.g., app assets, stark assets, ...)

		// Can be used to add specific headers
		headers: {
			// enable CORS
			"Access-Control-Allow-Origin": "*",

			// CSP header (and its variants per browser)
			"Content-Security-Policy": cspDirectives.join(" ; "),
			"X-Content-Security-Policy": cspDirectives.join(" ; "),
			"X-WebKit-CSP": cspDirectives.join(" ; "),

			// Other security headers

			// protect against clickjacking: https://en.wikipedia.org/wiki/Clickjacking
			// reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/X-Frame-Options
			"X-Frame-Options": "deny",

			// enable some protection against XSS
			// reference: https://www.owasp.org/index.php/List_of_useful_HTTP_headers
			"X-Xss-Protection": "1; mode=block",

			// protect against drive-by download attacks and user uploaded content that could be treated by Internet Explorer as executable or dynamic HTML files
			// reference: https://www.owasp.org/index.php/List_of_useful_HTTP_headers
			"X-Content-Type-Options": "nosniff"
		}
	}
});


//FIXME review for Webpack 2: might not be needed. We might have to switch back to HMR by default..
// Configure live reloading
// By default, if Hot Module Replacement (HMR) is enabled and the --inline flag is passed to Webpack
// then id adds the following bundle as entry: https://github.com/webpack/webpack/blob/master/hot/dev-server.js
// that script takes care of HMR but reloads the whole page when HMR does not work (e.g., when a stylesheet changes)

// With the following, if HMR is enabled but --inline was not specified, we disable the page reloads for cases when HMR does not work
// reference: https://github.com/webpack/webpack/issues/418

if (helpers.hasProcessFlag("hot")) {
	if (!helpers.hasProcessFlag("inline")) {
		// adds the following script: https://github.com/webpack/webpack/blob/master/hot/only-dev-server.js
		// that script handles HMR but does NOT force a page reload
		module.exports.entry["webpack-dev-server"] = helpers.root("node_modules/webpack/hot/only-dev-server");
	}
}
