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
}
