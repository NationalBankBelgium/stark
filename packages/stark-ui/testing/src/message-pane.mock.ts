import { StarkMessagePaneService } from "@nationalbankbelgium/stark-ui";
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the StarkMessagePaneService interface.
 * @link StarkMessagePaneService
 */
export class MockStarkMessagePaneService implements SpyObj<StarkMessagePaneService> {
	/**
	 * Flag to specify whether all messages should be cleared on navigation
	 */
	public clearOnNavigation = false;

	/**
	 * Add messages to the message pane
	 */
	public add: SpyObj<StarkMessagePaneService>["add"] = createSpy("add");

	/**
	 * Add a single message to the message pane
	 */
	public addOne: SpyObj<StarkMessagePaneService>["addOne"] = createSpy("addOne");

	/**
	 * Get all messages currently displayed in the message pane
	 */
	public getAll: SpyObj<StarkMessagePaneService>["getAll"] = createSpy("getAll");

	/**
	 * Remove messages from the message pane
	 */
	public remove: SpyObj<StarkMessagePaneService>["remove"] = createSpy("remove");

	/**
	 * Remove all messages
	 */
	public clearAll: SpyObj<StarkMessagePaneService>["clearAll"] = createSpy("clearAll");
}
