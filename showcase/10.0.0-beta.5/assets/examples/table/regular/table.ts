import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
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
export class TableRegularComponent implements OnInit {
	public data: object[];

	public columns: StarkTableColumnProperties[];

	public filter: StarkTableFilter;

	public order: string[];

	public pagination: StarkPaginationConfig;

	public tableRowActions: StarkTableRowActions;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.data = DUMMY_DATA;

		this.columns = [
			{ name: "id", label: "Id" },
			{
				name: "title",
				label: "Title",
				cellFormatter: (value: { label: string }): string => "~" + value.label,
				compareFn: (n1: { value: number }, n2: { value: number }) => n1.value - n2.value
			},
			{ name: "description", label: "Description" },
			{ name: "extra", label: "Extra info", isFilterable: false, isSortable: false, isVisible: false }
		];

		this.order = ["title", "-description", "id"];

		this.filter = { globalFilterPresent: true, columns: [] };

		this.pagination = { totalItems: DUMMY_DATA.length, page: 1, itemsPerPage: 10 };

		this.tableRowActions = {
			actions: [
				{
					id: "edit-item",
					label: "STARK.ICONS.EDIT_ITEM",
					icon: "pencil",
					actionCall: ($event: Event, data: object) => this.logger.debug("EDIT", $event, data),
					isEnabled: true
				},
				{
					id: "delete-item",
					label: "STARK.ICONS.DELETE_ITEM",
					icon: "delete",
					actionCall: ($event: Event, data: object) => this.logger.debug("DELETE", $event, data),
					isEnabled: false
				}
			]
		};
	}

	public handleRowClicked(data: object): void {
		this.logger.debug("ROW CLICKED:", data);
	}
}
