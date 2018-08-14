/**
 * Mock class of the ToastNotificationService interface.
 * @link ToastNotificationService
 */
import { Observable } from "rxjs";
import { StarkToastMessage, StarkToastNotificationService, StarkToastNotificationResult } from "@nationalbankbelgium/stark-ui";

export class MockToastNotificationService implements StarkToastNotificationService {
	/**
	 * Returns an observable that will emit one of the possible StarkToastNotificationResult after the toast is closed
	 * @param message - Message to be shown in the toast.
	 * @returns Observable that will emit the result value as soon as the toast is closed.
	 */
	public show: (message: StarkToastMessage) => Observable<StarkToastNotificationResult> = jasmine.createSpy("show");

	/**
	 * Hides the current toast and emits the corresponding result in the observable returned by the show() method
	 * @param result - Result to be sent to the subscribers of the show method's observable
	 */
	public hide: (result?: StarkToastNotificationResult) => void = jasmine.createSpy("hide");
}
