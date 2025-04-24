# Upgrade to Angular 16

This guide will help you to upgrade your Angular application to Angular 16. It is recommended to upgrade to Angular 15 first before upgrading to Angular 16.

## Before you start

make sure you use node 20

If you are on Windows, please use Git Bash or WSL to execute commands.

### Update dependencies

```json
	/* from */
	"@nationalbankbelgium/stark-core": "12.0.0-beta.2",
	"@nationalbankbelgium/stark-rbac": "12.0.0-beta.2",
	"@nationalbankbelgium/stark-ui": "12.0.0-beta.2",
	"@nationalbankbelgium/ngx-form-errors": "2.0.0-rc.2",

	/* to */

	"@nationalbankbelgium/stark-core": "^12.0.0",
	"@nationalbankbelgium/stark-rbac": "^12.0.0",
	"@nationalbankbelgium/stark-ui": "^12.0.0",
	"@nationalbankbelgium/ngx-form-errors": "^2.0.1",
```

### Update devDependencies

```json
	/* from */
	"@nationalbankbelgium/stark-build": "12.0.0-beta.2",
	"@nationalbankbelgium/stark-testing": "12.0.0-beta.2",

	/* to */
	"@nationalbankbelgium/stark-build": "^12.0.0",
	"@nationalbankbelgium/stark-testing": "^12.0.0",
```

### Remove Lodash version from package.json

```json
	/* remove */
    "@types/lodash":"4.14.195",
```

### install dependencies

```shell
npm install
```

### Commit your changes before executing angular schematics

Because the schematics want to run on clean workspace, you must commit your changes before executing the following command

```shell
npx ng update @angular/cli@16 @angular/core@16 @angular/material@16
```

### update your tsconfig.json

```json
{
  "extends": "@nationalbankbelgium/code-style/tsconfig/5.1.x/ng16",
  "compilerOptions": {
    "baseUrl": "./src",
    "outDir": "./dist",
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@nationalbankbelgium/stark-build/typings",
      "./node_modules/@nationalbankbelgium/stark-ui/typings"
    ],
    "paths": {}
  },
  "exclude": ["node_modules", "dist", "src/assets"]
}
```

### update eslint-config in package.json

```json
...
"devDependencies": {
	...
	"@nationalbankbelgium/eslint" : "^16.0.0",
	...
}
...
```

### remove script

in `package.json` remove the following script

```json
"scripts": {
	...
	"ngcc": "ngcc",
	"ponstinstall": "... && ngcc ...",
	...
}
```

### adapt `karma.conf.js`

```txt
	//lines to removed

	// Puppeteer: https://github.com/GoogleChrome/puppeteer/
	// takes care of download Chrome and making it available (can do much more :p)
	process.env.CHROME_BIN = require("puppeteer").executablePath();
```

### test

- remove `node_module` directory
- remove `package-lock.json` file
- run `npm i`
- run `npm run lint`
- run `npm run test`
- run `npm run start`
