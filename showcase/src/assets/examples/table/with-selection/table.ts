import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";
import { SelectionChange, SelectionModel } from "@angular/cdk/collections";

const DUMMY_DATA: object[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, description: "number one" },
	/* ... */
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-selection",
	templateUrl: "./table-with-selection.component.html"
})
export class TableWithSelectionComponent {
	public data: object[] = DUMMY_DATA;
	public selection = new SelectionModel<object>(true);

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id", isFilterable: true, isSortable: true },
		{
			name: "title",
			label: "Title",
			cellFormatter: (value: { label: string }): string => "~" + value.label
		},
		{ name: "description", label: "Description" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		this.selection.changed.subscribe((change: SelectionChange<object>) => {
			this.logger.debug("SELECTED ROW:", change.source.selected);
		});
	}
}
