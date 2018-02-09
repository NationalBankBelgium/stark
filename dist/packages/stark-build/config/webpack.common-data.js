"use strict";

// The goal of this module is only to export common configuration data that the different Webpack configuration files use

// Helpers
const helpers = require("./helpers");

// Metadata
const starkAppMetadata = require(helpers.root("src/stark-app-metadata.json"));
const starkAppConfig = require(helpers.root("src/stark-app-config.json"));

// PostCSS Plugins
const postcssPlugins = [
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
];

exports.postcssPlugins = postcssPlugins;
exports.starkAppMetadata = starkAppMetadata;
exports.starkAppConfig = starkAppConfig;
