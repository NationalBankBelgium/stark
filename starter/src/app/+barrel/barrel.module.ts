import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { Ng2StateDeclaration, UIRouterModule } from "@uirouter/angular";

import { BARREL_STATES } from "./barrel.routes";
import { BarrelComponent } from "./barrel.component";
import { routerChildConfigFn } from "../router.config";

console.log("`Barrel` bundle loaded asynchronously");

@NgModule({
	declarations: [
		/**
		 * Components / Directives/ Pipes
		 */
		BarrelComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		UIRouterModule.forChild({
			states: BARREL_STATES,
			config: routerChildConfigFn
		})
	]
})
export class BarrelModule {
	public static routes: Ng2StateDeclaration[] = BARREL_STATES;
}
