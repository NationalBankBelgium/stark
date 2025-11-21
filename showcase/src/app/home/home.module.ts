import { NgModule } from "@angular/core";
import { SharedModule } from "../shared";
import { HomePageComponent, NoContentPageComponent } from "./pages";
import { UIRouterModule } from "@uirouter/angular";
import { HOME_STATES } from "./routes";
import { CommonModule } from "@angular/common";
import { TsIconsModule } from "@nationalbankbelgium/stark-ui/src/modules/ts-icons";
import { mdiWall, mdiAtom, mdiTelevisionGuide, mdiShieldLockOutline, mdiTheater } from "@nationalbankbelgium/mdi-ts";

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		UIRouterModule.forChild({
			states: HOME_STATES
		}),
		TsIconsModule.forChild([mdiWall, mdiAtom, mdiTelevisionGuide, mdiShieldLockOutline, mdiTheater])
	],
	declarations: [HomePageComponent, NoContentPageComponent],
	exports: [HomePageComponent, NoContentPageComponent]
})
export class HomeModule {}
