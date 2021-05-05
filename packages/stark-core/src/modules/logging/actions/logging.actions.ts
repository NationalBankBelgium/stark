import { createAction, props, union } from "@ngrx/store";
import { StarkLogMessage } from "../entities";
import { starkLoggingStoreKey } from "../constants";

/**
 * Add the Application Name to the logging object
 *
 * Parameter:
 *   - applicationId - The id of the application
 */
export const setLoggingApplicationId = createAction(`[${starkLoggingStoreKey}] Set Logging Application Id`, props<{ applicationId: string }>());

/**
 * Store a debug/info/warning/error message
 *
 * Parameter:
 *   - message - The message to log
 */
export const logMessage = createAction(`[${starkLoggingStoreKey}] Log Message`, props<{ message: StarkLogMessage }>());

/**
 * Persists the log messages in the redux store to the back-end
 *
 * Parameter:
 *   - numberOfMessagesToFlush - The number of messages to flush
 */
export const flushLogMessages = createAction(`[${starkLoggingStoreKey}] Flush Log`, props<{ numberOfMessagesToFlush: number }>());

/**
 * @ignore
 */
const all = union({ setLoggingApplicationId, logMessage, flushLogMessages });
export type Types = typeof all;
