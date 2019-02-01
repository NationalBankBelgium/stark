import { StarkProgressIndicatorType } from "./progress-indicator-type.entity";

/**
 * Interface of progress indicator config
 */
export interface StarkProgressIndicatorConfig {
	/**
	 * The topic that the progress indicator will subscribe to.
	 */
	topic: string;

	/**
	 * Type of progress indicator: SPINNER, ...
	 */
	type: StarkProgressIndicatorType;

	/**
	 * Whether the progress indicator is visible or not.
	 */
	visible?: boolean;

	/**
	 * Number of listeners (progress indicator directives) subscribed to the same topic of this config.
	 */
	listenersCount?: number;

	/**
	 * Number of listeners (progress indicator directives) that are still pending (those that have called
	 * the StarkProgressIndicatorService's show() method but have not called the hide() method yet)
	 */
	pendingListenersCount?: number;
}
