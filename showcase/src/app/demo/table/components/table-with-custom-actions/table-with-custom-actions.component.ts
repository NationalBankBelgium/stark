import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkAction, StarkPaginationConfig, StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: any[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, description: "number one" },
	{ id: 10, title: { label: "second title (value: 2)", value: 2 }, description: "second description" },
	{ id: 12, title: { label: "third title (value: 3)", value: 3 }, description: "the third description" },
	{ id: 2, title: { label: "fourth title (value: 4)", value: 4 }, description: "description number four" },
	{ id: 23, title: { label: "fifth title (value: 5)", value: 5 }, description: "fifth description" },
	{ id: 222, title: { label: "sixth title (value: 6)", value: 6 }, description: "the sixth description" },
	{ id: 112, title: { label: "seventh title (value: 7)", value: 7 }, description: "seventh description" },
	{ id: 232, title: { label: "eighth title (value: 8)", value: 8 }, description: "description number eight" },
	{ id: 154, title: { label: "ninth title (value: 9)", value: 9 }, description: "the ninth description" },
	{ id: 27, title: { label: "tenth title (value: 10)", value: 10 }, description: "description number ten" },
	{ id: 86, title: { label: "eleventh title (value: 11)", value: 11 }, description: "eleventh description" },
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-custom-actions",
	templateUrl: "./table-with-custom-actions.component.html"
})
export class TableWithCustomActionsComponent implements OnInit {
	public data: any[];

	public columns: StarkTableColumnProperties[];

	public filter: StarkTableFilter;

	public pagination: StarkPaginationConfig;

	public tableActions: StarkAction[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.data = DUMMY_DATA;

		this.columns = [
			{ name: "id", label: "Id" },
			{ name: "title", label: "Title", cellFormatter: (value: any): string => "~" + value.label },
			{ name: "description", label: "Description" }
		];

		this.filter = { globalFilterPresent: false, columns: [] };

		this.pagination = { totalItems: DUMMY_DATA.length, page: 1, itemsPerPage: 10 };

		this.tableActions = [
			{ id: "edit-item", label: "STARK.ICONS.EDIT_ITEM", icon: "pencil", actionCall: this.logger.debug, isEnabled: false },
			{ id: "reload", label: "STARK.ICONS.RELOAD_PAGE", icon: "autorenew", actionCall: this.logger.debug, isEnabled: true }
		];
	}
}
