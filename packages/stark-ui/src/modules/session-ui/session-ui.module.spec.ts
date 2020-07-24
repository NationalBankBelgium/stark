/* tslint:disable:completed-docs */
import { async, fakeAsync, inject, TestBed, tick } from "@angular/core/testing";
import { Component, ModuleWithProviders, NgModuleFactoryLoader, SystemJsNgModuleLoader } from "@angular/core";
import { OverlayContainer } from "@angular/cdk/overlay";
import { UIRouterModule } from "@uirouter/angular";
import { Store } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { StateObject, StateService, UIRouter, UIRouterGlobals } from "@uirouter/core";
import { TranslateModule } from "@ngx-translate/core";
import { catchError, switchMap } from "rxjs/operators";
import { from, of, throwError } from "rxjs";
import {
	SESSION_STATES,
	STARK_SESSION_SERVICE,
	starkSessionExpiredStateName,
	starkSessionLogoutStateName
} from "@nationalbankbelgium/stark-core";
import { MockStarkSessionService } from "@nationalbankbelgium/stark-core/testing";
import { StarkSessionUiModule } from "./session-ui.module";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe("SessionUiModule", () => {
	let $state: StateService;
	let $globals: UIRouterGlobals;
	let router: UIRouter;
	let overlayContainer: SpyObj<OverlayContainer>;
	const homeStateNAme = "homepage";

	@Component({ selector: "home-component", template: "HOME" })
	class HomeComponent {}

	const routerModule: ModuleWithProviders = UIRouterModule.forRoot({
		useHash: true,
		states: [
			{
				name: homeStateNAme,
				url: `/${homeStateNAme}`,
				parent: "",
				component: HomeComponent
			},
			...SESSION_STATES // these are the parent states of the Session UI States
		]
	});

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [HomeComponent],
			imports: [routerModule, EffectsModule.forRoot([]), TranslateModule.forRoot(), StarkSessionUiModule.forRoot()],
			providers: [
				provideMockActions(() => of("some action")),
				{
					provide: Store,
					useValue: createSpyObj<Store<any>>("Store", ["dispatch"])
				},
				{
					provide: OverlayContainer,
					useValue: createSpyObj<OverlayContainer>("OverlayContainer", ["ngOnDestroy"])
				},
				{
					provide: STARK_SESSION_SERVICE,
					useValue: new MockStarkSessionService()
				},
				{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader } // needed for ui-router
			]
		}).compileComponents();
	}));

	// Inject module dependencies
	beforeEach(inject([UIRouter, OverlayContainer], (_router: UIRouter, _overlayContainer: SpyObj<OverlayContainer>) => {
		router = _router;
		overlayContainer = _overlayContainer;
		$state = router.stateService;
		$globals = router.globals;

		overlayContainer.ngOnDestroy.calls.reset();
	}));

	afterEach(() => {
		// IMPORTANT: reset the url after each test,
		// otherwise UI-Router will try to find a match of the current url and navigate to it!!
		router.urlService.url("");
	});

	describe("session UI states", () => {
		describe("starkSessionExpiredState", () => {
			it("when navigating to the state, it should destroy the Angular CDK OverlayContainer", fakeAsync(() => {
				from($state.go(homeStateNAme))
					.pipe(
						switchMap((enteredState: StateObject) => {
							expect(enteredState).toBeDefined();
							expect(enteredState.name).toBe(homeStateNAme);

							expect($globals.$current.name).toBe(enteredState.name);
							expect(overlayContainer.ngOnDestroy).not.toHaveBeenCalled();

							return $state.go(starkSessionExpiredStateName);
						}),
						catchError((error: any) => {
							return throwError(`currentState ${error}`);
						})
					)
					.subscribe(
						(enteredState: StateObject) => {
							expect(enteredState).toBeDefined();
							expect(enteredState.name).toBe(starkSessionExpiredStateName);

							expect($globals.$current.name).toBe(enteredState.name);
							expect(overlayContainer.ngOnDestroy).toHaveBeenCalledTimes(1);
						},
						(error: any) => fail(error)
					);

				tick();
			}));
		});

		describe("starkSessionLogoutState", () => {
			it("when navigating to the state, it should destroy the Angular CDK OverlayContainer", fakeAsync(() => {
				from($state.go(homeStateNAme))
					.pipe(
						switchMap((enteredState: StateObject) => {
							expect(enteredState).toBeDefined();
							expect(enteredState.name).toBe(homeStateNAme);

							expect($globals.$current.name).toBe(enteredState.name);
							expect(overlayContainer.ngOnDestroy).not.toHaveBeenCalled();

							return $state.go(starkSessionLogoutStateName);
						}),
						catchError((error: any) => {
							return throwError(`currentState ${error}`);
						})
					)
					.subscribe(
						(enteredState: StateObject) => {
							expect(enteredState).toBeDefined();
							expect(enteredState.name).toBe(starkSessionLogoutStateName);

							expect($globals.$current.name).toBe(enteredState.name);
							expect(overlayContainer.ngOnDestroy).toHaveBeenCalledTimes(1);
						},
						(error: any) => fail(error)
					);

				tick();
			}));
		});
	});
});
