import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";
import { SharedModule } from "../shared/shared.module";
import { STYLEGUIDE_STATES } from "./routes";
import {
	StyleguideButtonPageComponent,
	StyleguideCardPageComponent,
	StyleguideColorsPageComponent,
	StyleguideHeaderPageComponent,
	StyleguideLayoutPageComponent,
	StyleguideTypographyPageComponent
} from "./pages";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: STYLEGUIDE_STATES
		}),
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		TranslateModule,
		StarkPrettyPrintModule,
		SharedModule
	],
	providers: [],
	declarations: [
		StyleguideButtonPageComponent,
		StyleguideCardPageComponent,
		StyleguideTypographyPageComponent,
		StyleguideColorsPageComponent,
		StyleguideHeaderPageComponent,
		StyleguideLayoutPageComponent
	],
	entryComponents: [],
	exports: [
		StyleguideButtonPageComponent,
		StyleguideCardPageComponent,
		StyleguideTypographyPageComponent,
		StyleguideColorsPageComponent,
		StyleguideHeaderPageComponent,
		StyleguideLayoutPageComponent
	]
})
export class StyleguideModule {}
