import { InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StarkCollectionResponseWrapper, StarkHttpRequest, StarkResource, StarkSingleItemResponseWrapper } from "../entities";
import { Observable } from "rxjs";

/**
 * @ignore
 */
export const starkHttpServiceName = "StarkHttpService";
/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkHttpService}
 */
export const STARK_HTTP_SERVICE: InjectionToken<StarkHttpService<any>> = new InjectionToken<StarkHttpService<any>>(starkHttpServiceName);

/**
 * Stark Http Service
 * Service to make HTTP calls in compliance with the guidelines from the {@link https://github.com/NationalBankBelgium/REST-API-Design-Guide|NBB REST API Design Guide}.
 */
export interface StarkHttpService<T extends StarkResource> {
	/**
	 * Gets the core Angular HTTP API ({@link https://v12.angular.io/api/common/http/HttpClient|HttpClient})
	 */
	readonly rawHttpClient: HttpClient;

	/**
	 * Executes {@link https://v12.angular.io/api/common/http/HttpRequest|HttpRequests} to fetch a single resource
	 * @param request - The `HttpRequest` to be executed
	 * @returns Observable that will emit the `StarkSingleItemResponseWrapper`
	 */
	executeSingleItemRequest(request: StarkHttpRequest): Observable<StarkSingleItemResponseWrapper<T>>;

	/**
	 * Executes {@link https://v12.angular.io/api/common/http/HttpRequest|HttpRequests} to fetch an array of resources
	 * @param request - The `HttpRequest` to be executed
	 * @returns Observable that will emit the `StarkCollectionResponseWrapper`
	 */
	executeCollectionRequest(request: StarkHttpRequest): Observable<StarkCollectionResponseWrapper<T>>;
}
