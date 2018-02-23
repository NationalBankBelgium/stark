import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";

import { DETAIL_STATES } from "./detail.routes";
import { DetailComponent } from "./detail.component";
import { routerChildConfigFn } from "../router.config";

console.log("`Detail` bundle loaded asynchronously");

@NgModule({
	declarations: [
		/**
		 * Components / Directives/ Pipes
		 */
		DetailComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		UIRouterModule.forChild({
			states: DETAIL_STATES,
			config: routerChildConfigFn
		})
	]
})
export class DetailModule {
	public static routes = DETAIL_STATES;
}
