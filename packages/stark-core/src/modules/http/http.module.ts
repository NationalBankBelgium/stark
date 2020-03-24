import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { STARK_HTTP_SERVICE, StarkHttpServiceImpl } from "./services";

@NgModule({
	imports: [HttpClientModule]
})
export class StarkHttpModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v7.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The forRoot() pattern}
	 * @returns A module with providers
	 */
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkHttpModule,
			providers: [{ provide: STARK_HTTP_SERVICE, useClass: StarkHttpServiceImpl }]
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
		parentModule?: StarkHttpModule
	) {
		if (parentModule) {
			throw new Error("StarkHttpModule is already loaded. Import it in the AppModule only");
		}
	}
}
