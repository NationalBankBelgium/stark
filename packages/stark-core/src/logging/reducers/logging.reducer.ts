"use strict";

import { StarkLoggingActions, StarkLoggingActionTypes } from "../actions/index";
import { StarkLogging, StarkLogMessage } from "../entities/index";
import { LogMessage, FlushLogMessages, SetApplicationId } from "../actions/logging.actions";

export const starkLoggingStoreKey: string = "starkLogging";

const INITIAL_STATE: Readonly<StarkLogging> = {
	uuid: "",
	applicationId: "",
	messages: []
};

export function loggingReducer(
	state: Readonly<StarkLogging> = INITIAL_STATE,
	action: Readonly<StarkLoggingActions>
): Readonly<StarkLogging> {
	// the new state will be calculated from the data coming in the actions
	switch (action.type) {
		case StarkLoggingActionTypes.LOG_MESSAGE:
			action = <LogMessage>action;
			const message: StarkLogMessage = action.message;
			return { ...state, messages: [...state.messages, message] };

		case StarkLoggingActionTypes.FLUSH_LOG:
			action = <FlushLogMessages>action;
			const numberOfMessagesToFlush: number = action.numberOfMessagesToFlush;
			const numberOfMessages: number = state.messages.length;
			const messages: StarkLogMessage[] = state.messages.slice(numberOfMessagesToFlush, numberOfMessages);

			return { ...state, messages: [...messages] };

		case StarkLoggingActionTypes.LOGGING_SET_APPLICATION_ID:
			action = <SetApplicationId>action;
			return { ...state, applicationId: action.applicationId };

		default:
			return state;
	}
}
