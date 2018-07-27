import { Injectable, Inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkAppSidebarService, starkAppSidebarServiceName } from "./app-sidebar.service.intf";
import { StarkAppSidebarOpenEvent } from "./app-sidebar-open-event.intf";

/**
 * @ignore
 * StarkAppSidebarService service
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

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {
		this.logger.debug(starkAppSidebarServiceName + " loaded");
	}

	public openMenu(): void {
		this.openSidebarSource.next({
			mode: "menu",
			sidebar: "left"
		});
	}

	// FIXME: this tslint disable flag is due to a bug in 'no-identical-functions' rule (https://github.com/SonarSource/SonarTS/issues/676). Remove it once it is solved
	/*tslint:disable-next-line:no-identical-functions*/
	public openLeft(): void {
		this.openSidebarSource.next({
			mode: "regular",
			sidebar: "left"
		});
	}

	public openRight(): void {
		this.openSidebarSource.next({
			sidebar: "right"
		});
	}

	public close(): void {
		this.closeSidebarSource.next();
	}
}
