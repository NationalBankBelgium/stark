import { Observable } from "rxjs";
import { StarkProgressIndicatorService, StarkProgressIndicatorType } from "@nationalbankbelgium/stark-ui";

/**
 * Mock class of the {@link StarkProgressIndicatorService|StarkProgressIndicatorService}.
 *
 * `IMPORTANT:` This class just provides mocks (jasmine Spies) for all the methods of the actual service.
 * Therefore, it is up to you to define the return values of such spies according to your needs.
 *
 * You can use it in your unit tests by providing it while configuring the testing module in the TestBed. For example:
 * ```typescript
 * import { STARK_PROGRESS_INDICATOR_SERVICE } from "@nationalbankbelgium/stark-ui";
 * import { MockStarkProgressIndicatorService } from "@nationalbankbelgium/stark-ui/testing";
 *
 * describe("Some test", () => {
 *
 *     beforeEach(async(() => {
 *         return TestBed.configureTestingModule({
 *             imports: [...],
 *             declarations: [...],
 *             providers: [
 *                 // provide is as a value
 *                 { provide: STARK_PROGRESS_INDICATOR_SERVICE, useValue: new MockStarkProgressIndicatorService() },
 *                 // or as a class
 *                 { provide: STARK_PROGRESS_INDICATOR_SERVICE, useClass: MockStarkProgressIndicatorService }
 *             ]
 *         }).compileComponents();
 *     }));
 *
 * }
 * ```
 */
export class MockStarkProgressIndicatorService implements StarkProgressIndicatorService {
	/**
	 * registers a new progress indicator in the application state. Each registered progress indicator is identified by a topic,
	 * a unique identifier associated with it.
	 * @param topic - The topic of the progress indicator to be registered.
	 * @param type - Type of progress indicator (i.e. spinner)
	 */
	public register: (topic: string, type: StarkProgressIndicatorType) => void = jasmine.createSpy("register");

	/**
	 * Deregister a progress indicator already existing in the application state.
	 * @param topic - The topic of the progress indicator to be deregistered
	 */
	public deregister: (topic: string) => void = jasmine.createSpy("deregister");

	/**
	 * Shows the designated progress indicator
	 * @param topic - The topic that needs to be shown
	 */
	public show: (topic: string) => void = jasmine.createSpy("show");

	/**
	 * Hides the progress indicator.
	 * @param topic - The topic that needs to be hidden
	 */
	public hide: (topic: string) => void = jasmine.createSpy("hide");

	/**
	 * Return the latest status of the progress indicator for the given topic (whether is shown or hidden).
	 * @param topic - The topic of the progress indicator whose status will be fetched.
	 * @returns Observable that will emit a boolean value whenever the status of the progress indicator changes: false if it is hidden,
	 * true if it is shown or undefined in case there is no progress indicator for the given topic.
	 */
	public isVisible: (topic: string) => Observable<boolean | undefined> = jasmine.createSpy("isVisible");
}
