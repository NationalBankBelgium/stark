"use strict";

const helpers = require("./helpers");
const buildUtils = require("./build-utils");
const webpackMerge = require("webpack-merge"); // used to merge webpack configs
const commonConfig = require("./webpack-partial.common.js"); // the settings that are common to prod and dev
const ngCliUtils = require("./ng-cli-utils");

// Dev custom config
const webpackCustomConfig = require(helpers.root("config/webpack-custom-config.dev.json"));

const isProd = ngCliUtils.getNgCliCommandOption("prod");
const isHMR =
	ngCliUtils.getNgCliCommandOption("configuration") === "hmr" ||
	ngCliUtils.hasNgCliCommandOption("hmr") ||
	buildUtils.ANGULAR_APP_CONFIG.buildOptions.hmr;

const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
	ENV: isProd ? "production" : "development",
	BASE_URL: ngCliUtils.getNgCliCommandOption("baseHref") || buildUtils.ANGULAR_APP_CONFIG.buildOptions.baseHref,
	HMR: isHMR,
	AOT: ngCliUtils.hasNgCliCommandOption("aot") || buildUtils.ANGULAR_APP_CONFIG.buildOptions.aot,
	WATCH:
		!(ngCliUtils.hasNgCliCommandOption("watch") && ngCliUtils.getNgCliCommandOption("watch") === "false") &&
		!(buildUtils.ANGULAR_APP_CONFIG.buildOptions.watch === false), // by default is true
	environment: isHMR ? "hmr" : "dev",
	IS_DEV_SERVER: helpers.hasProcessFlag("serve") && !isProd // NG CLI command 'serve"
	// PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT  // TODO check if needed/useful in our case?
});

// Directives to be used in CSP header
const cspDirectives = [
	"base-uri 'self'",
	// "default-src 'self'", // FIXME: enable as soon as the issue is fixed in Angular (https://github.com/angular/angular-cli/issues/6872 )
	"child-src 'self'",
	"connect-src 'self' ws://" + METADATA.HOST + ":" + METADATA.PORT + " " + webpackCustomConfig["cspConnectSrc"], // ws://HOST:PORT" is due to Webpack
	`font-src 'self' ${webpackCustomConfig["cspFontSrc"] || ""}`,
	"form-action 'self' " + webpackCustomConfig["cspFormAction"],
	"frame-src 'self'", // deprecated. Use child-src instead. Used here because child-src is not yet supported by Firefox. Remove as soon as it is fully supported
	"frame-ancestors 'none'", // the app will not be allowed to be embedded in an iframe (roughly equivalent to X-Frame-Options: DENY)
	"img-src 'self' data: image/png", // data: image/png is due to ui-router visualizer loading PNG images
	"media-src 'self'",
	"object-src 'self'",
	"plugin-types application/pdf" // valid mime-types for plugins invoked via <object> and <embed>
	// "script-src 'self'", // FIXME: enable as soon as the issue is fixed in Angular (https://github.com/angular/angular-cli/issues/6872 )
	// "style-src 'self' 'nonce-uiroutervisualizer' 'nonce-cef324d21ec5483c8819cc7a5e33c4a2'" // we define the same nonce value as in the style-loader // FIXME: DomSharedStylesHost.prototype._addStylesToHost in platform-browser.js adds inline style!
];

/**
 * Webpack configuration
 *
 * See: https://webpack.js.org/configuration/
 */
module.exports = webpackMerge(commonConfig(METADATA), {
	module: {
		rules: [
			/**
			 * Prevent any external library from breaking support for Internet Explorer 11 (see https://github.com/NationalBankBelgium/stark/issues/900)
			 * Therefore, only certain libraries in 'node_modules' (except the biggest ones and the ones from NBB) are transpiled to ES5 with Babel
			 * reference: https://github.com/babel/babel-loader
			 */
			{
				test: /node_modules.*\.js$/,
				exclude: /node_modules.*(@angular|@mdi|@ng-idle|@nationalbankbelgium|@ngrx|@ngx-translate|@uirouter|cerialize|class-validator|core-js|ibantools|lodash|prettier|rxjs)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"@babel/preset-env",
								{
									// Environments you support/target. See https://babeljs.io/docs/en/babel-preset-env#targets
									targets: { ie: "11" }
								}
							]
						]
					}
				}
			}
		]
	},

	/**
	 * Webpack Development Server configuration
	 * Description: The webpack-dev-server is a little node.js Express server.
	 * The server emits information about the compilation state to the client,
	 * which reacts to those events.
	 *
	 * See: https://webpack.github.io/docs/webpack-dev-server.html
	 */
	devServer: {
		compress: true,

		// HTML5 History API support: no need for # in URLs
		// automatically redirect 404 errors to the index.html page
		// uses connect-history-api-fallback behind the scenes: https://github.com/bripkens/connect-history-api-fallback
		// reference: http://jaketrent.com/post/pushstate-webpack-dev-server/
		// historyApiFallback: true,

		// Can be used to add specific headers
		headers: {
			// enable CORS
			"Access-Control-Allow-Origin": "*",

			// TODO: enable CSP
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
