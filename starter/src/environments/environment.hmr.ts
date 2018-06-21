import { ApplicationRef, ComponentRef, NgModuleRef } from "@angular/core";
import { enableDebugTools } from "@angular/platform-browser";
import { Environment } from "./model";

// Ensure that we get detailed stack tracks during development (useful with node & Webpack)
// Reference: http://stackoverflow.com/questions/7697038/more-than-10-lines-in-a-node-js-stack-error
Error.stackTraceLimit = Infinity;
require("zone.js/dist/long-stack-trace-zone");

/**
 * @ignore
 */
export const environment: Environment = {
	production: false,
	hmr: true,

	/**
	 * Angular debug tools in the dev console
	 * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
	 * @param modRef - the module ref to decorate
	 */
	decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any> {
		const appRef: ApplicationRef = modRef.injector.get(ApplicationRef);
		const cmpRef: ComponentRef<any> = appRef.components[0];

		const _ng: any = (<any>window).ng;
		enableDebugTools(cmpRef);
		(<any>window).ng.probe = _ng.probe;
		(<any>window).ng.coreTokens = _ng.coreTokens;
		return modRef;
	},
	ENV_PROVIDERS: []
};
