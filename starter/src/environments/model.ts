import { NgModuleRef } from "@angular/core";

/**
 * Interface implemented by all environments
 */
export interface Environment {
	/**
	 * @ignore
	 */
	production: boolean;
	/**
	 * @ignore
	 */
	hmr: boolean;
	/**
	 * @ignore
	 */
	ENV_PROVIDERS: any;
	/**
	 * @ignore
	 */
	decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
