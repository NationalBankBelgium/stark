import { HttpHeaders, HttpRequest } from "@angular/common/http";
import { EventEmitter, Injector } from "@angular/core";
import { DEFAULT_INTERRUPTSOURCES, Idle, InterruptSource } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { HookMatchCriteria, Predicate } from "@uirouter/core";

import { defer, Observable, of, Subject, Subscriber, throwError } from "rxjs";
import { take } from "rxjs/operators";

import {
	StarkChangeLanguage,
	StarkChangeLanguageFailure,
	StarkChangeLanguageSuccess,
	StarkDestroySession,
	StarkDestroySessionSuccess,
	StarkInitializeSession,
	StarkInitializeSessionSuccess,
	StarkSessionLogout,
	StarkSessionTimeoutCountdownFinish,
	StarkSessionTimeoutCountdownStart,
	StarkSessionTimeoutCountdownStop,
	StarkUserActivityTrackingPause,
	StarkUserActivityTrackingResume
} from "../actions";
import { StarkSessionServiceImpl, starkUnauthenticatedUserError } from "./session.service";
import { StarkPreAuthentication, StarkSession } from "../entities";
import { StarkApplicationConfig, StarkApplicationConfigImpl } from "../../../configuration/entities/application";
import { StarkUser } from "../../user/entities";
import { StarkLoggingService } from "../../logging/services";
import { MockStarkLoggingService } from "../../logging/testing";
import { StarkRoutingService, StarkRoutingTransitionHook } from "../../routing/services";
import { MockStarkRoutingService } from "../../routing/testing";
import { StarkHttpHeaders } from "../../http/constants";
import { starkSessionExpiredStateName } from "../../../common/routes";
import { StarkCoreApplicationState } from "../../../common/store";
import Spy = jasmine.Spy;

describe("Service: StarkSessionService", () => {
	let mockStore: Store<StarkCoreApplicationState>;
	let appConfig: StarkApplicationConfig;
	let mockSession: StarkSession;
	let mockUser: Partial<StarkUser>;
	let mockLogger: StarkLoggingService;
	let mockRoutingService: StarkRoutingService;
	let mockIdleService: Idle;
	let mockKeepaliveService: Keepalive;
	let mockInjectorService: Injector;
	let mockTranslateService: TranslateService;
	let sessionService: SessionServiceHelper;
	const mockCorrelationId: string = "12345";

	// Inject module dependencies
	beforeEach(() => {
		mockUser = { uuid: "1", firstName: "Christopher", lastName: "Cortes" };
		mockSession = { currentLanguage: "NL", user: <StarkUser>mockUser };
		mockStore = jasmine.createSpyObj("store", ["dispatch", "pipe"]);
		(<Spy>mockStore.pipe).and.returnValue(of(mockSession));
		appConfig = new StarkApplicationConfigImpl();
		appConfig.sessionTimeout = 123;
		appConfig.sessionTimeoutWarningPeriod = 13;
		appConfig.keepAliveInterval = 45;
		appConfig.keepAliveUrl = "http://my.backend/keepalive";
		appConfig.logoutUrl = "http://localhost:5000/logout";
		appConfig.publicApp = false;

		mockLogger = new MockStarkLoggingService(mockCorrelationId);
		mockRoutingService = new MockStarkRoutingService();
		mockIdleService = jasmine.createSpyObj("idleService,", [
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
		mockKeepaliveService = jasmine.createSpyObj("keepaliveService,", ["interval", "request", "ping", "stop"]);
		mockKeepaliveService.onPing = new EventEmitter<any>();
		mockInjectorService = jasmine.createSpyObj("injector,", ["get"]);
		mockTranslateService = jasmine.createSpyObj("translateService,", ["use"]);
		sessionService = new SessionServiceHelper(
			mockStore,
			mockLogger,
			mockRoutingService,
			appConfig,
			mockIdleService,
			mockInjectorService,
			mockTranslateService
		);
		(<Spy>mockIdleService.setIdle).calls.reset();
		(<Spy>mockIdleService.setTimeout).calls.reset();
		(<Spy>mockIdleService.setInterrupts).calls.reset();
		(<Spy>mockIdleService.clearInterrupts).calls.reset();
		(<Spy>mockRoutingService.addTransitionHook).calls.reset();
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
							mockTranslateService
						)
				).toThrowError(/sessionTimeout/);
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
							mockTranslateService
						)
				).toThrowError(/sessionTimeoutWarning/);
			}
		});
	});

	describe("registerTransitionHook", () => {
		it("should add transitionHook (onBefore) to the RoutingService matching all states except starkAppInit/starkAppExit children", () => {
			sessionService.registerTransitionHook();

			expect(mockRoutingService.addTransitionHook).toHaveBeenCalledTimes(1);
			expect((<Spy>mockRoutingService.addTransitionHook).calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_BEFORE);

			const hookMatchCriteria: HookMatchCriteria = (<Spy>mockRoutingService.addTransitionHook).calls.argsFor(0)[1];

			expect(hookMatchCriteria.entering).toBeDefined();

			const matchingFn: Predicate<any> = <Predicate<any>>hookMatchCriteria.entering;
			const nonMatchingStates: object[] = [
				{ name: "starkAppInit.state1" },
				{ name: "starkAppInit.state2" },
				{ name: "starkAppInit.stateX" },
				{ name: "starkAppExit.state1" },
				{ name: "starkAppExit.state2" },
				{ name: "starkAppExit.stateX" },
				{ abstract: true, name: "" } // root state
			];
			const matchingStates: object[] = [
				{ name: "whatever.state1" },
				{ name: "other.state2" },
				{ name: "stateX" },
				{ name: <any>undefined }
			];

			for (const state of matchingStates) {
				expect(matchingFn(state)).toBe(true);
			}

			for (const state of nonMatchingStates) {
				expect(matchingFn(state)).toBe(false);
			}

			expect((<Spy>mockRoutingService.addTransitionHook).calls.argsFor(0)[2]).toBeDefined();
			expect((<Spy>mockRoutingService.addTransitionHook).calls.argsFor(0)[3]).toEqual({ priority: 1000 });
		});

		it("should resolve the promise when the onBefore hook is triggered and there IS user in the session", () => {
			sessionService.registerTransitionHook();

			expect((<Spy>mockRoutingService.addTransitionHook).calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_BEFORE);
			const onBeforeHookCallback: Function = (<Spy>mockRoutingService.addTransitionHook).calls.argsFor(0)[2];

			sessionService.session$ = of(mockSession);

			// trigger the onBefore hook callback
			defer<boolean>(() => onBeforeHookCallback()).subscribe(
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

			expect((<Spy>mockRoutingService.addTransitionHook).calls.argsFor(0)[0]).toBe(StarkRoutingTransitionHook.ON_BEFORE);
			const onBeforeHookCallback: Function = (<Spy>mockRoutingService.addTransitionHook).calls.argsFor(0)[2];

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

			sessionService.initializeSession(<StarkUser>mockUser);

			expect(sessionService.startIdleService).toHaveBeenCalledTimes(1);
			expect(sessionService.startKeepaliveService).toHaveBeenCalledTimes(1);

			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0]).toEqual(new StarkInitializeSession(<StarkUser>mockUser));
			expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0]).toEqual(new StarkInitializeSessionSuccess());
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
			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0]).toEqual(new StarkDestroySession());
			expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0]).toEqual(new StarkDestroySessionSuccess());
		});
	});

	describe("login", () => {
		it("should call the initializeSession() method passing the given user", () => {
			spyOn(sessionService, "initializeSession");

			sessionService.login(<StarkUser>mockUser);

			expect(sessionService.initializeSession).toHaveBeenCalledTimes(1);
			expect(sessionService.initializeSession).toHaveBeenCalledWith(<StarkUser>mockUser);
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
			const sendLogoutRequestSpy: Spy = spyOn(sessionService, "sendLogoutRequest").and.returnValue(of("HTTP response"));

			sessionService.logout();

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect((<Spy>mockStore.dispatch).calls.mostRecent().args[0]).toEqual(new StarkSessionLogout());

			expect(sendLogoutRequestSpy).toHaveBeenCalledTimes(1);
			expect(sendLogoutRequestSpy.calls.mostRecent().args[0]).toBe(appConfig.logoutUrl);
			expect(sendLogoutRequestSpy.calls.mostRecent().args[1]).toBe("");
			expect(sendLogoutRequestSpy.calls.mostRecent().args[2]).toBe(true);

			expect(sessionService.destroySession).toHaveBeenCalledTimes(1);
		});

		it("should call the destroySession() method only when the logout HTTP request has returned a response (either success or error)", () => {
			spyOn(sessionService, "destroySession");
			const logoutHttpResponse$: Subject<string> = new Subject();
			const sendLogoutRequestSpy: Spy = spyOn(sessionService, "sendLogoutRequest").and.returnValue(logoutHttpResponse$);

			sessionService.logout();

			expect(sendLogoutRequestSpy).toHaveBeenCalledTimes(1);
			expect(sendLogoutRequestSpy.calls.mostRecent().args[0]).toBe(appConfig.logoutUrl);
			expect(sendLogoutRequestSpy.calls.mostRecent().args[1]).toBe("");
			expect(sendLogoutRequestSpy.calls.mostRecent().args[2]).toBe(true);
			expect(sessionService.destroySession).not.toHaveBeenCalled();

			logoutHttpResponse$.next("HTTP 200");

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
			expect(mockStore.dispatch).toHaveBeenCalledWith(new StarkUserActivityTrackingPause());
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
			expect(mockStore.dispatch).toHaveBeenCalledWith(new StarkUserActivityTrackingResume());
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
			it("should be listened by subscribing to the observable from the idle service", () => {
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
			it("should be listened by subscribing to the observable from the idle service", () => {
				mockIdleService.onIdleEnd = new EventEmitter<any>();
				expect(mockIdleService.onIdleEnd.observers.length).toBe(0);

				sessionService.configureIdleService();

				expect(mockIdleService.onIdleEnd.observers.length).toBe(1);

				const onIdleEndSubscriber: Subscriber<any> = <Subscriber<any>>mockIdleService.onIdleEnd.observers[0];
				spyOn(onIdleEndSubscriber, "next");
				spyOn(onIdleEndSubscriber, "error");

				mockIdleService.onIdleEnd.next("some end value");

				expect(onIdleEndSubscriber.next).toHaveBeenCalledTimes(1);
				expect(onIdleEndSubscriber.next).toHaveBeenCalledWith("some end value");
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
				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0]).toEqual(new StarkSessionTimeoutCountdownStop());

				mockIdleService.onIdleEnd.complete();
			});
		});

		describe("onTimeout notifications", () => {
			it("should be listened by subscribing to the observable from the idle service", () => {
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

			it("should dispatch the COUNTDOWN_FINISH action, trigger the logout and navigate to the SessionExpired state", () => {
				spyOn(sessionService, "logout");

				mockIdleService.onTimeout = new EventEmitter<number>();
				expect(mockIdleService.onTimeout.observers.length).toBe(0);

				sessionService.configureIdleService();

				mockIdleService.onTimeout.next(321);

				expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0]).toEqual(new StarkSessionTimeoutCountdownFinish());
				expect(sessionService.logout).toHaveBeenCalledTimes(1);
				expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
				expect(mockRoutingService.navigateTo).toHaveBeenCalledWith(starkSessionExpiredStateName);

				mockIdleService.onTimeout.complete();
			});
		});

		describe("onTimeoutWarning notifications", () => {
			it("should be listened by subscribing to the observable from the idle service", () => {
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
				const countdownStartValue: number = 22;
				(<Spy>mockIdleService.getTimeout).and.returnValue(countdownStartValue);

				sessionService.configureIdleService();

				sessionService.countdownStarted = false;
				mockIdleService.onTimeoutWarning.next(10);

				expect(sessionService.countdownStarted).toBe(false);
				expect(mockStore.dispatch).not.toHaveBeenCalled();

				mockIdleService.onTimeoutWarning.next(countdownStartValue);

				expect(sessionService.countdownStarted).toBe(true);
				expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0]).toEqual(new StarkSessionTimeoutCountdownStart(countdownStartValue));

				mockIdleService.onTimeoutWarning.complete();
			});
		});
	});

	describe("configureKeepaliveService", () => {
		beforeEach(() => {
			(<Spy>mockInjectorService.get).and.returnValue(mockKeepaliveService);
			(<Spy>mockIdleService.getKeepaliveEnabled).and.returnValue(true);
		});

		it("should set the necessary options and headers of the keepalive service if it is ENABLED", () => {
			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService
			);

			expect(sessionServiceHelper.keepalive).toBeDefined();
			(<Spy>mockKeepaliveService.interval).calls.reset();
			(<Spy>mockKeepaliveService.request).calls.reset();

			// make sure the fake pre-auth info is set correctly
			const dummyUser: Partial<StarkUser> = {
				username: "jdoe",
				firstName: "john",
				lastName: "doe",
				email: "jdoe@email.com",
				language: "es",
				workpost: "dummy workpost",
				referenceNumber: "dummy ref number",
				roles: ["a role", "another role", "yet another role"]
			};

			const preAuthDefaults: StarkPreAuthentication = sessionServiceHelper.getFakePreAuthenticationDefaults();

			/*
			* headers: HttpHeaders({ normalizedNames: Map(  ), lazyUpdate: null, headers: Map(  ) }), params: , urlWithParams: 'http://my.backend/keepalive' })*/

			const expectedPreAuthHeaders: object = {};
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_USER_NAME] = dummyUser.username;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_FIRST_NAME] = dummyUser.firstName;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_LAST_NAME] = dummyUser.lastName;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_MAIL] = dummyUser.email;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_LANGUAGE] = dummyUser.language;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_DESCRIPTION] =
				dummyUser.referenceNumber + preAuthDefaults.descriptionSeparator + dummyUser.workpost;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_ROLES] = (<string[]>dummyUser.roles).join(preAuthDefaults.roleSeparator);

			sessionServiceHelper.setFakePreAuthenticationHeaders(<StarkUser>dummyUser);

			sessionServiceHelper.configureKeepaliveService();

			expect(mockKeepaliveService.interval).toHaveBeenCalledTimes(1);
			expect(mockKeepaliveService.interval).toHaveBeenCalledWith(appConfig.keepAliveInterval);
			expect(mockKeepaliveService.request).toHaveBeenCalledTimes(1);

			let mockHeadersObj: HttpHeaders = new HttpHeaders();
			mockHeadersObj = mockHeadersObj.set(StarkHttpHeaders.NBB_CORRELATION_ID, mockCorrelationId);

			for (const key of Object.keys(expectedPreAuthHeaders)) {
				mockHeadersObj = mockHeadersObj.set(key, expectedPreAuthHeaders[key]);
			}

			expect(mockKeepaliveService.request).toHaveBeenCalledWith(
				new HttpRequest("GET", <string>appConfig.keepAliveUrl, { headers: mockHeadersObj })
			);
		});

		it("should not set any option of the keepalive service if it is DISABLED", () => {
			(<Spy>mockIdleService.getKeepaliveEnabled).and.returnValue(false);

			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService
			);

			expect(sessionServiceHelper.keepalive).toBeUndefined();
			(<Spy>mockKeepaliveService.interval).calls.reset();
			(<Spy>mockKeepaliveService.request).calls.reset();

			sessionServiceHelper.configureKeepaliveService();

			expect(mockKeepaliveService.interval).not.toHaveBeenCalled();
			expect(mockKeepaliveService.request).not.toHaveBeenCalled();
		});

		describe("onPing notifications", () => {
			it("should be listened by subscribing to the observable from the idle service", () => {
				const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
					mockStore,
					mockLogger,
					mockRoutingService,
					appConfig,
					mockIdleService,
					mockInjectorService,
					mockTranslateService
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
			(<Spy>mockInjectorService.get).and.returnValue(mockKeepaliveService);
			(<Spy>mockIdleService.getKeepaliveEnabled).and.returnValue(true);

			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService
			);

			sessionServiceHelper.startKeepaliveService();

			expect(sessionServiceHelper.keepalive.ping).toHaveBeenCalledTimes(1);
		});

		it("should do NOTHING in case the Keepalive service is DISABLED", () => {
			(<Spy>mockIdleService.getKeepaliveEnabled).and.returnValue(false);

			sessionService.startKeepaliveService();

			expect(sessionService.keepalive).toBeUndefined();
		});
	});

	describe("stopKeepaliveService", () => {
		it("should call the stop() method from the Keepalive service to stop the keepalive ping requests", () => {
			(<Spy>mockInjectorService.get).and.returnValue(mockKeepaliveService);
			(<Spy>mockIdleService.getKeepaliveEnabled).and.returnValue(true);

			const sessionServiceHelper: SessionServiceHelper = new SessionServiceHelper(
				mockStore,
				mockLogger,
				mockRoutingService,
				appConfig,
				mockIdleService,
				mockInjectorService,
				mockTranslateService
			);

			sessionServiceHelper.stopKeepaliveService();

			expect(sessionServiceHelper.keepalive.stop).toHaveBeenCalledTimes(1);
		});

		it("should do NOTHING in case the keepalive service is DISABLED", () => {
			(<Spy>mockIdleService.getKeepaliveEnabled).and.returnValue(false);

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
					expect(<Partial<StarkUser>>user).toBe(mockUser);
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
			(<Spy>mockTranslateService.use).and.returnValue(of("FR"));

			sessionService.setCurrentLanguage("FR");

			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0]).toEqual(new StarkChangeLanguage("FR"));
			expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0]).toEqual(new StarkChangeLanguageSuccess("FR"));

			expect(mockTranslateService.use).toHaveBeenCalledTimes(1);
			expect(mockTranslateService.use).toHaveBeenCalledWith("FR");
		});

		it("should not change the language in case of failure and dispatch the FAILURE action", () => {
			(<Spy>mockTranslateService.use).and.returnValue(throwError("dummy error"));

			sessionService.setCurrentLanguage("FR");

			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0]).toEqual(new StarkChangeLanguage("FR"));
			expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0]).toEqual(new StarkChangeLanguageFailure("dummy error"));

			expect(mockTranslateService.use).toHaveBeenCalledTimes(1);
			expect(mockTranslateService.use).toHaveBeenCalledWith("FR");
		});
	});

	describe("setFakePreAuthenticationHeaders", () => {
		it("should construct the pre-authentication headers based on the user that is passed", () => {
			const dummyUser: Partial<StarkUser> = {
				username: "jdoe",
				firstName: "john",
				lastName: "doe",
				email: "jdoe@email.com",
				language: "es",
				workpost: "dummy workpost",
				referenceNumber: "dummy ref number",
				roles: ["a role", "another role", "yet another role"]
			};
			const preAuthDefaults: StarkPreAuthentication = sessionService.getFakePreAuthenticationDefaults();

			const expectedPreAuthHeaders: object = {};
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_USER_NAME] = dummyUser.username;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_FIRST_NAME] = dummyUser.firstName;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_LAST_NAME] = dummyUser.lastName;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_MAIL] = dummyUser.email;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_LANGUAGE] = dummyUser.language;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_DESCRIPTION] =
				dummyUser.referenceNumber + preAuthDefaults.descriptionSeparator + dummyUser.workpost;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_ROLES] = (<string[]>dummyUser.roles).join(preAuthDefaults.roleSeparator);

			sessionService.setFakePreAuthenticationHeaders(<StarkUser>dummyUser);

			expect(sessionService.fakePreAuthenticationHeaders.size).toBe(7);

			for (const header of Object.keys(expectedPreAuthHeaders)) {
				expect(sessionService.fakePreAuthenticationHeaders.has(header)).toBe(true);
				expect(sessionService.fakePreAuthenticationHeaders.get(header)).toBe(expectedPreAuthHeaders[header]);
			}
		});

		it("should construct only certain pre-authentication headers and with default values in case no user is passed", () => {
			const preAuthDefaults: StarkPreAuthentication = sessionService.getFakePreAuthenticationDefaults();

			const expectedPreAuthHeaders: object = {};
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_LANGUAGE] = preAuthDefaults.defaults.language;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_DESCRIPTION] =
				preAuthDefaults.defaults.referenceNumber + preAuthDefaults.descriptionSeparator + preAuthDefaults.defaults.workpost;
			expectedPreAuthHeaders[StarkHttpHeaders.NBB_ROLES] = "";

			sessionService.setFakePreAuthenticationHeaders();

			expect(sessionService.fakePreAuthenticationHeaders.size).toBe(3);

			for (const header of Object.keys(expectedPreAuthHeaders)) {
				expect(sessionService.fakePreAuthenticationHeaders.has(header)).toBe(true);
				expect(sessionService.fakePreAuthenticationHeaders.get(header)).toBe(expectedPreAuthHeaders[header]);
			}
		});
	});

	describe("fakePreAuthenticationHeaders", () => {
		it("should return the pre-authentication headers if they were constructed", () => {
			const expectedPreAuthHeaders: Map<string, string> = new Map<string, string>();
			expectedPreAuthHeaders.set(StarkHttpHeaders.NBB_USER_NAME, "jdoe");
			expectedPreAuthHeaders.set(StarkHttpHeaders.NBB_FIRST_NAME, "john");
			expectedPreAuthHeaders.set(StarkHttpHeaders.NBB_LAST_NAME, "doe");
			expectedPreAuthHeaders.set(StarkHttpHeaders.NBB_MAIL, "jdoe@email.com");
			expectedPreAuthHeaders.set(StarkHttpHeaders.NBB_LANGUAGE, "es");
			expectedPreAuthHeaders.set(StarkHttpHeaders.NBB_DESCRIPTION, "dummy description");
			expectedPreAuthHeaders.set(StarkHttpHeaders.NBB_ROLES, "dummy roles");

			sessionService.setInternalFakePreAuthenticationHeaders(expectedPreAuthHeaders);

			const fakePreAuthenticationHeaders: Map<string, string> = sessionService.fakePreAuthenticationHeaders;

			expect(fakePreAuthenticationHeaders.size).toBe(expectedPreAuthHeaders.size);

			expectedPreAuthHeaders.forEach((value: string, header: string) => {
				expect(fakePreAuthenticationHeaders.has(header)).toBe(true);
				expect(fakePreAuthenticationHeaders.get(header)).toBe(value);
			});
		});

		it("should return an empty map if the pre-authentication headers were not constructed", () => {
			sessionService.setInternalFakePreAuthenticationHeaders(undefined);

			const fakePreAuthenticationHeaders: Map<string, string> = sessionService.fakePreAuthenticationHeaders;

			expect(fakePreAuthenticationHeaders.size).toBe(0);
		});
	});
});

class SessionServiceHelper extends StarkSessionServiceImpl {
	public constructor(
		store: Store<StarkCoreApplicationState>,
		logger: StarkLoggingService,
		routingService: StarkRoutingService,
		appConfig: StarkApplicationConfig,
		/*xsrfService: StarkXSRFService,*/ idle: Idle,
		injector: Injector,
		translateService: TranslateService
	) {
		super(store, logger, routingService, appConfig, /*xsrfService,*/ idle, injector, translateService);
	}

	public registerTransitionHook(): void {
		super.registerTransitionHook();
	}

	public initializeSession(user: StarkUser): void {
		super.initializeSession(user);
	}

	public destroySession(): void {
		super.destroySession();
	}

	public configureIdleService(): void {
		super.configureIdleService();
	}

	public startIdleService(): void {
		super.startIdleService();
	}

	public stopIdleService(): void {
		super.stopIdleService();
	}

	public startKeepaliveService(): void {
		super.startKeepaliveService();
	}

	public stopKeepaliveService(): void {
		super.stopKeepaliveService();
	}

	public setFakePreAuthenticationHeaders(user?: StarkUser): void {
		super.setFakePreAuthenticationHeaders(user);
	}

	// override parent's implementation to prevent actual HTTP request to be sent!
	public sendLogoutRequest(): Observable<void> {
		/* dummy function to be mocked */
		return of(undefined);
	}

	public getFakePreAuthenticationDefaults(): StarkPreAuthentication {
		return this.fakePreAuthentication;
	}

	public setInternalFakePreAuthenticationHeaders(headers?: Map<string, string>): Map<string, string> {
		return (this._fakePreAuthenticationHeaders = <any>headers);
	}
}
