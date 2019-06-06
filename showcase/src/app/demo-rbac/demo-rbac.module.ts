import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UIRouterModule } from "@uirouter/angular";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { TranslateModule } from "@ngx-translate/core";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";
import { StarkRBACAuthorizationModule } from "@nationalbankbelgium/stark-rbac";
import { DEMO_STATES } from "./routes";
import { SharedModule } from "../shared";
import { DemoAuthorizationDirectivesPageComponent, DemoAuthorizationServicePageComponent, DemoProtectedPageComponent } from "./pages";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: DEMO_STATES
		}),
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		TranslateModule,
		SharedModule,
		StarkPrettyPrintModule,
		StarkRBACAuthorizationModule
	],
	declarations: [DemoAuthorizationDirectivesPageComponent, DemoAuthorizationServicePageComponent, DemoProtectedPageComponent],
	exports: [DemoAuthorizationDirectivesPageComponent, DemoAuthorizationServicePageComponent, DemoProtectedPageComponent],
	providers: []
})
export class DemoRBACModule {}
