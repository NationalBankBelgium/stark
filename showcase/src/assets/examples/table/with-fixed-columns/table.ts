import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkPaginationConfig, StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{
		id: 1,
		title: { label: "first title (value: 1)", value: 1 },
		sticky_column: "sticky column",
		description: "number one",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info.",
		even_more_info_2: "more info",
		even_more_info_3: "more info",
		even_more_info_4: "more info",
		even_more_info_5: "the stickyEnd column"
	},
	/*...*/
	{
		id: 222,
		title: { label: "sixth title (value: 6)", value: 6 },
		sticky_column: "sticky column",
		description: "the sixth description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info.",
		even_more_info_2: "more info",
		even_more_info_3: "more info",
		even_more_info_4: "more info",
		even_more_info_5: "the stickyEnd column"
	}
];

@Component({
	selector: "showcase-table-with-fixed-columns",
	templateUrl: "./table-with-fixed-columns.component.html"
})
export class TableWithFixedColumnsComponent {
	public data: object[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "title",
			label: "Title",
			cellFormatter: (value: { label: string }): string => "~" + value.label
		},
		{
			name: "sticky_column",
			label: "Extra info",
			sticky: true
		},
		{
			name: "description",
			label: "Description"
		},
		{
			name: "info",
			label: "Extra info",
			isFilterable: false,
			isSortable: false
		},
		{
			name: "more_info",
			label: "Extra info"
		},
		{
			name: "even_more_info",
			label: "Extra info",
		},
		{
			name: "even_more_info_2",
			label: "Extra info",
		},
		{
			name: "even_more_info_3",
			label: "Extra info"
		},
		{
			name: "even_more_info_4",
			label: "Extra info",
		},
		{
			name: "even_more_info_5",
			label: "Extra info",
			stickyEnd: true
		}
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };

	public pagination: StarkPaginationConfig = { totalItems: DUMMY_DATA.length, page: 1, itemsPerPage: 10 };

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}
}
