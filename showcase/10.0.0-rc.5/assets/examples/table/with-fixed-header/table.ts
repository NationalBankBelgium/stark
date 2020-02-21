import { Component } from "@angular/core";
import { StarkPaginationConfig, StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, description: "number one" },
	/* ... */
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-fixed-header",
	templateUrl: "./table-with-fixed-header.component.html"
})
export class TableWithFixedHeaderComponent {
	public data: object[] = DUMMY_DATA;
	public paginationConfig: StarkPaginationConfig = {
		itemsPerPage: 10
	};

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "title",
			label: "Title",
			cellFormatter: (value: { label: string }): string => "~" + value.label
		},
		{ name: "description", label: "Description" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };
}
