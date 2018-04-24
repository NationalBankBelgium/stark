import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { StarkRoutingServiceImpl, STARK_ROUTING_SERVICE } from "./services";

@NgModule({
	imports: [UIRouterModule.forChild()]
})
export class StarkRoutingModule {
	// instantiate the services only once since they should be singletons
	// so the forRoot() should be called only by the AppModule
	// see https://angular.io/guide/singleton-services#forroot
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkRoutingModule,
			providers: [{ provide: STARK_ROUTING_SERVICE, useClass: StarkRoutingServiceImpl }]
		};
	}

	// prevent this module from being re-imported
	// see https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkRoutingModule
	) {
		if (parentModule) {
			throw new Error("StarkRoutingModule is already loaded. Import it in the AppModule only");
		}
	}
}
