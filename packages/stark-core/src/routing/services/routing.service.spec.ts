import { Component, NgModuleFactoryLoader, NO_ERRORS_SCHEMA, SystemJsNgModuleLoader } from "@angular/core";
import { TestBed, fakeAsync, tick, inject } from "@angular/core/testing";
import { Ng2StateDeclaration, UIRouterModule } from "@uirouter/angular";
import { StateDeclaration, StateObject, StateService, TransitionService, UIRouter } from "@uirouter/core";
import { switchMap } from "rxjs/operators/switchMap";
import { catchError } from "rxjs/operators/catchError";
import { tap } from "rxjs/operators/tap";
import { _throw as observableThrow } from "rxjs/observable/throw";
import { Store } from "@ngrx/store";
import { StarkRoutingServiceImpl } from "./routing.service";
import { StarkLoggingService } from "../../logging/services";
import { StarkApplicationConfig } from "../../configuration/entities/application";
import { StarkStateConfigWithParams } from "./state-config-with-params.intf";
import { StarkRoutingTransitionHook } from "./routing-transition-hook.constants";
import CallInfo = jasmine.CallInfo;
import { StarkRoutingActionTypes } from "../actions";
import Spy = jasmine.Spy;
import { MockStarkLoggingService } from "../../logging/testing/logging.mock";
import { StarkCoreApplicationState } from "../../common/store/stark-core-application-state";

@Component({ selector: "test-home", template: "HOME" })
export class HomeComponent {}

@Component({ selector: "logout-page", template: "LOGOUT_PAGE_COMPONENT" })
export class LogoutPageComponent {}

describe("Service: StarkRoutingService", () => {
	let $state: StateService;
	let router: UIRouter;

	let routingService: StarkRoutingServiceImpl;
	let mockLogger: StarkLoggingService;
	const mockStore: Store<StarkCoreApplicationState> = jasmine.createSpyObj("storeSpy", ["dispatch"]);
	const appConfig: Partial<StarkApplicationConfig> = {
		sessionTimeout: 123,
		sessionTimeoutWarningPeriod: 13,
		keepAliveInterval: 45,
		keepAliveUrl: "http://my-backend/keepalive",
		logoutUrl: "http://localhost:5000/logout",
		homeStateName: "homepage"
	};
	const mockCorrelationId: string = "12345";

	// mockStates Tree
	//                                homepage
	//                                   |
	//                   -------------------------------------------------------------------
	//                   |                                |                                |
	//                page-01                          page-02                          Page-03(abstract)
	//                   |                                |                                |
	//                   |                                |                                |
	//                   |                                |                                |
	//       ---------------------------               --------------               --------------
	//       |            |            |               |            |               |            |
	//   page-01-01   page-01-02   page-01-03      page-02-01   page-02-02      page-03-01   page-03-02
	//                    |
	//             ----------------
	//             |              |
	//       page-01-02-01   page-01-02-02

	const numberOfMockStates: number = 14;
	const mockStates: Ng2StateDeclaration[] = [
		{
			name: "homepage", // the parent is defined in the state's name (contains a dot)
			url: "/homepage",
			params: {
				requestId: "default value",
				seniority: undefined,
				onBehalfView: false
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
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-01", // the parent is defined in the state's name (contains a dot)
			url: "/page-01",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
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
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-01-01", // the parent is defined in the state's name (contains a dot)
			url: "/page-01-01",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.01.01",
				pageTitleColor: "black",
				pageTitleFontSize: 14
			},
			parent: "page-01",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-01-02", // the parent is defined in the state's name (contains a dot)
			url: "/page-01-02",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.01.02",
				pageTitleColor: "black",
				pageTitleFontSize: 14
			},
			parent: "page-01",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-01-02-01", // the parent is defined in the state's name (contains a dot)
			url: "/page-01-02-01",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			parent: "page-01-02",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-01-02-02", // the parent is defined in the state's name (contains a dot)
			url: "/page-01-02-02",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.01.02.02"
			},
			parent: "page-01-02",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-01-03", // the parent is defined in the state's name (contains a dot)
			url: "/page-01-03",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.01.03",
				pageTitleColor: "black",
				pageTitleFontSize: 14
			},
			parent: "page-01",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-02", // the parent is defined in the state's name (contains a dot)
			url: "/page-02",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.02",
				pageTitleColor: "dark blue",
				pageTitleFontSize: 16
			},
			parent: "homepage",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-02-01", // the parent is defined in the state's name (contains a dot)
			url: "/page-02-01",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.02.01",
				pageTitleColor: "black",
				pageTitleFontSize: 14
			},
			parent: "page-02",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-02-02", // the parent is defined in the state's name (contains a dot)
			url: "/page-02-02",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.02.02",
				pageTitleColor: "black",
				pageTitleFontSize: 14
			},
			parent: "page-02",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-03", // the parent is defined in the state's name (contains a dot)
			url: "/page-03",
			params: {
				baseParameter: "inherited"
			},
			data: {
				translationKey: "PAGE.03",
				pageTitleColor: "dark blue",
				pageTitleFontSize: 16
			},
			parent: "homepage",
			abstract: true,
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-03-01", // the parent is defined in the state's name (contains a dot)
			url: "/page-03-01",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.03.01",
				pageTitleColor: "black",
				pageTitleFontSize: 14
			},
			parent: "page-03",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		},
		{
			name: "page-03-02", // the parent is defined in the state's name (contains a dot)
			url: "/page-03-02",
			params: {
				requestId: "default value",
				onBehalfView: false
			},
			data: {
				translationKey: "PAGE.03.02",
				pageTitleColor: "black",
				pageTitleFontSize: 14
			},
			parent: "page-03",
			views: {
				"initOrExit@": {
					component: LogoutPageComponent
				}
			}
		}
	];

	function TestStateTreeParams(navigationSteps: any, expectedStateTreeParams: any, previousNavigations?: number): void {
		for (const navigationStep of navigationSteps) {
			routingService.navigateTo(navigationStep.stateName, navigationStep.stateParams);
			tick();
		}

		if (previousNavigations) {
			for (let i: number = 0; i < previousNavigations; i++) {
				routingService.navigateToPrevious();
				tick();
			}
		}

		const stateTreeParams: Map<string, any> = routingService.getStateTreeParams();

		expect(stateTreeParams.size).toBe(expectedStateTreeParams.length);
		let index: number = 0;
		stateTreeParams.forEach((stateParams: any, stateName: string) => {
			expect(stateName).toBe(expectedStateTreeParams[index].stateName);
			expect(stateParams).toEqual(expectedStateTreeParams[index].stateParams);
			index++;
		});
	}

	function TestStateTreeResolves(navigationSteps: any, expectedStateTreeResolves: any): void {
		for (const navigationStep of navigationSteps) {
			routingService.navigateTo(navigationStep.stateName, navigationStep.stateParams);
			tick();
		}

		const stateTreeResolves: Map<string, any> = routingService.getStateTreeResolves();

		expect(stateTreeResolves.size).toBe(expectedStateTreeResolves.length);
		let index: number = 0;

		stateTreeResolves.forEach((stateResolve: any, token: string) => {
			expect(token).toBe(expectedStateTreeResolves[index].name);
			expect(stateResolve).toEqual(expectedStateTreeResolves[index].resolvableData);
			index++;
		});
	}

	function TestStateTreeData(navigationSteps: any, expectedStateTreeData: any): void {
		for (const navigationStep of navigationSteps) {
			routingService.navigateTo(navigationStep.stateName);
			tick();
		}

		const stateTreeData: Map<string, any> = routingService.getStateTreeData();

		expect(stateTreeData.size).toBe(expectedStateTreeData.length);
		let index: number = 0;

		stateTreeData.forEach((stateData: any, stateName: string) => {
			expect(stateName).toBe(expectedStateTreeData[index].name);
			expect(stateData).toEqual(expectedStateTreeData[index].data);
			index++;
		});
	}

	function TestTranslationKey(navigationSteps: any, expectedTranslationKeys: any): void {
		for (const navigationStep of navigationSteps) {
			routingService.navigateTo(navigationStep.stateName);
			tick();
		}

		for (const expectedTranslationKey of expectedTranslationKeys) {
			const translationKey: string = routingService.getTranslationKeyFromState(expectedTranslationKey.name);
			expect(translationKey).toBe(expectedTranslationKey.translationKey);
		}
	}

	const routerModule: UIRouterModule = UIRouterModule.forRoot({
		useHash: true,
		states: mockStates,
		deferIntercept: true // FIXME: this option shouldn't be used but is needed for Chrome and HeadlessChrome otherwise it doesn't work. Why?
	});

	const starkRoutingServiceFactory: any = (state: StateService, transitions: TransitionService) => {
		mockLogger = new MockStarkLoggingService(mockCorrelationId);

		return new StarkRoutingServiceImpl(mockLogger, mockStore, <any>appConfig, state, transitions);
	};

	/**
	 * async beforeEach
	 */
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [HomeComponent, LogoutPageComponent],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{
					provide: StarkRoutingServiceImpl,
					useFactory: starkRoutingServiceFactory,
					deps: [StateService, TransitionService]
				},
				{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader } // needed for ui-router
			],
			imports: [routerModule]
		});
	});

	// Inject module dependencies
	beforeEach(
		inject([UIRouter, StarkRoutingServiceImpl], (_router: UIRouter, _routingService: StarkRoutingServiceImpl) => {
			router = _router;
			$state = router.stateService;
			routingService = _routingService;

			(<Spy>mockLogger.warn).calls.reset();
			(<Spy>mockLogger.debug).calls.reset();
			(<Spy>mockLogger.error).calls.reset();
			(<Spy>mockStore.dispatch).calls.reset();
		})
	);

	afterEach(() => {
		// IMPORTANT: reset the url after each test,
		// otherwise UI-Router will try to find a match of the current url and navigate to it!!
		router.urlService.url("");
	});

	describe("getCurrentState", () => {
		it("should return the current State instance where the router has navigated to", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			let currentState: StateObject = routingService.getCurrentState();
			expect(currentState.name).toBe("");
			routingService
				.navigateTo("page-01")
				.pipe(
					tap((enteredState: StateObject) => {
						expect(enteredState).toBeDefined();
						expect(enteredState.name).toBe("page-01");

						currentState = routingService.getCurrentState();
						expect(currentState.name).toBe(enteredState.name);
						expect($state.go).toHaveBeenCalledTimes(1);
					}),
					catchError((error: any) => {
						return observableThrow("getCurrentState " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});
	});

	describe("getCurrentStateName", () => {
		it("should return the name of the current State instance where the router has navigated to", (done: DoneFn) => {
			routingService
				.navigateTo("page-01")
				.pipe(
					tap((enteredState: StateObject) => {
						const currentState: StateObject = routingService.getCurrentState();
						const currentStateName: string = routingService.getCurrentStateName();

						expect(currentStateName).toBe(enteredState.name);
						expect(currentStateName).toBe(currentState.name);
					}),
					catchError((error: any) => {
						return observableThrow("getCurrentStateName " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});
	});

	describe("getCurrentStateConfig", () => {
		it("should return the current StateConfig instance where the router has navigated to", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			routingService
				.navigateTo("page-01")
				.pipe(
					tap((enteredState: StateObject) => {
						expect(enteredState).toBeDefined();
						const currentStateConfig: StateDeclaration = routingService.getCurrentStateConfig();
						expect(currentStateConfig.name).toBe(enteredState.name);
						expect(currentStateConfig.url).toBe("/page-01");
					}),
					catchError((error: any) => {
						return observableThrow("getCurrentStateConfig " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});
	});

	describe("getStatesConfig", () => {
		it("should return an array containing all the defined states", () => {
			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			const stateDeclarations: StateDeclaration[] = routingService.getStatesConfig();
			expect(stateDeclarations.length).toBe(numberOfMockStates);

			for (let index: number = 0; index < numberOfMockStates; index++) {
				expect(stateDeclarations[index]).toBe(statesConfig[index]);
			}
		});
	});

	describe("getStateConfigByUrlPath", () => {
		it("should return the state of the requested url", () => {
			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states
			const url: string = <string>statesConfig[1].url;

			const stateDeclarations: StarkStateConfigWithParams = <StarkStateConfigWithParams>routingService.getStateConfigByUrlPath(url);
			expect(stateDeclarations.state).toBe(statesConfig[1]);
		});
	});

	describe("getStateDeclarationByStateName", () => {
		it("should return the requested state", () => {
			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			const stateName: string = "page-01";
			const stateDeclaration: StateDeclaration = <StateDeclaration>routingService.getStateDeclarationByStateName(stateName);
			expect(stateDeclaration).toBeDefined();
			expect(stateDeclaration.name).toBe(stateName);
		});

		it("should return undefined when the state does not exist", () => {
			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			const stateName: string = "unexisting state";
			const stateDeclaration: StateDeclaration = <StateDeclaration>routingService.getStateDeclarationByStateName(stateName);
			expect(stateDeclaration).toBeUndefined();
		});
	});

	describe("getCurrentStateParams", () => {
		it("should contain the params, when provided", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			const requestId: string = "652d9053-32a0-457c-9eca-162cd301a4e8";

			routingService
				.navigateTo("page-01", { requestId: requestId, onBehalfView: true })
				.pipe(
					tap(() => {
						expect($state.go).toHaveBeenCalledTimes(1);
						expect($state.go).toHaveBeenCalledWith(
							"page-01",
							{
								requestId: requestId,
								onBehalfView: true
							},
							undefined
						);

						const currentStateParams: any = routingService.getCurrentStateParams();
						expect(currentStateParams.requestId).toBeDefined();
						expect(currentStateParams.requestId).toBe(requestId);
						expect(currentStateParams.onBehalfView).toBeDefined();
						expect(currentStateParams.onBehalfView).toBe(true);
					}),
					catchError((error: any) => {
						return observableThrow("navigateTo " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});
	});

	describe("isCurrentUiState", () => {
		it("should return whether or not the current state is equal a specific state name", (done: DoneFn) => {
			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			routingService
				.navigateTo("page-01")
				.pipe(
					tap(() => {
						let isCurrentUIState: boolean = routingService.isCurrentUiState("page-01");
						expect(isCurrentUIState).toBe(true);

						isCurrentUIState = routingService.isCurrentUiState("otherState");
						expect(isCurrentUIState).toBe(false);
					}),
					catchError((error: any) => {
						return observableThrow("isCurrentUiState " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});

		it("should return whether or not the current state is equal a specific state name and parameters combination", (done: DoneFn) => {
			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			const requestId: string = "652d9053-32a0-457c-9eca-162cd301a4e8";

			routingService
				.navigateTo("page-01", { requestId: requestId, onBehalfView: true })
				.pipe(
					tap(() => {
						let isCurrentUIState: boolean = routingService.isCurrentUiState("page-01", {
							requestId: requestId,
							onBehalfView: true
						});
						expect(isCurrentUIState).toBe(true);

						isCurrentUIState = routingService.isCurrentUiState("otherState", {
							requestId: requestId,
							onBehalfView: true
						});
						expect(isCurrentUIState).toBe(false);

						isCurrentUIState = routingService.isCurrentUiState("page-01", {
							requestId: requestId,
							onBehalfView: false
						});
						expect(isCurrentUIState).toBe(false);
					}),
					catchError((error: any) => {
						return observableThrow("isCurrentUiState " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});
	});

	describe("navigateTo", () => {
		it("should navigate to the requested page", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			routingService
				.navigateTo("page-01")
				.pipe(
					tap((enteredState: StateObject) => {
						expect(enteredState).toBeDefined();
						expect(enteredState.name).toBe("page-01");
						expect($state.go).toHaveBeenCalledTimes(1);
						expect($state.go).toHaveBeenCalledWith("page-01", undefined, undefined);
					}),
					catchError((error: any) => {
						return observableThrow("navigateTo " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});

		it("should contain the options, when provided", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			routingService
				.navigateTo("page-01", undefined, { reload: true })
				.pipe(
					tap(() => {
						expect($state.go).toHaveBeenCalledTimes(1);
						expect($state.go).toHaveBeenCalledWith("page-01", undefined, { reload: true });
					}),
					catchError((error: any) => {
						return observableThrow("navigateTo " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});

		it("should navigate to a non-existing page", (done: DoneFn) => {
			spyOn($state, "go").and.returnValue(observableThrow("uh-oh").toPromise());

			routingService
				.navigateTo("whatever")
				.pipe(
					tap(() => {
						fail("whatever");
					}),
					catchError((error: any) => {
						return observableThrow(error);
					})
				)
				.subscribe(
					() => fail("it should not execute this code"),
					(error: any) => {
						expect(error).toEqual("uh-oh");
						done();
					}
				);
		});
	});

	describe("navigateToHome", () => {
		it("should navigate to the Home page", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			routingService
				.navigateToHome()
				.pipe(
					tap((enteredState: StateObject) => {
						expect(enteredState).toBeDefined();
						expect(enteredState.name).toBe("homepage");
						expect($state.go).toHaveBeenCalledTimes(1);
						expect($state.go).toHaveBeenCalledWith("homepage", undefined, undefined);
					}),
					catchError((error: any) => {
						return observableThrow("navigateToHome " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});

		it("should contain the params, when provided", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			const requestId: string = "652d9053-32a0-457c-9eca-162cd301a4e8";

			routingService
				.navigateTo("homepage", { requestId: requestId, onBehalfView: true })
				.pipe(
					tap(() => {
						expect($state.go).toHaveBeenCalledTimes(1);
						expect($state.go).toHaveBeenCalledWith(
							"homepage",
							{
								requestId: requestId,
								onBehalfView: true
							},
							undefined
						);

						const currentStateParams: any = routingService.getCurrentStateParams();
						expect(currentStateParams.requestId).toBeDefined();
						expect(currentStateParams.requestId).toBe(requestId);
						expect(currentStateParams.onBehalfView).toBeDefined();
						expect(currentStateParams.onBehalfView).toBe(true);
					}),
					catchError((error: any) => {
						return observableThrow("navigateToHome " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});
	});

	describe("navigateToPrevious", () => {
		it("should navigate to the previous page", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			routingService
				.navigateTo("homepage")
				.pipe(
					catchError((error: any) => {
						return observableThrow("navigateTo homepage " + error);
					}),
					switchMap(() => routingService.navigateTo("page-01")),
					catchError((error: any) => {
						return observableThrow("navigateTo page-01 " + error);
					}),
					switchMap(() => routingService.navigateTo("page-01-01")),
					catchError((error: any) => {
						return observableThrow("navigateTo page-01-01 " + error);
					}),
					switchMap(() => routingService.navigateToPrevious()),
					tap((enteredState: StateObject) => {
						expect(enteredState).toBeDefined();
						expect(enteredState.name).toBe("page-01");
						expect($state.go).toHaveBeenCalledTimes(4);
						expect($state.go).toHaveBeenCalledWith("page-01", undefined, undefined);
					}),
					catchError((error: any) => {
						return observableThrow("navigateToPrevious " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});
	});

	describe("reload", () => {
		it("should reload the current page", (done: DoneFn) => {
			spyOn($state, "transitionTo").and.callThrough();

			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			routingService
				.navigateTo("page-01")
				.pipe(
					catchError((error: any) => {
						return observableThrow("navigateTo homepage " + error);
					}),
					switchMap(() => routingService.reload()),
					tap((enteredState: StateObject) => {
						expect($state.transitionTo).toHaveBeenCalledTimes(2);
						expect(enteredState).toBeDefined();
						expect(enteredState.name).toBe("page-01");
					}),
					catchError((error: any) => {
						return observableThrow("reload " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});

		it("should reload the current page", (done: DoneFn) => {
			spyOn($state, "reload").and.returnValue(observableThrow("Reload has failed").toPromise());

			const statesConfig: StateDeclaration[] = $state.get();
			expect(statesConfig.length).toBe(numberOfMockStates); // UI-Router's root state + defined states

			routingService
				.navigateTo("page-01")
				.pipe(
					catchError((error: any) => {
						return observableThrow("navigateTo homepage " + error);
					}),
					switchMap(() => routingService.reload()),
					catchError((error: any) => {
						expect(error).toBe("Reload has failed");
						return observableThrow("reload " + error);
					})
				)
				.subscribe(() => () => fail("the test should not enter the next block"), () => done());
		});
	});

	describe("navigationErrorHandler", () => {
		it("should not navigate to a page when that page is already the current page", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			routingService
				.navigateTo("page-01")
				.pipe(
					catchError((error: any) => {
						return observableThrow("navigateTo page-01 " + error);
					}),
					switchMap(() => routingService.navigateTo("page-01")),
					catchError((error: any) => {
						return observableThrow("navigateTo page-01 " + error);
					}),
					tap((enteredState: StateObject) => {
						expect(mockLogger.warn).toHaveBeenCalledTimes(1);
						const message: string = (<Spy>mockLogger.warn).calls.argsFor(0)[0];
						expect(message).toMatch(/Route transition ignored/);

						expect(enteredState).toBeDefined();
						expect(enteredState.name).toBe("page-01");
						expect($state.go).toHaveBeenCalledTimes(2);
						expect($state.go).toHaveBeenCalledWith("page-01", undefined, undefined);
					}),
					catchError((error: any) => {
						return observableThrow("navigationErrorHandler " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});

		it("should cancel a navigation when another navigation is triggered before the first was completed", (done: DoneFn) => {
			spyOn($state, "go").and.callThrough();

			routingService.navigateTo("page-01");

			routingService
				.navigateTo("page-01-01")
				.pipe(
					catchError((error: any) => {
						return observableThrow("navigateTo page-01-01 " + error);
					}),
					tap((enteredState: StateObject) => {
						expect(mockLogger.warn).toHaveBeenCalledTimes(1);
						const message: string = (<Spy>mockLogger.warn).calls.argsFor(0)[0];
						expect(message).toMatch(/Route transition superseded/);

						expect(enteredState).toBeDefined();
						expect(enteredState.name).toBe("page-01-01");
						expect($state.go).toHaveBeenCalledTimes(2);
						expect($state.go).toHaveBeenCalledWith("page-01-01", undefined, undefined);
					}),
					catchError((error: any) => {
						return observableThrow("navigationErrorHandler " + error);
					})
				)
				.subscribe(() => done(), (error: any) => fail(error));
		});

		it("should not throw an error for a known navigation rejection cause", (done: DoneFn) => {
			routingService.addTransitionHook(StarkRoutingTransitionHook.ON_START, {}, () => {
				throw new Error("transition rejection");
			});

			routingService.addKnownNavigationRejectionCause("transition rejection");

			routingService
				.navigateTo("page-01")
				.pipe(
					catchError((error: any) => {
						expect(mockLogger.warn).toHaveBeenCalledTimes(1);
						const message: string = (<Spy>mockLogger.warn).calls.argsFor(0)[0];
						expect(message).toMatch(/Route transition rejected/);
						return observableThrow("navigationErrorHandler " + error);
					})
				)
				.subscribe(() => fail("this block should not be executed"), () => done());
		});

		it("should not log a known navigation rejection cause", (done: DoneFn) => {
			routingService.addTransitionHook(StarkRoutingTransitionHook.ON_START, {}, () => {
				throw new Error("transition rejection");
			});

			routingService
				.navigateTo("page-01")
				.pipe(
					catchError((error: any) => {
						expect(mockLogger.error).toHaveBeenCalledTimes(2);
						const message: string = (<Spy>mockLogger.error).calls.argsFor(0)[0];
						expect(message).toMatch(/Error during route transition/);
						return observableThrow("navigationErrorHandler " + error);
					})
				)
				.subscribe(() => fail("this block should not be executed"), () => done());
		});

		it("should log an warning if it is not a known navigation rejection cause", (done: DoneFn) => {
			routingService.addTransitionHook(StarkRoutingTransitionHook.ON_START, {}, () => {
				throw new Error("transition aborted");
			});

			routingService
				.navigateTo("page-01")
				.pipe(
					catchError((error: any) => {
						expect(mockLogger.warn).toHaveBeenCalledTimes(1);
						const message: string = (<Spy>mockLogger.warn).calls.argsFor(0)[0];
						expect(message).toMatch(/transition aborted/);
						return observableThrow("navigationErrorHandler " + error);
					})
				)
				.subscribe(() => fail("this block should not be executed"), () => done());
		});

		it("should log an error if it is not a known navigation rejection cause", (done: DoneFn) => {
			routingService.addTransitionHook(StarkRoutingTransitionHook.ON_START, {}, () => {
				throw new Error("resolve error");
			});

			routingService
				.navigateTo("page-01")
				.pipe(
					catchError((error: any) => {
						expect(mockLogger.error).toHaveBeenCalledTimes(2);
						const message: string = (<Spy>mockLogger.error).calls.argsFor(0)[0];
						expect(message).toMatch(/An error occurred with a resolve in the new state/);
						return observableThrow("navigationErrorHandler " + error);
					})
				)
				.subscribe(() => fail("this block should not be executed"), () => done());
		});

		it("should log an error if the state does not exist", (done: DoneFn) => {
			routingService
				.navigateTo("non-existing-page")
				.pipe(
					catchError((error: any) => {
						expect(mockLogger.error).toHaveBeenCalledTimes(1);
						const message: string = (<Spy>mockLogger.error).calls.argsFor(0)[0];
						expect(message).toMatch(/The target state does NOT exist/);
						return observableThrow("navigationErrorHandler " + error);
					})
				)
				.subscribe(() => fail("this block should not be executed"), () => done());
		});
	});

	describe("addKnownNavigationRejectionCause", () => {
		it("should return the current StateConfig instance where the router has navigated to", () => {
			const lengthBefore: number = routingService.knownRejectionCauses.length;
			routingService.addKnownNavigationRejectionCause("someRejectionCause");
			const lengthAfter: number = routingService.knownRejectionCauses.length;
			const latestRejectionCause: string = routingService.knownRejectionCauses[routingService.knownRejectionCauses.length - 1];

			expect(lengthBefore).toBe(lengthAfter - 1);
			expect(latestRejectionCause).toBe("someRejectionCause");
		});
	});

	describe("addTransitionHook", () => {
		it(
			"should call the ON_SUCCESS hook once upon successful navigation",
			fakeAsync(() => {
				const transitionHookSpy: any = jasmine.createSpy("successTest");
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_SUCCESS, {}, transitionHookSpy);
				routingService.navigateTo("homepage");

				// simulating the scope life cycle (so the angular watchers and bindings are triggered by the observable's values)
				tick();

				expect(transitionHookSpy).toHaveBeenCalledTimes(1);
			})
		);

		it(
			"should call the ON_ERROR hook when a routing transition is forced to fail",
			fakeAsync(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_START, {}, () => {
					// force the routing transition to fail
					return false;
				});

				const transitionErrorHookSpy: any = jasmine.createSpy("errorTest");
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_ERROR, {}, transitionErrorHookSpy);
				routingService.navigateTo("homepage");

				// simulating the scope life cycle (so the angular watchers and bindings are triggered by the observable's values)
				tick();

				// TODO we should investigate why the error hook is only called for valid navigation
				//
				// navigating to an existing page results in 2 dispatch calls
				//   dispatch calls: navigateTo + transitionObservable.next (also in navigateTo)
				//
				// navigating to a non-existing page results in 2 dispatch calls, but the error
				//   dispatch calls: navigateTo + this.$state.onInvalid
				//   any transaction is not called

				expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
				expect(transitionErrorHookSpy).toHaveBeenCalledTimes(1);
			})
		);

		it("should throw an error when an non-existing hook is used", () => {
			const transitionHookSpy: any = jasmine.createSpy("DoWhatever");

			expect(() => {
				routingService.addTransitionHook("NonExisting_Hook", {}, transitionHookSpy);
			}).toThrowError(/lifecycle hook unknown/);
		});

		it("should allow all available hooks to be added", () => {
			const transitionHookSpy: any = jasmine.createSpy("successTest");

			expect(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_BEFORE, {}, transitionHookSpy);
			}).not.toThrow();
			expect(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_START, {}, transitionHookSpy);
			}).not.toThrow();
			expect(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_EXIT, {}, transitionHookSpy);
			}).not.toThrow();
			expect(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_RETAIN, {}, transitionHookSpy);
			}).not.toThrow();
			expect(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_ENTER, {}, transitionHookSpy);
			}).not.toThrow();
			expect(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_FINISH, {}, transitionHookSpy);
			}).not.toThrow();
			expect(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_SUCCESS, {}, transitionHookSpy);
			}).not.toThrow();
			expect(() => {
				routingService.addTransitionHook(StarkRoutingTransitionHook.ON_ERROR, {}, transitionHookSpy);
			}).not.toThrow();
		});
	});

	describe("getStateTreeParams with NavigateTo", () => {
		it(
			"should return the state tree parameters for each visited page",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);

		it(
			"should return the state tree parameters when changing branch within Page-01 node",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: true }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);

		it(
			"should return the state tree parameters when changing to Page-02 branch",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-02-01",
						stateParams: { requestId: "Request-05", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-02-01",
						stateParams: { requestId: "Request-05", onBehalfView: true }
					},
					{
						stateName: "page-02",
						stateParams: undefined
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);
	});

	describe("getStateTreeParams with NavigateToPrevious", () => {
		it(
			"should return the state tree parameters for each visited page in same branch except the last one",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 1);
			})
		);

		it(
			"should return the state tree parameters when changing branch within Page-01 node except the last one",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 1);
			})
		);

		it(
			"should return the correct state tree names and parameters when switching branches except the last one",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-02",
						stateParams: undefined
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 1);
			})
		);

		it(
			"should return the correct state tree names and parameters when switching branches except the last two",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 2);
			})
		);

		it(
			"should return the correct state tree names and parameters when switching branches except the last one",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-06", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 1);
			})
		);

		it(
			"should return the correct state tree names and parameters when switching branches except the last two",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-06", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-02",
						stateParams: undefined
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 2);
			})
		);

		it(
			"should return the correct state tree names and parameters when switching branches except the last four",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-06", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 4);
			})
		);

		it(
			"should return the correct state tree names and parameters when switching branches except the last four",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: true }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: true }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-06", onBehalfView: true }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 5);
			})
		);
	});

	describe("Navigation History", () => {
		it(
			"should dispatch NAVIGATION_HISTORY_LIMIT_REACHED action, when the navigation history limit is reached",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-01",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-01-02-02",
						stateParams: { requestId: "Request-06", onBehalfView: false }
					},
					{
						stateName: "page-02",
						stateParams: { requestId: "Request-07", onBehalfView: false }
					},
					{
						stateName: "page-02-01",
						stateParams: { requestId: "Request-08", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams, 8);

				// expectedCalls
				// ==> 2 actions per navigation ("NAVIGATE" + "NAVIGATE_SUCCESS")
				// 8 successful navigations To => 8 x 2 = 16
				// 6 successful navigations ToPrevious => 6 x 2 = 12
				// 1 successful navigation ToPrevious with a warning => 3 ("NAVIGATION_HISTORY_LIMIT_REACHED" + "NAVIGATE" + "NAVIGATE_SUCCESS")
				// 1 unsuccessful navigations ToPrevious => 1 ("NAVIGATION_HISTORY_LIMIT_REACHED")

				const expectedCalls: number = 16 + 12 + 3 + 1;
				expect(mockStore.dispatch).toHaveBeenCalledTimes(expectedCalls);

				const actions: CallInfo[] = (<Spy>mockStore.dispatch).calls.all();
				const actionIndex: number = 16 + 12;

				for (let i: number = 0; i < actions.length; i++) {
					const action: CallInfo = actions[i];

					if (i === actionIndex) {
						expect(action.args[0].type).toBe(StarkRoutingActionTypes.NAVIGATION_HISTORY_LIMIT_REACHED);
					} else if (i <= actionIndex + 2) {
						expect(action.args[0].type).toContain(StarkRoutingActionTypes.NAVIGATE);
					} else {
						expect(action.args[0].type).toBe(StarkRoutingActionTypes.NAVIGATION_HISTORY_LIMIT_REACHED);
					}
				}
			})
		);
	});

	describe("getStateTreeParams", () => {
		it(
			"should return the name and parameters of each node in the state tree when navigating through the same branch (scenario 1)",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);

		it(
			"should return the name and parameters of each node in the state tree" + " when navigating to a sub branch (scenario 2)",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "page-01-02-02",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-02",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);

		it(
			"should return the name and parameters of each node in the state tree" +
				" after navigating the same path but with other params (scenario 3)",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: undefined
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-06", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-07", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-07", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-06", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: {}
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);

		it(
			"should return the name and parameters of each node in the state tree" + " after switching branches (scenario 4)",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "page-01-02-02",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-02-01",
						stateParams: { requestId: "Request-06", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-07", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-07", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);

		it(
			"should return the name and parameters of each node in the state tree" + " after switching branches (scenario 5)",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "page-02-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-02-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					},
					{
						stateName: "page-02",
						stateParams: undefined
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);
	});

	describe("getStateTreeParams in combination with NavigateToHome", () => {
		it(
			"should return the state tree name and parameters of the homepage",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "homepage",
						stateParams: {}
					}
				];

				for (const navigationStep of navigationSteps) {
					routingService.navigateTo(navigationStep.stateName, navigationStep.stateParams);
					tick();
				}

				navigationSteps.push({
					stateName: "homepage",
					stateParams: undefined
				});

				routingService.navigateToHome();
				tick();

				const stateTreeParams: Map<string, any> = routingService.getStateTreeParams();

				expect(stateTreeParams.size).toBe(expectedStateTreeParams.length);

				let index: number = 0;
				stateTreeParams.forEach((stateParams: any, stateName: string) => {
					expect(stateName).toBe(expectedStateTreeParams[index].stateName);
					expect(stateParams).toEqual(expectedStateTreeParams[index].stateParams);
					index++;
				});
			})
		);
	});

	describe("getStateTreeParams in combination with NavigateToPrevious", () => {
		it(
			"should return the state tree name and parameters of each node in the state tree",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "page-02-01",
						stateParams: { requestId: "Request-05", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				for (const navigationStep of navigationSteps) {
					routingService.navigateTo(navigationStep.stateName, navigationStep.stateParams);
					tick();
				}

				routingService.navigateToPrevious();
				tick();

				const stateTreeParams: Map<string, any> = routingService.getStateTreeParams();

				expect(stateTreeParams.size).toBe(expectedStateTreeParams.length);

				let index: number = 0;
				stateTreeParams.forEach((stateParams: any, stateName: string) => {
					expect(stateName).toBe(expectedStateTreeParams[index].stateName);
					expect(stateParams).toEqual(expectedStateTreeParams[index].stateParams);
					index++;
				});
			})
		);
	});

	describe("getStateTreeParams in combination with NagivateToHome and NavigateToPrevious", () => {
		it(
			"should return the state tree name and parameters of each node in the state tree",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				for (const navigationStep of navigationSteps) {
					routingService.navigateTo(navigationStep.stateName, navigationStep.stateParams);
					tick();
				}

				routingService.navigateToHome();
				tick();

				routingService.navigateToPrevious();
				tick();

				const stateTreeParams: Map<string, any> = routingService.getStateTreeParams();

				expect(stateTreeParams.size).toBe(expectedStateTreeParams.length);

				let index: number = 0;
				stateTreeParams.forEach((stateParams: any, stateName: string) => {
					expect(stateName).toBe(expectedStateTreeParams[index].stateName);
					expect(stateParams).toEqual(expectedStateTreeParams[index].stateParams);
					index++;
				});
			})
		);
	});

	describe("getStateTreeParams with abstract pages", () => {
		it(
			"should not navigate to an abstract page",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-03",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					}
				];

				const expectedStateTreeParams: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				TestStateTreeParams(navigationSteps, expectedStateTreeParams);
			})
		);
	});

	describe("getStateTreeResolves", () => {
		it(
			"should return the name, parameters and parent of each node in the state tree",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					}
				];

				const expectedStateTreeResolves: any = [
					{
						name: "page-01-02-01",
						resolvableData: undefined
					},
					{
						name: "page-01-02",
						resolvableData: undefined
					},
					{
						name: "page-01",
						resolvableData: { translationKey: "PAGE.01.FROM.RESOLVE" }
					},
					{
						name: "homepage",
						resolvableData: { availableHolidays: 22 }
					}
				];

				TestStateTreeResolves(navigationSteps, expectedStateTreeResolves);
			})
		);

		it(
			"should return the name, parameters and parent of each node in the state tree",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					}
				];

				const expectedStateTreeResolves: any = [
					{
						name: "homepage",
						resolvableData: { availableHolidays: 22 }
					}
				];

				TestStateTreeResolves(navigationSteps, expectedStateTreeResolves);
			})
		);
	});

	describe("getStateTreeData", () => {
		it(
			"should return the name, parameters and parent of each node in the state tree",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					}
				];

				const expectedStateTreeResolves: any = [
					{
						name: "page-01-02-01",
						data: undefined
					},
					{
						name: "page-01-02",
						data: { translationKey: "PAGE.01.02", pageTitleColor: "black", pageTitleFontSize: 14 }
					},
					{
						name: "page-01",
						data: { translationKey: "PAGE.01", pageTitleColor: "dark blue", pageTitleFontSize: 16 }
					},
					{
						name: "homepage",
						data: { translationKey: "HOME", pageTitleColor: "blue", pageTitleFontSize: 20 }
					}
				];

				TestStateTreeData(navigationSteps, expectedStateTreeResolves);
			})
		);
	});

	describe("getTranslationKeyFromState", () => {
		it(
			"should return the translationKey from the data of each node in the state tree",
			fakeAsync(() => {
				const navigationSteps: any = [
					{
						stateName: "homepage",
						stateParams: { requestId: "Request-01", onBehalfView: false }
					},
					{
						stateName: "page-01",
						stateParams: { requestId: "Request-02", onBehalfView: false }
					},
					{
						stateName: "page-01-02",
						stateParams: { requestId: "Request-03", onBehalfView: false }
					},
					{
						stateName: "page-01-02-01",
						stateParams: { requestId: "Request-04", onBehalfView: false }
					}
				];

				const expectedTranslationKeys: any = [
					{
						name: "page-01-02-01",
						translationKey: "page-01-02-01"
					},
					{
						name: "page-01-02",
						translationKey: "PAGE.01.02"
					},
					{
						name: "page-01",
						translationKey: "PAGE.01.FROM.RESOLVE"
					},
					{
						name: "homepage",
						translationKey: "HOME"
					}
				];

				TestTranslationKey(navigationSteps, expectedTranslationKeys);
			})
		);
	});
});
