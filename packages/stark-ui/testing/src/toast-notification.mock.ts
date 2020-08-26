import { StarkToastNotificationService } from "@nationalbankbelgium/stark-ui";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkToastNotificationService} interface.
 */
export class MockStarkToastNotificationService implements SpyObj<StarkToastNotificationService> {
	/**
	 * See [StarkToastNotificationService show()]{@link StarkToastNotificationService#show} method
	 */
	public show: Spy<StarkToastNotificationService["show"]> = createSpy("show");

	/**
	 * See [StarkToastNotificationService hide()]{@link StarkToastNotificationService#hide} method
	 */
	public hide: Spy<StarkToastNotificationService["hide"]> = createSpy("hide");
}
