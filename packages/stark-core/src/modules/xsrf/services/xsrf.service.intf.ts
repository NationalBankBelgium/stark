import { InjectionToken } from "@angular/core";
import { HttpRequest } from "@angular/common/http";

/**
 * @ignore
 */
export const starkXSRFServiceName = "StarkXSRFService";
/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkXSRFService}
 */
export const STARK_XSRF_SERVICE: InjectionToken<StarkXSRFService> = new InjectionToken<StarkXSRFService>(starkXSRFServiceName);

/**
 * Stark XSRF Service.
 * Service to get/store the XSRF token to be used with the different backends.
 * It also adds the XSRF configuration to XHR objects for those HTTP requests not performed using StarkHttpService or Angular's HttpClient.
 */
export interface StarkXSRFService {
	/**
	 * Add the necessary options to the XHR config in order to enable XSRF protection.
	 * Since the service will add the XSRF header to the XHR object, this method must be called after calling the XHR open() method because
	 * headers cannot be set before open(). See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
	 *
	 * This method should be used for those HTTP "state-changing" requests (POST, PUT, PATCH or DELETE) which are not performed
	 * using StarkHttpService or Angular raw $http
	 * @param xhr - The XHR object to be configured
	 */
	configureXHR(xhr: XMLHttpRequest): void;

	/**
	 * Return a new {@link https://v12.angular.io/api/common/http/HttpRequest|HttpRequest} including the necessary options
	 * for "state-changing" requests (POST, PUT, PATCH or DELETE) in order to enable XSRF protection.
	 *
	 * Logs a warning whenever there is no XSRF token to be sent in such requests
	 * @param request - The Angular `HttpRequest` to be modified
	 * @returns The modified Angular `HttpRequest`
	 */
	configureHttpRequest(request: HttpRequest<any>): HttpRequest<any>;

	/**
	 * Get the current XSRF token (in case there is one already stored)
	 */
	getXSRFToken(): string | undefined;

	/**
	 * Store the token from the current XSRF cookie
	 */
	storeXSRFToken(): void;

	/**
	 * Trigger a GET Http request to all the backends in order to get their XSRF tokens.
	 * Then the response is intercepted by the XSRF Http Interceptor to store the token from the current XSRF cookie
	 */
	pingBackends(): void;
}
