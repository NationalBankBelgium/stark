import { Action } from "@ngrx/store";
import { StarkLogMessage } from "../entities";

/**
 * Actions related to stark logging service
 */

export enum StarkLoggingActionTypes {
	SET_LOGGING_APPLICATION_ID = "[StarkLogging] Set Logging Application Id",
	LOG_MESSAGE = "[StarkLogging] Log Message",
	FLUSH_LOG = "[StarkLogging] Flush Log"
}

/**
 * Add the Application Name to the logging object
 * @returns The created action object
 */
export class StarkSetLoggingApplicationId implements Action {
	public readonly type: StarkLoggingActionTypes.SET_LOGGING_APPLICATION_ID = StarkLoggingActionTypes.SET_LOGGING_APPLICATION_ID;

	public constructor(public applicationId: string) {}
}

/**
 * Store a debug/info/warning/error message
 * @param message - The message to log
 * @returns The created action object
 */
export class StarkLogMessageAction implements Action {
	public readonly type: StarkLoggingActionTypes.LOG_MESSAGE = StarkLoggingActionTypes.LOG_MESSAGE;

	public constructor(public message: StarkLogMessage) {}
}

/**
 * Persists the log messages in the redux store to the back-end
 * @returns The created action object
 */
export class StarkFlushLogMessages implements Action {
	public readonly type: StarkLoggingActionTypes.FLUSH_LOG = StarkLoggingActionTypes.FLUSH_LOG;

	public constructor(public numberOfMessagesToFlush: number) {}
}

export type StarkLoggingActions = StarkSetLoggingApplicationId | StarkLogMessageAction | StarkFlushLogMessages;
