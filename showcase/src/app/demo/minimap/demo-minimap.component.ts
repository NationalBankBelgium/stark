import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../shared/reference-block";
import { ItemVisibility, StarkMinimapItemProperties } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-minimap",
	templateUrl: "./demo-minimap.component.html",
	styleUrls: ["./demo-minimap.component.scss"]
})
export class DemoMinimapComponent implements OnInit {
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

	public showHideItem(itemToHandle: ItemVisibility): void {
		const index: number = this.visibleItems.indexOf(itemToHandle.item.name);

		if (index !== -1) {
			if (!itemToHandle.isVisible) {
				this.visibleItems = [...this.visibleItems.slice(0, index), ...this.visibleItems.slice(index + 1)];
			}
		} else {
			if (itemToHandle.isVisible) {
				this.visibleItems = [...this.visibleItems, itemToHandle.item.name];
			}
		}
	}
}
