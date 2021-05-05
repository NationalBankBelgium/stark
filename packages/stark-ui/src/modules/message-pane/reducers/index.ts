import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import { StarkMessageCollection } from "../entities";
import { StarkMessagePaneActions } from "../actions";
import { messagesReducer } from "./messages-pane.reducer";
import { starkMessagePaneStoreKey } from "../constants";

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
export const starkMessagesReducers: ActionReducerMap<StarkMessageState, StarkMessagePaneActions.Types> = {
	/**
	 * Reducer assigned to the state's `messages` property
	 */
	messages: messagesReducer
};

/**
 * NGRX Selector for the {@link StarkMessagePaneModule}'s state
 */
export const selectStarkMessages = createSelector(
	createFeatureSelector<StarkMessageState>(starkMessagePaneStoreKey),
	(state: StarkMessageState) => state.messages
);
