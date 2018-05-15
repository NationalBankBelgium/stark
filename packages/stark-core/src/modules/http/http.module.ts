import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { STARK_HTTP_SERVICE, StarkHttpServiceImpl } from "./services";

@NgModule({
	imports: [HttpClientModule]
})
export class StarkHttpModule {
	// instantiate the services only once since they should be singletons
	// so the forRoot() should be called only by the AppModule
	// see https://angular.io/guide/singleton-services#forroot
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkHttpModule,
			providers: [{ provide: STARK_HTTP_SERVICE, useClass: StarkHttpServiceImpl }]
		};
	}

	// prevent this module from being re-imported
	// see https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkHttpModule
	) {
		if (parentModule) {
			throw new Error("StarkHttpModule is already loaded. Import it in the AppModule only");
		}
	}
}
