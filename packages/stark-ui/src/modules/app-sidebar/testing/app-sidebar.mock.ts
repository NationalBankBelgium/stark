/**
 * Mock class of the StarkAppSidebarService interface.
 * @link StarkAppSidebarService
 */
import { Observable, Subject } from "rxjs";
import { StarkAppSidebarOpenEvent, StarkAppSidebarService } from "@nationalbankbelgium/stark-ui";

export class MockAppSidebarService implements StarkAppSidebarService {
	private openSidebarSource: Subject<StarkAppSidebarOpenEvent> = new Subject<StarkAppSidebarOpenEvent>();

	public openSidebar$: Observable<StarkAppSidebarOpenEvent> = this.openSidebarSource.asObservable();

	private closeSidebarSource: Subject<void> = new Subject<void>();

	public closeSidebar$: Observable<void> = this.closeSidebarSource.asObservable();

	public openMenu: () => void = jasmine.createSpy("openMenu");

	public openLeft: () => void = jasmine.createSpy("openLeft");

	public openRight: () => void = jasmine.createSpy("openRight");

	public close: () => void = jasmine.createSpy("close");
}
