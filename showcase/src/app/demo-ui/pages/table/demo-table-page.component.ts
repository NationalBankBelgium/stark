import { Component } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-table",
	templateUrl: "./demo-table-page.component.html"
})
export class DemoTablePageComponent {
	public referenceList: ReferenceLink[] = [
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
