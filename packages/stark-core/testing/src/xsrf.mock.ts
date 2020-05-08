import { StarkXSRFService } from "@nationalbankbelgium/stark-core";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkXSRFService} interface.
 */
export class MockStarkXsrfService implements SpyObj<StarkXSRFService> {
	/**
	 * See [StarkXSRFService configureHttpRequest()]{@link StarkXSRFService#configureHttpRequest} method
	 */
	public configureHttpRequest: Spy<StarkXSRFService["configureHttpRequest"]> = createSpy("configureHttpRequest");

	/**
	 * See [StarkXSRFService configureXHR()]{@link StarkXSRFService#configureXHR} method
	 */
	public configureXHR: Spy<StarkXSRFService["configureXHR"]> = createSpy("configureXHR");

	/**
	 * See [StarkXSRFService getXSRFToken(]{@link StarkXSRFService#getXSRFToken} method
	 */
	public getXSRFToken: Spy<StarkXSRFService["getXSRFToken"]> = createSpy("getXSRFToken");

	/**
	 * See [StarkXSRFService pingBackends()]{@link StarkXSRFService#pingBackends} method
	 */
	public pingBackends: Spy<StarkXSRFService["pingBackends"]> = createSpy("pingBackends");

	/**
	 * See [StarkXSRFService storeXSRFToken()]{@link StarkXSRFService#storeXSRFToken} method
	 */
	public storeXSRFToken: Spy<StarkXSRFService["storeXSRFToken"]> = createSpy("storeXSRFToken");
}
