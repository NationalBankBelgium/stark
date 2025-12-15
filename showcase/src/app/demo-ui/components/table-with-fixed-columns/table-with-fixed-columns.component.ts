import { Component } from "@angular/core";
import { StarkPaginationConfig, StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

// tslint:disable:no-duplicate-string
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
	{
		id: 10,
		title: { label: "second title (value: 2)", value: 2 },
		sticky_column: "sticky column",
		description: "second description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info.",
		even_more_info_2: "more info",
		even_more_info_3: "more info",
		even_more_info_4: "more info",
		even_more_info_5: "the stickyEnd column"
	},
	{
		id: 12,
		title: { label: "third title (value: 3)", value: 3 },
		sticky_column: "sticky column",
		description: "the third description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info.",
		even_more_info_2: "more info",
		even_more_info_3: "more info",
		even_more_info_4: "more info",
		even_more_info_5: "the stickyEnd column"
	},
	{
		id: 2,
		title: { label: "fourth title (value: 4)", value: 4 },
		sticky_column: "sticky column",
		description: "description number four",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info.",
		even_more_info_2: "more info",
		even_more_info_3: "more info",
		even_more_info_4: "more info",
		even_more_info_5: "the stickyEnd column"
	},
	{
		id: 23,
		title: { label: "fifth title (value: 5)", value: 5 },
		sticky_column: "sticky column",
		description: "fifth description",
		info: "This is some info.",
		more_info: "This is even more info.",
		even_more_info: "This is a ludicrous amount of info.",
		even_more_info_2: "more info",
		even_more_info_3: "more info",
		even_more_info_4: "more info",
		even_more_info_5: "the stickyEnd column"
	},
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
// tslint:enable:no-duplicate-string

@Component({
	selector: "showcase-table-with-fixed-columns",
	templateUrl: "./table-with-fixed-columns.component.html"
})
export class TableWithFixedColumnsComponent {
	public data: object[] = DUMMY_DATA;
	
	private labelExtraInfo = "SHOWCASE.DEMO.TABLE.LABELS.EXTRA_INFO";
	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "title",
			label: "SHOWCASE.DEMO.TABLE.LABELS.TITLE",
			cellFormatter: (value: { label: string }): string => "~" + value.label
		},
		{
			name: "sticky_column",
			label: this.labelExtraInfo,
			sticky: true
		},
		{
			name: "description",
			label: "SHOWCASE.DEMO.TABLE.LABELS.DESCRIPTION"
		},
		{
			name: "info",
			label: this.labelExtraInfo,
			isFilterable: false,
			isSortable: false
		},
		{
			name: "more_info",
			label: this.labelExtraInfo
		},
		{
			name: "even_more_info",
			label: this.labelExtraInfo
		},
		{
			name: "even_more_info_2",
			label: this.labelExtraInfo
		},
		{
			name: "even_more_info_3",
			label: this.labelExtraInfo
		},
		{
			name: "even_more_info_4",
			label: this.labelExtraInfo
		},
		{
			name: "even_more_info_5",
			label: this.labelExtraInfo,
			stickyEnd: true
		}
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };

	public pagination: StarkPaginationConfig = { totalItems: DUMMY_DATA.length, page: 1, itemsPerPage: 10 };
}
