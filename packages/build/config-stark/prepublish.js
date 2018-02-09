'use strict';
const spawnSync = require('child_process').spawnSync;

console.log("Login to publishConfig registry for publishing...");

spawnSync('npm', ['login', '--registry=http://nexus.prd.nbb:81/repository/nbb-npm-internal/'],
	{stdio: 'inherit', shell: true});

console.log("Starting to publish...");

/*

 Here are a list of variables that are needed to publish
 _auth=cHItZGVwbG95bWVudDpkdW1teQ==
 always-auth=true
 registry=http://nexus.prd.nbb:85/nexus/content/repositories/NBB-NPM-internal/
 email=pr-deployment

*/




