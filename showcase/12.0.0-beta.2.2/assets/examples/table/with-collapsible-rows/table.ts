import { Component } from "@angular/core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, cost: 12, description: "number one" },
	{ id: 10, cost: 23, description: "second description" },
	{ id: 12, cost: 5, description: "the third description" }
];

@Component({
	selector: "showcase-table-with-collapsible-rows",
	templateUrl: "./table-with-collapsible-rows.component.html",
	styleUrls: ["./table-with-collapsible-rows.component.scss"]
})
export class TableWithCollapsibleRowsComponent {
	public data: object[] = DUMMY_DATA;

	public expandedRows: object[] = [];

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "cost",
			label: "SHOWCASE.DEMO.TABLE.LABELS.TITLE"
		},
		{ name: "description", label: "SHOWCASE.DEMO.TABLE.LABELS.DESCRIPTION" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };

	public handleRowClicked(row: any): void {
		const index = this.expandedRows.findIndex((expandedRow: any) => expandedRow.id === row.id);
		if (index >= 0) {
			this.expandedRows.splice(index, 1);
		} else {
			this.expandedRows.push(row);
		}
	}
}
