import { Component, ViewEncapsulation } from "@angular/core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, info: { label: "first info", tooltip: "this is first info" }, description: "number one" },
	/* ... */
	{ id: 232, title: { label: "eighth title (value: 8)", value: 8 }, info: { label: "eighth info", tooltip: "this is eighth info" }, description: "description number eight" },
];

@Component({
	selector: "showcase-table-with-tooltip",
	templateUrl: "./table-with-tooltip.component.html",
	styleUrls: ["./table-with-tooltip.component.scss"],
	/* tslint:disable-next-line:use-component-view-encapsulation */
	encapsulation: ViewEncapsulation.None // Important
})
export class TableWithTooltipComponent {
	public data: object[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{
			name: "id",
			label: "Id",
			cellTooltip: "This is the id",
			cellTooltipClassName: (id: number): string => id > 15 ? "tooltip-high" : "tooltip-low"
		},
		{
			name: "title",
			label: "Title",
			cellFormatter: (value: { label: string }): string => "~" + value.label,
			cellTooltip: (title: { value: number }): string => "value is " + (title.value % 2 === 0) ? "even" : "odd",
			cellTooltipClassName: (title: { value: number }): string => title.value % 2 === 0 ? "tooltip-even" : "tooltip-odd",
			cellTooltipPosition: "right"
		},
		{
			name: "info",
			label: "Info",
			cellFormatter: (value: { label: string }): string => value.label,
			cellTooltip: (info: { tooltip: string }): string => info.tooltip,
			cellTooltipClassName: "tooltip-info"
		},
		{ name: "description", label: "Description" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };
}
