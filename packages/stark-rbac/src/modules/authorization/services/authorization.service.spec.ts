/* tslint:disable:completed-docs no-big-function*/
import { of, throwError } from "rxjs";
import { Store } from "@ngrx/store";
import { fakeAsync, tick } from "@angular/core/testing";
import { HookMatchCriteria, Predicate, RawParams, StateDeclaration, StateOrName, TargetState, Transition } from "@uirouter/core";
import {
	StarkLoggingService,
	StarkRoutingService,
	StarkRoutingTransitionHook,
	StarkSessionService,
	StarkUser
} from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService, MockStarkSessionService } from "@nationalbankbelgium/stark-core/testing";

import { StarkRBACStatePermissions, StarkStateRedirection, StarkStateRedirectionFn } from "../entities";
import { StarkRBACAuthorizationServiceImpl, starkUnauthorizedUserError } from "./authorization.service";
import { StarkUserNavigationUnauthorized, StarkUserNavigationUnauthorizedRedirected } from "../actions/authorization.actions";
import createSpyObj = jasmine.createSpyObj;
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

describe("StarkRBACAuthorizationService", () => {
	let mockStore: Store<any>;
	let mockLogger: MockStarkLoggingService;
	let mockSessionService: MockStarkSessionService;
	let mockRoutingService: MockStarkRoutingService;
	let authorizationService: AuthorizationServiceHelper;
	const dummyRole: string = "super user";
	const dummyUnauthorizedStateName: string = "unauthorized state";

	function getMockTransitionTargetStateWithPermissions(mockPermissions: StarkRBACStatePermissions): StateDeclaration {
		return {
			data: {
				permissions: mockPermissions
			}
		};
	}

	beforeEach(() => {
		mockStore = createSpyObj("store", ["dispatch", "select"]);
		mockLogger = new MockStarkLoggingService();
		mockSessionService = new MockStarkSessionService();
		mockRoutingService = new MockStarkRoutingService();
		authorizationService = new AuthorizationServiceHelper(mockLogger, mockSessionService, mockRoutingService, mockStore);
	});

	describe("initializeService", () => {
		it("should subscribe to the getCurrentUser$ observable to get the current user from the Stark User service", () => {
			const mockUser: Partial<StarkUser> = { roles: [] };
			mockSessionService.getCurrentUser.and.returnValue(of(<StarkUser>mockUser));
			expect(authorizationService.user).toBeUndefined();

			authorizationService.initializeService();

			expect(authorizationService.user).toBe(<StarkUser>mockUser);
		});

		it("should throw an error if the getCurrentUser$ observable emits an error", fakeAsync(() => {
			mockSessionService.getCurrentUser.and.returnValue(throwError("dummy error"));
			expect(authorizationService.user).toBeUndefined();

			expect(() => {
				authorizationService.initializeService();
				tick(); // to force async error to be thrown
			}).toThrowError(/error while getting the user profile/);

			expect(authorizationService.user).toBeUndefined();
		}));

		it("should call registerTransitionHook function", () => {
			const mockUser: Partial<StarkUser> = { roles: [] };
			mockSessionService.getCurrentUser.and.returnValue(of(<StarkUser>mockUser));
			spyOn(authorizationService, "registerTransitionHook");

			authorizationService.initializeService();

			expect(authorizationService.registerTransitionHook).toHaveBeenCalledTimes(1);
		});
	});

	describe("registerTransitionHook", () => {
		it("should add transitionHook (onStart) matching all states with permissions except starkAppInit/starkAppExit children", () => {
			authorizationService.registerTransitionHook();

			expect(mockRoutingService.addTransitionHook).toHaveBeenCalledTimes(1);
			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_START);

			const hookMatchCriteria: HookMatchCriteria = mockRoutingService.addTransitionHook.calls.argsFor(0)[1];

			expect(hookMatchCriteria.entering).toBeDefined();

			const matchingFn: Predicate<any> = <Predicate<any>>hookMatchCriteria.entering;
			const nonMatchingStates: object[] = [
				{ name: "starkAppInit.state1" },
				{ name: "starkAppInit.state2", data: {} },
				{ name: "starkAppInit.stateX", data: { whatever: {} } },
				{ name: "starkAppExit.state1" },
				{ name: "starkAppExit.state2" },
				{ name: "starkAppExit.stateX" },
				{ abstract: true, name: "" } // root state
			];
			const matchingStates: object[] = [
				{ name: "whatever.state1", data: { permissions: { only: [] } } },
				{ name: "other.state2", data: { permissions: { except: [] } } },
				{ name: "stateX", data: { permissions: {} } }
			];

			for (const state of matchingStates) {
				expect(matchingFn(state)).toBe(true);
			}

			for (const state of nonMatchingStates) {
				expect(matchingFn(state)).toBe(false);
			}

			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[2]).toBeDefined();
			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[3]).toEqual({ priority: 900 });
		});

		it("should resolve the promise when the onStart hook is triggered and the current user IS authorized", () => {
			authorizationService.registerTransitionHook();

			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_START);
			const onStartHookCallback: Function = mockRoutingService.addTransitionHook.calls.argsFor(0)[2];

			spyOn(authorizationService, "isNavigationAuthorized").and.returnValue(true);
			spyOn(authorizationService, "handleUnauthorizedNavigation");

			const mockPermissions: StarkRBACStatePermissions = {
				only: [""]
			};
			const mockTransition: Partial<Transition> = {
				to: () => getMockTransitionTargetStateWithPermissions(mockPermissions)
			};

			// trigger the onStart hook callback
			const hookResult: boolean = onStartHookCallback(mockTransition);
			expect(hookResult).toBe(true);

			expect(authorizationService.isNavigationAuthorized).toHaveBeenCalledTimes(1);
			expect(authorizationService.isNavigationAuthorized).toHaveBeenCalledWith(mockPermissions);
			expect(authorizationService.handleUnauthorizedNavigation).not.toHaveBeenCalled();
		});

		it("should reject the promise with the value returned by handleUnauthorizedNavigation() when the user is NOT authorized", () => {
			authorizationService.registerTransitionHook();

			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_START);
			const onStartHookCallback: Function = mockRoutingService.addTransitionHook.calls.argsFor(0)[2];

			spyOn(authorizationService, "isNavigationAuthorized").and.returnValue(false);
			spyOn(authorizationService, "handleUnauthorizedNavigation").and.returnValue(<any>"dummy rejection value");

			const mockPermissions: StarkRBACStatePermissions = {
				only: [""]
			};
			const mockTransition: Partial<Transition> = {
				to: () => getMockTransitionTargetStateWithPermissions(mockPermissions)
			};

			// trigger the onStart hook callback
			const hookResult: string = onStartHookCallback(mockTransition);
			expect(hookResult).toBe("dummy rejection value");

			expect(authorizationService.isNavigationAuthorized).toHaveBeenCalledTimes(1);
			expect(authorizationService.isNavigationAuthorized).toHaveBeenCalledWith(mockPermissions);
			expect(authorizationService.handleUnauthorizedNavigation).toHaveBeenCalledTimes(1);
			expect(authorizationService.handleUnauthorizedNavigation).toHaveBeenCalledWith(mockPermissions, mockTransition);
		});
	});

	describe("hasRole", () => {
		it("should return true only if the current user has the given role", () => {
			const authorizedRole: string = dummyRole;
			const unauthorizedRole: string = "simple mortal";
			const mockUserWithRoles: Partial<StarkUser> = {
				roles: [dummyRole, "manager"]
			};
			authorizationService.user = <StarkUser>mockUserWithRoles;

			expect(authorizationService.hasRole(authorizedRole)).toBe(true);
			expect(authorizationService.hasRole(unauthorizedRole)).toBe(false);
		});

		it("should return false when the given role is empty or undefined", () => {
			const mockUserWithRoles: Partial<StarkUser> = {
				roles: [dummyRole, "manager", "", "   "] // empty string is not a valid role!
			};
			authorizationService.user = <StarkUser>mockUserWithRoles;

			expect(authorizationService.hasRole("   ")).toBe(false);
			expect(authorizationService.hasRole(<any>undefined)).toBe(false);
		});

		it("should return false when there is no current user defined or it has no roles", () => {
			const someRole: string = "whatever";
			authorizationService.user = <any>undefined;

			expect(authorizationService.hasRole(someRole)).toBe(false);

			const mockUserWithEmptyRoles: Partial<StarkUser> = { roles: [] };

			authorizationService.user = <StarkUser>mockUserWithEmptyRoles;

			expect(authorizationService.hasRole(someRole)).toBe(false);
		});
	});

	describe("hasAnyRole", () => {
		it("should return true only if the current user has ANY of the given roles", () => {
			const authorizedRoles: string[] = [dummyRole, "admin"];
			const unauthorizedRoles: string[] = ["simple mortal", "get out of here"];
			let mockUserWithRoles: Partial<StarkUser> = {
				roles: [dummyRole, "manager"]
			};
			authorizationService.user = <StarkUser>mockUserWithRoles;

			expect(authorizationService.hasAnyRole(authorizedRoles)).toBe(true);
			expect(authorizationService.hasAnyRole(unauthorizedRoles)).toBe(false);

			mockUserWithRoles = {
				roles: ["vip", "admin"]
			};
			authorizationService.user = <StarkUser>mockUserWithRoles;

			expect(authorizationService.hasAnyRole(authorizedRoles)).toBe(true);
			expect(authorizationService.hasAnyRole(unauthorizedRoles)).toBe(false);
		});

		it("should return false when the given roles are empty or undefined", () => {
			const mockUserWithRoles: Partial<StarkUser> = {
				roles: [dummyRole, "manager", "", "   "] // empty string is not a valid role!
			};
			authorizationService.user = <StarkUser>mockUserWithRoles;

			expect(authorizationService.hasAnyRole([])).toBe(false);
			expect(authorizationService.hasAnyRole(["", "   "])).toBe(false);
			expect(authorizationService.hasAnyRole(<any>undefined)).toBe(false);
		});

		it("should return false when there is no current user defined or it has no roles", () => {
			const someRoles: string[] = ["whatever"];
			authorizationService.user = <any>undefined;

			expect(authorizationService.hasAnyRole(someRoles)).toBe(false);

			const mockUserWithEmptyRoles: Partial<StarkUser> = { roles: [] };

			authorizationService.user = <StarkUser>mockUserWithEmptyRoles;

			expect(authorizationService.hasAnyRole(someRoles)).toBe(false);
		});
	});

	describe("isAnonymous", () => {
		it("should return true only if the current user has isAnonymous property set to TRUE", () => {
			let mockUserAnonymous: Partial<StarkUser> = { isAnonymous: true };
			authorizationService.user = <StarkUser>mockUserAnonymous;

			expect(authorizationService.isAnonymous()).toBe(true);

			mockUserAnonymous = { isAnonymous: false };
			authorizationService.user = <StarkUser>mockUserAnonymous;

			expect(authorizationService.isAnonymous()).toBe(false);

			mockUserAnonymous = { isAnonymous: undefined };
			authorizationService.user = <StarkUser>mockUserAnonymous;

			expect(authorizationService.isAnonymous()).toBe(false);

			mockUserAnonymous = {};
			authorizationService.user = <StarkUser>mockUserAnonymous;

			expect(authorizationService.isAnonymous()).toBe(false);
		});

		it("should return false when there is no current user defined", () => {
			authorizationService.user = <any>undefined;

			expect(authorizationService.isAnonymous()).toBe(false);
		});
	});

	describe("isNavigationAuthorized", () => {
		it("should call hasAnyRole() with the permissions 'only' if they are defined and return the value returned by that function", () => {
			const mockPermissions: StarkRBACStatePermissions = {
				only: ["dummyRole", "superRole"]
			};
			spyOn(authorizationService, "hasAnyRole").and.returnValues(true, false);

			let result: boolean = authorizationService.isNavigationAuthorized(mockPermissions);

			expect(result).toBe(true);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledTimes(1);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledWith(mockPermissions.only);

			(<Spy>authorizationService.hasAnyRole).calls.reset();
			result = authorizationService.isNavigationAuthorized(mockPermissions);

			expect(result).toBe(false);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledTimes(1);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledWith(mockPermissions.only);
		});

		it("should call hasAnyRole() with the permissions 'except' if they are defined and return the INVERTED value that is returned", () => {
			const mockPermissions: StarkRBACStatePermissions = {
				except: ["dummyRole", "superRole"]
			};
			spyOn(authorizationService, "hasAnyRole").and.returnValues(true, false);

			let result: boolean = authorizationService.isNavigationAuthorized(mockPermissions);

			expect(result).toBe(false); // inverted value of what hasAnyRole returns => 'except'
			expect(authorizationService.hasAnyRole).toHaveBeenCalledTimes(1);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledWith(mockPermissions.except);

			(<Spy>authorizationService.hasAnyRole).calls.reset();
			result = authorizationService.isNavigationAuthorized(mockPermissions);

			expect(result).toBe(true); // inverted value of what hasAnyRole returns => 'except'
			expect(authorizationService.hasAnyRole).toHaveBeenCalledTimes(1);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledWith(mockPermissions.except);
		});

		it("should give preference to permissions 'only' over 'except' when both are defined and call hasAnyRole() with those", () => {
			const mockPermissions: StarkRBACStatePermissions = {
				only: ["dummyRole", "superRole"],
				except: ["don't care"]
			};
			spyOn(authorizationService, "hasAnyRole").and.returnValues(true, false);

			let result: boolean = authorizationService.isNavigationAuthorized(mockPermissions);

			expect(result).toBe(true);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledTimes(1);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledWith(mockPermissions.only);

			(<Spy>authorizationService.hasAnyRole).calls.reset();
			result = authorizationService.isNavigationAuthorized(mockPermissions);

			expect(result).toBe(false);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledTimes(1);
			expect(authorizationService.hasAnyRole).toHaveBeenCalledWith(mockPermissions.only);
		});

		it("should return true without calling hasAnyRole() when the permissions object has invalid 'only' nor 'except' or is undefined", () => {
			const undefinedStatePermissionsStr: string = "could not find 'only' or 'except'";

			spyOn(authorizationService, "hasAnyRole");

			const mockPermissionsArray: StarkRBACStatePermissions[] = [
				{},
				{ only: <any>"not an array" },
				{ except: <any>"not an array" },
				{ redirectTo: { stateName: "", params: {} } },
				<any>undefined
			];

			for (const mockPermissions of mockPermissionsArray) {
				mockLogger.warn.calls.reset();

				const result: boolean = authorizationService.isNavigationAuthorized(mockPermissions);

				expect(result).toBe(true);
				expect(authorizationService.hasAnyRole).not.toHaveBeenCalled();

				if (typeof mockPermissions !== "undefined") {
					expect(mockLogger.warn).toHaveBeenCalledTimes(1);
					expect(mockLogger.warn.calls.argsFor(0)[0]).toContain(undefinedStatePermissionsStr);
				} else {
					// if the permissions object is undefined, no warning is logged
					expect(mockLogger.warn).not.toHaveBeenCalled();
				}
			}
		});
	});

	describe("handleUnauthorizedNavigation", () => {
		it("should log a warning and return the value of redirectNavigation() in case permissions object has 'redirectTo' defined", () => {
			const mockPermissions: StarkRBACStatePermissions = {
				redirectTo: {
					stateName: "dummy redirection state",
					params: { someParam: "whatever" }
				}
			};
			const mockTransition: Partial<Transition> = {};
			spyOn(authorizationService, "redirectNavigation").and.returnValue(<any>"dummy redirection return value");

			const result: any = authorizationService.handleUnauthorizedNavigation(mockPermissions, <Transition>mockTransition);

			expect(result).toBe(<any>"dummy redirection return value");
			expect(authorizationService.redirectNavigation).toHaveBeenCalledTimes(1);
			expect(authorizationService.redirectNavigation).toHaveBeenCalledWith(mockPermissions.redirectTo, mockTransition);
			expect(mockLogger.warn).toHaveBeenCalledTimes(1);
			expect(mockLogger.warn).toHaveBeenCalledWith(starkUnauthorizedUserError);
			expect(mockStore.dispatch).not.toHaveBeenCalled();
		});

		it("should dispatch a FAILURE action and throw an error when permissions object is undefined ot it has no 'redirectTo' defined", () => {
			let mockPermissions: StarkRBACStatePermissions = {};
			const targetStateObj: any = {
				name: createSpy("spyNameFn").and.returnValue(dummyUnauthorizedStateName)
			};
			const mockTransition: Partial<Transition> = {
				targetState: createSpy("spyTargetStateFn").and.returnValue(targetStateObj)
			};
			spyOn(authorizationService, "redirectNavigation");

			expect(() => {
				authorizationService.handleUnauthorizedNavigation(mockPermissions, <Transition>mockTransition);
			}).toThrowError(starkUnauthorizedUserError);

			expect(authorizationService.redirectNavigation).not.toHaveBeenCalled();
			expect(mockLogger.warn).toHaveBeenCalledTimes(1);
			expect(mockLogger.warn).toHaveBeenCalledWith(starkUnauthorizedUserError);
			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(new StarkUserNavigationUnauthorized(dummyUnauthorizedStateName));

			mockPermissions = <any>undefined;
			mockLogger.warn.calls.reset();

			expect(() => {
				authorizationService.handleUnauthorizedNavigation(mockPermissions, <Transition>mockTransition);
			}).toThrowError(starkUnauthorizedUserError);

			expect(authorizationService.redirectNavigation).not.toHaveBeenCalled();
			expect(mockLogger.warn).toHaveBeenCalledTimes(1);
			expect(mockLogger.warn).toHaveBeenCalledWith(starkUnauthorizedUserError);
		});
	});

	describe("redirectNavigation", () => {
		// mock target state
		let targetStateObj: any;
		let mockTransition: Partial<Transition>;
		const mockRedirectToObj: StarkStateRedirection = {
			stateName: "dummy redirection state",
			params: { someParam: "whatever" }
		};

		beforeEach(() => {
			targetStateObj = {
				redirectionStateName: undefined, // custom prop
				redirectionStateParams: undefined, // custom prop
				redirectionStateParamsReplaced: undefined, // custom prop
				// name() function as defined in the Ui-Router API
				name: createSpy("spyNameFn").and.returnValue(dummyUnauthorizedStateName),
				// withState() function as defined in the Ui-Router API
				withState: createSpy("spyWithStateFn").and.callFake(
					(state: StateOrName): TargetState => {
						targetStateObj.redirectionStateName = state;
						return targetStateObj;
					}
				),
				// withParams() function as defined in the Ui-Router API
				withParams: createSpy("spyWithParamsFn").and.callFake(
					(params: RawParams, replace: boolean): TargetState => {
						targetStateObj.redirectionStateParams = params;
						targetStateObj.redirectionStateParamsReplaced = replace;
						return targetStateObj;
					}
				)
			};

			mockTransition = {
				targetState: createSpy("spyTargetStateFn").and.returnValue(targetStateObj)
			};
		});

		it("should log a warning, dispatch REDIRECTED action and return a redirection state based on permissions 'redirectTo' object", () => {
			const result: TargetState = authorizationService.redirectNavigation(mockRedirectToObj, <Transition>mockTransition);

			expect(result).toBe(targetStateObj);
			expect(result["redirectionStateName"]).toBe(mockRedirectToObj.stateName);
			expect(result["redirectionStateParams"]).toBe(mockRedirectToObj.params);
			expect(result["redirectionStateParamsReplaced"]).toBe(true);
			expect(mockTransition.targetState).toHaveBeenCalledTimes(1);
			expect(targetStateObj.withState).toHaveBeenCalledTimes(1);
			expect(targetStateObj.withState).toHaveBeenCalledWith(mockRedirectToObj.stateName);
			expect(targetStateObj.withParams).toHaveBeenCalledTimes(1);
			expect(targetStateObj.withParams).toHaveBeenCalledWith(mockRedirectToObj.params, true);
			expect(mockLogger.warn).toHaveBeenCalledTimes(1);
			expect(mockLogger.warn.calls.argsFor(0)[0]).toContain("redirecting");
			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(
				new StarkUserNavigationUnauthorizedRedirected(dummyUnauthorizedStateName, mockRedirectToObj.stateName)
			);
		});

		it("should log a warning, dispatch REDIRECTED action and return a redirection state based on permissions 'redirectTo' function", () => {
			const mockRedirectToFn: StarkStateRedirectionFn = createSpy("spyTargetStateFn").and.returnValue(mockRedirectToObj);

			const result: TargetState = authorizationService.redirectNavigation(mockRedirectToFn, <Transition>mockTransition);
			expect(result).toBe(targetStateObj);
			expect(result["redirectionStateName"]).toBe(mockRedirectToObj.stateName);
			expect(result["redirectionStateParams"]).toBe(mockRedirectToObj.params);
			expect(result["redirectionStateParamsReplaced"]).toBe(true);
			expect(mockRedirectToFn).toHaveBeenCalledTimes(1);
			expect(mockRedirectToFn).toHaveBeenCalledWith(mockTransition);
			expect(mockTransition.targetState).toHaveBeenCalledTimes(1);
			expect(targetStateObj.withState).toHaveBeenCalledTimes(1);
			expect(targetStateObj.withState).toHaveBeenCalledWith(mockRedirectToObj.stateName);
			expect(targetStateObj.withParams).toHaveBeenCalledTimes(1);
			expect(targetStateObj.withParams).toHaveBeenCalledWith(mockRedirectToObj.params, true);
			expect(mockLogger.warn).toHaveBeenCalledTimes(1);
			expect(mockLogger.warn.calls.argsFor(0)[0]).toContain("redirecting");
			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(
				new StarkUserNavigationUnauthorizedRedirected(dummyUnauthorizedStateName, mockRedirectToObj.stateName)
			);
		});
	});
});

class AuthorizationServiceHelper extends StarkRBACAuthorizationServiceImpl {
	public constructor(
		logger: StarkLoggingService,
		sessionService: StarkSessionService,
		routingService: StarkRoutingService,
		store: Store<any>
	) {
		super(logger, sessionService, routingService, store);
	}

	public registerTransitionHook(): void {
		super.registerTransitionHook();
	}

	public isNavigationAuthorized(permissions: StarkRBACStatePermissions): boolean {
		return super.isNavigationAuthorized(permissions);
	}

	public handleUnauthorizedNavigation(permissions: StarkRBACStatePermissions, transition: Transition): TargetState {
		return super.handleUnauthorizedNavigation(permissions, transition);
	}

	public redirectNavigation(redirectTo: StarkStateRedirection | StarkStateRedirectionFn, transition: Transition): TargetState {
		return super.redirectNavigation(redirectTo, transition);
	}
}
