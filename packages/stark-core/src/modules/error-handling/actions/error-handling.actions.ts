import { Action } from "@ngrx/store";

/**
 * All the StarkErrorHandling action types
 */
export enum StarkErrorHandlingActionTypes {
	UNHANDLED_ERROR = "[StarkErrorHandling] Unhandled Error"
}

/**
 * Action that requires to display an error message as a toast notification
 * @returns The created action object
 */
export class StarkUnhandledError implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkErrorHandlingActionTypes.UNHANDLED_ERROR = StarkErrorHandlingActionTypes.UNHANDLED_ERROR;

	/**
	 * Class constructor
	 * @param error - The error to display
	 */
	public constructor(public error: any) {}
}

export type StarkErrorHandlingActions = StarkUnhandledError;
