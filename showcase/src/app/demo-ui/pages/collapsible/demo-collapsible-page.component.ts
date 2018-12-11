import { Component, OnInit } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-collapsible",
	styleUrls: ["./demo-collapsible-page.component.scss"],
	templateUrl: "./demo-collapsible-page.component.html"
})
export class DemoCollapsiblePageComponent implements OnInit {
	public collapsed: boolean[] = [false, true, false, true, false, false, false];
	public referenceList: ReferenceLink[];

	public constructor() {
		//empty constructor
	}

	public toggleCollapsible(nb: number): void {
		this.collapsed[nb] = !this.collapsed[nb];
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.referenceList = [
			{
				label: "Stark Collapsible component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkCollapsibleComponent.html"
			}
		];
	}
}
