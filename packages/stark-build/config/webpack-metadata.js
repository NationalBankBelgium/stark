// Helpers
const helpers = require("./helpers");
const ngCliUtils = require("./ng-cli-utils");
const buildUtils = require("./build-utils");

const isProd =
	ngCliUtils.hasNgCliCommandOption("prod") ||
	ngCliUtils.getNgCliCommandOption("c") === "production" ||
	ngCliUtils.getNgCliCommandOption("configuration") === "production";
const configENV = isProd ? "production" : "development";

const isHMR =
	ngCliUtils.getNgCliCommandOption("configuration") === "hmr" || ngCliUtils.hasNgCliCommandOption("hmr") || isProd
		? buildUtils.ANGULAR_APP_CONFIG.buildConfigurations.production.hmr
		: buildUtils.ANGULAR_APP_CONFIG.buildOptions.hmr || false;

const isWatch =
	ngCliUtils.getNgCliAction() === "serve" ||
	(ngCliUtils.hasNgCliCommandOption("watch") && ngCliUtils.getNgCliCommandOption("watch") === "true") ||
	buildUtils.getAngularWorkspaceBuildProperty("baseHref", configENV) === true;

const METADATA = {
	// Default value in production: `true`, otherwise: `false`. See: https://v8.angular.io/guide/aot-compiler#choosing-a-compiler
	AOT: ngCliUtils.hasNgCliCommandOption("aot") || buildUtils.getAngularWorkspaceBuildProperty("aot", configENV) || isProd,
	BASE_URL: ngCliUtils.getNgCliCommandOption("baseHref") || buildUtils.getAngularWorkspaceBuildProperty("baseHref", configENV),
	E2E: ngCliUtils.getNgCliAction("e2e"),
	ENV: configENV,
	HOST:
		ngCliUtils.getNgCliAction() === "serve"
			? ngCliUtils.getNgCliCommandOption("host") || buildUtils.getAngularWorkspaceServeProperty("host", configENV) || "localhost"
			: undefined, // by default is "localhost"
	HMR: isHMR,
	// PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT  // TODO check if needed/useful in our case?
	IS_DEV_SERVER: ngCliUtils.getNgCliAction() === "serve" && !isProd, // NG CLI command 'serve"
	PORT:
		ngCliUtils.getNgCliAction() === "serve"
			? ngCliUtils.getNgCliCommandOption("port") || buildUtils.getAngularWorkspaceServeProperty("port", configENV) || 4200
			: undefined, // by default is 4200
	TITLE: "Stark Application by @NationalBankBelgium",
	TS_CONFIG_PATH: buildUtils.ANGULAR_APP_CONFIG.buildOptions.tsConfig,
	WATCH: isWatch,
	environment: isProd ? (helpers.hasProcessFlag("e2e") ? "e2e.prod" : "prod") : isHMR ? "hmr" : "dev"
};

exports.METADATA = METADATA;
