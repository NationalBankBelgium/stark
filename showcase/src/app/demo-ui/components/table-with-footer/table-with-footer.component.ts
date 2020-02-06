import { Component, ViewEncapsulation } from "@angular/core";
import { StarkPaginationConfig, StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, cost: 12, description: "number one" },
	{ id: 10, cost: 23, description: "second description" },
	{ id: 12, cost: 5, description: "the third description" },
	{ id: 2, cost: 33, description: "description number four" },
	{ id: 23, cost: 54, description: "fifth description" },
	{ id: 222, cost: 3, description: "the sixth description" },
	{ id: 112, cost: 7, description: "seventh description" },
	{ id: 232, cost: 24, description: "description number eight" },
	{ id: 154, cost: 35, description: "the ninth description" },
	{ id: 27, cost: 10, description: "description number ten" },
	{ id: 86, cost: 21, description: "eleventh description" },
	{ id: 44, cost: 6, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-footer",
	templateUrl: "./table-with-footer.component.html",
	styleUrls: ["./table-with-footer.component.scss"],
	/* tslint:disable-next-line:use-view-encapsulation */
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
