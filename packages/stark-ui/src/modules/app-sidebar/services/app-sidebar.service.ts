import { Inject, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkAppSidebarService, starkAppSidebarServiceName } from "./app-sidebar.service.intf";
import { StarkAppSidebarOpenEvent } from "./app-sidebar-open-event.intf";

/**
 * @ignore
 */
@Injectable()
export class StarkAppSidebarServiceImpl implements StarkAppSidebarService {
	/**
	 * Subject emitting sidebar open events
	 */
	private openSidebarSource: Subject<StarkAppSidebarOpenEvent> = new Subject<StarkAppSidebarOpenEvent>();

	public openSidebar$: Observable<StarkAppSidebarOpenEvent> = this.openSidebarSource.asObservable();

	/**
	 * Subject emitting sidebar close events
	 */
	private closeSidebarSource: Subject<void> = new Subject<void>();

	public closeSidebar$: Observable<void> = this.closeSidebarSource.asObservable();

	/**
	 * Subject emitting sidebar toggle events
	 */
	private toggleSidebarSource: Subject<StarkAppSidebarOpenEvent> = new Subject<StarkAppSidebarOpenEvent>();

	public toggleSidebar$: Observable<StarkAppSidebarOpenEvent> = this.toggleSidebarSource.asObservable();

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {
		this.logger.debug(starkAppSidebarServiceName + " loaded");
	}

	public close(): void {
		this.closeSidebarSource.next();
	}

	public openMenu(): void {
		this.openSidebarSource.next({
			type: "menu",
			sidebar: "left"
		});
	}

	public openLeft(): void {
		this.openSidebarSource.next({
			type: "regular",
			sidebar: "left"
		});
	}

	public openRight(): void {
		this.openSidebarSource.next({
			sidebar: "right"
		});
	}

	public toggleMenu(): void {
		this.toggleSidebarSource.next({
			type: "menu",
			sidebar: "left"
		});
	}
}
