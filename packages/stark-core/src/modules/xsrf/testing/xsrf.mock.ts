import { StarkXSRFService } from "@nationalbankbelgium/stark-core";
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the StarkXSRFService interface.
 * @link StarkXSRFService
 */
export class MockStarkXsrfService implements SpyObj<StarkXSRFService> {
	public configureHttpRequest: SpyObj<StarkXSRFService>["configureHttpRequest"] = createSpy("configureHttpRequest");

	public configureXHR: SpyObj<StarkXSRFService>["configureXHR"] = createSpy("configureXHR");

	public getXSRFToken: SpyObj<StarkXSRFService>["getXSRFToken"] = createSpy("getXSRFToken");

	public pingBackends: SpyObj<StarkXSRFService>["pingBackends"] = createSpy("pingBackends");

	public storeXSRFToken: SpyObj<StarkXSRFService>["storeXSRFToken"] = createSpy("storeXSRFToken");
}
