import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { StarkToastNotificationResult } from "./toast-notification-result.intf";
import { StarkToastMessage } from "../components";

/**
 * @ignore
 */
export const starkToastNotificationServiceName = "StarkToastNotificationService";

/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkToastNotificationService}
 */
export const STARK_TOAST_NOTIFICATION_SERVICE: InjectionToken<StarkToastNotificationService> =
	new InjectionToken<StarkToastNotificationService>(starkToastNotificationServiceName);

/**
 * Stark Toast Notification Service
 * Service to display different types of messages in a toast (info, warning or error).
 */
export interface StarkToastNotificationService {
	/**
	 * Returns an observable that will emit one of the possible {@link StarkToastNotificationResult} after the toast is closed
	 * @param message - Message to be shown in the toast.
	 * @returns Observable that will emit the result value as soon as the toast is closed.
	 */
	show(message: StarkToastMessage): Observable<StarkToastNotificationResult>;

	/**
	 * Hides the current toast and emits the corresponding result in the observable returned by the `show()` method
	 */
	hide(): void;
}
