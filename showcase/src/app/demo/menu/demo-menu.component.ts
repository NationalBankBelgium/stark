import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-menu",
	templateUrl: "./demo-menu.component.html",
	styleUrls: ["./demo-menu.component.scss"]
})
export class DemoMenuComponent implements OnInit {
	public menuWithSections: StarkMenuConfig;
	public simpleMenu: StarkMenuConfig;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.simpleMenu = {
			menuGroups: [
				{
					id: "menu-item-home",
					icon: "home",
					label: "Home",
					isVisible: true,
					isEnabled: true,
					targetState: "#",
					targetStateParams: { param1: "1-1-1", param2: "1-1-2" }
				},
				{
					id: "menu-item-with-entries",
					label: "Menu item with entries",
					isVisible: true,
					isEnabled: true,
					entries: [
						{
							id: "menu-item-entry-1",
							label: "Entry 1 with entries",
							isVisible: true,
							isEnabled: true,
							entries: [
								{
									id: "menu-item-entry-1-entry-1",
									label: "Entry 1.1",
									isVisible: true,
									isEnabled: true,
									targetState: "#"
								},
								{
									id: "menu-item-entry-1-entry-2",
									label: "Entry 1.2",
									isVisible: true,
									isEnabled: true,
									targetState: "#"
								},
								{
									id: "menu-item-entry-1-entry-3",
									label: "Entry 1.3",
									isVisible: true,
									isEnabled: true,
									targetState: "#"
								}
							]
						},
						{
							id: "menu-item-entry-2",
							label: "Entry 1",
							isVisible: true,
							isEnabled: true,
							targetState: "#"
						},
						{
							id: "menu-item-entry-3",
							label: "Entry 1",
							isVisible: true,
							isEnabled: true,
							targetState: "#"
						}
					]
				},
				{
					id: "menu-item",
					label: "Menu item",
					isVisible: true,
					isEnabled: true,
					targetState: "#"
				}
			]
		};

		this.menuWithSections = {
			menuSections: [
				{
					label: "Section 1",
					menuGroups: [
						{
							id: "menu-item-home",
							icon: "home",
							label: "Home",
							isVisible: true,
							isEnabled: true,
							targetState: "#",
							targetStateParams: { param1: "1-1-1", param2: "1-1-2" }
						},
						{
							id: "menu-item-with-entries",
							label: "Menu item with entries",
							isVisible: true,
							isEnabled: true,
							entries: [
								{
									id: "menu-item-entry-1",
									label: "Entry 1 with entries",
									isVisible: true,
									isEnabled: true,
									entries: [
										{
											id: "menu-item-entry-1-entry-1",
											label: "Entry 1.1",
											isVisible: true,
											isEnabled: true,
											targetState: ""
										},
										{
											id: "menu-item-entry-1-entry-2",
											label: "Entry 1.2",
											isVisible: true,
											isEnabled: true,
											targetState: "#"
										},
										{
											id: "menu-item-entry-1-entry-3",
											label: "Entry 1.3",
											isVisible: true,
											isEnabled: true,
											targetState: "#"
										}
									]
								},
								{
									id: "menu-item-entry-2",
									label: "Entry 1",
									isVisible: true,
									isEnabled: true,
									targetState: "#"
								},
								{
									id: "menu-item-entry-3",
									label: "Entry 1",
									isVisible: true,
									isEnabled: true,
									targetState: "#"
								}
							]
						},
						{
							id: "menu-item",
							label: "Menu item",
							isVisible: true,
							isEnabled: true,
							targetState: "#"
						}
					]
				},
				{
					label: "Section 2",
					menuGroups: [
						{
							id: "menu-item-1",
							label: "Menu item 1",
							isVisible: true,
							isEnabled: true,
							targetState: "#"
						},
						{
							id: "menu-item-2",
							label: "Menu item 2",
							isVisible: true,
							isEnabled: false,
							targetState: "#"
						},
						{
							id: "menu-item-3",
							label: "Menu item 3",
							isVisible: false,
							isEnabled: false,
							targetState: "#"
						}
					]
				}
			]
		};
	}
}
