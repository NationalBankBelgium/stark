import { StarkHttpService, StarkResource } from "@nationalbankbelgium/stark-core";
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;
import createSpyObj = jasmine.createSpyObj;

/**
 * Mock class of the StarkHttpService interface.
 * @link StarkHttpService
 */
export class MockStarkHttpService<T extends StarkResource> implements SpyObj<StarkHttpService<T>> {
	/**
	 * Gets the core Angular HTTP API (HttpClient)
	 * @returns Angular Http client
	 */
	public readonly rawHttpClient: SpyObj<StarkHttpService<T>["rawHttpClient"]> = createSpyObj<StarkHttpService<T>["rawHttpClient"]>(
		"rawHttpClient",
		["request", "delete", "get", "head", "jsonp", "options", "patch", "post", "put"]
	);

	/**
	 * Executes requests to fetch a single resource
	 * @param request - The HTTP request to be executed
	 * @returns Observable that will emit the single item response wrapper
	 */
	public executeSingleItemRequest: SpyObj<StarkHttpService<T>>["executeSingleItemRequest"] = createSpy("executeSingleItemRequest");

	/**
	 * Executes requests to fetch an array of resources
	 * @param request - The HTTP request to be executed
	 * @returns Observable that will emit the collection response wrapper
	 */
	public executeCollectionRequest: SpyObj<StarkHttpService<T>>["executeCollectionRequest"] = createSpy("executeCollectionRequest");
}
