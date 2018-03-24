"use strict";

import { StarkCollectionResponseWrapper, StarkHttpRequest, StarkResource, StarkSingleItemResponseWrapper } from "../entities";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

export const starkHttpServiceName: string = "StarkHttpService";

/**
 * Stark Http Service
 * Service to make HTTP calls in compliance with the guidelines from the NBB REST API Design Guide.
 */
export interface StarkHttpService<T extends StarkResource> {
	/**
	 * Gets the core Angular HTTP API (HttpClient)
	 * @returns Angular Http client
	 */
	readonly rawHttpClient: HttpClient;

	/**
	 * Executes requests to fetch a single resource
	 * @param request - The HTTP request to be executed
	 * @returns Observable that will emit the single item response wrapper
	 */
	executeSingleItemRequest(request: StarkHttpRequest): Observable<StarkSingleItemResponseWrapper<T>>;

	/**
	 * Executes requests to fetch an array of resources
	 * @param request - The HTTP request to be executed
	 * @returns Observable that will emit the collection response wrapper
	 */
	executeCollectionRequest(request: StarkHttpRequest): Observable<StarkCollectionResponseWrapper<T>>;
}
