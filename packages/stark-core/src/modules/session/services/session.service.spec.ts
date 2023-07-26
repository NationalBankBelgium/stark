/* eslint-disable @typescript-eslint/unbound-method */
import { HttpHeaders, HttpRequest } from "@angular/common/http";
import { EventEmitter, Injector } from "@angular/core";
import { DEFAULT_INTERRUPTSOURCES, Idle, InterruptSource } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { HookMatchCriteria, Predicate, StateObject } from "@uirouter/core";

import { defer, Observable, of, Subject, Subscriber, throwError } from "rxjs";
import { take } from "rxjs/operators";

import { StarkSessionActions } from "../actions";
import { StarkSessionServiceImpl, starkUnauthenticatedUserError } from "./session.service";
import { StarkSession, StarkSessionConfig } from "../entities";
import { StarkApplicationConfig, StarkApplicationConfigImpl } from "../../../configuration/entities/application";
import { StarkUser } from "../../user/entities";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkRoutingTransitionHook } from "../../routing/services";
import { StarkCoreApplicationState } from "../../../common/store";
import { starkAppExitStateName, starkAppInitStateName, starkSessionExpiredStateName } from "../constants";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;

describe("Service: StarkSessionService", () => {
	let mockStore: SpyObj<Store<StarkCoreApplicationState>>;
	let appConfig: StarkApplicationConfig;
	let mockSession: StarkSession;
	let mockLogger: MockStarkLoggingService;
	let mockRoutingService: MockStarkRoutingService;
	let mockIdleService: SpyObj<Idle>;
	let mockKeepaliveService: SpyObj<Keepalive>;
	let mockInjectorService: SpyObj<Injector>;
	let mockTranslateService: SpyObj<TranslateService>;
	let sessionService: SessionServiceHelper;
	const mockCorrelationId = "12345";
	const mockCorrelationIdHeaderName = "The-Correlation-Id";
	const mockUser: StarkUser = {
		uuid: "1",
		username: "jdoe",
		firstName: "john",
		lastName: "doe",
		email: "jdoe@email.com",
		language: "es",
		workpost: "dummy workpost",
		referenceNumber: "dummy ref number",
		roles: ["a role", "another role", "yet another role"]
	};
	const mockSessionConfig: StarkSessionConfig = {
		sessionExpiredStateName: starkAppExitStateName + ".mock-session-expired-state-name"
	};

	// Inject module dependencies
	beforeEach(() => {
		mockSession = { currentLanguage: "NL", user: mockUser };
		mockStore = jasmine.createSpyObj<Store<StarkCoreApplicationState>>("store", ["dispatch", "pipe"]);
		mockStore.pipe.and.returnValue(of(mockSession));
		appConfig = new StarkApplicationConfigImpl();
		appConfig.sessionTimeout = 123;
		appConfig.sessionTimeoutWarningPeriod = 13;
		appConfig.keepAliveInterval = 45;
		appConfig.keepAliveUrl = "http://my.backend/keepalive";
		appConfig.logoutUrl = "http://localhost:5000/logout";
		appConfig.publicApp = false;

		mockLogger = new MockStarkLoggingService(mockCorrelationId, mockCorrelationIdHeaderName);
		mockRoutingService = new MockStarkRoutingService();
		mockIdleService = jasmine.createSpyObj<Idle>("idleService,", [
			"setIdle",
			"setTimeout",
			"getTimeout",
			"setInterrupts",
			"clearInterrupts",
			"getKeepaliveEnabled",
			"watch",
			"stop",
			"clearInterrupts"
		]);
		mockIdleService.onIdleStart = new EventEmitter<any>();
		mockIdleService.onIdleEnd = new EventEmitter<any>();
		mockIdleService.onTimeout = new EventEmitter<number>();
		mockIdleService.onTimeoutWarning = new EventEmitter<number>();
		mockKeepaliveService = jasmine.createSpyObj<Keepalive>("keepaliveService,", ["interval", "request", "ping", "stop"]);
		mockKeepaliveService.onPing = new EventEmitter<any>();
		mockInjectorService = jasmine.createSpyObj<Injector>("injector,", ["get"]);
		mockTranslateService = jasmine.createSpyObj<TranslateService>("translateService,", ["use"]);
		sessionService = new SessionServiceHelper(
			mockStore,
			mockLogger,
			mockRoutingService,
			appConfig,
			mockIdleService,
			mockInjectorService,
			mockTranslateService,
			mockSessionConfig
		);
		mockIdleService.setIdle.calls.reset();
		mockIdleService.setTimeout.calls.reset();
		mockIdleService.setInterrupts.calls.reset();
		mockIdleService.clearInterrupts.calls.reset();
		mockRoutingService.addTransitionHook.calls.reset();
	});

	describe("on initialization", () => {
		it("should throw an error in case the session timeout in the app config is invalid", () => {
			const invalidSessionTimeoutValues: number[] = [<any>undefined, -1];

			for (const invalidSessionTimeout of invalidSessionTimeoutValues) {
				appConfig.sessionTimeout = invalidSessionTimeout;
				appConfig.sessionTimeoutWarningPeriod = 13;

				expect(
					() =>
						new SessionServiceHelper(
							mockStore,
							mockLogger,
							mockRoutingService,
							appConfig,
							mockIdleService,
							mockInjectorService,
							mockTranslateService,
							mockSessionConfig
						)
				).toThrowError(/sessionTimeout/);
			}
		});

		it("should throw an error in case the session config object contains invalid initial states", () => {
			const invalidSessionConfigValues: StarkSessionConfig[] = [
				{ loginStateName: "someLoginState" },
				{ loginStateName: "" },
				{ loginStateName: starkAppInitStateName },
				{ loginStateName: starkAppInitStateName + "." },
				{ loginStateName: starkAppExitStateName + ".someLoginState" },
				{ preloadingStateName: "somePreloadingState" },
				{ preloadingStateName: "" },
				{ preloadingStateName: starkAppInitStateName },
				{ preloadingStateName: starkAppInitStateName + "." },
				{ preloadingStateName: starkAppExitStateName + ".somePreloadingState" }
			];

			for (const invalidSessionConfig of invalidSessionConfigValues) {
				expect(
					() =>
						new SessionServiceHelper(
							mockStore,
							mockLogger,
							mockRoutingService,
							appConfig,
							mockIdleService,
							mockInjectorService,
							mockTranslateService,
							invalidSessionConfig
						)
				).toThrowError(/invalid StarkSessionConfig(.*)initial state/);
			}
		});

		it("should throw an error in case the session config object contains invalid exit states", () => {
			const invalidSessionConfigValues: StarkSessionConfig[] = [
				{ sessionExpiredStateName: "someSessionExpiredState" },
				{ sessionExpiredStateName: "" },
				{ sessionExpiredStateName: starkAppExitStateName },
				{ sessionExpiredStateName: starkAppExitStateName + "." },
				{ sessionExpiredStateName: starkAppInitStateName + ".someSessionExpiredState" },
				{ sessionLogoutStateName: "someSessionExpiredState" },
				{ sessionLogoutStateName: "" },
				{ sessionLogoutStateName: starkAppExitStateName },
				{ sessionLogoutStateName: starkAppExitStateName + "." },
				{ sessionLogoutStateName: starkAppInitStateName + ".someSessionExpiredState" }
			];

			for (const invalidSessionConfig of invalidSessionConfigValues) {
				expect(
					() =>
						new SessionServiceHelper(
							mockStore,
							mockLogger,
							mockRoutingService,
							appConfig,
							mockIdleService,
							mockInjectorService,
							mockTranslateService,
							invalidSessionConfig
						)
				).toThrowError(/invalid StarkSessionConfig(.*)exit state/);
			}
		});

		it("should throw an error in case the warning period in the app config is invalid", () => {
			const invalidSessionTimeoutWarningPeriodValues: number[] = [<any>undefined, -1];

			for (const invalidSessionTimeoutWarningPeriod of invalidSessionTimeoutWarningPeriodValues) {
				appConfig.sessionTimeout = 123;
				appConfig.sessionTimeoutWarningPeriod = invalidSessionTimeoutWarningPeriod;

				expect(
					() =>
						new SessionServiceHelper(
							mockStore,
							mockLogger,
							mockRoutingService,
							appConfig,
							mockIdleService,
							mockInjectorService,
							mockTranslateService,
							mockSessionConfig
						)
				).toThrowError(/sessionTimeoutWarning/);
			}
		});
	});

	describe("registerTransitionHook", () => {
		it("should add transitionHook (onBefore) to the RoutingService matching all states except starkAppInit/starkAppExit children", () => {
			sessionService.registerTransitionHook();

			expect(mockRoutingService.addTransitionHook).toHaveBeenCalledTimes(1);
			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_BEFORE);

			const hookMatchCriteria: HookMatchCriteria = mockRoutingService.addTransitionHook.calls.argsFor(0)[1];

			expect(hookMatchCriteria.entering).toBeDefined();

			const matchingFn = <Predicate<StateObject>>hookMatchCriteria.entering;
			const nonMatchingStates: Partial<StateObject>[] = [
				{ name: "starkAppInit.state1" },
				{ name: "starkAppInit.state2" },
				{ name: "starkAppInit.stateX" },
				{ name: "starkAppExit.state1" },
				{ name: "starkAppExit.state2" },
				{ name: "starkAppExit.stateX" },
				{ abstract: true, name: "" } // root state
			];
			const matchingStates: Partial<StateObject>[] = [
				{ name: "whatever.state1" },
				{ name: "other.state2" },
				{ name: "stateX" },
				{ name: <any>undefined }
			];

			for (const state of matchingStates) {
				expect(matchingFn(<StateObject>state)).toBe(true);
			}

			for (const state of nonMatchingStates) {
				expect(matchingFn(<StateObject>state)).toBe(false);
			}

			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[2]).toBeDefined();
			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[3]).toEqual({ priority: 1000 });
		});

		it("should resolve the promise when the onBefore hook is triggered and there IS user in the session", () => {
			sessionService.registerTransitionHook();

			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_BEFORE);
			const onBeforeHookCallback: (...args: any[]) => Promise<boolean> = <(...args: any[]) => Promise<boolean>>(
				mockRoutingService.addTransitionHook.calls.argsFor(0)[2]
			);

			sessionService.session$ = of(mockSession);

			// trigger the onBefore hook callback
			defer(() => onBeforeHookCallback()).subscribe(
				(result: boolean) => {
					expect(result).toBe(true);
				},
				() => {
					fail("The 'error' function should not be called in case of success");
				}
			);
		});

		it("should reject the promise with an error when the onBefore hook is triggered and there is NO user in the session", () => {
			const sessionWithoutUser: StarkSession = { ...mockSession, user: undefined };
			sessionService.session$ = of(sessionWithoutUser);

			sessionService.registerTransitionHook();

			expect(mockRoutingService.addTransitionHook.calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_BEFORE);
			const onBeforeHookCallback: Function = mockRoutingService.addTransitionHook.calls.argsFor(0)[2];

			// trigger the onBefore hook callback
			defer(() => onBeforeHookCallback()).subscribe(
				() => {
					fail("The 'next' function should not be called in case of an http error");
				},
				(error: Error) => {
					expect(error.message).toBe(starkUnauthenticatedUserError);
				}
			);
		});
	});

	describe("initializeSession", () => {
		it("should start the idle and keepalive services and dispatch the corresponding actions", () => {
			spyOn(sessionService, "startIdleService");
			spyOn(sessionService, "startKeepaliveService");

			sessionService.initializeSession(mockUser);

			expect(sessionService.startIdleService).toHaveBeenCalledTimes(1);
			expect(sessionService.startKeepaliveService).toHaveBeenCalledTimes(1);

			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
			expect(mockStore.dispatch.calls.argsFor(0)[0]).toEqual(StarkSessionActions.initializeSession({ user: mockUser }));
			expect(mockStore.dispatch.calls.argsFor(1)[0]).toEqual(StarkSessionActions.initializeSessionSuccess());
		});
	});

	describe("destroySession", () => {
		it("should stop the idle and keepalive services and dispatch the corresponding actions", () => {
			spyOn(sessionService, "stopIdleService");
			spyOn(sessionService, "stopKeepaliveService");

			sessionService.destroySession();

			expect(sessionService.stopIdleService).toHaveBeenCalledTimes(1);
			expect(sessionService.stopKeepaliveService).toHaveBeenCalledTimes(1);

			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
			expect(mockStore.dispatch.calls.argsFor(0)[0]).toEqual(StarkSessionActions.destroySession());
			expect(mockStore.dispatch.calls.argsFor(1)[0]).toEqual(StarkSessionActions.destroySessionSuccess());
		});
	});

	describe("login", () => {
		it("should call the initializeSession() method passing the given user", () => {
			spyOn(sessionService, "initializeSession");

			sessionService.login(mockUser);

			expect(sessionService.initializeSession).toHaveBeenCalledTimes(1);
			expect(sessionService.initializeSession).toHaveBeenCalledWith(mockUser);
		});

		it("should THROW an error and NOT call the initializeSession() method when the given user is invalid", () => {
			const invalidUser: StarkUser = new StarkUser();
			invalidUser.firstName = "Christopher";
			spyOn(sessionService, "initializeSession");

			expect(() => sessionService.login(invalidUser)).toThrowError(/invalid user/);

			expect(sessionService.initializeSession).not.toHaveBeenCalled();
		});
	});

	describe("logout", () => {
		it("should dispatch the SESSION_LOGOUT action and send the logout HTTP request asynchronously ", () => {
			spyOn(sessionService, "destroySession");
			const sendLogoutRequestSpy: Spy = spyOn(sessionService, "sendLogoutRequest").and.returnValue(of(undefined)); // HTTP 200

			sessionService.logout();

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch.calls.mostRecent().args[0]).toEqual(StarkSessionActions.sessionLogout());

			expect(sendLogoutRequestSpy).toHaveBeenCalledTimes(1);
			expect(sendLogoutRequestSpy.calls.mostRecent().args[0]).toBe(appConfig.logoutUrl);
			expect(sendLogoutRequestSpy.calls.mostRecent().args[1]).toBe("");
			expect(sendLogoutRequestSpy.calls.mostRecent().args[2]).toBe(true);

			expect(sessionService.destroySession).toHaveBeenCalledTimes(1);
		});

		it("should call the destroySession() method only when the logout HTTP request has returned a response (either success or error)", () => {
			spyOn(sessionService, "destroySession");
			const logoutHttpResponse$: Subject<void> = new Subject();
			const sendLogoutRequestSpy: Spy = spyOn(sessionService, "sendLogoutRequest").and.returnValue(
				logoutHttpResponse$.asObservable()
			);

			sessionService.logout();

			expect(sendLogoutRequestSpy).toHaveBeenCalledTimes(1);
			expect(sendLogoutRequestSpy.calls.mostRecent().args[0]).toBe(appConfig.logoutUrl);
			expect(sendLogoutRequestSpy.calls.mostRecent().args[1]).toBe("");
			expect(sendLogoutRequestSpy.calls.mostRecent().args[2]).toBe(true);
			expect(sessionService.destroySession).not.toHaveBeenCalled();

			logoutHttpResponse$.next(); // HTTP 200

			expect(sessionService.destroySession).toHaveBeenCalledTimes(1);
			(<Spy>sessionService.destroySession).calls.reset();
			expect(sessionService.destroySession).not.toHaveBeenCalled();

			logoutHttpResponse$.error("HTTP 500");

			expect(sessionService.destroySession).toHaveBeenCalledTimes(1);

			logoutHttpResponse$.complete();
		});
	});

	describe("pauseUserActivityTracking", () => {
		it("should call the idle service to clear the interrupts temporarily and dispatch the corresponding action", () => {
			sessionService.pauseUserActivityTracking();

			expect(mockIdleService.clearInterrupts).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkSessionActions.userActivityTrackingPause());
		});
	});

	describe("resumeUserActivityTracking", () => {
		it("should re-set the interrupts from the idle service and then re-start the idle and keepalive services and dispatch the action", () => {
			const interruptsToBeSet: InterruptSource[] = DEFAULT_INTERRUPTSOURCES;
			spyOn(sessionService, "startIdleService");
			spyOn(sessionService, "startKeepaliveService");

			sessionService.resumeUserActivityTracking();

			expect(mockIdleService.setInterrupts).toHaveBeenCalledTimes(1);
			expect(mockIdleService.setInterrupts).toHaveBeenCalledWith(interruptsToBeSet);

			expect(sessionService.startIdleService).toHaveBeenCalledTimes(1);
			expect(sessionService.startKeepaliveService).toHaveBeenCalledTimes(1);

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkSessionActions.userActivityTrackingResume());
		});
	});

	describe("configureIdleService", () => {
		it("should set the necessary options of the idle service", () => {
			const interruptsToBeSet: InterruptSource[] = DEFAULT_INTERRUPTSOURCES;

			sessionService.configureIdleService();

			expect(mockIdleService.setIdle).toHaveBeenCalledTimes(1);
			expect(mockIdleService.setIdle).toHaveBeenCalledWith(appConfig.sessionTimeout - appConfig.sessionTimeoutWarningPeriod);

			expect(mockIdleService.setTimeout).toHaveBeenCalledTimes(1);
			expect(mockIdleService.setTimeout).toHaveBeenCalledWith(appConfig.sessionTimeoutWarningPeriod);

			expect(mockIdleService.setInterrupts).toHaveBeenCalledTimes(1);
			expect(mockIdleService.setInterrupts).toHaveBeenCalledWith(interruptsToBeSet);
		});

		it("should throw an error if the warning period is equal or higher than the session timeout in the app config", () => {
			appConfig.sessionTimeout = 30;
			appConfig.sessionTimeoutWarningPeriod = 30;

			expect(() => sessionService.configureIdleService()).toThrowError(/sessionTimeoutWarningPeriod/);

			appConfig.sessionTimeout = 30;
			appConfig.sessionTimeoutWarningPeriod = 31;

			expect(() => sessionService.configureIdleService()).toThrowError(/sessionTimeoutWarningPeriod/);
		});

		describe("onIdleStart notifications", () => {
			it("should be received by subscribing to the onIdleStart observable from the idle service", () => {
				mockIdleService.onIdleStart = new EventEmitter<any>();
				expect(mockIdleService.onIdleStart.observers.length).toBe(0);

				sessionService.configureIdleService();

				expect(mockIdleService.onIdleStart.observers.length).toBe(1);

				const onIdleStartSubscriber: Subscriber<any> = <Subscriber<any>>mockIdleService.onIdleStart.observers[0];
				spyOn(onIdleStartSubscriber, "next");
				spyOn(onIdleStartSubscriber, "error");

				mockIdleService.onIdleStart.next("some start value");

				expect(onIdleStartSubscriber.next).toHaveBeenCalledTimes(1);
				expect(onIdleStartSubscriber.next).toHaveBeenCalledWith("some start value");
				expect(onIdleStartSubscriber.error).not.toHaveBeenCalled();

				mockIdleService.onIdleStart.complete();
			});
		});

		describe("onIdleEnd notifications", () => {
			it("should be received by subscribing to the onIdleEnd observable from the idle service", () => {
				mockIdleService.onIdleEnd = new EventEmitter<any>();
				expect(mockIdleService.onIdleEnd.observers.length).toBe(0);

				sessionService.configureIdleService();

				expect(mockIdleService.onIdleEnd.observers.length).toBe(1);

				const mockIdleEndValue = "some end value";
				const onIdleEndSubscriber: Subscriber<any> = <Subscriber<any>>mockIdleService.onIdleEnd.observers[0];
				spyOn(onIdleEndSubscriber, "next");
				spyOn(onIdleEndSubscriber, "error");

				mockIdleService.onIdleEnd.next(mockIdleEndValue);

				expect(onIdleEndSubscriber.next).toHaveBeenCalledTimes(1);
				expect(onIdleEndSubscriber.next).toHaveBeenCalledWith(mockIdleEndValue);
				expect(onIdleEndSubscriber.error).not.toHaveBeenCalled();

				mockIdleService.onIdleEnd.complete();
			});

			it("should dispatch the COUNTDOWN_STOP action and only if the countdown was started", () => {
				mockIdleService.onIdleEnd = new EventEmitter<any>();
				expect(mockIdleService.onIdleEnd.observers.length).toBe(0);

				sessionService.configureIdleService();

				sessionService.countdownStarted = false;
				mockIdleService.onIdleEnd.next("some end value");

				expect(sessionService.countdownStarted).toBe(false);
				expect(mockStore.dispatch).not.toHaveBeenCalled();

				sessionService.countdownStarted = true;
				mockIdleService.onIdleEnd.next("another end value");

				expect(sessionService.countdownStarted).toBe(false);
				expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
				expect(mockStore.dispatch.calls.argsFor(0)[0]).toEqual(StarkSessionActions.sessionTimeoutCountdownStop());

				mockIdleService.onIdleEnd.complete();
			});
		});

		describe("onTimeout notifications", () => {
			it("should be received by subscribing to the onTimeout observable from the idle service", () => {
				mockIdleService.onTimeout = new EventEmitter<number>();
				expect(mockIdleService.onTimeout.observers.length).toBe(0);

				sessionService.configureIdleService();

				expect(mockIdleService.onTimeout.observers.length).toBe(1);

				const onTimeoutSubscriber: Subscriber<any> = <Subscriber<any>>mockIdleService.onTimeout.observers[0];
				spyOn(onTimeoutSubscriber, "next");
				spyOn(onTimeoutSubscriber, "error");

				mockIdleService.onTimeout.next(321);

				expect(onTimeoutSubscriber.next).toHaveBeenCalledTimes(1);
				expect(onTimeoutSubscriber.next).toHaveBeenCalledWith(321);
				expect(onTimeoutSubscriber.error).not.toHaveBeenCalled();

				mockIdleService.onTimeout.complete();
			});

			it("should dispatch the COUNTDOWN_FINISH action, trigger the logout and navigate to the starkSessionExpired state", () => {
				sessionService = new SessionServiceHelper(
					mockStore,
					mockLogger,
					mockRoutingService,
					appConfig,
					mockIdleService,
					mockInjectorService,
					mockTranslateService,
					{} // default empty session config
				);

				spyOn(sessionService, "logout");

				mockIdleService.onTimeout = new EventEmitter<number>();
				expect(mockIdleService.onTimeout.observers.length).toBe(0);

				sessionService.configureIdleService();

				mockIdleService.onTimeout.next(321);

				expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
				expect(mockStore.dispatch.calls.argsFor(0)[0]).toEqual(StarkSessionActions.sessionTimeoutCountdownFinish());
				expect(sessionService.logout).toHaveBeenCalledTimes(1);
				expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
				expect(mockRoutingService.navigateTo).toHaveBeenCalledWith(starkSessionExpiredStateName);

				mockIdleService.onTimeout.complete();
			});

			it("should dispatch the COUNTDOWN_FINISH action, trigger the logout and navigate to the SessionExpired state set in the injected sessionConfig", () => {
				spyOn(sessionService, "logout");

				mockIdleService.onTimeout = new EventEmitter<number>();
				expect(mockIdleService.onTimeout.observers.length).toBe(0);

				sessionService.configureIdleService();

				mockIdleService.onTimeout.next(321);

				expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
				expect(mockStore.dispatch.calls.argsFor(0)[0]).toEqual(StarkSessionActions.sessionTimeoutCountdownFinish());
				expect(sessionService.logout).toHaveBeenCalledTimes(1);
				expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
				expect(mockRoutingService.navigateTo).toHaveBeenCalledWith(<string>mockSessionConfig.sessionExpiredStateName);

				mockIdleService.onTimeout.complete();
			});
		});

		describe("onTimeoutWarning notifications", () => {
			it("should be received by subscribing to the onTimeoutWarning observable from the idle service", () => {
				mockIdleService.onTimeoutWarning = new EventEmitter<number>();
				expect(mockIdleService.onTimeoutWarning.observers.length).toBe(0);

				sessionService.configureIdleService();

				expect(mockIdleService.onTimeoutWarning.observers.length).toBe(1);

				const onTimeoutWarningSubscriber: Subscriber<any> = <Subscriber<any>>mockIdleService.onTimeoutWarning.observers[0];
				spyOn(onTimeoutWarningSubscriber, "next");
				spyOn(onTimeoutWarningSubscriber, "error");

				mockIdleService.onTimeoutWarning.next(10);

				expect(onTimeoutWarningSubscriber.next).toHaveBeenCalledTimes(1);
				expect(onTimeoutWarningSubscriber.next).toHaveBeenCalledWith(10);
				expect(onTimeoutWarningSubscriber.error).not.toHaveBeenCalled();

				mockIdleService.onTimeoutWarning.complete();
			});

			it("should dispatch the COUNTDOWN_START action only when the value emitted is the first one of the countdown", () => {
				mockIdleService.onTimeoutWarning = new EventEmitter<number>();
				expect(mockIdleService.onTimeoutWarning.observers.length).toBe(0);
				const countdownStartValue = 22;
				mockIdleService.getTimeout.and.returnValue(countdownStartValue);

				sessionService.configureIdleService();

				sessionService.countdownStarted = false;
				mockIdleService.onTimeoutWarning.next(10);

				expect(sessionService.countdownStarted).toBe(false);
				expect(mockStore.dispatch).not.toHaveBeenCalled();

				mockIdleService.onTimeoutWarning.next(countdownStartValue);

				expect(sessionService.countdownStarted).toBe(true);
				expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
				expect(mockStore.dispatch.calls.argsFor(0)[0]).toEqual(
					StarkSessionActions.sessionTimeoutCountdownStart({ countdown: countdownStartValue })
				);

				mockIdleService.onTimeoutWarning.complete();
			});
		});
	});

	describe("configureKeepaliveService", () => {
		beforeEach(() => {
			// eslint-disable-next-line import/no-deprecated
			mockInjectorService.get.and.returnValue(mockKeepaliveService);
			mockIdleService.getKeepaliveEnabled.and.returnValue(true);
		});

		it("should set the necessary options and headers of the keepalive service if it is ENABLED", () => {
			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService,
				mockSessionConfig
			);

			expect(sessionServiceHelper.keepalive).toBeDefined();
			mockKeepaliveService.interval.calls.reset();
			mockKeepaliveService.request.calls.reset();

			const expectedDevAuthHeaders: Map<string, string> = new Map<string, string>();
			expectedDevAuthHeaders.set("usernameTestHeader", mockUser.username);
			expectedDevAuthHeaders.set("firstnameTestHeader", mockUser.firstName);
			expectedDevAuthHeaders.set("lastnameTestHeader", mockUser.lastName);
			expectedDevAuthHeaders.set("emailTestHeader", <string>mockUser.email);

			sessionServiceHelper.setDevAuthenticationHeaders(expectedDevAuthHeaders);
			sessionServiceHelper.configureKeepaliveService();

			expect(mockKeepaliveService.interval).toHaveBeenCalledTimes(1);
			expect(mockKeepaliveService.interval).toHaveBeenCalledWith(appConfig.keepAliveInterval);
			expect(mockKeepaliveService.request).toHaveBeenCalledTimes(1);

			let mockHeadersObj: HttpHeaders = new HttpHeaders();
			expectedDevAuthHeaders.forEach((value: string, key: string) => {
				mockHeadersObj = mockHeadersObj.set(key, value);
			});
			mockHeadersObj = mockHeadersObj.set(mockCorrelationIdHeaderName, mockCorrelationId);

			expect(<HttpRequest<void>>(<unknown>mockKeepaliveService.request)).toHaveBeenCalledWith(
				new HttpRequest<void>("GET", <string>appConfig.keepAliveUrl, { headers: mockHeadersObj })
			);
		});

		it("should NOT set the correlationId headers to the keepalive Http request if the correlation id is undefined", () => {
			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService,
				mockSessionConfig
			);

			expect(sessionServiceHelper.keepalive).toBeDefined();
			mockKeepaliveService.interval.calls.reset();
			mockKeepaliveService.request.calls.reset();

			const expectedDevAuthHeaders: Map<string, string> = new Map<string, string>();
			expectedDevAuthHeaders.set("usernameTestHeader", mockUser.username);
			expectedDevAuthHeaders.set("firstnameTestHeader", mockUser.firstName);
			expectedDevAuthHeaders.set("lastnameTestHeader", mockUser.lastName);
			expectedDevAuthHeaders.set("emailTestHeader", <string>mockUser.email);

			(<any>mockLogger)["correlationId"] = undefined;
			sessionServiceHelper.setDevAuthenticationHeaders(expectedDevAuthHeaders);
			sessionServiceHelper.configureKeepaliveService();

			expect(mockKeepaliveService.interval).toHaveBeenCalledTimes(1);
			expect(mockKeepaliveService.interval).toHaveBeenCalledWith(appConfig.keepAliveInterval);
			expect(mockKeepaliveService.request).toHaveBeenCalledTimes(1);

			let mockHeadersObj: HttpHeaders = new HttpHeaders();
			expectedDevAuthHeaders.forEach((value: string, key: string) => {
				mockHeadersObj = mockHeadersObj.set(key, value);
			});

			expect(<HttpRequest<void>>(<unknown>mockKeepaliveService.request)).toHaveBeenCalledWith(
				new HttpRequest<void>("GET", <string>appConfig.keepAliveUrl, { headers: mockHeadersObj })
			);
		});

		it("should not set any option of the keepalive service if it is DISABLED", () => {
			mockIdleService.getKeepaliveEnabled.and.returnValue(false);

			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService,
				mockSessionConfig
			);

			expect(sessionServiceHelper.keepalive).toBeUndefined();
			mockKeepaliveService.interval.calls.reset();
			mockKeepaliveService.request.calls.reset();

			sessionServiceHelper.configureKeepaliveService();

			expect(mockKeepaliveService.interval).not.toHaveBeenCalled();
			expect(mockKeepaliveService.request).not.toHaveBeenCalled();
		});

		describe("onPing notifications", () => {
			it("should be listened by subscribing to the observable from the Keepalive service", () => {
				const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
					mockStore,
					mockLogger,
					mockRoutingService,
					appConfig,
					mockIdleService,
					mockInjectorService,
					mockTranslateService,
					mockSessionConfig
				);

				mockKeepaliveService.onPing = new EventEmitter<any>();
				expect(mockKeepaliveService.onPing.observers.length).toBe(0);

				sessionServiceHelper.configureKeepaliveService();

				expect(mockKeepaliveService.onPing.observers.length).toBe(1);

				const onPingSubscriber: Subscriber<any> = <Subscriber<any>>mockKeepaliveService.onPing.observers[0];
				spyOn(onPingSubscriber, "next");
				spyOn(onPingSubscriber, "error");

				mockKeepaliveService.onPing.next("some ping value");

				expect(onPingSubscriber.next).toHaveBeenCalledTimes(1);
				expect(onPingSubscriber.next).toHaveBeenCalledWith("some ping value");
				expect(onPingSubscriber.error).not.toHaveBeenCalled();
			});
		});
	});

	describe("startIdleService", () => {
		it("should call the watch() method from Idle service to start watching for inactivity", () => {
			sessionService.startIdleService();

			expect(sessionService.idle.watch).toHaveBeenCalledTimes(1);
		});
	});

	describe("stopIdleService", () => {
		it("should call the stop() method from Idle service to stop watching for inactivity and clear all interrupt sources", () => {
			sessionService.stopIdleService();

			expect(sessionService.idle.stop).toHaveBeenCalledTimes(1);
			expect(sessionService.idle.clearInterrupts).toHaveBeenCalledTimes(1);
		});
	});

	describe("startKeepaliveService", () => {
		it("should trigger a ping using the Keepalive service", () => {
			// eslint-disable-next-line import/no-deprecated
			mockInjectorService.get.and.returnValue(mockKeepaliveService);
			mockIdleService.getKeepaliveEnabled.and.returnValue(true);

			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService,
				mockSessionConfig
			);

			sessionServiceHelper.startKeepaliveService();

			expect((<Keepalive>sessionServiceHelper.keepalive).ping).toHaveBeenCalledTimes(1);
		});

		it("should do NOTHING in case the Keepalive service is DISABLED", () => {
			mockIdleService.getKeepaliveEnabled.and.returnValue(false);

			sessionService.startKeepaliveService();

			expect(sessionService.keepalive).toBeUndefined();
		});
	});

	describe("stopKeepaliveService", () => {
		it("should call the stop() method from the Keepalive service to stop the keepalive ping requests", () => {
			// eslint-disable-next-line import/no-deprecated
			mockInjectorService.get.and.returnValue(mockKeepaliveService);
			mockIdleService.getKeepaliveEnabled.and.returnValue(true);

			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService,
				mockSessionConfig
			);

			sessionServiceHelper.stopKeepaliveService();

			expect((<Keepalive>sessionServiceHelper.keepalive).stop).toHaveBeenCalledTimes(1);
		});

		it("should do NOTHING in case the keepalive service is DISABLED", () => {
			mockIdleService.getKeepaliveEnabled.and.returnValue(false);

			sessionService.stopKeepaliveService();

			expect(sessionService.keepalive).toBeUndefined();
		});
	});

	describe("getCurrentUser", () => {
		it("should get the current user in an observable", () => {
			sessionService
				.getCurrentUser()
				.pipe(take(1))
				.subscribe((user?: StarkUser) => {
					expect(user).toBe(mockUser);
				});
		});
	});

	describe("getCurrentLanguage", () => {
		it("should get the current language in an observable", () => {
			sessionService
				.getCurrentLanguage()
				.pipe(take(1))
				.subscribe((language: string) => {
					expect(language).toBe("NL");
				});
		});
	});

	describe("setCurrentLanguage", () => {
		it("should change the language successfully and dispatch the SUCCESS action", () => {
			mockTranslateService.use.and.returnValue(of("FR"));

			sessionService.setCurrentLanguage("FR");

			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
			expect(mockStore.dispatch.calls.argsFor(0)[0]).toEqual(StarkSessionActions.changeLanguage({ languageId: "FR" }));
			expect(mockStore.dispatch.calls.argsFor(1)[0]).toEqual(StarkSessionActions.changeLanguageSuccess({ languageId: "FR" }));

			expect(mockTranslateService.use).toHaveBeenCalledTimes(1);
			expect(mockTranslateService.use).toHaveBeenCalledWith("FR");
		});

		it("should not change the language in case of failure and dispatch the FAILURE action", () => {
			mockTranslateService.use.and.returnValue(throwError("dummy error"));

			sessionService.setCurrentLanguage("FR");

			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
			expect(mockStore.dispatch.calls.argsFor(0)[0]).toEqual(StarkSessionActions.changeLanguage({ languageId: "FR" }));
			expect(mockStore.dispatch.calls.argsFor(1)[0]).toEqual(StarkSessionActions.changeLanguageFailure({ error: "dummy error" }));

			expect(mockTranslateService.use).toHaveBeenCalledTimes(1);
			expect(mockTranslateService.use).toHaveBeenCalledWith("FR");
		});
	});

	describe("setDevAuthenticationHeaders", () => {
		it("should construct the dev authentication headers based on the http headers that are passed", () => {
			expect(sessionService["_devAuthenticationHeaders"] instanceof Map).toBeTruthy();

			const expectedDevAuthHeaders: Map<string, string> = new Map<string, string>();
			expectedDevAuthHeaders.set("usernameTestHeader", mockUser.username);
			expectedDevAuthHeaders.set("firstnameTestHeader", mockUser.firstName);
			expectedDevAuthHeaders.set("lastnameTestHeader", mockUser.lastName);
			expectedDevAuthHeaders.set("emailTestHeader", <string>mockUser.email);

			sessionService.setDevAuthenticationHeaders(expectedDevAuthHeaders);
			expect(sessionService["_devAuthenticationHeaders"]).toBeDefined();
			expect(sessionService.devAuthenticationHeaders.size).toBe(4);

			expectedDevAuthHeaders.forEach((value: string, key: string) => {
				expect(sessionService.devAuthenticationHeaders.has(key)).toBe(true);
				expect(sessionService.devAuthenticationHeaders.get(key)).toBe(value);
			});
		});

		it("should construct the dev authentication headers excluding those http headers with undefined or null names or values", () => {
			expect(sessionService["_devAuthenticationHeaders"] instanceof Map).toBeTruthy();

			const expectedDevAuthHeaders: Map<string, string> = new Map<string, string>();
			expectedDevAuthHeaders.set("usernameTestHeader", mockUser.username);
			expectedDevAuthHeaders.set("firstnameTestHeader", mockUser.firstName);
			expectedDevAuthHeaders.set("lastnameTestHeader", <any>undefined);
			// eslint-disable-next-line no-null/no-null
			expectedDevAuthHeaders.set("emailTestHeader", <any>null);
			expectedDevAuthHeaders.set(<any>undefined, "dummy value");
			// eslint-disable-next-line no-null/no-null
			expectedDevAuthHeaders.set(<any>null, "another dummy value");

			sessionService.setDevAuthenticationHeaders(expectedDevAuthHeaders);
			expect(sessionService["_devAuthenticationHeaders"]).toBeDefined();
			expect(sessionService.devAuthenticationHeaders.size).toBe(2);

			expectedDevAuthHeaders.forEach((value: string, key: string) => {
				if (key === "usernameTestHeader" || key === "firstnameTestHeader") {
					expect(sessionService.devAuthenticationHeaders.has(key)).toBe(true);
					expect(sessionService.devAuthenticationHeaders.get(key)).toBe(value);
				} else {
					expect(sessionService.devAuthenticationHeaders.has(key)).toBe(false);
				}
			});
		});
	});

	describe("devAuthenticationHeaders", () => {
		it("should return the pre-authentication headers if they were constructed", () => {
			const expectedDevAuthHeaders: Map<string, string | string[]> = new Map<string, string | string[]>();
			expectedDevAuthHeaders.set("usernameTestHeader", "doej");
			expectedDevAuthHeaders.set("firstnameTestHeader", "john");
			expectedDevAuthHeaders.set("lastTestHeader", "doe");
			expectedDevAuthHeaders.set("emailTestHeader", ["jdoe@mail.com", "john.d@email.com"]);

			sessionService.setInternalDevAuthenticationHeaders(expectedDevAuthHeaders);

			const devAuthenticationHeaders: Map<string, string | string[]> = sessionService.devAuthenticationHeaders;

			expect(devAuthenticationHeaders.size).toBe(expectedDevAuthHeaders.size);

			expectedDevAuthHeaders.forEach((value: string | string[], header: string) => {
				expect(expectedDevAuthHeaders.has(header)).toBe(true);
				expect(expectedDevAuthHeaders.get(header)).toBe(value);
			});
		});
	});
});

class SessionServiceHelper extends StarkSessionServiceImpl {
	public constructor(
		store: SpyObj<Store<StarkCoreApplicationState>>,
		logger: MockStarkLoggingService,
		routingService: MockStarkRoutingService,
		appConfig: StarkApplicationConfig,
		idle: SpyObj<Idle>,
		injector: Injector,
		translateService: SpyObj<TranslateService>,
		sessionConfig: StarkSessionConfig
	) {
		super(
			<Store<StarkCoreApplicationState>>(<unknown>store),
			logger,
			routingService,
			appConfig,
			<Idle>(<unknown>idle),
			injector,
			<TranslateService>(<unknown>translateService),
			sessionConfig
		);
	}

	public override registerTransitionHook(): void {
		super.registerTransitionHook();
	}

	public override initializeSession(user: StarkUser): void {
		super.initializeSession(user);
	}

	public override destroySession(): void {
		super.destroySession();
	}

	public override configureIdleService(): void {
		super.configureIdleService();
	}

	public override startIdleService(): void {
		super.startIdleService();
	}

	public override stopIdleService(): void {
		super.stopIdleService();
	}

	public override startKeepaliveService(): void {
		super.startKeepaliveService();
	}

	public override stopKeepaliveService(): void {
		super.stopKeepaliveService();
	}

	public override setDevAuthenticationHeaders(devAuthenticationHeaders: Map<string, string>): void {
		super.setDevAuthenticationHeaders(devAuthenticationHeaders);
	}

	// override parent's implementation to prevent actual HTTP request to be sent!
	public override sendLogoutRequest(): Observable<void> {
		/* dummy function to be mocked */
		return of(undefined);
	}

	public setInternalDevAuthenticationHeaders(headers?: Map<string, string | string[]>): void {
		this._devAuthenticationHeaders = <any>headers;
	}
}
