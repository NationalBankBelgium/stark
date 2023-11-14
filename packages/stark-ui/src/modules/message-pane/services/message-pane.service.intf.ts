import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { StarkMessage, StarkMessageCollection } from "@nationalbankbelgium/stark-ui/src/common";

/**
 * @ignore
 */
export const starkMessagePaneServiceName = "StarkMessagePaneService";
/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkMessagePaneService}
 */
export const STARK_MESSAGE_PANE_SERVICE: InjectionToken<StarkMessagePaneService> = new InjectionToken<StarkMessagePaneService>(
	starkMessagePaneServiceName
);

/**
 * Service to interact with the {@link StarkMessagePaneComponent}.
 * Can be used to :
 *
 * - send messages to display (info, warning, error)
 * - remove currently displayed messages
 * - ...
 */
export interface StarkMessagePaneService {
	/**
	 * Flag to specify whether all messages should be cleared on navigation
	 */
	clearOnNavigation: boolean;

	/**
	 * Add messages to the message pane
	 * @param messages - The messages to be added
	 */
	add(messages: StarkMessage[]): void;

	/**
	 * Add a single message to the message pane
	 * @param message - The message to be added
	 */
	addOne(message: StarkMessage): void;

	/**
	 * Get all messages currently displayed in the message pane
	 */
	getAll(): Observable<StarkMessageCollection>;

	/**
	 * Remove messages from the message pane
	 * @param messages - The messages to remove
	 */
	remove(messages: StarkMessage[]): void;

	/**
	 * Remove all messages
	 */
	clearAll(): void;
}
