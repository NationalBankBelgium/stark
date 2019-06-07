import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { StarkProgressIndicatorDirective } from "./directives";
import { STARK_PROGRESS_INDICATOR_SERVICE, StarkProgressIndicatorServiceImpl } from "./services";
import { starkProgressIndicatorReducers } from "./reducers";
import { StarkProgressIndicatorComponent } from "./components";

@NgModule({
	declarations: [StarkProgressIndicatorDirective, StarkProgressIndicatorComponent],
	imports: [CommonModule, StoreModule.forFeature("StarkProgressIndicator", starkProgressIndicatorReducers)],
	exports: [StarkProgressIndicatorDirective],
	entryComponents: [StarkProgressIndicatorComponent]
})
export class StarkProgressIndicatorModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the forRoot() should be called only by the AppModule
	 * @link https://angular.io/guide/singleton-services#forroot
	 * @returns a module with providers
	 */
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkProgressIndicatorModule,
			providers: [{ provide: STARK_PROGRESS_INDICATOR_SERVICE, useClass: StarkProgressIndicatorServiceImpl }]
		};
	}
}
