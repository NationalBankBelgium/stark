# Environments support

## Environment.ts

In the `src/environments/model.ts` is provided the Environment interface as follows

```
...
export interface Environment {
	production: boolean;
	hmr: boolean;
	...
```

`production`, which is a boolean, will specify is your application runs under a production environment,
while `hmr` will indicate if it runs under a Hot Module Replacement environment.

This interface will then be defined by default in `src/environments/environment.ts`:

```
...
export const environment: Environment = {
	production: false,
	hmr: false,
	showDevModule: true,
	...
```

## How to find out which environment is your application is currently using?

All you have to do is to import the environment.ts constant anywhere you want in your application:

```
import { environment } from "environments/environment";
```

This way, you will be able to programmatically determine which environment is used in your app
with simple checks, as follows:

```
environment.production
// if the output of this line is true, we are in production environment.
// Otherwise, we are in hmr environment.
```

## How to add a new environment ?

First, create you new Ts file in the `src/environments` folder.

Then, make sure your new environment extends the `src/environments/model.ts` interface.

Finally, define the options and file replacement of your new environment in the `angular.json` file.

For exemple, the environment.dummyEnv.ts file:

```
import { enableProdMode, NgModuleRef } from "@angular/core";
import { disableDebugTools } from "@angular/platform-browser";
import { Environment } from "./model";

enableProdMode();

export const environment: Environment = {

	production: false,
	hmr: false,

	decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any> {
		disableDebugTools();
		return modRef;
	},
	ENV_PROVIDERS: []
}
```

And in the angular.json file:

```
 "dummyEnv" : {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
         "with": "src/environments/environment.dummyEnv.ts"
      }
    ]
  }
```
