/* tslint:disable:completed-docs no-commented-code*/
import {MatTooltipModule} from "@angular/material/tooltip";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {RouteEntry} from "../components/route-entry.intf";
import {StarkMenuConfig, StarkMenuGroup} from "../../app-menu";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Component, NO_ERRORS_SCHEMA, ViewChild} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {StarkRouteSearchComponent} from "./route-search.component";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {Ng2StateDeclaration, UIRouterModule} from "@uirouter/angular";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	StarkLoggingService,
	StarkRoutingService
} from "@nationalbankbelgium/stark-core";
import {MockStarkLoggingService, MockStarkRoutingService} from "@nationalbankbelgium/stark-core/testing";
import {CommonModule} from "@angular/common";
import {of, Subject} from "rxjs";
import Spy = jasmine.Spy;
import {mergeUiTranslations} from "../../../common/translations/merge-translations";
import {StarkLocale} from "../../../../../stark-core";

@Component({
	selector: `host-component`,
	template: `
		<stark-route-search [menuConfig]="routesToDisplay"></stark-route-search>
	`
})
class TestHostComponent {
	@ViewChild(StarkRouteSearchComponent)
	public routeSearchComponent: StarkRouteSearchComponent;
	public routesToDisplay: RouteEntry[];
	public menuConfig: StarkMenuConfig;
}

/* tslint:disable:no-big-function */
describe("StarkRouteSearchComponent", () => {
	let component: StarkRouteSearchComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;
	let translateService: TranslateService;

	const mockRoutingService: StarkRoutingService = new MockStarkRoutingService();
	const mockLoggingService: StarkLoggingService = new MockStarkLoggingService();

	const inheritedParams: { [param: string]: any } = {
		requestId: "default value",
		seniority: undefined,
		onBehalfView: false
	};
	const mockStates: Ng2StateDeclaration[] = [
		{
			name: "homepage",
			url: "/homepage",
			params: {
				...inheritedParams // ALL states will inherit these params
			},
			resolve: {
				availableHolidays: () => {
					return 11 * 2;
				}
			},
			data: {
				translationKey: "HOME",
				pageTitleColor: "blue",
				pageTitleFontSize: 20
			},
			parent: "",
		},
		{
			name: "page-01",
			url: "/page-01",
			params: {}, // no params (inherits the ones from the parent/ancestor)
			data: {
				translationKey: "PAGE.01",
				pageTitleColor: "dark blue",
				pageTitleFontSize: 16
			},
			resolve: {
				translationKey: () => {
					return "PAGE.01.FROM.RESOLVE";
				}
			},
			parent: "homepage",
		},
		{
			name: "page-01-01",
			url: "/page-01-01",
			params: {}, // no params (inherits the ones from the parent/ancestor)
			data: {
				translationKey: "PAGE.01.01",
				pageTitleColor: "black",
				pageTitleFontSize: 14
			},
			parent: "page-01",
		}
	];

	const moduleTranslationsEn: any = {
		PATH: {
			FIRST: "path1",
			SECOND: "path2",
			THIRD: "path3",
			FOURTH: "path4"
		}
	};

	const menuConfig: StarkMenuConfig = {
		menuSections: [
			{
				label: "Welcome to STARK",
				menuGroups: [
					{
						id: "test1",
						label: "Test 1",
						isVisible: true,
						isEnabled: true,
						targetState: "test1"
					},
					{
						id: "test2",
						label: "Test 2",
						isVisible: true,
						isEnabled: true,
						targetState: "test2"
					},
					{
						id: "test3",
						label: "Test 3",
						isVisible: true,
						isEnabled: true,
						targetState: "test3"
					}
				]
			}
		]
	};

	const routerModule: UIRouterModule = UIRouterModule.forRoot({
		useHash: true,
		states: mockStates
	});

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			imports: [
				CommonModule,
				FormsModule,
				MatButtonModule,
				MatInputModule,
				MatFormFieldModule,
				MatTooltipModule,
				MatAutocompleteModule,
				MatSelectModule,
				NoopAnimationsModule,
				MatOptionModule,
				ReactiveFormsModule,
				TranslateModule.forRoot(),
				routerModule
			],
			declarations: [StarkRouteSearchComponent, TestHostComponent],
			providers: [{provide: STARK_ROUTING_SERVICE, useValue: mockRoutingService},
				{provide: STARK_LOGGING_SERVICE, useValue: mockLoggingService},
				/*{provide: TranslateService, useClass: TranslateService}*/],
			schemas: [NO_ERRORS_SCHEMA] // to avoid errors due to "mat-icon" directive not known (which we don't want to add in these tests)
		}).compileComponents();
	}));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		component = hostComponent.routeSearchComponent;
		(<Spy>mockRoutingService.getStatesConfig).and.returnValue(
			[
				{
					name: "path1",
					url: "/path1",
					data: {
						translationKey: "PATH.01"
					},
				},
				{
					name: "path2",
					url: "/path2",
					data: {
						translationKey: "PATH.02"
					},
				},
				{
					name: "path3",
					url: "/path3",
					data: {
						translationKey: "PATH.03"
					},
				},
				{
					name: "path4",
					url: "/path4",
					data: {
						translationKey: "PATH.04"
					},
				},
			]
		);
		(<Spy>component.starkRoutingService.getTranslationKeyFromState).and.returnValue([
			{
				translationKey: "PATH.01"
			},
			{
				translationKey: "PATH.02"
			},
			{
				translationKey: "PATH.03"
			},
			{
				translationKey: "PATH.04"
			}
		]);
		hostFixture.detectChanges();
	});

	// Inject module dependencies
	beforeEach(inject([TranslateService], (_translateService: TranslateService) => {
		translateService = _translateService;
		translateService.addLangs(["en"]);
		translateService.setDefaultLang("en");
	}));


	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.starkRoutingService).not.toBeNull();
			expect(component.starkRoutingService).toBeDefined();
			expect(component.starkRoutingService).toBeDefined();
			expect(component.translateService).toBeDefined();

			expect(component.hide).toBe(true);
			expect(component.filteredRouteEntries).not.toBeNull();
		});
	});

	describe("route search input field", () => {
		let hideButton: HTMLElement;

		beforeEach(() => {
			spyOn(component, "show").and.callThrough();
		});

		it("should display the input field when the Search button is clicked", () => {
			hideButton = <HTMLPreElement>hostFixture.nativeElement.querySelector("button");
			hideButton.click(); //we click once to display the component
			expect(component.show).toHaveBeenCalledTimes(1);
			expect(component.hide).toBe(false);
		});

		it("should hide the input field if it is already visible and the Search button is clicked", () => {
			hideButton = <HTMLPreElement>hostFixture.nativeElement.querySelector("button");
			hideButton.click();
			hostFixture.detectChanges();
			hideButton.click(); //we click a second time to hide the component
			hostFixture.detectChanges();
			expect(component.show).toHaveBeenCalledTimes(2);
			expect(component.hide).toBe(true);
		});
	});

	describe("init routes list", () => {
		it("should use the initRoutePathFromRouter when menuConfig is undefined", () => {
			spyOn(component, "constructRouteEntriesFromRouterStates").and.callThrough();
			component.routesToDisplay = [];
			component.menuConfig = undefined;
			component.ngOnInit();

			expect(component.constructRouteEntriesFromRouterStates).toHaveBeenCalledTimes(1);
		});

		it("should use the initRoutePathFromConfig when menuConfig is defined", () => {
			spyOn(component, "constructRouteEntriesFromMenuConfig").and.callThrough();
			component.routesToDisplay = [];
			component.menuConfig = menuConfig;
			component.ngOnInit();

			expect(component.constructRouteEntriesFromMenuConfig).toHaveBeenCalledTimes(1);
		});
	});

	describe("filter options", () => {
		it("should filters the options according to the passed parameter", () => {

			//populated the menuConfig array
			component.menuConfig = menuConfig;
			component.ngOnInit();

			const result: RouteEntry[] = component.filterRouteEntries("Test 1");

			expect(result.length).toBe(1);
			expect(result[0].label).toBe("Test 1");
			expect(result[0].targetState).toBe("test1");
		});

		it("should return an empty array if the input is not in the list", () => {
			const input: string = "badInput";
			const result: RouteEntry[] = component.filterRouteEntries(input);

			spyOn(input, "toLowerCase").and.callThrough();
			expect(result.length).toBe(0);
		});
	});

	describe("redirect", () => {
		it("should redirect to the url when the redirect method is called", () => {
			(<Spy>mockRoutingService.navigateTo).and.returnValue(of("redirection succeeded"));
			const entry: RouteEntry = {label: "URL 1", targetState: "url1"};
			component.redirect(entry);
			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
		});

		it("should clear the input text as soon as the redirection finishes", () => {
			const redirectionSubj: Subject<string> = new Subject();
			(<Spy>mockRoutingService.navigateTo).and.returnValue(redirectionSubj);

			// TODO
			// simulate a successful redirection
			// redirectionSubj.next("redirection succeeded");
		});

		it("should NOT clear the input text if the redirection failed", () => {
			const redirectionSubj: Subject<string> = new Subject();
			(<Spy>mockRoutingService.navigateTo).and.returnValue(redirectionSubj);

			// TODO
			// simulate a failed redirection
			// redirectionSubj.error("redirection failed");
		});
	});

	describe("initRoutePathFromConfig", () => {
		it("should retrieve the list for menuConfig", () => {
			component.menuConfig = menuConfig;
			const routesToDisplay: RouteEntry[] = component.constructRouteEntriesFromMenuConfig(component.menuConfig);

			expect(routesToDisplay.length).toBe(3);
		});
	});

	describe("sortRoutesLabels", () => {
		it("should sort the list passed as a parameter", () => {
			const beforSorting: RouteEntry[] = [
				{
					label: "BLabel",
					targetState: "Blabel"
				},
				{
					label: "CLabel",
					targetState: "Clabel"
				},
				{
					label: "ALabel",
					targetState: "Alabel"
				}
			];

			const afterSorting: RouteEntry[] = [
				{
					label: "ALabel",
					targetState: "Alabel"
				},
				{
					label: "BLabel",
					targetState: "Blabel"
				},
				{
					label: "CLabel",
					targetState: "Clabel"
				}
			];

			const result: RouteEntry[] = component.sortRoutesLabels(beforSorting);
			expect(result).toEqual(afterSorting);
		})
	});

	describe("extractRoutesFromMenuGroup", () => {
		it("should extract routes from a starkMenuGroup object", () => {
			const menuGroupForExtraction: StarkMenuGroup =
				{
					id: "entry1",
					label: "Entry 1",
					isVisible: true,
					isEnabled: true,
					entries: [
						{
							id: "entry2",
							label: "Entry 2",
							isVisible: true,
							isEnabled: true,
							targetState: "entry2"
						}
					]
				};

			const expectedMenuGroup: RouteEntry[] = [
				{
					label: "Entry 2",
					targetState: "entry2",
					targetStateParams: undefined
				}
			];

			const result: RouteEntry[] = component.extractRoutesFromMenuGroup(menuGroupForExtraction);
			expect(result).toEqual(expectedMenuGroup);
		})
	});

	describe("initRoutePathFromRouter", () => {
		it("should retrieve the list for uiRouter", () => {
			spyOn(component, "constructRouteEntriesFromRouterStates").and.returnValue(
				[
					{
						label: "path 1",
						targetState: "/url1"
					},
					{
						label: "path 2",
						targetState: "/url2"
					},
					{
						label: "path 3",
						targetState: "/url3"
					},
					{
						label: "path 4",
						targetState: "/url4"
					}
				]
			);
			component.menuConfig = undefined;
			const routesToDisplay: RouteEntry[] = component.constructRouteEntriesFromRouterStates();

			expect(routesToDisplay.length).toBe(4);

		});
	});

	describe("translateRouteLabels", () => {
		it("should translate translations keys from a RouteEntry object", () => {
			const routeEntriesToTranslate: RouteEntry[] =
				[
					{
						label: "PATH.FIRST",
						targetState: "/path1"
					},
					{
						label: "PATH.SECOND",
						targetState: "/path2"
					},
					{
						label: "PATH.THIRD",
						targetState: "/path3"
					},
					{
						label: "PATH.FOURTH",
						targetState: "/path4"
					}
				];

			const routeEntriesAfterTranslation: RouteEntry[] =
				[
					{
						label: "path1",
						targetState: "/path1"
					},
					{
						label: "path2",
						targetState: "/path2"
					},
					{
						label: "path3",
						targetState: "/path3"
					},
					{
						label: "path4",
						targetState: "/path4"
					}
				];

			spyOn(component.translateService,"instant").and.callThrough();

			const english: StarkLocale = { languageCode: "en", translations: moduleTranslationsEn };
			mergeUiTranslations(translateService, english);
			
			const routesToReturn: RouteEntry[] = component.translateRoutesLabels(routeEntriesToTranslate);
			
			expect(component.translateService.instant).toHaveBeenCalledTimes(4);
			expect(routesToReturn).toEqual(routeEntriesAfterTranslation);

		});
	});

});
