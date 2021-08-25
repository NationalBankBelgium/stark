import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { StarkProgressIndicatorDirective } from "./directives";
import { STARK_PROGRESS_INDICATOR_SERVICE, StarkProgressIndicatorServiceImpl } from "./services";
import { starkProgressIndicatorStoreKey } from "./constants";
import { starkProgressIndicatorReducers } from "./reducers";
import { StarkProgressIndicatorComponent } from "./components";

@NgModule({
	declarations: [StarkProgressIndicatorDirective, StarkProgressIndicatorComponent],
	imports: [CommonModule, StoreModule.forFeature(starkProgressIndicatorStoreKey, starkProgressIndicatorReducers)],
	exports: [StarkProgressIndicatorDirective],
	entryComponents: [StarkProgressIndicatorComponent]
})
export class StarkProgressIndicatorModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v7.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The `forRoot()` pattern}
	 * @returns A module with providers
	 */
	public static forRoot(): ModuleWithProviders<StarkProgressIndicatorModule> {
		return {
			ngModule: StarkProgressIndicatorModule,
			providers: [{ provide: STARK_PROGRESS_INDICATOR_SERVICE, useClass: StarkProgressIndicatorServiceImpl }]
		};
	}
}
