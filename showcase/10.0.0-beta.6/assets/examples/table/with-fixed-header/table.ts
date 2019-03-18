import { Component, OnInit } from "@angular/core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, description: "number one" },
	/* ... */
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-fixed-header",
	templateUrl: "./table-with-fixed-header.component.html"
})
export class TableWithFixedHeaderComponent implements OnInit {
	public data: object[];

	public columns: StarkTableColumnProperties[];

	public filter: StarkTableFilter;

	public ngOnInit(): void {
		this.data = DUMMY_DATA;

		this.columns = [
			{ name: "id", label: "Id" },
			{ name: "title", label: "Title", cellFormatter: (value: { label: string }): string => "~" + value.label },
			{ name: "description", label: "Description" }
		];

		this.filter = { globalFilterPresent: false, columns: [] };
	}
}
