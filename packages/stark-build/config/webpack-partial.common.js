"use strict";

const helpers = require("./helpers");
const fs = require("fs");
const commonData = require("./webpack.common-data.js"); // common configuration between environments
const buildUtils = require("./build-utils");
const ngCliPackageChunkSort = require("@angular-devkit/build-angular/src/angular-cli-files/utilities/package-chunk-sort");

/**
 * Webpack Plugins
 *
 */
const IndexHtmlWebpackPlugin = require("@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin")
	.IndexHtmlWebpackPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BaseHrefWebpackPlugin = require("base-href-webpack-plugin").BaseHrefWebpackPlugin;
const DefinePlugin = require("webpack/lib/DefinePlugin");
const HtmlElementsWebpackPlugin = require("html-elements-webpack-plugin");
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const WebpackMonitor = require("webpack-monitor");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const WriteFilePlugin = require("write-file-webpack-plugin");
// const StylelintPlugin = require("stylelint-webpack-plugin");
// const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");
// const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

const fixedTSLintConfig = buildUtils.getFixedTSLintConfig(
	buildUtils.get(buildUtils.ANGULAR_APP_CONFIG.config, "architect.lint.options.tslintConfig", "tslint.json")
);

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = metadata => {
	const isProd = metadata.ENV === "production";
	const METADATA = metadata;

	const MONITOR = !!process.env.MONITOR; // env MONITOR variable set via cross-env

	const BUNDLE_ANALYZER = !!process.env.BUNDLE_ANALYZER; // env BUNDLE_ANALYZER variable set via cross-env

	return {
		/**
		 * Stats lets you precisely control what bundle information gets displayed
		 * reference: https://webpack.js.org/configuration/stats/
		 */
		stats: {
			assets: true,
			children: true,
			chunks: true,
			chunkModules: false,
			chunkOrigins: false,
			colors: true,
			errors: true,
			errorDetails: true, // display error details. Same as the --show-error-details flag,
			hash: true,
			modules: true,
			moduleTrace: true,
			performance: true,
			reasons: false,
			source: true,
			timings: true,
			version: true,
			warnings: true
		},

		/**
		 * Options affecting the normal modules.
		 *
		 * See: https://webpack.js.org/configuration/module
		 */
		module: {
			// FIXME Remove the following line once Prettier 2.0.0 is released. See: https://github.com/NationalBankBelgium/stark/issues/1483
			noParse: /prettier\/parser-typescript/,

			rules: [
				/**
				 * TSLint loader support for *.ts files
				 * @see https://github.com/wbuchwalter/tslint-loader
				 */
				{
					enforce: "pre",
					test: /\.ts$/,
					use: [
						{
							loader: "tslint-loader",
							options: {
								typeCheck: false, // FIXME enable type checking when it is improved in tslint-loader (https://github.com/wbuchwalter/tslint-loader/pull/114)
								tsconfig: buildUtils.ANGULAR_APP_CONFIG.buildOptions.tsconfig || "tsconfig.json",
								configFile: fixedTSLintConfig //FIXME use the configured tslint.json when type checking is enabled
							}
						}
					],
					exclude: [helpers.root("node_modules")]
				}
			]
		},

		/**
		 * Add additional plugins to the compiler.
		 *
		 * See: https://webpack.js.org/configuration/plugins
		 */
		plugins: [
			// TODO: cannot enable this WriteFilePlugin due to Error: Content and Map of this Source is no longer available (only size() is supported)
			// /**
			//  * Plugin: WriteFilePlugin
			//  * Description: This plugin makes sure that bundles and assets are written to disk
			//  * this is necessary so that assets are available in dev mode
			//  * See: https://www.npmjs.com/package/write-file-webpack-plugin
			//  */
			// new WriteFilePlugin(),

			/**
			 * Plugin: DefinePlugin
			 * Description: Define free variables.
			 * Useful for having development builds with debug logging or adding global constants.
			 *
			 * Environment helpers
			 * IMPORTANT: when adding more properties make sure you include them in typings/environment.d.ts
			 *
			 * See: https://webpack.js.org/plugins/define-plugin
			 */
			new DefinePlugin({
				ENV: JSON.stringify(METADATA.ENV),
				HMR: METADATA.HMR,
				AOT: METADATA.AOT, // TODO: is this needed?
				"process.env": {
					ENV: JSON.stringify(METADATA.ENV),
					NODE_ENV: JSON.stringify(METADATA.ENV),
					HMR: METADATA.HMR
				}
			}),

			/**
			 * Plugin: HtmlWebpackPlugin
			 * Description: Simplifies creation of HTML files to serve your webpack bundles.
			 * This is especially useful for webpack bundles that include a hash in the filename
			 * which changes every compilation.
			 *
			 * See: https://github.com/jantimon/html-webpack-plugin
			 */
			new HtmlWebpackPlugin({
				template: "!!ejs-loader!src/index.html",
				title: METADATA.TITLE,
				chunksSortMode: function(a, b) {
					// generated entry points will include those from styles config
					// const entryPoints = ["runtime", "polyfills", "sw-register", "styles", "vendor", "main"];
					// logic extracted from getBrowserConfig function in @angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js
					const entryPoints = ngCliPackageChunkSort.generateEntryPoints(buildUtils.ANGULAR_APP_CONFIG.buildOptions);
					return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
				},
				metadata: METADATA,
				inject: "body", //  true (default) or  "body" are the same
				starkAppMetadata: commonData.starkAppMetadata,
				starkAppConfig: commonData.starkAppConfig, // TODO: shall we remove it?
				// xhtml: true, // TODO: why XHTML?
				minify: isProd
					? {
							caseSensitive: true,
							collapseWhitespace: true,
							keepClosingSlash: true
					  }
					: false
			}),

			/**
			 * Plugin: BaseHrefWebpackPlugin
			 * Description: Extension for html-webpack-plugin to programmatically insert or update <base href="" /> tag.
			 * Therefore, HtmlWebpackPlugin should also be installed
			 *
			 * See: https://github.com/dzonatan/base-href-webpack-plugin
			 */
			new BaseHrefWebpackPlugin({ baseHref: buildUtils.ANGULAR_APP_CONFIG.baseHref }),

			/**
			 * Plugin: ScriptExtHtmlWebpackPlugin
			 * Description: Enhances html-webpack-plugin functionality
			 * with different deployment options for your scripts including:
			 *
			 * See: https://github.com/numical/script-ext-html-webpack-plugin
			 */
			// TODO evaluate this
			// new ScriptExtHtmlWebpackPlugin({
			// 	sync: /inline|polyfills|vendor/,
			// 	defaultAttribute: 'async',
			// 	preload: [/polyfills|vendor|main/],
			// 	prefetch: [/chunk/]
			// }),

			/**
			 * Plugin: InlineManifestWebpackPlugin
			 * Inline Webpack's manifest.js in index.html
			 *
			 * https://github.com/szrenwei/inline-manifest-webpack-plugin
			 */
			// TODO evaluate this
			// new InlineManifestWebpackPlugin(),

			/**
			 * Plugin: WriteFilePlugin
			 * Description: This plugin makes sure that bundles and assets are written to disk
			 * this is necessary so that assets are available in dev mode
			 * See: https://www.npmjs.com/package/write-file-webpack-plugin
			 */
			// TODO evaluate this
			// new WriteFilePlugin(),

			/**
			 * Generate html tags based on javascript maps.
			 *
			 * If a publicPath is set in the webpack output configuration, it will be automatically added to
			 * href attributes, you can disable that by adding a "=href": false property.
			 * You can also enable it to other attribute by settings "=attName": true.
			 *
			 * The configuration supplied is map between a location (key) and an element definition object (value)
			 * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
			 *
			 * Example:
			 *  Adding this plugin configuration
			 *  new HtmlElementsWebpackPlugin({
			 *  headTags: { ... }
			 *  })
			 *
			 * Means we can use it in the template like this:
			 * <%= webpackConfig.htmlElements.headTags %>
			 *
			 * @link : https://github.com/fulls1z3/html-elements-webpack-plugin
			 *
			 */
			...(fs.existsSync(helpers.root("config/index-head-config.js"))
				? [
						new HtmlElementsWebpackPlugin({
							headTags: require(helpers.root("config/index-head-config"))
						})
				  ]
				: []),

			/**
			 * Plugin: ContextReplacementPlugin
			 * Description: allows to override the inferred information in a 'require' context
			 * Including only a certain set of Moment locales
			 *
			 * See: https://webpack.js.org/plugins/context-replacement-plugin/
			 */
			// TODO Change with moment-locales-webpack-plugin
			new ContextReplacementPlugin(/moment[\/\\]locale$/, /(de|fr|en-gb|nl|nl-be)\.js/),

			/**
			 * Plugin: WebpackMonitor
			 * Description: Gives information about the bundle size
			 * See: https://github.com/webpackmonitor/webpackmonitor
			 */
			...(MONITOR
				? [
						new WebpackMonitor({
							capture: true, // -> default 'true'
							target: helpers.root("reports/webpack-monitor/stats.json"), // default -> '../monitor/stats.json'
							launch: true, // -> default 'false'
							port: 3030, // default 8081
							excludeSourceMaps: true // default 'true'
						})
				  ]
				: []),

			/**
			 * Plugin: BundleAnalyzerPlugin
			 * Description: Visualizes size of webpack output files with an interactive zoomable treemap.
			 * See: https://github.com/webpack-contrib/webpack-bundle-analyzer
			 */
			...(BUNDLE_ANALYZER
				? [
						new BundleAnalyzerPlugin({
							generateStatsFile: true, // default 'false'
							statsFilename: helpers.root("reports/bundle-analyzer/stats.json"), // default -> 'stats.json'
							openAnalyzer: true, //default 'true'
							analyzerPort: 3030 // default 8888
						})
				  ]
				: []),

			/**
			 * Internally, NG CLI uses its own IndexHtmlWebpackPlugin.
			 * So we override this to generate a "dummy" index html that won't be used.
			 * The "index.html" that will be used is the one generated with the HtmlWebpackPlugin.
			 */
			new IndexHtmlWebpackPlugin({
				input: "src/index.html",
				output: ".ng-cli.index.html"
			})

			// TODO: StylelintWebpackPlugin breaks the build: the assets are not copied
			// /**
			//  * Plugin: Stylelint
			//  * Description: Lints the stylesheets loaded in the app (pcss, scss, css, sass)
			//  * See: https://github.com/JaKXz/stylelint-webpack-plugin
			//  */
			// new StylelintPlugin({
			// 	configFile: ".stylelintrc",
			// 	emitErrors: false,
			// 	files: ["src/**/*.?(pc|sc|c|sa)ss"] // pcss|scss|css|sass
			// }),
		]
	};
};
