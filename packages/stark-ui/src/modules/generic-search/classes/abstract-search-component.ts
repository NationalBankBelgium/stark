import { ReplaySubject, Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AbstractStarkFormComponent } from "../classes/abstract-form-component";
import { StarkGenericSearchService } from "../classes/generic-search.service.intf";
import { StarkSearchState } from "../entities/search-state.entity.intf";
import { StarkErrorImpl, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkFormUtil } from "../../../util/form";
import { StarkProgressIndicatorConfig, StarkProgressIndicatorService, StarkProgressIndicatorType } from "../../progress-indicator";

/**
 * Default progress indicator configuration
 */
const defaultProgressIndicatorConfig: StarkProgressIndicatorConfig = {
	topic: "",
	type: StarkProgressIndicatorType.SPINNER
};

/**
 * Abstract class defining the common properties and methods for the Search Page using the {@link StarkGenericSearchComponent}.
 */
export abstract class AbstractStarkSearchComponent<SearchResultsType, CriteriaType> extends AbstractStarkFormComponent<CriteriaType>
	implements OnInit, OnDestroy {
	/**
	 * @internal
	 * @ignore
	 */
	private _latestResults?: Readonly<SearchResultsType[]>;
	/**
	 * @internal
	 * @ignore
	 */
	private searchStateSubscription!: Subscription;

	/**
	 * Whether a new search should be performed automatically after initialization in case the last search criteria can be fetched
	 * from the application state (@ngrx/store)
	 */
	protected performSearchOnInit: boolean;
	/**
	 * Whether the latest emitted results by the emitResult() method will be kept in the latestResults variable
	 */
	protected preserveLatestResults: boolean;
	/**
	 * The config of the progress indicator to be shown/hidden when performing the search.
	 */
	public progressIndicatorConfig: StarkProgressIndicatorConfig;
	/**
	 * Observable that will emit the search results. This Observable is created as soon as the Search Page controller is constructed
	 * and the first value it emits is an empty array in order to avoid the having undefined values passed down to the subscriber(s).
	 */
	protected results$!: ReplaySubject<SearchResultsType[]>;

	/**
	 * Class constructor
	 * @param genericSearchService - Service implementing the StarkGenericSearchService interface providing all the necessary methods to search items.
	 * @param logger - The logging service of the application
	 * @param progressService - Service that provides an easy way to change the visibility of a progress indicator.
	 */
	protected constructor(
		protected genericSearchService: StarkGenericSearchService<SearchResultsType, CriteriaType>,
		logger: StarkLoggingService,
		protected progressService: StarkProgressIndicatorService
	) {
		super(logger);

		this.progressIndicatorConfig = defaultProgressIndicatorConfig;
		this.performSearchOnInit = true;
		this.preserveLatestResults = false;
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		// it will re-emit the latest value whenever a new observer subscribes to it
		// so an empty array can be emitted as the result$ initial value (to avoid having undefined results)
		this.results$ = new ReplaySubject<SearchResultsType[]>(1);
		// initially an empty array is emitted
		this.emitResult([]);

		// if a search was done previously (saved in the Redux state)
		// then the search is automatically performed on initialization (only if the performSearchOnInit option is TRUE)
		this.searchStateSubscription = this.genericSearchService
			.getSearchState()
			.pipe(
				map((searchState: StarkSearchState<CriteriaType>) => {
					if (searchState.hasBeenSearched && this.performSearchOnInit) {
						this.performSearch(searchState.criteria);
					}
					return searchState.criteria;
				})
			)
			.subscribe((searchCriteria: CriteriaType) => {
				this.setOriginalCopy(searchCriteria);
			});
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		this.searchStateSubscription.unsubscribe();
	}

	/**
	 * Invoke the search passing the formGroup's working copy only if the Search formGroup is valid
	 * @param formGroup - The 'search' formGroup
	 */
	public onSearch(formGroup: FormGroup): void {
		if (StarkFormUtil.isFormGroupValid(formGroup)) {
			this.performSearch(this.workingCopy);
		}
	}

	/**
	 * Invoke the genericSearchService.createNew() method
	 */
	public onNew(): void {
		if (typeof this.genericSearchService.createNew !== "undefined") {
			this.genericSearchService.createNew();
		} else {
			throw new StarkErrorImpl(
				'AbstractStarkSearchComponent: When StarkGenericSearch component has the "new" button defined, ' +
					'the service must have an implementation for "createNew" method.'
			);
		}
	}

	/**
	 * Invoke the genericSearchService.resetSearchState() method and clears the results
	 */
	public onReset(form: FormGroup): void {
		this.genericSearchService.resetSearchState();
		StarkFormUtil.setFormChildControlsState(form, ["untouched", "pristine"]);
		StarkFormUtil.setFormGroupState(form, ["untouched", "pristine"]);
		this.emitResult([]);
	}

	/**
	 * Update the current working copy of the searchCriteria
	 * @param searchCriteria - New value of searchCriteria
	 */
	public updateWorkingCopy(searchCriteria: CriteriaType): void {
		this.workingCopy = searchCriteria;
	}

	/**
	 * Invoke the genericSearchService.search() method and emits the results. If no searchCriteria object is passed, then the current
	 * form's working copy is used.
	 */
	public performSearch(searchCriteria: CriteriaType = this.workingCopy): void {
		this.performSearchOnInit = false; // prevent further automatic searches due to the subscription to StarkSearchState changes in NgOnInit

		this.showProgress(true);

		this.genericSearchService
			.search(searchCriteria)
			.pipe(
				take(1) // this ensures that the observable will be automatically unsubscribed after emitting the value
			)
			.subscribe(
				(result: SearchResultsType[]) => {
					this.emitResult(result);
					this.showProgress(false);
				},
				() => {
					// hide the progress in case of error
					this.showProgress(false);
				}
			);
	}

	/**
	 * The latest search results that have been emitted in the results$ Observable.
	 */
	public get latestResults(): Readonly<SearchResultsType[]> | undefined {
		return this._latestResults;
	}

	/**
	 * Call the progressService show/hide methods in case there is a progressTopic defined
	 * @param show - Whether to show the progress indicator or not
	 */
	protected showProgress(show: boolean): void {
		if (this.progressIndicatorConfig && this.progressIndicatorConfig.topic && this.progressIndicatorConfig.topic !== "") {
			if (show) {
				this.progressService.show(this.progressIndicatorConfig.topic);
			} else {
				this.progressService.hide(this.progressIndicatorConfig.topic);
			}
		}
	}

	/**
	 * Emit the latest results and optionally keeps a reference to them if the preserveLatestResults option is enabled.
	 */
	protected emitResult(result: SearchResultsType[]): void {
		if (this.preserveLatestResults) {
			this._latestResults = result;
		}
		this.results$.next(result);
	}
}
