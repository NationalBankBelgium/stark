import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkMessageCollection } from "../entities";
import { StarkMessagePaneActions } from "../actions";
import { messagesReducer } from "./messages-pane.reducer";

/**
 * Defines the part of the state assigned to the {@link StarkMessagePaneModule}
 */
export interface StarkMessageState {
	/**
	 * State corresponding to the {@link StarkMessagePaneModule}
	 */
	messages: StarkMessageCollection;
}

/**
 * Reducers assigned to the each property of the {@link StarkMessagePaneModule}'s state
 */
export const starkMessagesReducers: ActionReducerMap<StarkMessageState, StarkMessagePaneActions> = {
	/**
	 * Reducer assigned to the state's `messages` property
	 */
	messages: messagesReducer
};

/**
 * NGRX Selector for the {@link StarkMessagePaneModule}'s state
 */
export const selectStarkMessages: MemoizedSelector<object, StarkMessageCollection> = createSelector(
	createFeatureSelector<StarkMessageState>("StarkMessages"),
	(state: StarkMessageState) => state.messages
);
