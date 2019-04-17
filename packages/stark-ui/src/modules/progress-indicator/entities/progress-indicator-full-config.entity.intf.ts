import { StarkProgressIndicatorConfig } from "./progress-indicator-config.entity.intf";

// FIXME: currently the '@internal' JSDoc tag cannot be used in interfaces due to a bug in TSLint (https://github.com/palantir/tslint/issues/4326)
/**
 * Interface of progress indicator config to be used internally by the {@link StarkProgressIndicatorService}
 * **internal**
 */
export interface StarkProgressIndicatorFullConfig extends StarkProgressIndicatorConfig {
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
