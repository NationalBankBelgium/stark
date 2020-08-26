import { Action } from "@ngrx/store";
import { StarkMessage } from "../../../common/message";

/**
 * Actions related to stark message pane service
 */
export enum StarkMessagePaneActionTypes {
	ADD_MESSAGES = "[StarkMessagePane] Add Messages",
	REMOVE_MESSAGES = "[StarkMessagePane] Remove Messages",
	CLEAR_MESSAGES = "[StarkMessagePane] Clear Messages",
	GET_ALL_MESSAGES = "[StarkMessagePane] Get All Messages"
}

/**
 * Triggered when the addMessages() method is called.
 */
export class StarkAddMessages implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkMessagePaneActionTypes.ADD_MESSAGES = StarkMessagePaneActionTypes.ADD_MESSAGES;

	/**
	 * Class constructor
	 * @param messages - The messages to add.
	 */
	public constructor(public messages: StarkMessage[]) {}
}

/**
 * Triggered when the removeMessages() method is called.
 */
export class StarkRemoveMessages implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkMessagePaneActionTypes.REMOVE_MESSAGES = StarkMessagePaneActionTypes.REMOVE_MESSAGES;

	/**
	 * Class constructor
	 * @param messages - The messages to remove.
	 */
	public constructor(public messages: StarkMessage[]) {}
}

/**
 * Triggered when the clearMessages() method is called.
 */
export class StarkClearMessages implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkMessagePaneActionTypes.CLEAR_MESSAGES = StarkMessagePaneActionTypes.CLEAR_MESSAGES;
}

/**
 * Triggered when the getAllMessages() method is called.
 */
export class StarkGetAllMessages implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkMessagePaneActionTypes.GET_ALL_MESSAGES = StarkMessagePaneActionTypes.GET_ALL_MESSAGES;
}

export type StarkMessagePaneActions = StarkAddMessages | StarkRemoveMessages | StarkClearMessages | StarkGetAllMessages;
