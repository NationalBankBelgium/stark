import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTableColumnProperties, StarkTableFilter, StarkTableRowActions } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{
		id: 1,
		title: { label: "first title (value: 1)", value: 1 },
		description: "number one",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	/*...*/
	{
		id: 44,
		title: { label: "twelfth title (value: 12)", value: 12 },
		description: "the twelfth description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	}
];

@Component({
	selector: "showcase-table-with-fixed-actions",
	templateUrl: "./table-with-fixed-actions.component.html",
	styleUrls: ["./table-with-fixed-actions.component.scss"]
})
export class TableWithFixedActionsComponent {
	public data: object[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "title",
			label: "Title",
			cellFormatter: (value: { label: string }): string => "~" + value.label
		},
		{ name: "description", label: "Description" },
		{ name: "info", label: "Extra info" },
		{ name: "more_info", label: "Extra info" },
		{ name: "even_more_info", label: "Extra info" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };

	public tableRowActions: StarkTableRowActions = {
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
				isEnabled: true
			}
		],
		isFixed: true
	};

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}
}
