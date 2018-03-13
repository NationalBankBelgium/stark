import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { Ng2StateDeclaration, UIRouterModule } from "@uirouter/angular";

import { CHILD_DETAIL_STATES } from "./child-detail.routes";
import { ChildDetailComponent } from "./child-detail.component";
import { routerChildConfigFn } from "../../router.config";

console.log("`ChildDetail` bundle loaded asynchronously");

@NgModule({
	declarations: [
		/**
		 * Components / Directives/ Pipes
		 */
		ChildDetailComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		UIRouterModule.forChild({
			states: CHILD_DETAIL_STATES,
			config: routerChildConfigFn
		})
	]
})
export class ChildDetailModule {
	public static routes: Ng2StateDeclaration[] = CHILD_DETAIL_STATES;
}
