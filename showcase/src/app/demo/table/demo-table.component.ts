import { Component, OnInit } from "@angular/core";
import { ReferenceLink } from "../../shared/reference-block";

@Component({
	selector: "demo-table",
	templateUrl: "./demo-table.component.html"
})
export class DemoTableComponent implements OnInit {
	public referenceList: ReferenceLink[];

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.referenceList = [
			{
				label: "Stark Table component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkTableComponent.html"
			},
			{
				label: "Stark Table - Column component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkTableColumnComponent.html"
			},
			{
				label: "Stark Table - Multisort Dialog component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkTableMultisortDialogComponent.html"
			}
		];
	}
}
