import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { GettingStartedPageComponent, HomePageComponent, NewsPageComponent, NoContentPageComponent } from "./pages";
import { NewsItemComponent } from "./components";
import { SharedModule } from "../shared";
import { NEWS_STATES } from "./routes";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: NEWS_STATES
		}),
		SharedModule
	],
	declarations: [GettingStartedPageComponent, HomePageComponent, NoContentPageComponent, NewsPageComponent, NewsItemComponent],
	exports: [GettingStartedPageComponent, HomePageComponent, NoContentPageComponent, NewsPageComponent, NewsItemComponent]
})
export class WelcomeModule {}
