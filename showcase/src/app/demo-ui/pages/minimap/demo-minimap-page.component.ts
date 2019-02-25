import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../../shared/components";
import {  StarkMinimapItemProperties } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-minimap",
	templateUrl: "./demo-minimap-page.component.html",
	styleUrls: ["./demo-minimap-page.component.scss"]
})
export class DemoMinimapPageComponent implements OnInit {
	public items: StarkMinimapItemProperties[];
	public visibleItems: string[];
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.items = [
			{ name: "First", label: "First" },
			{ name: "Second", label: "Second" },
			{ name: "Third", label: "Third" },
			{ name: "Fourth", label: "Fourth" }
		];

		this.visibleItems = [this.items[0].name, this.items[1].name, this.items[2].name, this.items[3].name];

		this.referenceList = [
			{
				label: "Stark Minimap component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkMinimapComponent.html"
			}
		];
	}

	public showHideItem(item: StarkMinimapItemProperties): void {
		const index: number = this.visibleItems.indexOf(item.name);

		if (index !== -1) {
			this.visibleItems = [...this.visibleItems.slice(0, index), ...this.visibleItems.slice(index + 1)];
		} else {
			this.visibleItems = [...this.visibleItems, item.name];
		}
	}
}
