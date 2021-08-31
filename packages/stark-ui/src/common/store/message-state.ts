import { StarkMessageCollection } from "../message";

/**
 * Defines the part of the state assigned to the {@link StarkMessagePaneModule}
 */
export interface StarkMessageState {
	/**
	 * State corresponding to the {@link StarkMessagePaneModule}
	 */
	messages: StarkMessageCollection;
}
