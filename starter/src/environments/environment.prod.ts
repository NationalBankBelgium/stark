import { enableProdMode, NgModuleRef } from "@angular/core";
import { disableDebugTools } from "@angular/platform-browser";
import { StarkEnvironment } from "@nationalbankbelgium/stark-core";

enableProdMode();

/**
 * @ignore
 */
export const environment: StarkEnvironment = {
	production: true,
	hmr: false,

	/**
	 * Angular debug tools in the dev console
	 * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
	 * @param modRef - NgModule Instance created by Angular for a given platform.
	 */
	decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any> {
		disableDebugTools();
		return modRef;
	},
	ENV_PROVIDERS: []
};
