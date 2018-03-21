import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Ng2StateDeclaration, UIRouterModule } from "@uirouter/angular";

import { DEV_MODULE_STATES } from "./dev-module.routes";
import { DevModuleComponent } from "./dev-module.component";
import { routerChildConfigFn } from "../router.config";

/*
      Don't leave side-effects outside of classes so this will tree-shake nicely on prod
      e.g. `console.log('something')` is a side effect.
*/
@NgModule({
	declarations: [DevModuleComponent],
	imports: [
		CommonModule,
		UIRouterModule.forChild({
			states: DEV_MODULE_STATES,
			config: routerChildConfigFn
		})
	]
})
export class DevModuleModule {
	public static routes: Ng2StateDeclaration[] = DEV_MODULE_STATES;
	public constructor() {
		console.log("`DevModuleModule` module initialized");
	}
}
