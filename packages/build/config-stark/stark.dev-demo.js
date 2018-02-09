"use strict";

const spawn = require('child_process').spawn;
const helpers = require("./helpers");
const fs = require('fs');

var starkAppConfig = require(helpers.root("/src/stark-app-config.json"));
var starkWebpackCustomConfig = require(helpers.root("/config/webpack-custom-config.dev.json"));
var jsonServerBackends = [];


if (process.argv.length > 2) {
	starkAppConfig = getAppConfigCLI(process.argv.slice(2), starkAppConfig);
	fs.writeFileSync(helpers.root("/src/stark-app-config.json"), JSON.stringify(starkAppConfig));
	starkWebpackCustomConfig = getWebpackCustomConfigCLI(starkWebpackCustomConfig, jsonServerBackends);
	fs.writeFileSync(helpers.root("/config/webpack-custom-config.dev.json"), JSON.stringify(starkWebpackCustomConfig));
}

function getAppConfigCLI(args, defaultConfig) {
	let backends = [];
	let ports = [];
	let host = "localhost";

	args.forEach((arg) => {
		let param = arg.split("=");
		switch (param[0]) {
			case "--port":
			case "-p":
				if (ports.indexOf(param[1]) < 0) {
					ports.push(param[1]);
				}
				break;
			case "--host":
			case "-h":
				host = param[1];
				break;
		}
	});

	Object.keys(defaultConfig.backends).forEach(function (property) {
		if (defaultConfig.backends[property].mock && defaultConfig.backends[property].mock === 'json-server') {
			if (ports.length > 0) {
				defaultConfig.backends[property].url = "http://"+host+":"+ports[0];
				backends.push("http://"+host+":"+ports[0]);
			}
			if (ports.length > 1) {
				ports = ports.slice(1);
			}
		}
	});

	jsonServerBackends = backends;
	return defaultConfig;
}

function getWebpackCustomConfigCLI(defaultConfig, backends) {
	backends.forEach((backend) => {
		if (defaultConfig["cspConnectSrc"].indexOf(backend) < 0) {
			defaultConfig["cspConnectSrc"] += " " + backend;
		}
		if (defaultConfig["cspFormAction"].indexOf(backend) < 0) {
			defaultConfig["cspFormAction"] += " " + backend;
		}
	});

	return defaultConfig;
}

const jsonServer = spawn('npm', ['run', 'json-server'], {stdio: 'inherit', shell: true});
jsonServer.on('close', () => {
	console.log('caught child\'s jsonServer close');
	process.kill();
	process.exit();
});

jsonServer.on('exit', () => {
	console.log('caught child\'s jsonServer exit');
	jsonServer.kill();
});

const demoStark = spawn('npm', ['start'], {stdio: 'inherit', shell: true});
demoStark.on('close', () => {
	console.log('caught child\'s '+ starkAppConfig.logApplicationId +' close');
	process.kill();
	process.exit();
});

demoStark.on('exit', () => {
	console.log('caught child\'s '+ starkAppConfig.logApplicationId +' exit');
	demoStark.kill();
});


process.on('exit', () => {
	console.log('caught process exit');
	process.kill(-jsonServer.pid);
	process.kill(-demoStark.pid);
	jsonServer.kill();
	demoStark.kill();
});

process.on('SIGINT', () => {
	jsonServer.kill();
	demoStark.kill();
});

process.on('uncaughtException', () => {
	jsonServer.kill();
	demoStark.kill();
});
