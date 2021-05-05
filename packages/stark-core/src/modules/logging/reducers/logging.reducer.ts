import { StarkLoggingActions } from "../actions";
import { StarkLogging, StarkLogMessage } from "../entities";
import { createReducer, on } from "@ngrx/store";

/**
 * Defines the initial state of the reducer
 */
const INITIAL_LOGGING_STATE: Readonly<StarkLogging> = {
	uuid: "",
	applicationId: "",
	messages: []
};

/**
 * Definition of the reducer using `createReducer` method.
 */
const reducer = createReducer<StarkLogging, StarkLoggingActions.Types>(
	INITIAL_LOGGING_STATE,
	on(StarkLoggingActions.logMessage, (state, action) => ({ ...state, messages: [...state.messages, action.message] })),
	on(StarkLoggingActions.flushLogMessages, (state, action) => {
		const numberOfMessagesToFlush: number = action.numberOfMessagesToFlush;
		const numberOfMessages: number = state.messages.length;
		const messages: StarkLogMessage[] = state.messages.slice(numberOfMessagesToFlush, numberOfMessages);

		return { ...state, messages: [...messages] };
	}),
	on(StarkLoggingActions.setLoggingApplicationId, (state, action) => ({ ...state, applicationId: action.applicationId }))
);

/**
 * Definition of the `logging` reducer.
 * @param state - The state of the reducer
 * @param action - The action to perform
 * @returns The new `StarkLogging` state
 */
export function loggingReducer(
	state: Readonly<StarkLogging> | undefined,
	action: Readonly<StarkLoggingActions.Types>
): Readonly<StarkLogging> {
	return reducer(state, action);
}
