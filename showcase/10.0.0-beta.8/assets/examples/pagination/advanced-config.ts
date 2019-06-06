import { Component } from "@angular/core";
import { StarkPaginateEvent, StarkPaginationConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-pagination",
	templateUrl: "./demo-pagination.component.html",
})
export class DemoPaginationComponent {
	public paginationAdvancedConfig: StarkPaginationConfig = {
		totalItems: 20,
		page: 1,
		itemsPerPage: 4,
		itemsPerPageOptions: [2, 4, 6, 8, 10, 20],
		itemsPerPageIsPresent: true,
		pageInputIsPresent: false,
		pageNavIsPresent: true
	};
	public paginateEvent = "";

	public onPaginationChange(paginateEvent: StarkPaginateEvent): void {
		this.paginateEvent = JSON.stringify(paginateEvent);
	}
}
