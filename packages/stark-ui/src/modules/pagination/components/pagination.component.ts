import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {
	MatLegacyPaginator as MatPaginator,
	MatLegacyPaginatorIntl as MatPaginatorIntl,
	LegacyPageEvent as PageEvent
} from "@angular/material/legacy-paginator";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkPaginationConfig } from "./pagination-config.intf";
import { StarkPaginateEvent } from "./paginate-event.intf";
import isEqual from "lodash-es/isEqual";

/**
 * @ignore
 */
const componentName = "stark-pagination";

/**
 * The available modes for the {@link StarkPaginationComponent}
 */
export type StarkPaginationComponentMode = "compact";

// FIXME: refactor the template of this component function to reduce its cyclomatic complexity
/* eslint-disable @angular-eslint/template/cyclomatic-complexity */
/**
 * Component to display pagination bar to be used with a collection of items.
 *
 * It extends the {@link https://v7.material.angular.io/components/paginator/api#MatPaginator|Angular Material's MatPaginator class}
 * so it can be integrated as well with the {@link https://v7.material.angular.io/components/table/examples|Angular Material's MatTable}.
 */
@Component({
	selector: "stark-pagination",
	templateUrl: "./pagination.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarkPaginationComponent extends MatPaginator implements OnInit, OnChanges, AfterViewInit {
	/**
	 * Adds class="stark-pagination" attribute on the host component
	 */
	@HostBinding("class")
	public class: string = componentName;

	/**
	 * Suffix id given to "items per page" dropdown (`items-per-page-<htmlSuffixId>`)
	 * and "page selector" dropdown (`page-selector-<htmlSuffixId>`)
	 *
	 * Default: `"pagination"`
	 */
	@Input()
	public htmlSuffixId?: string;

	/**
	 * Desired layout or flavour:
	 * - `compact`: Displayed in a compact mode.
	 * - `default`: basic implementation with multiple buttons to change pages
	 */
	@Input()
	public mode?: StarkPaginationComponentMode;

	/**
	 * Object containing main information for the pagination.
	 */
	@Input()
	public paginationConfig!: StarkPaginationConfig;

	/**
	 * Output event emitter that will emit the paginate event when the pagination changed.
	 */
	@Output()
	public readonly paginated = new EventEmitter<StarkPaginateEvent>();

	/**
	 * Page number entered manually by the user via the "enter page" input field
	 */
	public get paginationInput(): number {
		return this._paginationInput;
	}

	public set paginationInput(newValue: number) {
		// store the previous pagination input value in case the new one is not valid
		// so it can be reverted to the previous value when that happens
		if (this._paginationInput && (newValue > this.getTotalPages() || newValue === 0)) {
			this.previousPaginationInput = this._paginationInput;
		}
		this._paginationInput = newValue;
	}

	/**
	 * @ignore
	 */
	private _paginationInput = 0;

	/**
	 * Previous page number entered by the user
	 */
	public previousPaginationInput = 0;

	/**
	 * Index corresponding to the previous page
	 */
	public previousPageIndex = 0;

	/**
	 * Page numbers to be displayed by the component when `extended` mode is enabled
	 */
	public pageNumbers: ("..." | number)[] = [];

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param element - Reference to the DOM element where this component is attached to.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param cdRef - Reference to the change detector attached to this component.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		public element: ElementRef,
		public renderer: Renderer2,
		public cdRef: ChangeDetectorRef
	) {
		// we don't use the MatPaginatorIntl service to translate the labels but it is needed for the MatPaginator base class
		// see https://v7.material.angular.io/components/paginator/api#services
		super(new MatPaginatorIntl(), cdRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.paginationConfig = this.normalizePaginationConfig(this.paginationConfig);
		this.setMatPaginatorProperties(this.paginationConfig);

		this.htmlSuffixId = this.htmlSuffixId || "pagination";

		this.setPageNumbers();

		this.logger.debug(componentName + ": controller initialized");
	}

	/**
	 * Component lifecycle hook
	 */
	public ngAfterViewInit(): void {
		if (this.paginationConfig.isExtended) {
			this.renderer.addClass(this.element.nativeElement, "extended-pagination");
		}
	}

	/**
	 * Component lifecycle hook
	 * @param changesObj - Contains the changed properties
	 */
	public ngOnChanges(changesObj: SimpleChanges): void {
		if (changesObj["paginationConfig"]) {
			// Set local variable to prevent shadow changes
			const paginationConfigOriginalChange: StarkPaginationConfig = { ...this.paginationConfig };
			this.paginationConfig = this.normalizePaginationConfig(this.paginationConfig);
			this.logger.debug(componentName + ": paginationConfig changed...", this.paginationConfig);

			// If normalization has changed the page or itemsPerPage, that means the paginationConfig is not the same in the pagination controller
			// and in the parent controller. So pagination hast to trigger onPaginate callback to pass the new values.
			if (
				typeof paginationConfigOriginalChange === "undefined" ||
				paginationConfigOriginalChange.page !== this.paginationConfig.page ||
				paginationConfigOriginalChange.itemsPerPage !== this.paginationConfig.itemsPerPage
			) {
				this.onChangePagination();
			} else if (
				!isEqual(paginationConfigOriginalChange, changesObj["paginationConfig"].previousValue) ||
				paginationConfigOriginalChange.totalItems !== this.paginationConfig.totalItems ||
				paginationConfigOriginalChange.itemsPerPageOptions !== this.paginationConfig.itemsPerPageOptions
			) {
				this.setPageNumbers();
			}
			this.paginationInput = <number>this.paginationConfig.page;
		}
	}

	/**
	 * Creates a normalized paginationConfig to be used by this component.
	 * If the given config is undefined it will set totalItems only, otherwise it sets default values for the missing properties
	 * @param config - `StarkPaginationConfig` object
	 */
	public normalizePaginationConfig(config: StarkPaginationConfig): StarkPaginationConfig {
		if (!config) {
			// initialize paginationConfig to prevent errors in other functions depending on this config
			this.logger.warn(componentName + ": No configuration defined in pagination component. TotalItems set to 0 by default");
			return { totalItems: 0 };
		}

		let defaultItemsPerPageIsPresent: StarkPaginationConfig["itemsPerPageIsPresent"];

		if (typeof config.itemsPerPageIsPresent === "undefined") {
			defaultItemsPerPageIsPresent = this.mode !== "compact"; // `true` on "default" mode, `false` on "compact" mode
		}

		return {
			itemsPerPageOptions: config.itemsPerPageOptions || [5, 10, 15],
			itemsPerPage: config.itemsPerPage || (config.itemsPerPageOptions ? config.itemsPerPageOptions[0] : 5),
			page: config.page || 1,
			isExtended: config.isExtended !== undefined ? config.isExtended : false,
			itemsPerPageIsPresent: config.itemsPerPageIsPresent !== undefined ? config.itemsPerPageIsPresent : defaultItemsPerPageIsPresent,
			pageNavIsPresent: config.pageNavIsPresent !== undefined ? config.pageNavIsPresent : true,
			pageInputIsPresent: config.pageInputIsPresent !== undefined ? config.pageInputIsPresent : true,
			totalItems: config.totalItems !== undefined ? config.totalItems : 0
		};
	}

	/**
	 * Set the properties needed for the {@link https://v7.material.angular.io/components/paginator/api#MatPaginator|MatPaginator} base class
	 * based on the given pagination configuration.
	 *
	 * @param config - The config object which be used to set the `MatPaginator` properties
	 */
	public setMatPaginatorProperties(config: StarkPaginationConfig): void {
		// The set of provided page size options to display to the user.
		this.pageSizeOptions = <number[]>config.itemsPerPageOptions;
		// Number of items to display on a page. By default set to 50.
		this.pageSize = <number>config.itemsPerPage;
		// The zero-based page index of the displayed list of items. Defaulted to 0.
		this.pageIndex = <number>config.page - 1; // zero-based
		// The length of the total number of items that are being paginated. Defaulted to 0.
		this.length = <number>config.totalItems;
	}

	/**
	 * Check whether the given value is equal to zero (as number `0` or as string `"0"`).
	 * @param numberToCheck - Number to check
	 */
	public isZero(numberToCheck: string | number): boolean {
		return numberToCheck === 0 || numberToCheck === "0";
	}

	/**
	 * Check whether there is a page after the current one.
	 */
	public hasNext(): boolean {
		return this.paginationConfig && <number>this.paginationConfig.page < this.getTotalPages();
	}

	/**
	 * Check whether there is a page before the current one.
	 */
	public hasPrevious(): boolean {
		return this.paginationConfig && <number>this.paginationConfig.page > 1;
	}

	/**
	 * Change page to first one.
	 */
	public goToFirst(): void {
		if (this.hasPrevious()) {
			this.goToPage(1);
		}
	}

	/**
	 * Change page to previous one.
	 */
	public goToPrevious(): void {
		if (this.hasPrevious()) {
			this.goToPage(<number>this.paginationConfig.page - 1);
		}
	}

	/**
	 * Change page to next one.
	 */
	public goToNext(): void {
		if (this.hasNext()) {
			this.goToPage(<number>this.paginationConfig.page + 1);
		}
	}

	/**
	 * Change page to last one.
	 */
	public goToLast(): void {
		if (this.hasNext()) {
			this.goToPage(this.getTotalPages());
		}
	}

	/**
	 * Emit the stark paginate event and the MatPagination event.
	 * Then reload pageNumbers variable.
	 */
	public onChangePagination(): void {
		if (
			this.paginationConfig &&
			// Check the types of page & itemsPerPage to be sure they are not undefined
			typeof this.paginationConfig.page === "number" &&
			typeof this.paginationConfig.itemsPerPage === "number"
		) {
			this.paginated.emit({
				page: this.paginationConfig.page,
				itemsPerPage: this.paginationConfig.itemsPerPage
			});

			this.setMatPaginatorProperties(this.paginationConfig);
			this.emitMatPaginationEvent();
		}
		this.setPageNumbers();
		this.paginationInput = <number>this.paginationConfig.page;
	}

	/**
	 * Get total number of pages available based on `itemsPerPage` and `totalItems`.
	 */
	public getTotalPages(): number {
		let calculatedTotalPages = 0;
		if (this.paginationConfig) {
			const itemsPerPage: number = this.isZero(<number>this.paginationConfig.itemsPerPage)
				? 1
				: <number>this.paginationConfig.itemsPerPage;
			calculatedTotalPages = Math.ceil(<number>this.paginationConfig.totalItems / itemsPerPage);
		}

		if (calculatedTotalPages === 0) {
			return 1;
		}
		return calculatedTotalPages;
	}

	/**
	 * Set page to first then call `onChangePagination` function.
	 * @param itemsPerPage - Items per page to change to
	 */
	public onChangeItemsPerPage(itemsPerPage: number): void {
		if (this.paginationConfig.itemsPerPage !== itemsPerPage) {
			this.paginationConfig.page = 1;
			this.paginationConfig.itemsPerPage = itemsPerPage;
			this.onChangePagination();
		}
	}

	/**
	 * Set pageNumbers variable.
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	public setPageNumbers(): void {
		let min: number;
		let max: number;
		let i: number;
		let j: number;

		const input: ("..." | number)[] = [];

		if (this.isCompactMode()) {
			min = <number>this.paginationConfig.page > 1 ? <number>this.paginationConfig.page - 1 : 1;
			max = min + 2;

			for (j = 0, i = min; i <= max && i <= this.getTotalPages(); i++, j++) {
				input[j] = i;
			}
		} else {
			// default mode: stark
			min = 1;
			max = this.getTotalPages();

			if (max < 6) {
				for (j = 0, i = min; i <= max; i++, j++) {
					input[j] = i;
				}
			} else {
				input[0] = min;
				input[4] = max;

				switch (this.paginationConfig.page) {
					case min + 2:
					case min + 1: {
						input[2] = min + 2;

						break;
					}
					case max - 2:
					case max - 1: {
						input[2] = max - 2;

						break;
					}
					case max:
					case min: {
						input[2] = Math.ceil(max / 2);

						break;
					}
					default: {
						input[2] = <number>this.paginationConfig.page;
					}
				}

				if (input[2] - 1 === min + 1) {
					input[1] = min + 1;
				} else {
					input[1] = "...";
				}

				if (input[2] + 1 === max - 1) {
					input[3] = max - 1;
				} else {
					input[3] = "...";
				}
			}
		}

		this.pageNumbers = input;
	}

	/**
	 * Change to the given page if it is different than `"..."`. It calls `onChangePagination` afterwards.
	 * @param page - Page to go to
	 */
	public goToPage(page: number | "..."): void {
		if (page !== "...") {
			this.previousPageIndex = <number>this.paginationConfig.page;
			this.paginationConfig.page = page;
			this.onChangePagination();
		}
	}

	/**
	 * Change the page when the Enter key is pressed in the page number input
	 */
	public changePageOnEnter(): void {
		const newPage: number = typeof this.paginationInput === "string" ? parseInt(this.paginationInput, 10) : this.paginationInput;
		if (newPage <= this.getTotalPages() && newPage > 0) {
			this.goToPage(newPage);
		} else {
			this.logger.warn(componentName + ": the page ", newPage, " does not exist");
			this.paginationInput = this.previousPaginationInput; // revert the pagination input value
		}
	}

	/**
	 * Return the number of digits of the current total number of pages.
	 */
	public getPageInputMaxDigits(): number {
		return this.getTotalPages().toString().length;
	}

	/**
	 * Whether the component is to be rendered in the `compact` mode
	 */
	public isCompactMode(): boolean {
		return typeof this.mode !== "undefined" && this.mode === "compact";
	}

	/**
	 * Emit the `PageEvent` according to the MatPaginator API.
	 * See {@link https://v7.material.angular.io/components/paginator/api#PageEvent|MatPaginator PageEvent}
	 */
	public emitMatPaginationEvent(): void {
		const pageEvent: PageEvent = {
			pageIndex: this.pageIndex,
			pageSize: this.pageSize,
			length: this.length,
			previousPageIndex: this.previousPageIndex
		};
		this.page.emit(pageEvent);
	}

	/**
	 * Check whether the itemsPerPage should be present according to paginationConfig.
	 * @param paginationConfig - Object containing main information for the pagination
	 */
	public isItemsPerPagePresent(
		paginationConfig: StarkPaginationConfig
	): paginationConfig is StarkPaginationConfig & Required<Pick<StarkPaginationConfig, "itemsPerPageOptions" | "itemsPerPage">> {
		return !!paginationConfig.itemsPerPageIsPresent && !!paginationConfig.itemsPerPage && !!paginationConfig.itemsPerPageOptions;
	}

	/**
	 * @ignore
	 */
	public trackPageNumberFn(_index: number): number {
		return _index;
	}
}
