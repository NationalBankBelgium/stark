import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { SESSION_UI_STATES } from "./routes";
import {
	StarkLoginPageComponent,
	StarkPreloadingPageComponent,
	StarkSessionExpiredPageComponent,
	StarkSessionLogoutPageComponent
} from "./pages";

@NgModule({
	declarations: [
		StarkLoginPageComponent,
		StarkPreloadingPageComponent,
		StarkSessionExpiredPageComponent,
		StarkSessionLogoutPageComponent
	],
	exports: [StarkLoginPageComponent, StarkPreloadingPageComponent, StarkSessionExpiredPageComponent, StarkSessionLogoutPageComponent],
	imports: [
		CommonModule,
		UIRouterModule.forChild({
			states: SESSION_UI_STATES
		}),
		MatButtonModule,
		TranslateModule
	]
})
export class StarkSessionUiModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the forRoot() should be called only by the AppModule
	 * @link https://angular.io/guide/singleton-services#forroot
	 * @returns a module with providers
	 */
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkSessionUiModule
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * @link https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	 * @param parentModule - The parent module
	 */
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkSessionUiModule
	) {
		if (parentModule) {
			throw new Error("StarkSessionUiModule is already loaded. Import it in the AppModule only");
		}
	}
}
