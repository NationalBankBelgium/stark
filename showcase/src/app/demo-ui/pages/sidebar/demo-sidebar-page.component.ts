import { Component, Inject } from "@angular/core";
import { STARK_APP_SIDEBAR_SERVICE, StarkAppSidebarService } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-sidebar",
	styleUrls: ["./demo-sidebar-page.component.scss"],
	templateUrl: "./demo-sidebar-page.component.html"
})
export class DemoSidebarPageComponent {
	public referenceList: ReferenceLink[] = [
		{
			label: "Stark AppSidebar service",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/interfaces/StarkAppSidebarService.html"
		},
		{
			label: "Stark Mock AppSidebar service",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/classes/MockStarkAppSidebarService.html"
		},
		{
			label: "Stark AppSidebar component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppSidebarComponent.html"
		}
	];

	public constructor(@Inject(STARK_APP_SIDEBAR_SERVICE) public sidebarService: StarkAppSidebarService) {}

	public openMenu(): void {
		this.sidebarService.openMenu();
	}

	public openLeftSidebar(): void {
		this.sidebarService.openLeft();
	}

	public openRightSidebar(): void {
		this.sidebarService.openRight();
	}
}
