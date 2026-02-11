import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, cost: 12, description: "number one" },
	/*...*/
	{ id: 11, cost: 21, description: "eleventh description", whatever: "<span>whatever</span>" },
	{ id: 12, cost: 6, description: "the twelfth description", whatever: "<span>whatever</span>" }
];

@Component({
	selector: "showcase-table-with-custom-cell-rendering",
	templateUrl: "./table-with-custom-cell-rendering.component.html"
})
export class TableWithCustomCellRenderingComponent {
	public data: object[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "cost",
			label: "SHOWCASE.DEMO.TABLE.LABELS.TITLE",
			cellClassName: (cost: number): string => (cost === 5 ? "danger" : cost === 21 ? "warning" : "")
		},
		{ name: "description", label: "SHOWCASE.DEMO.TABLE.LABELS.DESCRIPTION" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };
}
