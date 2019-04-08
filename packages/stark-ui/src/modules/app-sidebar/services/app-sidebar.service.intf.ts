import { Observable } from "rxjs";
import { StarkAppSidebarOpenEvent } from "./app-sidebar-open-event.intf";
import { InjectionToken } from "@angular/core";

/**
 * The name of the service in case an injection is needed
 */
export const starkAppSidebarServiceName = "StarkAppSidebarService";
/**
 * The InjectionToken version of the service name
 */
export const STARK_APP_SIDEBAR_SERVICE: InjectionToken<StarkAppSidebarService> = new InjectionToken<StarkAppSidebarService>(
	starkAppSidebarServiceName
);

/**
 * Stark Sidebar Service.
 */
export interface StarkAppSidebarService {
	/**
	 * Observable subscribed by components to catch close events
	 */
	closeSidebar$: Observable<void>;

	/**
	 * Observable subscribed by components to catch open events
	 */
	openSidebar$: Observable<StarkAppSidebarOpenEvent>;

	/**
	 * Observable subscribed by components to catch open events
	 */
	toggleSidebar$: Observable<StarkAppSidebarOpenEvent>;

	/**
	 * close all sidebars
	 */
	close(): void;

	/**
	 * open sidebar's menu
	 */
	openMenu(): void;

	/**
	 * open the left sidebar
	 */
	openLeft(): void;

	/**
	 * open the right sidebar
	 */
	openRight(): void;

	/**
	 * toggle sidebar's menu
	 */
	toggleMenu(): void;
}
