/* eslint-disable @angular-eslint/no-lifecycle-call */
import { ComponentFixture, inject, TestBed, waitForAsync } from "@angular/core/testing";
import { Component, NgModule, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from "@angular/material/legacy-autocomplete";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyOptionModule as MatOptionModule } from "@angular/material/legacy-core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Ng2StateDeclaration, StateDeclaration } from "@uirouter/angular";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLocale } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkRouteSearchComponent } from "./route-search.component";
import { StarkRouteSearchEntry } from "../components";
import { StarkMenuConfig, StarkMenuGroup } from "@nationalbankbelgium/stark-ui/src/modules/app-menu";
import { of, throwError } from "rxjs";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";

@Component({
	selector: `host-component`,
	template: ` <stark-route-search [menuConfig]="menuConfig"></stark-route-search> `
})
class TestHostComponent {
	@ViewChild(StarkRouteSearchComponent, { static: true })
	public routeSearchComponent!: StarkRouteSearchComponent;

	public menuConfig?: StarkMenuConfig;
}

@NgModule()
class LazyLoadedModule {}

describe("RouteSearchComponent", () => {
	let component: StarkRouteSearchComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;
	let translateService: TranslateService;

	const mockRoutingService: MockStarkRoutingService = new MockStarkRoutingService();
	const mockLoggingService: MockStarkLoggingService = new MockStarkLoggingService();

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
						id: "entry3",
						label: "Entry 3",
						isVisible: true,
						isEnabled: true,
						targetState: "entry3"
					}
				]
			}
		]
	};

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			imports: [
				CommonModule,
				FormsModule,
				MatButtonModule,
				MatInputModule,
				MatFormFieldModule,
				MatTooltipModule,
				MatAutocompleteModule,
				MatIconModule,
				MatIconTestingModule,
				MatSelectModule,
				NoopAnimationsModule,
				MatOptionModule,
				ReactiveFormsModule,
				TranslateModule.forRoot()
			],
			declarations: [StarkRouteSearchComponent, TestHostComponent],
			providers: [
				{ provide: STARK_ROUTING_SERVICE, useValue: mockRoutingService },
				{ provide: STARK_LOGGING_SERVICE, useValue: mockLoggingService }
			]
		}).compileComponents()));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostComponent.menuConfig = menuConfig;
		component = hostComponent.routeSearchComponent;
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

			expect(component.routingService).not.toBeNull();
			expect(component.routingService).toBeDefined();
			expect(component.routingService).toBeDefined();
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
			hideButton.click(); // click once to display the component
			expect(component.show).toHaveBeenCalledTimes(1);
			expect(component.hide).toBe(false);
		});

		it("should hide the input field if it is already visible and the Search button is clicked", () => {
			hideButton = <HTMLPreElement>hostFixture.nativeElement.querySelector("button");
			hideButton.click();
			hostFixture.detectChanges();

			hideButton.click(); // click a second time to hide the component
			hostFixture.detectChanges();
			expect(component.show).toHaveBeenCalledTimes(2);
			expect(component.hide).toBe(true);
		});
	});

	describe("route entries", () => {
		describe("initialization", () => {
			it("should use the constructRouteEntriesFromRouterStates when menuConfig is undefined", () => {
				spyOn(component, "constructRouteEntriesFromRouterStates").and.returnValue([]);
				spyOn(component, "constructRouteEntriesFromMenuConfig").and.callThrough();
				component.routesToDisplay = [];
				component.menuConfig = undefined;
				component.ngOnInit();

				expect(component.constructRouteEntriesFromRouterStates).toHaveBeenCalledTimes(1);
				expect(component.constructRouteEntriesFromMenuConfig).not.toHaveBeenCalled();
			});

			it("should use the constructRouteEntriesFromMenuConfig when menuConfig is defined", () => {
				spyOn(component, "constructRouteEntriesFromRouterStates").and.callThrough();
				spyOn(component, "constructRouteEntriesFromMenuConfig").and.callThrough();
				component.routesToDisplay = [];
				component.menuConfig = menuConfig;
				component.ngOnInit();

				expect(component.constructRouteEntriesFromMenuConfig).toHaveBeenCalledTimes(1);
				expect(component.constructRouteEntriesFromRouterStates).not.toHaveBeenCalled();
			});
		});

		describe("filtering", () => {
			it("should filter the options according to the passed value", () => {
				component.ngOnInit();

				let result: StarkRouteSearchEntry[] = component.filterRouteEntries("Test 1");
				expect(result.length).toBe(1);
				expect(result[0]).toEqual({ label: "Test 1", targetState: "test1", targetStateParams: undefined });

				result = component.filterRouteEntries("Test");
				expect(result.length).toBe(2);
				expect(result[0]).toEqual({ label: "Test 1", targetState: "test1", targetStateParams: undefined });
				expect(result[1]).toEqual({ label: "Test 2", targetState: "test2", targetStateParams: undefined });

				result = component.filterRouteEntries("st");
				expect(result.length).toBe(2);
				expect(result[0]).toEqual({ label: "Test 1", targetState: "test1", targetStateParams: undefined });
				expect(result[1]).toEqual({ label: "Test 2", targetState: "test2", targetStateParams: undefined });
			});

			it("should return an empty array if the input is not in the list", () => {
				const result: StarkRouteSearchEntry[] = component.filterRouteEntries("non existing value");

				expect(result.length).toBe(0);
			});
		});
	});

	describe("redirect", () => {
		beforeEach(() => {
			mockRoutingService.navigateTo.calls.reset();
		});

		it("should redirect to the entry.targetState when the redirect method is called", () => {
			mockRoutingService.navigateTo.and.returnValue(of("redirection succeeded"));
			const entry: StarkRouteSearchEntry = { label: "URL 1", targetState: "url1" };

			component.redirect(entry);
			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
		});

		it("should clear the input text as soon as the redirection finishes", () => {
			const searchFieldValue = "test";
			component.searchField.setValue(searchFieldValue);
			mockRoutingService.navigateTo.and.returnValue(of("redirection succeeded"));
			const entry: StarkRouteSearchEntry = { label: "URL 1", targetState: "url1" };
			expect(component.searchField.value).toBe(searchFieldValue);

			component.redirect(entry);
			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
			expect(component.searchField.value).toBe("");
		});

		it("should NOT clear the input text if the redirection failed", () => {
			const searchFieldValue = "test";
			component.searchField.setValue(searchFieldValue);
			mockRoutingService.navigateTo.and.returnValue(throwError("redirection failed"));
			const entry: StarkRouteSearchEntry = { label: "URL 1", targetState: "url1" };
			expect(component.searchField.value).toBe(searchFieldValue);

			component.redirect(entry);
			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
			expect(component.searchField.value).toBe(searchFieldValue);
		});
	});

	describe("constructRouteEntriesFromMenuConfig", () => {
		it("should retrieve the list for menuConfig", () => {
			const routesToDisplay: StarkRouteSearchEntry[] = component.constructRouteEntriesFromMenuConfig(menuConfig);

			expect(routesToDisplay.length).toBe(3);
			expect(routesToDisplay).toEqual([
				{ label: "Test 1", targetState: "test1", targetStateParams: undefined },
				{ label: "Test 2", targetState: "test2", targetStateParams: undefined },
				{ label: "Entry 3", targetState: "entry3", targetStateParams: undefined }
			]);
		});
	});

	describe("extractRoutesFromMenuGroup", () => {
		it("should extract the routes recursively from the given StarkMenuGroup object", () => {
			const menuGroup: StarkMenuGroup = {
				id: "entry1",
				label: "Entry 1",
				isVisible: true,
				isEnabled: true,
				targetState: "entry1",
				entries: [
					{
						id: "entry1.1",
						label: "Entry 1.1",
						isVisible: true,
						isEnabled: true,
						targetState: "entry1.1",
						entries: [
							{
								id: "entry1.1.1",
								label: "Entry 1.1.1",
								isVisible: true,
								isEnabled: true,
								targetState: "entry1.1.1",
								entries: [
									{
										id: "entry1.1.1.1",
										label: "Entry 1.1.1.1",
										isVisible: true,
										isEnabled: true,
										targetState: "entry1.1.1.1",
										entries: []
									}
								]
							},
							{
								id: "entry1.1.2",
								label: "Entry 1.1.2",
								isVisible: true,
								isEnabled: true,
								targetState: "entry1.1.2"
							}
						]
					},
					{
						id: "entry1.2",
						label: "Entry 1.2",
						isVisible: true,
						isEnabled: true,
						targetState: "entry1.2"
					}
				]
			};

			const expectedRouteEntries: StarkRouteSearchEntry[] = [
				{ label: "Entry 1", targetState: "entry1", targetStateParams: undefined },
				{ label: "Entry 1.1", targetState: "entry1.1", targetStateParams: undefined },
				{ label: "Entry 1.1.1", targetState: "entry1.1.1", targetStateParams: undefined },
				{ label: "Entry 1.1.1.1", targetState: "entry1.1.1.1", targetStateParams: undefined },
				{ label: "Entry 1.1.2", targetState: "entry1.1.2", targetStateParams: undefined },
				{ label: "Entry 1.2", targetState: "entry1.2", targetStateParams: undefined }
			];

			const result: StarkRouteSearchEntry[] = component.extractRoutesFromMenuGroup(menuGroup);
			expect(result).toEqual(expectedRouteEntries);
		});

		it("should extract the routes only from those menu entries that are visible, enabled and have a targetState defined", () => {
			const menuGroup: StarkMenuGroup = {
				id: "entry1",
				label: "Entry 1",
				isVisible: true,
				isEnabled: true,
				targetState: "entry1",
				entries: [
					{
						id: "entry1.1",
						label: "Entry 1.1",
						isVisible: true,
						isEnabled: false,
						targetState: "entry1.1",
						entries: [
							{
								id: "entry1.1.1",
								label: "Entry 1.1.1",
								isVisible: false,
								isEnabled: true,
								targetState: "entry1.1.1",
								entries: [
									{
										id: "entry1.1.1.1",
										label: "Entry 1.1.1.1",
										isVisible: true,
										isEnabled: true,
										entries: []
									}
								]
							},
							{
								id: "entry1.1.2",
								label: "Entry 1.1.2",
								isVisible: true,
								isEnabled: true,
								targetState: "entry1.1.2"
							}
						]
					},
					{
						id: "entry1.2",
						label: "Entry 1.2",
						isVisible: true,
						isEnabled: true,
						targetState: "entry1.2"
					}
				]
			};

			const expectedRouteEntries: StarkRouteSearchEntry[] = [
				{ label: "Entry 1", targetState: "entry1", targetStateParams: undefined },
				{ label: "Entry 1.1.2", targetState: "entry1.1.2", targetStateParams: undefined },
				{ label: "Entry 1.2", targetState: "entry1.2", targetStateParams: undefined }
			];

			const result: StarkRouteSearchEntry[] = component.extractRoutesFromMenuGroup(menuGroup);
			expect(result).toEqual(expectedRouteEntries);
		});
	});

	describe("sortRoutesLabels", () => {
		it("should sort alphabetically the list passed as a parameter", () => {
			const unsortedEntries: StarkRouteSearchEntry[] = [
				{ label: "Label B", targetState: "label b" },
				{ label: "Label C", targetState: "label c" },
				{ label: "Label A", targetState: "label a" }
			];

			const sortedEntries: StarkRouteSearchEntry[] = [
				{ label: "Label A", targetState: "label a" },
				{ label: "Label B", targetState: "label b" },
				{ label: "Label C", targetState: "label c" }
			];

			const result: StarkRouteSearchEntry[] = component.sortRoutesLabels(unsortedEntries);
			expect(result).toEqual(sortedEntries);
		});
	});

	describe("constructRouteEntriesFromRouterStates", () => {
		it("should retrieve the routes for the Router", () => {
			const mockStates: StateDeclaration[] = [
				{
					name: "homepage",
					url: "/homepage",
					data: {
						translationKey: "HOME",
						pageTitleColor: "blue",
						pageTitleFontSize: 20
					},
					parent: ""
				},
				{
					name: "page-01",
					url: "/page-01",
					data: {
						translationKey: "PAGE.01",
						pageTitleColor: "dark blue",
						pageTitleFontSize: 16
					},
					parent: "homepage"
				},
				{
					name: "page-01-01",
					url: "/page-01-01",
					data: {
						translationKey: "PAGE.01.01",
						pageTitleColor: "black",
						pageTitleFontSize: 14
					},
					parent: "page-01"
				}
			];

			mockRoutingService.getStatesConfig.and.returnValue(mockStates);
			mockRoutingService.getTranslationKeyFromState.and.callFake((stateName: string) => stateName.toUpperCase());

			const expectedRouteEntries: StarkRouteSearchEntry[] = [
				{ label: "HOMEPAGE", targetState: "homepage" },
				{ label: "PAGE-01", targetState: "page-01" },
				{ label: "PAGE-01-01", targetState: "page-01-01" }
			];
			component.menuConfig = undefined;
			const result: StarkRouteSearchEntry[] = component.constructRouteEntriesFromRouterStates();

			expect(result.length).toBe(3);
			expect(result).toEqual(expectedRouteEntries);
		});

		it("should retrieve only valid routes (no abstract routes, no lazy loaded routes, with name and url defined)", () => {
			const mockStates: Ng2StateDeclaration[] = [
				{
					name: "homepage",
					url: "/homepage",
					abstract: true,
					parent: ""
				},
				{
					name: "page-01",
					url: "/page-01",
					parent: "homepage",
					// FIXME This should be tested properly
					loadChildren: (): any => LazyLoadedModule
					// loadChildren: "./some.module#SomeModule" // lazy loaded module
				},
				{
					name: "page-01-01",
					url: "",
					parent: "page-01"
				},
				{
					name: "page-01-01-01",
					parent: "page-01-01"
				},
				{
					url: "/page-01-01-01-01",
					parent: "page-01-01-01-01"
				},
				{
					name: "page-01-01-01-01-01",
					url: "/page-01-01-01-01-01",
					parent: "page-01-01-01-01"
				}
			];

			mockRoutingService.getStatesConfig.and.returnValue(mockStates);
			mockRoutingService.getTranslationKeyFromState.and.callFake((stateName: string) => stateName.toUpperCase());

			const expectedRouteEntries: StarkRouteSearchEntry[] = [
				{
					label: "PAGE-01-01-01-01-01",
					targetState: "page-01-01-01-01-01"
				}
			];
			component.menuConfig = undefined;
			const result: StarkRouteSearchEntry[] = component.constructRouteEntriesFromRouterStates();

			expect(result.length).toBe(1);
			expect(result).toEqual(expectedRouteEntries);
		});
	});

	describe("translateRouteLabels", () => {
		beforeEach(() => {
			const english: StarkLocale = { languageCode: "en", translations: moduleTranslationsEn };
			mergeUiTranslations(translateService, english);

			spyOn(component.translateService, "instant").and.callThrough();
		});

		it("should translate the label of every RouteEntry object in the given array", () => {
			const nonTranslatedRouteEntries: StarkRouteSearchEntry[] = [
				{ label: "PATH.FIRST", targetState: "/path1" },
				{ label: "PATH.SECOND", targetState: "/path2" },
				{ label: "PATH.THIRD", targetState: "/path3" },
				{ label: "PATH.FOURTH", targetState: "/path4" }
			];

			const expectedTranslatedRouteEntries: StarkRouteSearchEntry[] = [
				{ label: "path1", targetState: "/path1", targetStateParams: undefined },
				{ label: "path2", targetState: "/path2", targetStateParams: undefined },
				{ label: "path3", targetState: "/path3", targetStateParams: undefined },
				{ label: "path4", targetState: "/path4", targetStateParams: undefined }
			];

			const translatedRouteEntries: StarkRouteSearchEntry[] = component.translateRoutesLabels(nonTranslatedRouteEntries);

			expect(component.translateService.instant).toHaveBeenCalledTimes(nonTranslatedRouteEntries.length);
			expect(translatedRouteEntries).toEqual(expectedTranslatedRouteEntries);
		});

		it("should translate the label of every RouteEntry object or leave the label 'as is' if the translation cannot be found", () => {
			const nonTranslatedRouteEntries: StarkRouteSearchEntry[] = [
				{ label: "PATH.FIRST", targetState: "/path1" },
				{ label: "PATH.SECOND", targetState: "/path2" },
				{ label: "NON.EXISTING.TRANSLATION", targetState: "/path3" },
				{ label: "whatever", targetState: "/path4" }
			];

			const expectedTranslatedRouteEntries: StarkRouteSearchEntry[] = [
				{ label: "path1", targetState: "/path1", targetStateParams: undefined },
				{ label: "path2", targetState: "/path2", targetStateParams: undefined },
				{ label: "NON.EXISTING.TRANSLATION", targetState: "/path3", targetStateParams: undefined },
				{ label: "whatever", targetState: "/path4", targetStateParams: undefined }
			];

			const translatedRoutesEntries: StarkRouteSearchEntry[] = component.translateRoutesLabels(nonTranslatedRouteEntries);

			expect(component.translateService.instant).toHaveBeenCalledTimes(nonTranslatedRouteEntries.length);
			expect(translatedRoutesEntries).toEqual(expectedTranslatedRouteEntries);
		});
	});
});
