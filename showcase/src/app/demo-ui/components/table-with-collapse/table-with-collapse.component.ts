import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTableColumnProperties, StarkTableFilter } from "@nationalbankbelgium/stark-ui";

const DUMMY_DATA: object[] = [
	{ id: 1, cost: 12, description: "number one", expendedInformation: "<span>More infos about the current row</span>" },
	{ id: 10, cost: 23, description: "second description" },
	{ id: 12, cost: 5, description: "the third description" },
	{ id: 2, cost: 33, description: "description number four" },
	{ id: 23, cost: 54, description: "fifth description" },
	{ id: 222, cost: 3, description: "the sixth description" },
	{ id: 112, cost: 7, description: "seventh description" },
	{ id: 232, cost: 24, description: "description number eight" },
	{ id: 154, cost: 35, description: "the ninth description" },
	{ id: 27, cost: 10, description: "description number ten" },
	{ id: 86, cost: 21, description: "eleventh description", whatever: "<span>whatever</span>" },
	{ id: 44, cost: 6, description: "the twelfth description", whatever: "<span>whatever</span>" }
];

@Component({
	selector: "showcase-table-with-collapse",
	templateUrl: "./table-with-collapse.component.html",
	styleUrls: ["./table-with-collapse.component.scss"],
	animations: [
		trigger("detailExpand", [
			state("collapsed", style({ height: "0px", minHeight: "0" })),
			state("expanded", style({ height: "*" })),
			transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
		])
	],
	/* tslint:disable-next-line:use-component-view-encapsulation */
	encapsulation: ViewEncapsulation.None // Important
})
export class TableWithCollapseComponent {
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
		this.logger.debug("implicitCtx:", implicitCtx, "\ndata:", data, "\ncellValue:", cellValue, "\ndisplayedValue:", displayedValue);
	}
	public logData(implicitCtx: any, data: any, cellValue: any, displayedValue: any): void {
		this.logger.debug("implicitCtx:", implicitCtx, "\ndata:", data, "\ncellValue:", cellValue, "\ndisplayedValue:", displayedValue);
	}
}
