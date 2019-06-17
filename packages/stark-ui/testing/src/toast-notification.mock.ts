import { StarkToastNotificationService } from "@nationalbankbelgium/stark-ui";
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkToastNotificationService|StarkToastNotificationService}.
 *
 * `IMPORTANT:` This class just provides mocks (jasmine Spies) for all the methods of the actual service.
 * Therefore, it is up to you to define the return values of such spies according to your needs.
 *
 * You can use it in your unit tests by providing it while configuring the testing module in the TestBed. For example:
 * ```typescript
 * import { STARK_TOAST_NOTIFICATION_SERVICE } from "@nationalbankbelgium/stark-ui";
 * import { MockStarkToastNotificationService } from "@nationalbankbelgium/stark-ui/testing";
 *
 * describe("Some test", () => {
 *
 *     beforeEach(async(() => {
 *         return TestBed.configureTestingModule({
 *             imports: [...],
 *             declarations: [...],
 *             providers: [
 *                 // provide is as a value
 *                 { provide: STARK_TOAST_NOTIFICATION_SERVICE, useValue: new MockStarkToastNotificationService() },
 *                 // or as a class
 *                 { provide: STARK_TOAST_NOTIFICATION_SERVICE, useClass: MockStarkToastNotificationService }
 *             ]
 *         }).compileComponents();
 *     }));
 *
 * }
 * ```
 */
export class MockStarkToastNotificationService implements SpyObj<StarkToastNotificationService> {
	/**
	 * Returns an observable that will emit one of the possible StarkToastNotificationResult after the toast is closed
	 * @param message - Message to be shown in the toast.
	 * @returns Observable that will emit the result value as soon as the toast is closed.
	 */
	public show: SpyObj<StarkToastNotificationService>["show"] = createSpy("show");

	/**
	 * Hides the current toast and emits the corresponding result in the observable returned by the show() method
	 * @param result - Result to be sent to the subscribers of the show method's observable
	 */
	public hide: SpyObj<StarkToastNotificationService>["hide"] = createSpy("hide");
}
