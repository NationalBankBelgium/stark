import { StarkMessage, StarkMessageType } from "../../../common/message";
import { StarkMessageCollection } from "../entities";
import { StarkMessagePaneActionTypes, StarkMessagePaneActions } from "../actions";
import { StarkAddMessages, StarkRemoveMessages } from "../actions/message-pane.actions";

/**
 * @ignore
 */
const _findIndex: Function = require("lodash/findIndex");

/**
 * key to retrieve stark messages in a store
 */
export const starkMessagesStoreKey: string = "starkMessages";

/**
 * Initial state of the store
 */
const INITIAL_STATE: Readonly<StarkMessageCollection> = {
	infoMessages: [],
	warningMessages: [],
	errorMessages: []
};

/**
 * Definition of the message reducergit
 * @param state - the state of the reducer
 * @param action - the action to perform
 */
export function messagesReducer(
	state: Readonly<StarkMessageCollection> = INITIAL_STATE,
	action: Readonly<StarkMessagePaneActions>
): Readonly<StarkMessageCollection> {
	// the new state will be calculated from the data coming in the actions
	switch (action.type) {
		case StarkMessagePaneActionTypes.ADD_MESSAGES:
			return addMessage(state, <StarkAddMessages>action);

		case StarkMessagePaneActionTypes.CLEAR_MESSAGES:
			return clearMessages(state);

		case StarkMessagePaneActionTypes.REMOVE_MESSAGES:
			return removeMessages(state, <StarkRemoveMessages>action);

		default:
			return state;
	}
}

/**
 * Ignore
 */
function addMessage(state: Readonly<StarkMessageCollection>, action: Readonly<StarkAddMessages>): Readonly<StarkMessageCollection> {
	// by default the current message arrays remain unchanged
	const newStateAfterAddition: StarkMessageCollection = {
		infoMessages: state.infoMessages,
		warningMessages: state.warningMessages,
		errorMessages: state.errorMessages
	};

	// merging with the current state (only those type of messages that are being added)
	for (const newMessage of action.messages) {
		switch (newMessage.type) {
			case StarkMessageType.INFO:
				newStateAfterAddition.infoMessages = insertMessage(newStateAfterAddition.infoMessages, newMessage); // immutable PUSH
				break;
			case StarkMessageType.WARNING:
				newStateAfterAddition.warningMessages = insertMessage(newStateAfterAddition.warningMessages, newMessage); // immutable PUSH
				break;
			case StarkMessageType.ERROR:
				newStateAfterAddition.errorMessages = insertMessage(newStateAfterAddition.errorMessages, newMessage); // immutable PUSH
				break;
			default:
				throw new Error("Unknown message type received by reducer: " + newMessage.type);
		}
	}

	return newStateAfterAddition;
}

/**
 * Ignore
 */
function clearMessages(state: Readonly<StarkMessageCollection>): Readonly<StarkMessageCollection> {
	let clearedState: StarkMessageCollection = INITIAL_STATE;

	// a new state will be created as long as there are messages to be cleared, otherwise the state remains untouched
	if (state.errorMessages.length + state.infoMessages.length + state.warningMessages.length === 0) {
		clearedState = state;
	}

	return clearedState;
}

/**
 * Ignore
 */
function removeMessages(state: Readonly<StarkMessageCollection>, action: Readonly<StarkRemoveMessages>): Readonly<StarkMessageCollection> {
	// getting a deeply mutable copy
	const mutableState: StarkMessageCollection = {
		infoMessages: [...state.infoMessages],
		warningMessages: [...state.warningMessages],
		errorMessages: [...state.errorMessages]
	};
	// by default the current message arrays remain unchanged
	const newStateAfterRemoval: StarkMessageCollection = {
		infoMessages: state.infoMessages,
		warningMessages: state.warningMessages,
		errorMessages: state.errorMessages
	};

	// merging with the current state (only those type of messages that are being removed)
	for (const messageToRemove of action.messages) {
		let idx: number;

		switch (messageToRemove.type) {
			case StarkMessageType.INFO:
				idx = _findIndex(mutableState.infoMessages, ["id", messageToRemove.id]);
				if (idx !== -1) {
					mutableState.infoMessages.splice(idx, 1);
					newStateAfterRemoval.infoMessages = mutableState.infoMessages;
				}
				break;
			case StarkMessageType.WARNING:
				idx = _findIndex(mutableState.warningMessages, ["id", messageToRemove.id]);
				if (idx !== -1) {
					mutableState.warningMessages.splice(idx, 1);
					newStateAfterRemoval.warningMessages = mutableState.warningMessages;
				}
				break;
			case StarkMessageType.ERROR:
				idx = _findIndex(mutableState.errorMessages, ["id", messageToRemove.id]);
				if (idx !== -1) {
					mutableState.errorMessages.splice(idx, 1);
					newStateAfterRemoval.errorMessages = mutableState.errorMessages;
				}
				break;
			default:
				throw new Error("Unknown message type received by reducer: " + messageToRemove.type);
		}
	}

	return newStateAfterRemoval;
}

/**
 * This function ensures that the new message is inserted in the right order.
 * The messages should be ordered by ascending priority and then ordered by time (the most recent first).
 * @param messageArray - The array of messages to insert the new message to
 * @param newMessage - The new message to be inserted in the array
 * @returns Array of messages including the inserted message in the right order
 */
function insertMessage(messageArray: StarkMessage[], newMessage: StarkMessage): StarkMessage[] {
	if (messageArray.length === 0) {
		messageArray = [newMessage];
		return messageArray;
	}

	let index: number = 0;
	for (const message of messageArray) {
		if (<number>message.priority >= <number>newMessage.priority) {
			break;
		}
		index++;
	}

	const slice1: StarkMessage[] = messageArray.slice(0, index);
	const slice2: StarkMessage[] = messageArray.slice(index);
	return [...slice1, newMessage, ...slice2];
}
