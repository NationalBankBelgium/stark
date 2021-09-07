import { Observable } from "rxjs";
import { StarkAppSidebarOpenEvent } from "./app-sidebar-open-event.intf";
import { InjectionToken } from "@angular/core";

/**
 * @ignore
 */
export const starkAppSidebarServiceName = "StarkAppSidebarService";
/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkAppSidebarService}
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
	 * Observable subscribed by components to catch toggle events
	 */
	toggleSidebar$: Observable<StarkAppSidebarOpenEvent>;

	/**
	 * Close all sidebars
	 */
	close(): void;

	/**
	 * Open sidebar's menu
	 */
	openMenu(): void;

	/**
	 * Open the left sidebar
	 */
	openLeft(): void;

	/**
	 * Open the right sidebar
	 */
	openRight(): void;

	/**
	 * Toggle sidebar's menu
	 */
	toggleMenu(): void;
}
