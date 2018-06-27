import { enableProdMode, NgModuleRef } from "@angular/core";
import { disableDebugTools } from "@angular/platform-browser";
import { APP_BASE_HREF } from "@angular/common";
import { StarkEnvironment } from "@nationalbankbelgium/stark-core";

enableProdMode();

/**
 * This factory constructs the final baseHref based on the path location of the Showcase app in GitHub Pages
 */
export function appBaseHrefFactory(): string {
	// the final url in GitHub Pages will be something like "/showcase/latest/" or "/showcase/some-version/"
	const finalUrlRegex: RegExp = /(\/showcase\/[\d\D][^\/]+(\/|\/$|$))/;
	const trailingSlashRegex: RegExp = /\/$/;
	const matches: RegExpExecArray | null = finalUrlRegex.exec(window.location.pathname);

	let finalBaseHref: string = "";

	if (matches && matches[1]) {
		finalBaseHref = matches[1];
	}

	// add a trailing slash to the url in case it doesn't have any
	if (!finalBaseHref.match(trailingSlashRegex)) {
		finalBaseHref = finalBaseHref + "/";
	}

	return finalBaseHref;
}

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
	ENV_PROVIDERS: [
		{ provide: APP_BASE_HREF, useFactory: appBaseHrefFactory } // the baseHref is defined via the Angular provider instead of the angular.json file
	]
};
