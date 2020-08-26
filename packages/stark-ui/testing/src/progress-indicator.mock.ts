import { StarkProgressIndicatorService } from "@nationalbankbelgium/stark-ui";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkProgressIndicatorService} interface.
 */
export class MockStarkProgressIndicatorService implements SpyObj<StarkProgressIndicatorService> {
	/**
	 * See [StarkProgressIndicatorService register()]{@link StarkProgressIndicatorService#register} method
	 */
	public register: Spy<StarkProgressIndicatorService["register"]> = createSpy("register");

	/**
	 * See [StarkProgressIndicatorService deregister()]{@link StarkProgressIndicatorService#deregister} method
	 */
	public deregister: Spy<StarkProgressIndicatorService["deregister"]> = createSpy("deregister");

	/**
	 * See [StarkProgressIndicatorService show()]{@link StarkProgressIndicatorService#show} method
	 */
	public show: Spy<StarkProgressIndicatorService["show"]> = createSpy("show");

	/**
	 * See [StarkProgressIndicatorService hide()]{@link StarkProgressIndicatorService#hide} method
	 */
	public hide: Spy<StarkProgressIndicatorService["hide"]> = createSpy("hide");

	/**
	 * See [StarkProgressIndicatorService isVisible()]{@link StarkProgressIndicatorService#isVisible} method
	 */
	public isVisible: Spy<StarkProgressIndicatorService["isVisible"]> = createSpy("isVisible");
}
