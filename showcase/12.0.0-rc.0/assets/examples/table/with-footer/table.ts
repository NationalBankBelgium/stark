import { Component, ViewEncapsulation } from "@angular/core";
import { StarkPaginationConfig, StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, cost: 12, description: "number one" },
	/* ... */
	{ id: 44, cost: 6, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-footer",
	templateUrl: "./table-with-footer.component.html",
	styleUrls: ["./table-with-footer.component.scss"],
	encapsulation: ViewEncapsulation.None // Important
})
export class TableWithFooterComponent {
	public data: object[] = DUMMY_DATA;
	public paginationConfig: StarkPaginationConfig = {
		itemsPerPage: 10
	};

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id", footerValue: "SHOWCASE.DEMO.TABLE.FOOTER.TOTAL" },
		{
			name: "cost",
			label: "SHOWCASE.DEMO.TABLE.LABELS.TITLE",
			footerValue: this.getTotal()
		},
		{ name: "description", label: "SHOWCASE.DEMO.TABLE.LABELS.DESCRIPTION" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };

	/** Gets the total cost of all products. */
	private getTotal(): number {
		return DUMMY_DATA.map((obj: any) => obj.cost).reduce((acc: number, value: number) => acc + value, 0);
	}
}
