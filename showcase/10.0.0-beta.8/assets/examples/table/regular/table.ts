import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkPaginationConfig, StarkTableColumnProperties, StarkTableFilter, StarkTableRowActions } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{
		id: 1,
		title: { label: "first title (value: 1)", value: 1 },
		description: "first one",
		extra: "number one has some extra information"
	},
	/*...*/
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-regular",
	templateUrl: "./table-regular.component.html",
	styleUrls: ["./table-regular.component.scss"],
	encapsulation: ViewEncapsulation.None // Important
})
export class TableRegularComponent {
	public data: object[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "title",
			label: "Title",
			cellFormatter: (value: { label: string }): string => "~" + value.label,
			compareFn: (n1: { value: number }, n2: { value: number }): number => n1.value - n2.value
		},
		{ name: "description", label: "Description" },
		{ name: "extra", label: "Extra info", isFilterable: false, isSortable: false, isVisible: false }
	];

	public filter: StarkTableFilter = { globalFilterPresent: true, columns: [] };

	public order: string[] = ["title", "-description", "id"];

	public pagination: StarkPaginationConfig = { totalItems: DUMMY_DATA.length, page: 1, itemsPerPage: 10 };

	public tableRowActions = {
		actions: [
			{
				id: "edit-item",
				label: "Edit",
				icon: "pencil",
				actionCall: ($event: Event, data: object): void => this.logger.debug("EDIT", $event, data),
				isEnabled: true
			},
			{
				id: "delete-item",
				label: "Delete",
				icon: "delete",
				actionCall: ($event: Event, data: object): void => this.logger.debug("DELETE", $event, data),
				isEnabled: false
			}
		]
	};

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	public handleRowClicked(data: object): void {
		this.logger.debug("ROW CLICKED:", data);
	}
}
