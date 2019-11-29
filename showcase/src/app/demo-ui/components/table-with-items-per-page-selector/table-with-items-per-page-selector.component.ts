import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkPaginationConfig, StarkTableColumnProperties, StarkTableFilter, StarkTableRowActions } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{
		id: 1,
		title: { label: "first title (value: 1)", value: 1 },
		description: "first one"
	},
	{ id: 10, title: { label: "second title (value: 2)", value: 2 }, description: "second description" },
	{ id: 12, title: { label: "third title (value: 3)", value: 3 }, description: "the third description" },
	{ id: 2, title: { label: "fourth title (value: 4)", value: 4 }, description: "description number four" },
	{
		id: 23,
		title: { label: "fifth title (value: 5)", value: 5 },
		description: "fifth description"
	},
	{ id: 222, title: { label: "sixth title (value: 6)", value: 6 }, description: "the sixth description" },
	{
		id: 112,
		title: { label: "seventh title (value: 7)", value: 7 },
		description: "seventh description"
	},
	{ id: 232, title: { label: "eighth title (value: 8)", value: 8 }, description: "description number eight" },
	{ id: 154, title: { label: "ninth title (value: 9)", value: 9 }, description: "the ninth description" },
	{ id: 27, title: { label: "tenth title (value: 10)", value: 10 }, description: "description number ten" },
	{ id: 86, title: { label: "eleventh title (value: 11)", value: 11 }, description: "eleventh description" },
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-items-per-page-selector",
	templateUrl: "./table-with-items-per-page-selector.component.html"
})
export class TableWithItemsPerPageSelectorComponent {
	public data: object[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "title",
			label: "SHOWCASE.DEMO.TABLE.LABELS.TITLE",
			cellFormatter: (value: { label: string }): string => "~" + value.label,
			compareFn: (n1: { value: number }, n2: { value: number }): number => n1.value - n2.value
		},
		{ name: "description", label: "SHOWCASE.DEMO.TABLE.LABELS.DESCRIPTION" }
	];

	public filter: StarkTableFilter = {
		globalFilterPresent: true,
		columns: [{ columnName: "id", filterPosition: "below" }, { columnName: "title", filterPosition: "above" }],
		filterPosition: "below"
	};

	public order: string[] = ["title", "-description", "id"];

	public pagination: StarkPaginationConfig = { totalItems: DUMMY_DATA.length, page: 1, itemsPerPage: 10, itemsPerPageIsPresent: true };

	public tableRowActions: StarkTableRowActions = {
		actions: [
			{
				id: "edit-item",
				label: "STARK.ICONS.EDIT_ITEM",
				icon: "pencil",
				actionCall: ($event: Event, data: object): void => this.logger.debug("EDIT", $event, data),
				isEnabled: true
			},
			{
				id: "delete-item",
				label: "STARK.ICONS.DELETE_ITEM",
				icon: "delete",
				actionCall: ($event: Event, data: object): void => this.logger.debug("DELETE", $event, data),
				isEnabled: false
			}
		]
	};

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}
}
