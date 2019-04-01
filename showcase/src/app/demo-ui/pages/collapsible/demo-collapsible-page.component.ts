import { Component } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-collapsible",
	styleUrls: ["./demo-collapsible-page.component.scss"],
	templateUrl: "./demo-collapsible-page.component.html"
})
export class DemoCollapsiblePageComponent {
	public collapsed: boolean[] = [false, false, true];
	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Collapsible component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkCollapsibleComponent.html"
		}
	];

	public toggleCollapsible(nb: number): void {
		this.collapsed[nb] = !this.collapsed[nb];
	}
}
