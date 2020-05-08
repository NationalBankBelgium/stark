import { StarkLogMessage } from "./log-message.entity.intf";

/**
 * The StarkLogging entity to be kept in the application state
 */
export interface StarkLogging {
	/**
	 * The `uuid` of the entity
	 */
	uuid: string;
	/**
	 * The id of the application
	 */
	applicationId: string;
	/**
	 * The {@link StarkLogMessage} objects being logged
	 */
	messages: StarkLogMessage[];
}
