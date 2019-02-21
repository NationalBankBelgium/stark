"use strict";

// The goal of this module is only to export common configuration data that the different Webpack configuration files use

// Helpers
const helpers = require("./helpers");

// Metadata
const starkAppMetadata = require(helpers.root("src/stark-app-metadata.json"));
const starkAppConfig = require(helpers.root("src/stark-app-config.json"));

exports.starkAppMetadata = starkAppMetadata;
exports.starkAppConfig = starkAppConfig;
