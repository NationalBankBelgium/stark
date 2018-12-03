import { Component, Inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { RouteEntry } from "../components/route-entry.intf";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { map, startWith } from "rxjs/operators";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService,starkAppExitStateName, starkAppInitStateName } from "@nationalbankbelgium/stark-core";
import { StarkMenuConfig, StarkMenuGroup } from "../../app-menu/components";
import { Ng2StateDeclaration } from "@uirouter/angular";

/**
 *  @ignore
 */
const _sortBy: Function = require("lodash/sortBy");
/**
 * Name of the component
 *
 */
const componentName: string = "stark-route-search";
export type StarkRouteSearchDirection = "left" | "right";

/**
 * Component to search a particular route with autocompletion that will redirect to the route chosen by the user
 */
@Component({
	selector: "stark-route-search",
	templateUrl: "./route-search.component.html",
	encapsulation: ViewEncapsulation.None,
	host: {
		class: componentName
	}
})
export class StarkRouteSearchComponent implements OnInit {
	/**
	 * the controller of the form
	 */
	public pathCtrl: FormControl;

	/**
	 * the list of routes filtered by autocomplete
	 */
	public filteredRouteEntries: Observable<RouteEntry[]>;

	/**
	 * the list of routes filtered by autocomplete
	 */
	public routesToDisplay: RouteEntry[] = [];

	/**
	 * The menu which options will be displayed
	 */
	@Input()
	public menuConfig?: StarkMenuConfig;

	/**
	 * The direction in which the field will be displayed
	 */
	@Input()
	public direction: StarkRouteSearchDirection = "left";

	/**
	 * if the input field must be hidden or not
	 */
	public hide: boolean;

	public constructor(
		@Inject(STARK_ROUTING_SERVICE) public starkRoutingService: StarkRoutingService,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(TranslateService) public translateService: TranslateService
	) {
		this.pathCtrl = new FormControl();
	}

	/**
	 * Filters the options according to what has been entered by the user in the input field
	 */
	public filterRouteEntries(value: string): RouteEntry[] {
		const filterValue: string = value.toLowerCase();
		return this.routesToDisplay.filter((state: RouteEntry) => state.label.toString().toLowerCase().indexOf(filterValue) === 0);
	}

	public ngOnInit(): void {
		this.pathCtrl.setValue("");
		this.filteredRouteEntries = this.pathCtrl.valueChanges.pipe(
			startWith(""),
			map((option: string) => (option ? this.filterRouteEntries(option) : [...this.routesToDisplay]))
		);

		this.hide = true;

		this.logger.debug(componentName + ": component initialized");

		if (this.routesToDisplay !== undefined) {
			if (this.menuConfig === undefined) {
				this.routesToDisplay = this.constructRouteEntriesFromRouterStates();
			} else {
				this.routesToDisplay = this.constructRouteEntriesFromMenuConfig(this.menuConfig);
			}
		}

		this.translateService.onLangChange.subscribe((_ev: LangChangeEvent) => {
			this.translateRoutesLabels(this.routesToDisplay);
		});
	}

	/**
	 * redirect the user to the chosen path
	 */
	public redirect(state: RouteEntry): void {
		this.starkRoutingService.navigateTo(state.targetState, state.targetStateParams).subscribe(() => {
			this.hide = true;
			this.pathCtrl.setValue("");
		});
	}

	/**
	 * Show/hide the input field
	 */
	public show(): void {
		this.hide = !this.hide;
	}

	/**
	 * @ignore
	 */
	public trackPath(_index: number, path: RouteEntry): string {
		return path.targetState;
	}

	/**
	 * Retrieve the list of routes from a StarkMenuConfig object which the user have passed to the component
	 */
	public constructRouteEntriesFromMenuConfig(menuConfig: StarkMenuConfig): RouteEntry[] {
		let routesToDisplay: RouteEntry[] = [];

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
		routesToDisplay = _sortBy(routesToDisplay, ['label']);
		return routesToDisplay;
	}

	/**
	 * This recursive method is used to extract routes from a StarkMenuGroup object
	 * @param group - the group which entries need to be extracted
	 * @returns the retrieved entries as an array of RouteEntry
	 */
	public extractRoutesFromMenuGroup(group: StarkMenuGroup): RouteEntry[] {
		let routesToDisplay: RouteEntry[] = [];

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
	 * Retrieve the list of routes from UIRouter if the user haven't passed a list to the component
	 */
	public constructRouteEntriesFromRouterStates(): RouteEntry[] {
		let routesToDisplay: RouteEntry[] = [];
		for (const state of this.starkRoutingService.getStatesConfig()) {
			const tempState:Ng2StateDeclaration = state;
			if (tempState.name !== undefined && tempState.url !== undefined && tempState.url.length > 1 && !tempState.abstract && !tempState.loadChildren) {
				const regexInitExitStateName: RegExp = new RegExp("(" + starkAppInitStateName + "|" + starkAppExitStateName + ")");
				if (!tempState.name.match(regexInitExitStateName) && this.starkRoutingService.getTranslationKeyFromState(tempState.name)) {
					const translationKey: string = this.starkRoutingService.getTranslationKeyFromState(tempState.name);
					routesToDisplay.push({label: translationKey, targetState: tempState.name});
				}
			}
		}
		
		routesToDisplay = this.translateRoutesLabels(routesToDisplay);
		return routesToDisplay;
	}

	/**
	 * This method is used to translate all labels in the RouteEntry list to be displayed
	 * This is useful as the language can change during runtime. 
	 * @param routeEntry - route entries to translate
	 * @returns the translate route entries
	 */
	public translateRoutesLabels(routeEntry: RouteEntry[]):RouteEntry[] {
		let routesToDisplay: RouteEntry[] = [];
		for (const route of routeEntry){
			routesToDisplay.push({label: this.translateService.instant(route.label.toString()), targetState: route.targetState});
		}
		routesToDisplay = this.sortRoutesLabels(routesToDisplay);
		return routesToDisplay;
	}

	/**
	 * Sort the RouteEntry list by alphabetical order
	 * @param routeEntry - the list to sort
	 * @returns the sorted RouteEntry list
	 */
	public sortRoutesLabels(routeEntry: RouteEntry[]): RouteEntry[]{
		routeEntry = _sortBy(routeEntry, ["label"]);
		return routeEntry;
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
