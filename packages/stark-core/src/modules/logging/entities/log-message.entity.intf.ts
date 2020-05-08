import { StarkLogMessageType } from "./log-message-type.entity";
import { StarkError } from "../../../common/error";

/**
 * Log message for Stark Application
 */
export interface StarkLogMessage {
	/**
	 * The timestamp of the message
	 */
	timestamp: string;
	/**
	 * The log message
	 */
	message: string;
	/**
	 * The type of message (debug, warn, info,...)
	 */
	type: StarkLogMessageType;
	/**
	 * The correlation id of the log message
	 */
	correlationId: string;
	/**
	 * The error linked to the log message
	 */
	error?: StarkError;
}
