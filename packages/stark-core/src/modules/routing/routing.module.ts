import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { STARK_ROUTING_SERVICE, StarkRoutingServiceImpl } from "./services";

@NgModule({
	imports: [UIRouterModule.forChild()]
})
export class StarkRoutingModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v12.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The forRoot() pattern}
	 * @returns A module with providers
	 */
	public static forRoot(): ModuleWithProviders<StarkRoutingModule> {
		return {
			ngModule: StarkRoutingModule,
			providers: [{ provide: STARK_ROUTING_SERVICE, useClass: StarkRoutingServiceImpl }]
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * See {@link https://v12.angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule|Angular docs: Prevent reimport of a root module}
	 * @param parentModule - The parent module
	 */
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule?: StarkRoutingModule
	) {
		if (parentModule) {
			throw new Error("StarkRoutingModule is already loaded. Import it in the AppModule only");
		}
	}
}
