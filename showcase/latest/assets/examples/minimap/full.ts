import { Component, OnInit } from "@angular/core";
import { ItemVisibility, StarkMinimapItemProperties } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-minimap",
	templateUrl: "./full.html"
})
export class DemoFullMinimapComponent implements OnInit {
	public items: StarkMinimapItemProperties[];
	public visibleItems: string[];

	public constructor() {
		//
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.items = [
			{ name: "first", label: "first" },
			{ name: "second", label: "second" },
			{ name: "third", label: "third" },
			{ name: "fourth", label: "fourth" }
		];

		this.visibleItems = [this.items[0].name, this.items[1].name, this.items[2].name, this.items[3].name];
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
