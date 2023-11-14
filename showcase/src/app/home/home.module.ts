import { NgModule } from "@angular/core";
import { SharedModule } from "../shared";
import { HomePageComponent, NoContentPageComponent } from "./pages";
import { UIRouterModule } from "@uirouter/angular";
import { HOME_STATES } from "./routes";
import { CommonModule } from "@angular/common";

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		UIRouterModule.forChild({
			states: HOME_STATES
		})
	],
	declarations: [HomePageComponent, NoContentPageComponent],
	exports: [HomePageComponent, NoContentPageComponent]
})
export class HomeModule {}
