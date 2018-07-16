import { Component, Inject, OnInit } from "@angular/core";
import { StarkActionBarConfig, StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "showcase-demo-table",
	templateUrl: "./table.component.html"
})
export class TableComponent implements OnInit {
	public getTitle = (data: any): string => {
		return "~" + data.title.label;
	};

	public compareTitle = (n1: any, n2: any) => {
		if (n1.value < n2.value) {
			return -1;
		}
		if (n1.value > n2.value) {
			return 1;
		}
		return 0;
	};

	public dummyData: any[];
	public columnsProperties: StarkTableColumnProperties[];
	public tableRowsActionBarConfig: StarkActionBarConfig;
	public columns: any[];
	public orderProperties: string[];
	public filter: StarkTableFilter;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.dummyData = [
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

		this.columnsProperties = [
			{
				name: "id",
				label: "id",
				isSortable: true,
				isFilterable: true
			},
			{
				name: "title",
				label: "Title",
				cellFormatter: (value: any): string => {
					return "~" + value.label;
				},
				isSortable: true,
				isFilterable: true,
				compareFn: this.compareTitle
			},
			{
				name: "description",
				label: "Description",
				isSortable: true,
				isFilterable: true
			}
		];

		this.columns = [
			{
				name: "id",
				sortable: true
			},
			{
				name: "title",
				sortable: true,
				dataAccessor: (data: any): string => {
					return "~" + data.title.label;
				},
				compareFn: this.compareTitle
			},
			{
				name: "description",
				sortable: true
			}
		];

		this.orderProperties = ["title", "-description", "id"];

		this.filter = {
			globalFilterPresent: true,
			columns: []
		};

		this.tableRowsActionBarConfig = {
			actions: [
				{
					id: "edit-item",
					label: "Edit",
					icon: "pencil",
					actionCall: (event: Event, data: any): void => {
						this.logger.debug(event);
						this.logger.debug(data);
					},
					isEnabled: true
				},
				{
					id: "delete-item",
					label: "Delete",
					icon: "delete",
					actionCall: (event: Event, data: any): void => {
						this.logger.debug(event);
						this.logger.debug(data);
					},
					isEnabled: false
				}
			]
		};
	}
}
