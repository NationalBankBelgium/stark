import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, description: "number one" },
	/* ... */
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-selection",
	templateUrl: "./table-with-selection.component.html"
})
export class TableWithSelectionComponent implements OnInit {
	public data: object[];

	public columns: StarkTableColumnProperties[];

	public filter: StarkTableFilter;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.data = DUMMY_DATA;

		this.columns = [
			{ name: "id", label: "Id", isFilterable: true, isSortable: true },
			{
				name: "title",
				label: "Title",
				cellFormatter: (value: { label: string }): string => "~" + value.label
			},
			{ name: "description", label: "Description" }
		];

		this.filter = { globalFilterPresent: false, columns: [] };
	}

	public handleRowSelected(data: object[]): void {
		this.logger.debug("SELECTED ROW:", data);
	}
}
