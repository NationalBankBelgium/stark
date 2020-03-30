import { ApplicationInitStatus, Inject, ModuleWithProviders, NgModule, Optional, Self, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { from } from "rxjs";
import { STARK_RBAC_AUTHORIZATION_SERVICE, StarkRBACAuthorizationService, StarkRBACAuthorizationServiceImpl } from "./services";
import { StarkHideOnPermissionDirective, StarkShowOnPermissionDirective } from "./directives";

@NgModule({
	declarations: [StarkHideOnPermissionDirective, StarkShowOnPermissionDirective],
	imports: [CommonModule],
	exports: [StarkHideOnPermissionDirective, StarkShowOnPermissionDirective]
})
export class StarkRBACAuthorizationModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v7.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The forRoot() pattern}
	 * @returns A module with providers
	 */
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkRBACAuthorizationModule,
			providers: [{ provide: STARK_RBAC_AUTHORIZATION_SERVICE, useClass: StarkRBACAuthorizationServiceImpl }]
		};
	}

	/**
	 * Verifies that the `forRoot()` method of this module has been called so that its providers are effectively registered.
	 * @param rootAuthorizationService - The `StarkRBACAuthorizationService` instance of the application (null when the `forRoot()` method was called)
	 * @param childAuthorizationService - The `StarkRBACAuthorizationService` instance of the application (null when the `forRoot()` was not called, so this module is imported as a child module)
	 * @param appInitStatus - A class that reflects the state of running {@link https://v7.angular.io/api/core/APP_INITIALIZER|APP_INITIALIZER}s
	 */
	public constructor(
		@Optional() @SkipSelf() @Inject(STARK_RBAC_AUTHORIZATION_SERVICE) rootAuthorizationService: StarkRBACAuthorizationService,
		@Optional() @Self() @Inject(STARK_RBAC_AUTHORIZATION_SERVICE) childAuthorizationService: StarkRBACAuthorizationService,
		appInitStatus: ApplicationInitStatus
	) {
		if (!childAuthorizationService && !rootAuthorizationService) {
			throw new Error(
				`${STARK_RBAC_AUTHORIZATION_SERVICE.toString()} is not provided. Make sure you call the 'forRoot' method of the StarkRBACAuthorizationModule in the AppModule only.`
			);
		}

		if (childAuthorizationService && rootAuthorizationService) {
			throw new Error(
				`${STARK_RBAC_AUTHORIZATION_SERVICE.toString()} is already provided. Make sure you call the 'forRoot' method of the StarkRBACAuthorizationModule in the AppModule only.`
			);
		}

		// initialize the service only when this is a Root module ('forRoot' was called)
		if (childAuthorizationService && !rootAuthorizationService) {
			// this logic cannot be executed in an APP_INITIALIZER factory because the StarkRBACAuthorizationService uses the StarkLoggingService
			// which needs the "logging" state to be already defined in the Store (which NGRX defines internally via APP_INITIALIZER factories :p)
			from(appInitStatus.donePromise).subscribe(() => {
				childAuthorizationService.initializeService();
			});
		}
	}
}
