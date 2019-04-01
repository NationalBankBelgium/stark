import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { Ng2StateDeclaration } from "@uirouter/angular";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	starkAppExitStateName,
	starkAppInitStateName,
	StarkLoggingService,
	StarkRoutingService
} from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { StarkRouteSearchEntry } from "../components/route-search-entry.intf";
import { StarkMenuConfig, StarkMenuGroup } from "../../app-menu/components";
import  sortBy  from "lodash-es/sortBy";

/**
 * Name of the component
 */
const componentName: string = "stark-route-search";

/**
 * Direction in which the Route Search field can be displayed
 */
export type StarkRouteSearchDirection = "left" | "right";

/**
 * Component to search a particular route with autocompletion and to redirect to the route chosen by the user.
 *
 * **`IMPORTANT:`** by default, when no menu config is provided, the Route Search component will display only those routes already registered by the Router at the time the component is initialized.
 * In this case the lazy loaded routes that have not been loaded yet will not be displayed.
 *
 * ### Setting labels for routes
 * The component will construct the routes to display by recursively processing all the routes registered by the Router.
 * In this case, the label for each route will be taken from the route's `data.translationKey` property or from the route name if such property is not found.
 *
 * ### Customizing component labels
 * It is possible to override the following translations used in the different labels of this component:
 *
 * - **STARK.ROUTE_SEARCH.ABOUT:** label shown in the tooltip of the search button
 * - **STARK.ROUTE_SEARCH.PLACEHOLDER:** label shown in the placeholder of the search field
 */
@Component({
	selector: "stark-route-search",
	templateUrl: "./route-search.component.html",
	encapsulation: ViewEncapsulation.None,
	host: {
		class: componentName
	}
})
export class StarkRouteSearchComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * The {@link StarkMenuConfig} where the routes should be taken from.
	 * Normally the same {@link StarkMenuConfig} is used for the {@link StarkAppMenuComponent}.
	 *
	 * **`IMPORTANT:`** when this is provided, the component will display all the routes from the config including the lazy loaded routes (if any).
	 */
	@Input()
	public menuConfig?: StarkMenuConfig;

	/**
	 * The direction in which the Route Search field will be displayed. Default: "left"
	 */
	@Input()
	public direction: StarkRouteSearchDirection = "left";

	/**
	 * Desired icon of the search button. Default: "magnify"
	 */
	@Input()
	public icon: "magnify" | string = "magnify";

	/**
	 * The source FormControl object of the search field
	 */
	public searchField: FormControl;

	/**
	 * The list of {@link StarkRouteSearchEntry}'s objects filtered by the auto-complete field
	 */
	public filteredRouteEntries: Observable<StarkRouteSearchEntry[]>;

	/**
	 * The list of routes to be displayed
	 */
	public routesToDisplay: StarkRouteSearchEntry[] = [];

	/**
	 * Whether the input field must be hidden or not
	 */
	public hide: boolean = true;

	/**
	 * Class constructor
	 * @param starkRoutingService - The routing service of the application
	 * @param logger - The logger of the application
	 * @param translateService -  The translation service of the application
	 * @param renderer - Angular Renderer wrapper for DOM manipulations
	 * @param elementRef- Reference to the DOM element where this directive is applied to
	 */
	public constructor(
		@Inject(STARK_ROUTING_SERVICE) public starkRoutingService: StarkRoutingService,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(TranslateService) public translateService: TranslateService,
		public renderer: Renderer2,
		public elementRef: ElementRef
	) {
		super(renderer, elementRef);
		this.searchField = new FormControl();
	}

	/**
	 * Filters the options according to what has been entered by the user in the input field
	 */
	public filterRouteEntries(value: string): StarkRouteSearchEntry[] {
		const filterValue: string = value.toLowerCase();
		return this.routesToDisplay.filter(
			(routeEntry: StarkRouteSearchEntry) =>
				routeEntry.label
					.toString()
					.toLowerCase()
					.indexOf(filterValue) === 0
		);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		super.ngOnInit();

		this.searchField.setValue("");
		this.filteredRouteEntries = this.searchField.valueChanges.pipe(
			startWith(""),
			map((option: string) => {
				return option ? this.filterRouteEntries(option) : [...this.routesToDisplay];
			})
		);

		if (typeof this.menuConfig === "undefined") {
			this.routesToDisplay = this.constructRouteEntriesFromRouterStates();
		} else {
			this.routesToDisplay = this.constructRouteEntriesFromMenuConfig(this.menuConfig);
		}

		this.routesToDisplay = this.translateRoutesLabels(this.routesToDisplay);
		this.routesToDisplay = this.sortRoutesLabels(this.routesToDisplay);

		this.translateService.onLangChange.subscribe((_ev: LangChangeEvent) => {
			this.routesToDisplay = this.translateRoutesLabels(this.routesToDisplay);
			this.routesToDisplay = this.sortRoutesLabels(this.routesToDisplay);
		});

		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * redirect the user to the chosen path
	 */
	public redirect(routeEntry: StarkRouteSearchEntry): void {
		this.starkRoutingService.navigateTo(routeEntry.targetState, routeEntry.targetStateParams).subscribe(
			() => {
				this.hide = true;
				this.searchField.setValue("");
			},
			(error: any) => {
				this.logger.warn(componentName + ": navigation failed. Error:" + error);
			}
		);
	}

	/**
	 * Show/hide the input field
	 */
	public show(): void {
		this.hide = !this.hide;

		if (!this.hide) {
			// set focus on the search field automatically
			setTimeout(() => {
				const inputField: HTMLElement = this.elementRef.nativeElement.querySelector(".search-field-input");
				inputField.focus();
			});
		}
	}

	/**
	 * @ignore
	 */
	public trackPath(_index: number, routeEntry: StarkRouteSearchEntry): string {
		return routeEntry.targetState;
	}

	/**
	 * Retrieve the list of routes from a {@link StarkMenuConfig} object which the user have passed to the component
	 */
	public constructRouteEntriesFromMenuConfig(menuConfig: StarkMenuConfig): StarkRouteSearchEntry[] {
		let routesToDisplay: StarkRouteSearchEntry[] = [];

		if (menuConfig !== undefined && menuConfig.menuSections !== undefined) {
			for (const section of menuConfig.menuSections) {
				for (const group of section.menuGroups) {
					routesToDisplay = [...routesToDisplay, ...this.extractRoutesFromMenuGroup(group)];
				}
			}
		}

		if (menuConfig !== undefined && menuConfig.menuGroups !== undefined) {
			for (const group of menuConfig.menuGroups) {
				routesToDisplay = [...routesToDisplay, ...this.extractRoutesFromMenuGroup(group)];
			}
		}

		return routesToDisplay;
	}

	/**
	 * Recursive method to extract routes from a StarkMenuGroup object.
	 * @param group - the group which entries need to be extracted
	 * @returns the extracted array of {@link StarkRouteSearchEntry} objects
	 */
	public extractRoutesFromMenuGroup(group: StarkMenuGroup): StarkRouteSearchEntry[] {
		let routesToDisplay: StarkRouteSearchEntry[] = [];

		if (group.isVisible && group.isEnabled && group.targetState) {
			routesToDisplay.push({
				label: group.label,
				targetState: group.targetState,
				targetStateParams: group.targetStateParams
			});
		}
		if (group.entries) {
			for (const subGroup of group.entries) {
				routesToDisplay = [...routesToDisplay, ...this.extractRoutesFromMenuGroup(subGroup)];
			}
		}

		return routesToDisplay;
	}

	/**
	 * Retrieve the list of routes from the Router if the user haven't passed a list to the component
	 */
	public constructRouteEntriesFromRouterStates(): StarkRouteSearchEntry[] {
		const routesToDisplay: StarkRouteSearchEntry[] = [];
		for (const state of this.starkRoutingService.getStatesConfig()) {
			const ng2State: Ng2StateDeclaration = state;
			const regexInitExitStateName: RegExp = new RegExp("(" + starkAppInitStateName + "|" + starkAppExitStateName + ")");
			if (
				ng2State.name !== undefined &&
				ng2State.url !== undefined &&
				ng2State.url.length > 1 &&
				!ng2State.abstract &&
				!ng2State.loadChildren &&
				!ng2State.name.match(regexInitExitStateName)
			) {
				const translationKey: string = this.starkRoutingService.getTranslationKeyFromState(ng2State.name);
				routesToDisplay.push({ label: translationKey, targetState: ng2State.name });
			}
		}

		return routesToDisplay;
	}

	/**
	 * Translate the label of all elements in the {@link StarkRouteSearchEntry} object.
	 * This is useful as the language can change during runtime.
	 * @param routeEntries - route entries to translate
	 * @returns the translate route entries
	 */
	public translateRoutesLabels(routeEntries: StarkRouteSearchEntry[]): StarkRouteSearchEntry[] {
		const routesToDisplay: StarkRouteSearchEntry[] = [];
		for (const route of routeEntries) {
			let translatedLabel: string | object = this.translateService.instant(route.label.toString());
			// in case the translation fails because the key is not found, an object containing all the translations will be returned!
			// in that case the route label is used
			translatedLabel = typeof translatedLabel === "string" ? translatedLabel : route.label.toString();
			routesToDisplay.push({
				label: translatedLabel,
				targetState: route.targetState,
				targetStateParams: route.targetStateParams
			});
		}

		return routesToDisplay;
	}

	/**
	 * Sort the array of {@link StarkRouteSearchEntry} objects by alphabetical order
	 * @param routeEntries - the list of entries to sort
	 * @returns the sorted array of {@link StarkRouteSearchEntry} objects
	 */
	public sortRoutesLabels(routeEntries: StarkRouteSearchEntry[]): StarkRouteSearchEntry[] {
		routeEntries = sortBy(routeEntries, ["label"]);
		return routeEntries;
	}

	/**
	 * Determine the css class to use according to the direction chosen by the user
	 */
	public getDirection(): string {
		if (this.direction === "right") {
			return "route-search-right";
		}
		return "route-search-left";
	}
}
