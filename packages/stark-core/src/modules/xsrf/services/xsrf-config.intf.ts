import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

/**
 * {@link https://v7.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkXSRFConfig}
 */
export const STARK_XSRF_CONFIG: InjectionToken<StarkXSRFConfig> = new InjectionToken<StarkXSRFConfig>("StarkXSRFConfig");

/**
 * Alternative literal object to define the waitBeforePinging function and its DI dependencies
 */
export interface StarkXSRFWaitBeforePingingLiteral {
	/**
	 * Array of Dependency Injection tokens for the dependencies of the `waitBeforePingingFn`.
	 */
	deps: any[];

	/**
	 * Function that will be called by the {@link StarkXSRFService} passing the necessary dependencies to get the corresponding Promise/Observable
	 * that the service should wait for before pinging all the backends.
	 */
	waitBeforePingingFn: (...deps: any[]) => Promise<any> | PromiseLike<any> | Observable<any>;
}

/**
 * Definition of the configuration object for the {@link StarkXSRFService}
 */
export interface StarkXSRFConfig {
	/**
	 * Function that will be called by the {@link StarkXSRFService} to get the corresponding Promise/Observable
	 * that the service should wait for before pinging all the backends.
	 * Alternatively, this can be defined as a {@link StarkXSRFWaitBeforePingingLiteral|literal}
	 */
	waitBeforePinging?: (() => Promise<any> | PromiseLike<any> | Observable<any>) | StarkXSRFWaitBeforePingingLiteral;

	/**
	 * Defines if the XSRF cookie can be overridden or not.
	 * If `httpOnly` is set to `true`, the `StarkXSRFService` reads the cookie value for each http request.
	 *
	 * Default: `false`
	 */
	httpOnly?: boolean;
}
