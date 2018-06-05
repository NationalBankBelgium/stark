import { NgModuleRef } from "@angular/core";

export interface Environment {
	production: boolean;
	hmr: boolean;
	ENV_PROVIDERS: any;
	decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
