/**
 * @author: tipe.io
 */
const path = require('path');

const EVENT = process.env.npm_lifecycle_event || '';

/**
 * Helper functions.
 */
// const ROOT = path.resolve(__dirname, '..');
const _root = path.resolve(process.cwd(), "."); // project root folder
const _rootStark = path.resolve(process.cwd(), "node_modules/@nationalbankbelgium/stark"); // stark root folder

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}

// function rootStark(args){
//   args = Array.prototype.slice.call(arguments, 0);
//   //console.log("dirname "+ __dirname);
//   //console.log("process.cwd " + process.cwd());
//   //console.log("stark path: ",path.join.apply(path, [_rootStark].concat(args)));
//   return path.join.apply(path, [_rootStark].concat(args));
// }

const root = path.join.bind(path, _root);
const rootStark = path.join.bind(path, _rootStark);

exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
exports.rootStark = rootStark;
