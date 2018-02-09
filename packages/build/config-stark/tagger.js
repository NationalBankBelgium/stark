"use strict";

// This script will be executed as an npm "preversion" script.
//
// The goal of this script will be to :
// 1) if no local changes
// 2) then create a tag based on the current working copy remote url
const helpers = require("./helpers");
const packageConfig = require(helpers.root("package.json"));
var Client = require('svn-spawn');

const packageName = packageConfig.name.replace("@nationalbankbelgium/", "");
const packageVersion = packageConfig.version;
var scmRepoUrl = "";
var tagUrl = "";

console.log("package name : %s", packageName);
console.log("package version : %s", packageVersion);

Client.prototype.svnCopy = function (source, target, callback) {
	var self = this;
	self.session('silent', true).cmd(['copy', source, target, "-m", "Tagging"], callback);

};

var client = new Client({
	cwd: helpers.root("")
});


client.status(function (err, data) {
	console.log("Checking for local changes...");
	if (data.length != 0) {
		console.log("You have local changes, please commit your code before creating a tag...");
		process.exit(1);
	} else {
		client.getInfo(function (err, data) {
			if (!err === null) {
				console.log("an error occured in the svn client : %s", err);
			} else {
				console.log(JSON.stringify(data));

				scmRepoUrl = data.url;
				console.log('Repository url is %s', scmRepoUrl);
				if (!!~scmRepoUrl.indexOf("trunk")) {
					tagUrl = scmRepoUrl.replace("trunk", "tags");
					tagUrl = tagUrl.concat("/", packageName, "-", packageVersion);
				} else {
					if (!!~scmRepoUrl.indexOf("branches")) {
						tagUrl = scmRepoUrl.replace("branches", "tags");
						tagUrl = tagUrl.substr(0, tagUrl.lastIndexOf("/"));
						tagUrl = tagUrl.concat("/", packageName, "-", packageVersion);
					}
					else {
						console.log("cannot detect if working copy is a branch or a tag.");
						process.exit(1);
					}
				}
				console.log("tag url will be : %s", tagUrl);
				client.svnCopy(scmRepoUrl,tagUrl,function(err, data){
					console.log("error is %s",err);
					console.log("data is %s",data);
				});
			}
		});
	}

});



