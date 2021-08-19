import {Component, ViewEncapsulation} from "@angular/core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, info: { label: "first info", tooltip: "this is first info" }, description: "number one" },
	{ id: 10, title: { label: "second title (value: 2)", value: 2 }, info: { label: "second info", tooltip: "this is second info" }, description: "second description" },
	{ id: 126, title: { label: "third title (value: 3)", value: 3 }, info: { label: "third info", tooltip: "this is third info" }, description: "the third description" },
	{ id: 2, title: { label: "fourth title (value: 4)", value: 4 }, info: { label: "fourth info", tooltip: "this is fourth info" }, description: "description number four" },
	{ id: 23, title: { label: "fifth title (value: 5)", value: 5 }, info: { label: "fifth info", tooltip: "this is fifth info" }, description: "fifth description" },
	{ id: 3, title: { label: "sixth title (value: 6)", value: 6 }, info: { label: "sixth info", tooltip: "this is sixth info" }, description: "the sixth description" },
	{ id: 112, title: { label: "seventh title (value: 7)", value: 7 }, info: { label: "seventh info", tooltip: "this is seventh info" }, description: "seventh description" },
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
			label: "SHOWCASE.DEMO.TABLE.LABELS.TITLE",
			cellFormatter: (value: { label: string }): string => "~" + value.label,
			cellTooltip: (title: { value: number }): string => "value is " + (title.value % 2 === 0 ? "even" : "odd"),
			cellTooltipClassName: (title: { value: number }): string => title.value % 2 === 0 ? "tooltip-even" : "tooltip-odd",
			cellTooltipPosition: "right"
		},
		{
			name: "info",
			label: "SHOWCASE.DEMO.TABLE.LABELS.EXTRA_INFO",
			cellFormatter: (value: { label: string }): string => value.label,
			cellTooltip: (info: { tooltip: string }): string => info.tooltip,
			cellTooltipClassName: "tooltip-info"
		},
		{ name: "description", label: "SHOWCASE.DEMO.TABLE.LABELS.DESCRIPTION" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };
}
