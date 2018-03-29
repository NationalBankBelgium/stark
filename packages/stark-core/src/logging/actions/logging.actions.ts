"use strict";

import { Action } from "@ngrx/store";
import { StarkLogMessage } from "../entities/index";

/**
 * Actions related to stark logging service
 */

export enum StarkLoggingActionTypes {
	LOGGING_SET_APPLICATION_ID = "LOGGING_SET_APPLICATION_ID",
	LOG_MESSAGE = "LOG_MESSAGE",
	FLUSH_LOG = "FLUSH_LOG"
}

/**
 * Add the Application Name to the logging object
 * @returns The created action object
 */
export class SetApplicationId implements Action {
	public readonly type:"LOGGING_SET_APPLICATION_ID" = StarkLoggingActionTypes.LOGGING_SET_APPLICATION_ID;
	public constructor(public applicationId: string) {
	}
}

/**
 * Store a debug/info/warning/error message
 * @param message - The message to log
 * @returns The created action object
 */
export class LogMessage implements Action {
	public readonly type:"LOG_MESSAGE" = StarkLoggingActionTypes.LOG_MESSAGE;
	public constructor(public message: StarkLogMessage) {
	}
}

/**
 * Persists the log messages in the redux store to the back-end
 * @returns The created action object
 */
export class FlushLogMessages implements Action {
	public readonly type:"FLUSH_LOG" = StarkLoggingActionTypes.FLUSH_LOG;

	public constructor(public numberOfMessagesToFlush: number) {}
}
export type StarkLoggingActions = SetApplicationId | LogMessage | FlushLogMessages;
