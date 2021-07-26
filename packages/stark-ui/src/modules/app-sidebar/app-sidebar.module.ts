import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { StarkAppSidebarComponent } from "./components";
import { STARK_APP_SIDEBAR_SERVICE, StarkAppSidebarServiceImpl } from "./services";

@NgModule({
	declarations: [StarkAppSidebarComponent],
	imports: [CommonModule, MatSidenavModule],
	exports: [StarkAppSidebarComponent]
})
export class StarkAppSidebarModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v7.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The `forRoot()` pattern}
	 * @returns A module with providers
	 */
	public static forRoot(): ModuleWithProviders<StarkAppSidebarModule> {
		return {
			ngModule: StarkAppSidebarModule,
			providers: [{ provide: STARK_APP_SIDEBAR_SERVICE, useClass: StarkAppSidebarServiceImpl }]
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * See {@link https://v7.angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule|Angular docs: Prevent reimport of a root module}
	 * @param parentModule - The parent module
	 */
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule?: StarkAppSidebarModule
	) {
		if (parentModule) {
			throw new Error("StarkAppSidebarModule is already loaded. Import it in the AppModule only");
		}
	}
}
