import { StarkHttpService, StarkResource } from "@nationalbankbelgium/stark-core";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;
import createSpyObj = jasmine.createSpyObj;

/**
 * Mock class of the {@link StarkHttpService} interface.
 */
export class MockStarkHttpService<T extends StarkResource> implements SpyObj<StarkHttpService<T>> {
	/**
	 * See [StarkHttpService rawHttpClient]{@link StarkHttpService#rawHttpClient} property
	 */
	public readonly rawHttpClient: SpyObj<StarkHttpService<T>["rawHttpClient"]> = createSpyObj<StarkHttpService<T>["rawHttpClient"]>(
		"rawHttpClient",
		["request", "delete", "get", "head", "jsonp", "options", "patch", "post", "put"]
	);

	/**
	 * See [StarkHttpService executeSingleItemRequest()]{@link StarkHttpService#executeSingleItemRequest} method
	 */
	public executeSingleItemRequest: Spy<StarkHttpService<T>["executeSingleItemRequest"]> = createSpy("executeSingleItemRequest");

	/**
	 * See [StarkHttpService executeCollectionRequest()]{@link StarkHttpService#executeCollectionRequest} method
	 */
	public executeCollectionRequest: Spy<StarkHttpService<T>["executeCollectionRequest"]> = createSpy("executeCollectionRequest");
}
