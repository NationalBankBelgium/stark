import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import {
	AbstractStarkSearchComponent,
	STARK_PROGRESS_INDICATOR_SERVICE,
	StarkPaginationConfig,
	StarkProgressIndicatorService,
	StarkTableColumnProperties
} from "@nationalbankbelgium/stark-ui";
import { HeroMovie, HeroMovieSearchCriteria } from "./entities";
import { DemoGenericService } from "./services";

@Component({
	selector: "demo-generic-search",
	templateUrl: "./demo-generic-search-page.component.html"
})
export class DemoGenericSearchPageComponent extends AbstractStarkSearchComponent<HeroMovie, HeroMovieSearchCriteria>
	implements OnInit, OnDestroy {
	public columnsProperties: StarkTableColumnProperties[];
	public searchResults: HeroMovie[];
	public paginationConfig: StarkPaginationConfig;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) logger: StarkLoggingService,
		demoGenericService: DemoGenericService,
		@Inject(STARK_PROGRESS_INDICATOR_SERVICE) progressService: StarkProgressIndicatorService
	) {
		super(demoGenericService, logger, progressService);

		this.progressIndicatorConfig.topic = "demo-generic-search"; // Set the progress topic to make the progressService working
		this.performSearchOnInit = true; // Turn on automatic search (last search criteria)
		this.preserveLatestResults = true; // Keep a reference to the latest results in the latestResults variable
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		super.ngOnInit();

		this.results$.subscribe((genericObjects: HeroMovie[]) => (this.searchResults = genericObjects));

		this.columnsProperties = [
			{
				name: "hero",
				label: "Hero",
				isFilterable: true,
				isSortable: true
			},
			{
				name: "movie",
				label: "Movie",
				isFilterable: true,
				isSortable: true
			},
			{
				name: "year",
				label: "Year",
				isFilterable: true,
				isSortable: true
			}
		];

		this.paginationConfig = {
			isExtended: false,
			itemsPerPage: 10,
			itemsPerPageOptions: [10, 20, 50],
			itemsPerPageIsPresent: true,
			page: 1,
			pageNavIsPresent: true,
			pageInputIsPresent: true
		};
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}
}
