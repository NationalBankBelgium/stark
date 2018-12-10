import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { TranslateModule } from "@ngx-translate/core";
import { AboutPageComponent, HomePageComponent, NoContentPageComponent } from "./pages";
import { HOME_STATES } from "./routes";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: HOME_STATES
		}),
		TranslateModule
	],
	declarations: [AboutPageComponent, HomePageComponent, NoContentPageComponent],
	exports: []
})
export class HomeModule {}
