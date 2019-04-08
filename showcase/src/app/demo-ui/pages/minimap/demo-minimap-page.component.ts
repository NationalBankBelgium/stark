import { Component } from "@angular/core";
import { StarkMinimapItemProperties } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-minimap",
	templateUrl: "./demo-minimap-page.component.html",
	styleUrls: ["./demo-minimap-page.component.scss"]
})
export class DemoMinimapPageComponent {
	public items: StarkMinimapItemProperties[] = [
		{ name: "First", label: "First" },
		{ name: "Second", label: "Second" },
		{ name: "Third", label: "Third" },
		{ name: "Fourth", label: "Fourth" }
	];
	public visibleItems = [this.items[0].name, this.items[1].name, this.items[2].name, this.items[3].name];

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Minimap component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkMinimapComponent.html"
		}
	];

	public showHideItem(item: StarkMinimapItemProperties): void {
		const index: number = this.visibleItems.indexOf(item.name);

		if (index !== -1) {
			this.visibleItems = [...this.visibleItems.slice(0, index), ...this.visibleItems.slice(index + 1)];
		} else {
			this.visibleItems = [...this.visibleItems, item.name];
		}
	}
}
