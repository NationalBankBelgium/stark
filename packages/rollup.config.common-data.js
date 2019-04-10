"use strict";

// This configuration file contains common values we can reuse in the different rollup configuration files (at least parts of)

const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const sourcemaps = require("rollup-plugin-sourcemaps");

const globals = {
	"@angularclass/hmr": "angularclass.hmr",
	"@angular/animations": "ng.animations",
	"@angular/cdk": "ng.cdk",
	"@angular/cdk/a11y": "ng.cdk.a11y",
	"@angular/cdk/collections": "ng.cdk.collections",
	"@angular/cdk/coercion": "ng.cdk.coercion",
	"@angular/cdk/layout": "ng.cdk.layout",
	"@angular/core": "ng.core",
	"@angular/common": "ng.common",
	"@angular/common/http": "ng.common.http",
	"@angular/forms": "ng.forms",
	"@angular/material": "ngMaterial",
	"@angular/material/autocomplete": "ngMaterial.autocomplete",
	"@angular/material/button": "ngMaterial.button",
	"@angular/material/button-toggle": "ngMaterial.buttonToggle",
	"@angular/material/card": "ngMaterial.card",
	"@angular/material/checkbox": "ngMaterial.checkbox",
	"@angular/material/core": "ngMaterial.core",
	"@angular/material/datepicker": "ngMaterial.datepicker",
	"@angular/material/dialog": "ngMaterial.dialog",
	"@angular/material/divider": "ngMaterial.divider",
	"@angular/material/expansion": "ngMaterial.expansion",
	"@angular/material/form-field": "ngMaterial.formField",
	"@angular/material/icon": "ngMaterial.icon",
	"@angular/material/input": "ngMaterial.input",
	"@angular/material/list": "ngMaterial.list",
	"@angular/material/menu": "ngMaterial.menu",
	"@angular/material/paginator": "ngMaterial.paginator",
	"@angular/material/select": "ngMaterial.select",
	"@angular/material/sidenav": "ngMaterial.sidenav",
	"@angular/material/snack-bar": "ngMaterial.snack-bar",
	"@angular/material/sort": "ngMaterial.sort",
	"@angular/material/table": "ngMaterial.table",
	"@angular/material/tooltip": "ngMaterial.tooltip",
	"@angular/material-moment-adapter": "ngMaterialMomentAdapter",
	"@angular/platform-browser": "ng.platformBrowser",
	"@angular/platform-browser/animations": "ng.platformBrowser.animations",
	"@nationalbankbelgium/stark-core": "stark.core",
	"@nationalbankbelgium/stark-ui": "stark.ui",
	"@ngrx/store": "ngrx.store",
	"@ngrx/store-devtools": "ngrx.store.devtools",
	"@ngrx/effects": "ngrx.effects",
	"@ng-idle/core": "ngIdle.core",
	"@ng-idle/keepalive": "ngIdle.keepalive",
	"@ngx-translate/core": "ngxTranslate.core",
	"@uirouter/core": "uirouter.core",
	"@uirouter/angular": "uirouter.angular",
	"angular2-text-mask": "ng2TextMask",
	"class-validator": "class-validator",
	cerialize: "cerialize",
	ibantools: "ibantools",
	moment: "moment",
	"lodash-es/cloneDeep": "lodash-es.cloneDeep",
	"lodash-es/find": "lodash-es.find",
	"lodash-es/findIndex": "lodash-es.findIndex",
	"lodash-es/floor": "lodash-es.floor",
	"lodash-es/get": "lodash-es.get",
	"lodash-es/isEmpty": "lodash-es.isEmpty",
	"lodash-es/isEqual": "lodash-es.isEqual",
	"lodash-es/merge": "lodash-es.merge",
	"lodash-es/noop": "lodash-es.noop",
	"lodash-es/reduce": "lodash-es.reduce",
	"lodash-es/sortBy": "lodash-es.sortBy",
	"lodash-es/uniqueId": "lodash-es.uniqueId",
	nouislider: "nouislider",
	"prettier/standalone": "prettier.standalone",
	"prettier/parser-babylon": "prettier.parserBabylon",
	"prettier/parser-postcss": "prettier.parserPostcss",
	"prettier/parser-typescript": "prettier.parserTypescript",
	"pretty-data": "prettyData",
	prismjs: "Prism",
	"prismjs/components/prism-typescript.min.js": "Prism.languages.typescript",
	"prismjs/components/prism-sql.min.js": "Prism.languages.sql",
	"prismjs/components/prism-json.min.js": "Prism.languages.json",
	"prismjs/components/prism-css-extras.min.js": "Prism.languages.css.selector",
	"prismjs/components/prism-scss.min.js": "Prism.languages.scss",
	"text-mask-core": "textMaskCore",
	"text-mask-addons": "textMaskAddons",
	uuid: "uuid",

	rxjs: "rxjs",
	"rxjs/operators": "rxjs.operators"

	// TODO add lines such as the one below to make sure that stark modules that depend on other stark modules can find those
	// '@nationalbankbelgium/core': 'stark.core',
};

const plugins = [
	resolve({
		only: ["tslib"] // "tslib" should be the ONLY ONE resolved, the rest should be marked as externals!
	}),
	commonjs(), // converts date-fns to ES modules
	sourcemaps()
];

const output = {
	globals: globals,
	format: "umd", // modules with code should be converted to umd
	exports: "named",
	sourcemap: true
};

exports.output = output;
exports.external = Object.keys(globals);
exports.plugins = plugins;
