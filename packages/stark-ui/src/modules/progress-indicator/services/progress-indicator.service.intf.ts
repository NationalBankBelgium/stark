import { Observable } from "rxjs";
import { StarkProgressIndicatorType } from "../entities";
import { InjectionToken } from "@angular/core";

/**
 * The name of the StarkProgressIndicatorService
 */
export const starkProgressIndicatorServiceName = "StarkProgressIndicatorService";
/**
 * The InjectionToken version of the service name
 */
export const STARK_PROGRESS_INDICATOR_SERVICE: InjectionToken<StarkProgressIndicatorService> = new InjectionToken<
	StarkProgressIndicatorService
>(starkProgressIndicatorServiceName);

/**
 * Service to handle the visibility of a progress indicator (e.g., spinner, progress percentage, ...) programmatically.
 */
export interface StarkProgressIndicatorService {
	/**
	 * Registers a new progress indicator in the application state. Each registered progress indicator is identified by a topic,
	 * a unique identifier associated with it.
	 * @param topic - The topic of the progress indicator to be registered.
	 * @param type - Type of progress indicator (i.e. spinner)
	 */
	register(topic: string, type: StarkProgressIndicatorType): void;

	/**
	 * Deregisters a progress indicator already existing in the application state.
	 * @param topic - The topic of the progress indicator to be deregistered
	 */
	deregister(topic: string): void;

	/**
	 * Shows the designated progress indicator
	 * @param topic - The topic that needs to be shown
	 */
	show(topic: string): void;

	/**
	 * Hides the progress indicator.
	 * @param topic - The topic that needs to be hidden
	 */
	hide(topic: string): void;

	/**
	 * Returns the latest status of the progress indicator for the given topic (whether is shown or hidden).
	 * @param topic - The topic of the progress indicator whose status will be fetched.
	 * @returns Observable that will emit a boolean value whenever the status of the progress indicator changes: false if it is hidden,
	 * true if it is shown or undefined in case there is no progress indicator for the given topic.
	 */
	isVisible(topic: string): Observable<boolean | undefined>;
}
