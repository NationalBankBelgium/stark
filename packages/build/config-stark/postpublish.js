'use strict';
const spawnSync = require('child_process').spawnSync;

console.log("Logout from publishConfig registry after publishing...");

spawnSync('npm', ['logout', '--registry=http://nexus.prd.nbb:81/repository/nbb-npm-internal/'],
	{stdio: 'inherit', shell: true});

console.log("Logout done...");





