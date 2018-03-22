const path = require("path");

/**
 * Helper functions.
 */
// const ROOT = path.resolve(__dirname, '..');
const _root = path.resolve(process.cwd(), "."); // project root folder

const root = path.join.bind(path, _root);

exports.root = root;
