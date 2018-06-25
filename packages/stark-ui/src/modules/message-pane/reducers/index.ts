import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkMessageCollection } from "../entities";
import { StarkMessagePaneActions } from "../actions";
import { messagesReducer } from "./messages-pane.reducer";

/**
 * We define part of the state assigned to the session module
 */
export interface StarkMessageState {
	/**
	 * The session property
	 * @link StarkMessageCollection
	 */
	messages: StarkMessageCollection;
}

/**
 * We assign a reducer to our session property
 */
export const starkMessagesReducers: ActionReducerMap<StarkMessageState, StarkMessagePaneActions> = {
	/**
	 * the reducer is assigned to our property
	 */
	messages: messagesReducer
};

/**
 * This will create the session feature used by the selector to find the session module in the state
 */
export const selectStarkMessagesFeature: MemoizedSelector<object, StarkMessageState> = createFeatureSelector<StarkMessageState>(
	"StarkMessages"
);

/**
 * The selector will return the part of the state assigned to the logging when called
 */
export const selectStarkMessages: MemoizedSelector<object, StarkMessageCollection> = createSelector(
	selectStarkMessagesFeature,
	(state: StarkMessageState) => state.messages
);
