import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { TranslateModule } from "@ngx-translate/core";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";
import { GettingStartedPageComponent, HomePageComponent, NewsPageComponent, NoContentPageComponent } from "./pages";
import { NewsItemComponent } from "./components";
import { SharedModule } from "../shared";
import { NEWS_STATES } from "./routes";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: NEWS_STATES
		}),
		CommonModule,
		TranslateModule,
		MatCardModule,
		MatExpansionModule,
		MatIconModule,
		StarkPrettyPrintModule,
		SharedModule
	],
	declarations: [GettingStartedPageComponent, HomePageComponent, NoContentPageComponent, NewsPageComponent, NewsItemComponent],
	exports: [GettingStartedPageComponent, HomePageComponent, NoContentPageComponent, NewsPageComponent, NewsItemComponent]
})
export class WelcomeModule {}
