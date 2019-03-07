import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTableColumnProperties, StarkTableFilter, StarkTableRowActions } from "@nationalbankbelgium/stark-ui";

// tslint:disable:no-duplicate-string
const DUMMY_DATA: object[] = [
	{
		id: 1,
		title: { label: "first title (value: 1)", value: 1 },
		description: "number one",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 10,
		title: { label: "second title (value: 2)", value: 2 },
		description: "second description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 12,
		title: { label: "third title (value: 3)", value: 3 },
		description: "the third description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 2,
		title: { label: "fourth title (value: 4)", value: 4 },
		description: "description number four",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 23,
		title: { label: "fifth title (value: 5)", value: 5 },
		description: "fifth description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 222,
		title: { label: "sixth title (value: 6)", value: 6 },
		description: "the sixth description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 112,
		title: { label: "seventh title (value: 7)", value: 7 },
		description: "seventh description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 232,
		title: { label: "eighth title (value: 8)", value: 8 },
		description: "description number eight",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 154,
		title: { label: "ninth title (value: 9)", value: 9 },
		description: "the ninth description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 27,
		title: { label: "tenth title (value: 10)", value: 10 },
		description: "description number ten",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 86,
		title: { label: "eleventh title (value: 11)", value: 11 },
		description: "eleventh description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	},
	{
		id: 44,
		title: { label: "twelfth title (value: 12)", value: 12 },
		description: "the twelfth description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info."
	}
];
// tslint:enable:no-duplicate-string

@Component({
	selector: "showcase-table-with-fixed-actions",
	templateUrl: "./table-with-fixed-actions.component.html",
	styleUrls: ["./table-with-fixed-actions.component.scss"]
})
export class TableWithFixedActionsComponent implements OnInit {
	public data: object[];

	public columns: StarkTableColumnProperties[];

	public filter: StarkTableFilter;

	public tableRowActions: StarkTableRowActions;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.data = DUMMY_DATA;

		this.columns = [
			{ name: "id", label: "Id" },
			{
				name: "title",
				label: "SHOWCASE.DEMO.TABLE.LABELS.TITLE",
				cellFormatter: (value: { label: string }): string => "~" + value.label
			},
			{ name: "description", label: "SHOWCASE.DEMO.TABLE.LABELS.DESCRIPTION" },
			// tslint:disable:no-duplicate-string
			{ name: "info", label: "SHOWCASE.DEMO.TABLE.LABELS.EXTRA_INFO" },
			{ name: "more_info", label: "SHOWCASE.DEMO.TABLE.LABELS.EXTRA_INFO" },
			{ name: "even_more_info", label: "SHOWCASE.DEMO.TABLE.LABELS.EXTRA_INFO" }
			// tslint:enable:no-duplicate-string
		];

		this.filter = { globalFilterPresent: false, columns: [] };

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
					isEnabled: true
				}
			],
			isFixed: true
		};
	}
}
