import { ErrorHandler, ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { StarkErrorHandler } from "./handlers/error-handler";

@NgModule({})
export class StarkErrorHandlingModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the forRoot() should be called only by the AppModule
	 * @link https://angular.io/guide/singleton-services#forroot
	 * @returns a module with providers
	 */
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkErrorHandlingModule,
			providers: [
				{
					provide: ErrorHandler,
					useClass: StarkErrorHandler
				}
			]
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * @link https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	 * @param parentModule - the parent module
	 */
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkErrorHandlingModule
	) {
		if (parentModule) {
			throw new Error("StarkErrorHandlingModule is already loaded. Import it in the AppModule only");
		}
	}
}
