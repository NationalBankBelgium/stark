import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../../shared";
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
export class DemoGenericSearchPageComponent
	extends AbstractStarkSearchComponent<HeroMovie, HeroMovieSearchCriteria>
	implements OnInit, OnDestroy {
	public hideSearch = false;

	public columnsProperties: StarkTableColumnProperties[] = [
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
	public searchResults?: HeroMovie[];
	public paginationConfig: StarkPaginationConfig = {
		isExtended: false,
		itemsPerPage: 10,
		itemsPerPageOptions: [10, 20, 50],
		itemsPerPageIsPresent: true,
		page: 1,
		pageNavIsPresent: true,
		pageInputIsPresent: true
	};

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Generic Search component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkGenericSearchComponent.html"
		},
		{
			label: "SHOWCASE.DEMO.GENERIC_SEARCH.EXPLANATION_ABOUT_DOC_ON_GITHUB",
			url: "https://github.com/NationalBankBelgium/stark/blob/master/docs/GENERIC_SEARCH.md"
		}
	];

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) logger: StarkLoggingService,
		@Inject(STARK_PROGRESS_INDICATOR_SERVICE) progressIndicatorService: StarkProgressIndicatorService,
		demoGenericService: DemoGenericService
	) {
		super(demoGenericService, logger, progressIndicatorService);

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
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}
}
