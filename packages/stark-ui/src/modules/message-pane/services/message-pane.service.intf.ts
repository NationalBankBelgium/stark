"use strict";

import { Observable } from "rxjs";
import { StarkMessage } from "../../../common/message";
import { StarkMessageCollection } from "../entities/message-collection.entity.intf";
import { InjectionToken } from "@angular/core";

/**
 * The name of the service
 */
export const starkMessagePaneServiceName: string = "StarkMessagePaneService";
/**
 * Injection Token version of the Service Name
 */
export const STARK_MESSAGE_PANE_SERVICE: InjectionToken<StarkMessagePaneService> = new InjectionToken<StarkMessagePaneService>(
	starkMessagePaneServiceName
);

/**
 * Message pane service of Stark.
 * Can be used to manipulate messages displayed on the pane
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
