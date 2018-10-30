import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { NewsComponent } from "./news-component";
import { NewsItemComponent } from "./news-item-component";
import { SharedModule } from "../shared";
import { NEWS_STATES } from "./routes";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: NEWS_STATES
		}),
		CommonModule,
		MatCardModule,
		MatIconModule,
		SharedModule
	],
	declarations: [NewsComponent, NewsItemComponent],
	exports: [NewsComponent, NewsItemComponent]
})
export class NewsModule {}
