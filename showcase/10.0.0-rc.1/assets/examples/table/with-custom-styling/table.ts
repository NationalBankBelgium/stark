import { Component, ViewEncapsulation } from "@angular/core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, description: "number one" },
	/* ... */
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-custom-styling",
	templateUrl: "./table-with-custom-styling.component.html",
	styleUrls: ["./table-with-custom-styling.component.scss"],
	encapsulation: ViewEncapsulation.None // Important
})
export class TableWithCustomStylingComponent {
	public data: object[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id", headerClassName: "large", cellClassName: "large" },
		{
			name: "title",
			label: "Title",
			cellFormatter: (value: { label: string }): string => "~" + value.label,
			cellClassName: (title: { value: number }): string => (title.value < 5 ? "danger" : title.value < 9 ? "warning" : "success")
		},
		{ name: "description", label: "Description" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };

	public getRowClassName = (_row: object, index: number): string => (index % 2 === 0 ? "even" : "odd");
}
