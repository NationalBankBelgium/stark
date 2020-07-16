import { Component, ViewEncapsulation, Inject, ViewChild } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTableColumnProperties, StarkTableFilter, StarkTableComponent } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, cost: 12, description: "number one" },
	{ id: 10, cost: 23, description: "second description" },
	{ id: 12, cost: 5, description: "the third description" }
];

@Component({
	selector: "showcase-table-with-collapsible-rows",
	templateUrl: "./table-with-collapsible-rows.component.html",
	styleUrls: ["./table-with-collapsible-rows.component.scss"]
})
export class TableWithCollapsibleRowsComponent {
	@ViewChild(StarkTableComponent)
	public tableComponent!: StarkTableComponent;

	public data: object[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id" },
		{
			name: "cost",
			label: "SHOWCASE.DEMO.TABLE.LABELS.TITLE"
		},
		{ name: "description", label: "SHOWCASE.DEMO.TABLE.LABELS.DESCRIPTION" }
	];

	public filter: StarkTableFilter = { globalFilterPresent: false, columns: [] };

	/** Gets the total cost of all products. */

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	public handleRowClicked(implicitCtx: any, data: any, cellValue: any, displayedValue: any): void {
		this.tableComponent.expandRow(implicitCtx);
	}

	public logData(implicitCtx: any, data: any, cellValue: any, displayedValue: any): void {
		this.logger.debug("implicitCtx:", implicitCtx, "\ndata:", data, "\ncellValue:", cellValue, "\ndisplayedValue:", displayedValue);
	}
}
