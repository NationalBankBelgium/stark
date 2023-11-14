import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import { StarkMessagePaneActions } from "../actions";
import { messagesReducer } from "./messages-pane.reducer";
import { starkMessagePaneStoreKey } from "../constants";
import { StarkMessageState } from "@nationalbankbelgium/stark-ui/src/common";

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
