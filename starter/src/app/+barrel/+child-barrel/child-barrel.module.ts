import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { Ng2StateDeclaration, UIRouterModule } from "@uirouter/angular";

import { CHILD_BARREL_STATES } from "./child-barrel.routes";
import { ChildBarrelComponent } from "./child-barrel.component";
import { routerChildConfigFn } from "../../router.config";

console.log("`ChildBarrel` bundle loaded asynchronously");

@NgModule({
	declarations: [
		/**
		 * Components / Directives/ Pipes
		 */
		ChildBarrelComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		UIRouterModule.forChild({
			states: CHILD_BARREL_STATES,
			config: routerChildConfigFn
		})
	]
})
export class ChildBarrelModule {
	public static routes: Ng2StateDeclaration[] = CHILD_BARREL_STATES;
}
