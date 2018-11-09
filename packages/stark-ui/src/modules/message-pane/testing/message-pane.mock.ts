import { Observable } from "rxjs";
import { StarkMessage, StarkMessageCollection, StarkMessagePaneService } from "@nationalbankbelgium/stark-ui";

/**
 * Mock class of the StarkMessagePaneService interface.
 * @link StarkMessagePaneService
 */
export class MockStarkMessagePaneService implements StarkMessagePaneService {
	/**
	 * Flag to specify whether all messages should be cleared on navigation
	 */
	public clearOnNavigation: boolean;

	/**
	 * Add messages to the message pane
	 */
	public add: (messages: StarkMessage[]) => void = jasmine.createSpy("add");

	/**
	 * Add a single message to the message pane
	 */
	public addOne: (message: StarkMessage) => void = jasmine.createSpy("addOne");

	/**
	 * Get all messages currently displayed in the message pane
	 */
	public getAll: () => Observable<StarkMessageCollection> = jasmine.createSpy("getAll");

	/**
	 * Remove messages from the message pane
	 */
	public remove: (messages: StarkMessage[]) => void = jasmine.createSpy("remove");

	/**
	 * Remove all messages
	 */
	public clearAll: () => void = jasmine.createSpy("clearAll");
}
