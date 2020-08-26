import { StarkMessagePaneService } from "@nationalbankbelgium/stark-ui";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkMessagePaneService} interface.
 */
export class MockStarkMessagePaneService implements SpyObj<StarkMessagePaneService> {
	/**
	 * See [StarkMessagePaneService clearOnNavigation]{@link StarkMessagePaneService#clearOnNavigation} property
	 *
	 * Default: `false`.
	 */
	public clearOnNavigation = false;

	/**
	 * See [StarkMessagePaneService add()]{@link StarkMessagePaneService#add} method
	 */
	public add: Spy<StarkMessagePaneService["add"]> = createSpy("add");

	/**
	 * See [StarkMessagePaneService addOne()]{@link StarkMessagePaneService#addOne} method
	 */
	public addOne: Spy<StarkMessagePaneService["addOne"]> = createSpy("addOne");

	/**
	 * See [StarkMessagePaneService getAll()]{@link StarkMessagePaneService#getAll} method
	 */
	public getAll: Spy<StarkMessagePaneService["getAll"]> = createSpy("getAll");

	/**
	 * See [StarkMessagePaneService remove()]{@link StarkMessagePaneService#remove} method
	 */
	public remove: Spy<StarkMessagePaneService["remove"]> = createSpy("remove");

	/**
	 * See [StarkMessagePaneService clearAll()]{@link StarkMessagePaneService#clearAll} method
	 */
	public clearAll: Spy<StarkMessagePaneService["clearAll"]> = createSpy("clearAll");
}
