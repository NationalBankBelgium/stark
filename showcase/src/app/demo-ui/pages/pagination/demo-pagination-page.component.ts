import { Component } from "@angular/core";
import { StarkPaginateEvent, StarkPaginationConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

type PaginationConfigType = "simple" | "extended" | "advanced" | "compact";

@Component({
	selector: "demo-pagination",
	templateUrl: "./demo-pagination-page.component.html"
})
export class DemoPaginationPageComponent {
	public paginationSimpleConfig: StarkPaginationConfig = {
		totalItems: 20,
		page: 1,
		itemsPerPage: 10,
		itemsPerPageOptions: [2, 4, 6, 8, 10, 20]
	};
	public paginateEventSimple = "";

	public paginationExtendedConfig: StarkPaginationConfig = {
		totalItems: 20,
		page: 1,
		itemsPerPage: 2,
		itemsPerPageOptions: [2, 4, 6, 8, 10, 20],
		isExtended: true
	};
	public paginateEventExtended = "";

	public paginationAdvancedConfig: StarkPaginationConfig = {
		totalItems: 20,
		page: 1,
		itemsPerPage: 4,
		itemsPerPageOptions: [2, 4, 6, 8, 10, 20],
		itemsPerPageIsPresent: true,
		pageInputIsPresent: false,
		pageNavIsPresent: true
	};
	public paginateEventAdvanced = "";

	public paginationCompactConfig: StarkPaginationConfig = {
		totalItems: 20,
		page: 1,
		itemsPerPage: 4,
		itemsPerPageOptions: [2, 4, 6, 8, 10, 20]
	};
	public paginateEventCompact = "";

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Pagination component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkPaginationComponent.html"
		}
	];

	public onPaginationChange(paginateEvent: StarkPaginateEvent, config: PaginationConfigType): void {
		switch (config) {
			case "extended":
				this.paginateEventExtended = JSON.stringify(paginateEvent);
				break;
			case "advanced":
				this.paginateEventAdvanced = JSON.stringify(paginateEvent);
				break;
			case "compact":
				this.paginateEventCompact = JSON.stringify(paginateEvent);
				break;
			default:
				this.paginateEventSimple = JSON.stringify(paginateEvent);
				break;
		}
	}
}
