import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { StarkRBACAuthorizationModule } from "@nationalbankbelgium/stark-rbac";
import { DEMO_STATES } from "./routes";
import { SharedModule } from "../shared";
import { DemoAuthorizationDirectivesPageComponent, DemoAuthorizationServicePageComponent, DemoProtectedPageComponent } from "./pages";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: DEMO_STATES
		}),
		SharedModule,
		StarkRBACAuthorizationModule
	],
	declarations: [DemoAuthorizationDirectivesPageComponent, DemoAuthorizationServicePageComponent, DemoProtectedPageComponent],
	exports: [DemoAuthorizationDirectivesPageComponent, DemoAuthorizationServicePageComponent, DemoProtectedPageComponent],
	providers: []
})
export class DemoRBACModule {}
