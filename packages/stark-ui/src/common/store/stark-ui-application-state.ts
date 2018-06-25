import { messagesReducer, starkMessagesStoreKey } from "../../modules/message-pane/reducers/messages-pane.reducer";
import { StarkMessageCollection } from "@nationalbankbelgium/stark-ui";

/**
 * List of all reducers
 */
export let starkUiReducers: object = {};
starkUiReducers[starkMessagesStoreKey] = messagesReducer;

/**
 * Interface defining the shape of the application state of Stark Ui extending Core (i.e., what's stored in Redux by Stark)
 */
export interface StarkUIApplicationState {
	starkMessages: StarkMessageCollection;
}
