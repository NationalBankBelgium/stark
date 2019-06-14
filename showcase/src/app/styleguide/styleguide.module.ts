import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
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
