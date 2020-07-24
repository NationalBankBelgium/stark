import { Component } from "@angular/core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, cost: 12, description: "number one" },
	{ id: 2, cost: 23, description: "second description" },
	{ id: 3, cost: 5, description: "the third description" },
	{ id: 4, cost: 33, description: "description number four" },
	{ id: 5, cost: 54, description: "fifth description" },
	{ id: 6, cost: 3, description: "the sixth description" },
	{ id: 7, cost: 7, description: "seventh description" },
	{ id: 9, cost: 24, description: "description number eight" },
	{ id: 9, cost: 35, description: "the ninth description" },
	{ id: 10, cost: 10, description: "description number ten" },
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
