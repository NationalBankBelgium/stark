import { StarkAppSidebarOpenEvent, StarkAppSidebarService } from "@nationalbankbelgium/stark-ui";
import { Subject } from "rxjs";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkAppSidebarService} interface.
 */
export class MockAppSidebarService implements SpyObj<StarkAppSidebarService> {
	/**
	 * See [StarkAppSidebarService closeSidebar$]{@link StarkAppSidebarService#closeSidebar$} property
	 */
	public closeSidebar$: Subject<void> = new Subject<void>();

	/**
	 * See [StarkAppSidebarService openSidebar$]{@link StarkAppSidebarService#openSidebar$} property
	 */
	public openSidebar$: Subject<StarkAppSidebarOpenEvent> = new Subject<StarkAppSidebarOpenEvent>();

	/**
	 * See [StarkAppSidebarService toggleSidebar$]{@link StarkAppSidebarService#toggleSidebar$} property
	 */
	public toggleSidebar$: Subject<StarkAppSidebarOpenEvent> = new Subject<StarkAppSidebarOpenEvent>();

	/**
	 * See [StarkAppSidebarService close()]{@link StarkAppSidebarService#close} method
	 */
	public close: Spy<StarkAppSidebarService["close"]> = createSpy("close");

	/**
	 * See [StarkAppSidebarService openMenu()]{@link StarkAppSidebarService#openMenu} method
	 */
	public openMenu: Spy<StarkAppSidebarService["openMenu"]> = createSpy("openMenu");

	/**
	 * See [StarkAppSidebarService openLeft()]{@link StarkAppSidebarService#openLeft} method
	 */
	public openLeft: Spy<StarkAppSidebarService["openLeft"]> = createSpy("openLeft");

	/**
	 * See [StarkAppSidebarService openRight()]{@link StarkAppSidebarService#openRight} method
	 */
	public openRight: Spy<StarkAppSidebarService["openRight"]> = createSpy("openRight");

	/**
	 * See [StarkAppSidebarService toggleMenu()]{@link StarkAppSidebarService#toggleMenu} method
	 */
	public toggleMenu: Spy<StarkAppSidebarService["toggleMenu"]> = createSpy("toggleMenu");
}
