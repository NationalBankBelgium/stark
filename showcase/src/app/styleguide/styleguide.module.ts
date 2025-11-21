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
import { ExampleViewerModule } from "../example-viewer";
import { TsIconsModule } from "@nationalbankbelgium/stark-ui/src/modules/ts-icons";
import {
	mdiHome,
	mdiCogs,
	mdiDotsVertical,
	mdiMenu,
	mdiArrowLeft,
	mdiSkipNext,
	mdiSkipPrevious,
	mdiTelevisionGuide,
	mdiPlus,
	mdiMagnify,
	mdiAlertCircle
} from "@nationalbankbelgium/mdi-ts";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: STYLEGUIDE_STATES
		}),
		SharedModule,
		ExampleViewerModule,
		TsIconsModule.forChild([
			mdiHome,
			mdiCogs,
			mdiDotsVertical,
			mdiMenu,
			mdiArrowLeft,
			mdiSkipNext,
			mdiSkipPrevious,
			mdiTelevisionGuide,
			mdiPlus,
			mdiMagnify,
			mdiAlertCircle
		])
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
