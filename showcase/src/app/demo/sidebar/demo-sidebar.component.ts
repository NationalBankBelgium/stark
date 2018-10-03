import { Component, Inject, OnInit } from "@angular/core";
import { STARK_APP_SIDEBAR_SERVICE, StarkAppSidebarService } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../shared/reference-block";

@Component({
	selector: "demo-sidebar",
	styleUrls: ["./demo-sidebar.component.scss"],
	templateUrl: "./demo-sidebar.component.html"
})
export class DemoSidebarComponent implements OnInit {
	public referenceList: ReferenceLink[];

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

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.referenceList = [
			{
				label: "Stark Sidebar component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppSidebarComponent.html"
			}
		];
	}
}
