import { ApplicationInitStatus, Inject, ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { from } from "rxjs";
import { STARK_XSRF_CONFIG, STARK_XSRF_SERVICE, StarkXSRFConfig, StarkXSRFService, StarkXSRFServiceImpl } from "./services";
import { StarkHttpHeaders } from "../http/constants";
import { StarkXSRFHttpInterceptor } from "./interceptors";

@NgModule({
	imports: [
		HttpClientModule,
		HttpClientXsrfModule.withOptions({
			// Name of cookie containing the XSRF token. Default value in Angular is 'XSRF-TOKEN'
			// https://v7.angular.io/guide/http#security-xsrf-protection
			cookieName: "XSRF-TOKEN",
			// Name of HTTP header to populate with the XSRF token. Default value in Angular is 'X-XSRF-TOKEN'.
			// https://v7.angular.io/guide/http#security-xsrf-protection
			headerName: StarkHttpHeaders.XSRF_TOKEN
		})
	]
})
export class StarkXSRFModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v7.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The forRoot() pattern}
	 * @param xsrfConfig - Object containing the configuration (if any) for the `StarkXSRFService`
	 * @returns A module with providers
	 */
	public static forRoot(xsrfConfig?: StarkXSRFConfig): ModuleWithProviders {
		return {
			ngModule: StarkXSRFModule,
			providers: [
				{ provide: STARK_XSRF_CONFIG, useValue: xsrfConfig },
				{ provide: STARK_XSRF_SERVICE, useClass: StarkXSRFServiceImpl },
				{ provide: HTTP_INTERCEPTORS, useClass: StarkXSRFHttpInterceptor, multi: true } // Add the StarkXSRFHttpInterceptor as an Http interceptor to handle missing XSRF token
			]
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * See {@link https://v7.angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule|Angular docs: Prevent reimport of a root module}
	 * @param xsrfService - The `StarkXSRFService` instance of the application.
	 * @param appInitStatus - A class that reflects the state of running {@link https://v7.angular.io/api/core/APP_INITIALIZER|APP_INITIALIZER}s.
	 * @param parentModule - The parent module.
	 */
	public constructor(
		@Inject(STARK_XSRF_SERVICE) xsrfService: StarkXSRFService,
		appInitStatus: ApplicationInitStatus,
		@Optional()
		@SkipSelf()
		parentModule?: StarkXSRFModule
	) {
		if (parentModule) {
			throw new Error("StarkXSRFModule is already loaded. Import it in the AppModule only");
		}

		// this logic cannot be executed in an APP_INITIALIZER factory because the StarkXsrfService uses the StarkLoggingService
		// which needs the "logging" state to be already defined in the Store (which NGRX defines internally via APP_INITIALIZER factories :p)
		from(appInitStatus.donePromise).subscribe(() => {
			xsrfService.pingBackends();
		});
	}
}
