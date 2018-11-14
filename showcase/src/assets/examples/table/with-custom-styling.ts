import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { StarkPaginationConfig, StarkTableFilter } from "@nationalbankbelgium/stark-ui";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-table",
	styleUrls: ["./demo-table.component.scss"],
	templateUrl: "./demo-table.component.html",
	encapsulation: ViewEncapsulation.None
})
export class DemoTableComponent implements OnInit {
	public getRowClassName = (_row: any, index: number): Object => (index % 2 === 0 ? "even" : "odd");

	public getTitleCellClassName = (title: { value: number }): string =>
		title.value < 5 ? "danger" : title.value < 9 ? "warning" : "success";

	public dummyData: any[];
	public columns: any[];
	public filter: StarkTableFilter;
	public paginationConfig: StarkPaginationConfig;

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

		this.columns = [
			{
				name: "id",
				label: "id",
				headerClassName: "bold",
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
				cellClassName: this.getTitleCellClassName
			},
			{
				name: "description",
				label: "Description",
				isSortable: true,
				isFilterable: true
			}
		];

		this.filter = {
			globalFilterPresent: true,
			columns: []
		};

		this.paginationConfig = {
			totalItems: this.dummyData.length,
			page: 1,
			itemsPerPage: 20,
			itemsPerPageOptions: [10, 12, 15, 18, 20, 25, 50, 100]
		};
	}
}
