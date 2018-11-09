import { StarkMessage } from "../../../common/message";

/**
 * A collection of messages to be displayed in the {@link StarkMessagePaneComponent}
 */
export interface StarkMessageCollection {
	/**
	 * Array of 'info' messages
	 */
	infoMessages: StarkMessage[];

	/**
	 * Array of 'warning' messages
	 */
	warningMessages: StarkMessage[];

	/**
	 * Array of 'error' messages
	 */
	errorMessages: StarkMessage[];
}
