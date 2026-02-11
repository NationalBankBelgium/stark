import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkAction, StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, description: "number one" },
	/* ... */
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-custom-actions",
	templateUrl: "./table-with-custom-actions.component.html"
})
export class TableWithCustomActionsComponent {
	public data: object[] = DUMMY_DATA;

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

	public tableActions: StarkAction[] = [
		{
			id: "edit-item",
			label: "Edit",
			icon: "pencil",
			actionCall: ($event: Event, data: object): void => this.logger.debug("EDIT:", $event, data),
			isEnabled: false
		},
		{
			id: "reload",
			label: "Reload page",
			icon: "autorenew",
			actionCall: ($event: Event, data: object): void => this.logger.debug("RELOAD:", $event, data),
			isEnabled: true
		}
	];

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}
}
