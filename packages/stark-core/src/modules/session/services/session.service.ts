/* tslint:disable:completed-docs*/
import { HttpHeaders, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector, Optional } from "@angular/core";
import { DEFAULT_INTERRUPTSOURCES, Idle } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { TranslateService } from "@ngx-translate/core";
import { select, Store } from "@ngrx/store";
import { StateObject } from "@uirouter/core";
import { validateSync } from "class-validator";
import { defer, Observable, Subject } from "rxjs";
import { distinctUntilChanged, map, take } from "rxjs/operators";

import { STARK_LOGGING_SERVICE, StarkLoggingService } from "../../logging/services";
import { StarkSessionService, starkSessionServiceName } from "./session.service.intf";
import { STARK_ROUTING_SERVICE, StarkRoutingService, StarkRoutingTransitionHook } from "../../routing/services";
import { STARK_APP_CONFIG, StarkApplicationConfig } from "../../../configuration/entities/application";
import { STARK_SESSION_CONFIG, StarkSession, StarkSessionConfig } from "../entities";
import { StarkUser } from "../../user/entities";
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
import { StarkHttpStatusCodes } from "../../http/enumerators";
import { StarkHttpHeaders } from "../../http/constants";
import { StarkCoreApplicationState } from "../../../common/store";
import { selectStarkSession } from "../reducers";
import { StarkConfigurationUtil } from "../../../util/configuration.util";
import { StarkValidationErrorsUtil } from "../../../util";
import { starkAppExitStateName, starkAppInitStateName, starkSessionExpiredStateName } from "../constants";

/**
 * @ignore
 */
export const starkUnauthenticatedUserError = "StarkSessionService => user not authenticated";

/**
 * @ignore
 * @ngdoc service
 * @description Service to get/set session settings (language, ...).
 */
@Injectable()
export class StarkSessionServiceImpl implements StarkSessionService {
	public keepalive?: Keepalive;
	public session$: Observable<StarkSession>;
	protected _devAuthenticationHeaders = new Map<string, string | string[]>();
	public countdownStarted = false;

	// TODO Check if we can simplify this service
	/* tslint:disable-next-line:parameters-max-number */
	public constructor(
		public store: Store<StarkCoreApplicationState>,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		@Inject(STARK_APP_CONFIG) private appConfig: StarkApplicationConfig,
		public idle: Idle,
		injector: Injector,
		public translateService: TranslateService,
		@Optional()
		@Inject(STARK_SESSION_CONFIG)
		private sessionConfig?: StarkSessionConfig
	) {
		// ensuring that the app config is valid before doing anything
		StarkConfigurationUtil.validateConfig(this.appConfig, ["session"], starkSessionServiceName);

		// ensuring that the session config is valid before doing anything
		if (this.sessionConfig) {
			this.validateSessionConfig(this.sessionConfig);
		}

		if (this.idle.getKeepaliveEnabled() && !this.appConfig.keepAliveDisabled) {
			this.keepalive = injector.get<Keepalive>(Keepalive);
		}

		this.registerTransitionHook();

		this.configureIdleService();
		this.configureKeepaliveService();

		this.session$ = this.store.pipe(select(selectStarkSession));

		if (window) {
			window.addEventListener("beforeunload", (_ev: BeforeUnloadEvent) => {
				// Hit the logout URL before leaving the application.
				// We need to call the REST service synchronously,
				// because the browser has to wait for the HTTP call to complete.

				// dispatch action so an effect can run any logic if needed
				this.store.dispatch(new StarkSessionLogout());
				this.sendLogoutRequest(this.appConfig.logoutUrl, "", false);
				// in this case, since the HTTP call is synchronous, the session can be destroy immediately
				this.destroySession();
			});
		}

		this.logger.debug(starkSessionServiceName + " loaded");
	}

	/**
	 * Validates the StarkSessionConfig provided.
	 * @param customConfig - Custom configuration object passed via the StarkSessionModule.forRoot() method
	 * @throws In case the configuration object passed via the StarkSessionModule.forRoot() method is not valid
	 */
	protected validateSessionConfig(customConfig: StarkSessionConfig): void {
		const invalidConfigErrorPrefix: string = starkSessionServiceName + ": invalid StarkSessionConfig object. ";
		const invalidConfigErrorAppInitSuffix: string =
			" should have the prefix '" + starkAppInitStateName + ".' in order to be configured correctly as an application initial state";
		const invalidConfigErrorAppExitSuffix: string =
			" should have the prefix '" + starkAppExitStateName + ".' in order to be configured correctly as an application exit state";

		// validate config to ensure that the init/exit states have the correct StarkAppInit or StarkAppExit parent
		if (
			typeof customConfig.loginStateName !== "undefined" &&
			(!customConfig.loginStateName.startsWith(starkAppInitStateName) ||
				customConfig.loginStateName.replace(starkAppInitStateName, "").length < 2)
		) {
			throw new Error(invalidConfigErrorPrefix + "'loginStateName' value" + invalidConfigErrorAppInitSuffix);
		}
		if (
			typeof customConfig.preloadingStateName !== "undefined" &&
			(!customConfig.preloadingStateName.startsWith(starkAppInitStateName) ||
				customConfig.preloadingStateName.replace(starkAppInitStateName, "").length < 2)
		) {
			throw new Error(invalidConfigErrorPrefix + "'preloadingStateName' value" + invalidConfigErrorAppInitSuffix);
		}
		if (
			typeof customConfig.sessionExpiredStateName !== "undefined" &&
			(!customConfig.sessionExpiredStateName.startsWith(starkAppExitStateName) ||
				customConfig.sessionExpiredStateName.replace(starkAppExitStateName, "").length < 2)
		) {
			throw new Error(invalidConfigErrorPrefix + "'sessionExpiredStateName' value" + invalidConfigErrorAppExitSuffix);
		}
		if (
			typeof customConfig.sessionLogoutStateName !== "undefined" &&
			(!customConfig.sessionLogoutStateName.startsWith(starkAppExitStateName) ||
				customConfig.sessionLogoutStateName.replace(starkAppExitStateName, "").length < 2)
		) {
			throw new Error(invalidConfigErrorPrefix + "'sessionLogoutStateName' value" + invalidConfigErrorAppExitSuffix);
		}
	}

	protected registerTransitionHook(): void {
		this.routingService.addKnownNavigationRejectionCause(starkUnauthenticatedUserError);

		this.routingService.addTransitionHook(
			StarkRoutingTransitionHook.ON_BEFORE,
			{
				// match any state except the ones that are children of starkAppInit/starkAppExit or the Ui-Router's root state
				entering: (state?: StateObject): boolean => {
					if (state && typeof state.name !== "undefined") {
						const regexInitExitStateName: RegExp = new RegExp("(" + starkAppInitStateName + "|" + starkAppExitStateName + ")");
						return !state.name.match(regexInitExitStateName) && !(state.abstract && state.name === "");
					} else {
						return true; // always match
					}
				}
			},
			(): Promise<boolean> => {
				return this.session$
					.pipe(
						take(1),
						map((session: StarkSession) => {
							if (typeof session.user === "undefined") {
								// reject transition in case there is no user in the session
								throw new Error(starkUnauthenticatedUserError);
							} else {
								return true;
							}
						})
					)
					.toPromise<boolean>();
			},
			{ priority: 1000 } // very high priority (this hook should be the first one to be called to reject transitions immediately)
		);
	}

	/**
	 * Performs all the necessary actions to initialize the session.
	 * It dispatches a INITIALIZE_SESSION action to the NGRX-Store
	 * @param user - The user used to initialize the session.
	 */
	protected initializeSession(user: StarkUser): void {
		this.store.dispatch(new StarkInitializeSession(user));
		this.startIdleService();
		this.startKeepaliveService();
		this.store.dispatch(new StarkInitializeSessionSuccess());
	}

	/**
	 * Performs all the necessary actions to destroy the session. The user stored in the session is removed.
	 * It dispatches a DESTROY_SESSION action to the NGRX-Store
	 */
	protected destroySession(): void {
		this.store.dispatch(new StarkDestroySession());
		this.stopIdleService();
		this.stopKeepaliveService();
		this.store.dispatch(new StarkDestroySessionSuccess());
	}

	public login(user: StarkUser): void {
		// use class-validator to validate the object based on the entity StarkUser
		StarkValidationErrorsUtil.throwOnError(validateSync(user), starkSessionServiceName + ": invalid user profile.");

		this.initializeSession(user);
	}

	public logout(): void {
		// dispatch action so an effect can run any logic if needed
		this.store.dispatch(new StarkSessionLogout());
		// the session will always be destroyed right after the response of the logout HTTP call (regardless of its result)
		this.sendLogoutRequest(this.appConfig.logoutUrl, "", true).subscribe(() => this.destroySession(), () => this.destroySession());
	}

	protected sendLogoutRequest(url: string, serializedData: string, async: boolean = true): Observable<void> {
		const httpRequest$: Subject<void> = new Subject<void>();

		const emitXhrResult = (xhrRequest: XMLHttpRequest): void => {
			if (xhrRequest.readyState === XMLHttpRequest.DONE) {
				if (xhrRequest.status === StarkHttpStatusCodes.HTTP_200_OK || xhrRequest.status === StarkHttpStatusCodes.HTTP_201_CREATED) {
					httpRequest$.next();
					httpRequest$.complete();
				} else {
					httpRequest$.error(xhrRequest.status);
				}
			}
		};

		const xhr: XMLHttpRequest = new XMLHttpRequest();

		if (async) {
			xhr.onreadystatechange = (): void => emitXhrResult(xhr);
		} else {
			emitXhrResult(xhr);
		}

		// catch any error raised by the browser while opening the connection. for example:
		// Chrome "mixed content" error: https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content
		// IE "Access is denied" error: https://stackoverflow.com/questions/22098259/access-denied-in-ie-10-and-11-when-ajax-target-is-localhost
		try {
			xhr.open("GET", url, async);
			xhr.setRequestHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			xhr.send(serializedData);
		} catch (e) {
			httpRequest$.error(e);
		}

		return httpRequest$;
	}

	public pauseUserActivityTracking(): void {
		this.store.dispatch(new StarkUserActivityTrackingPause());
		this.idle.clearInterrupts();
	}

	public resumeUserActivityTracking(): void {
		this.store.dispatch(new StarkUserActivityTrackingResume());
		this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
		this.startIdleService();
		this.startKeepaliveService();
	}

	protected configureIdleService(): void {
		// ensuring that the session timeout values are valid to prevent errors while setting the idle value
		if (this.appConfig.sessionTimeoutWarningPeriod >= this.appConfig.sessionTimeout) {
			const errorMsg = `${starkSessionServiceName}: ${STARK_APP_CONFIG} constant is not valid.\n\n- sessionTimeoutWarningPeriod cannot be equal or higher than sessionTimeout\n`;

			throw new Error(errorMsg);
		}

		// seconds before the user is considered to be idle (should be calculated subtracting the timeout warning period)
		this.idle.setIdle(this.appConfig.sessionTimeout - this.appConfig.sessionTimeoutWarningPeriod);
		// seconds before the session times out and the timeout warning event should be emitted
		this.idle.setTimeout(this.appConfig.sessionTimeoutWarningPeriod);
		// sets the default interrupts (clicks, scrolls, touches to the document)
		this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

		this.idle.onIdleStart.subscribe(() => this.logger.warn(starkSessionServiceName + ": the user has gone idle"));
		this.idle.onIdleEnd.subscribe(() => {
			this.logger.info(starkSessionServiceName + ": the user is no longer idle");
			if (this.countdownStarted) {
				this.countdownStarted = false;
				// dispatch action so an effect can run any logic if needed
				this.store.dispatch(new StarkSessionTimeoutCountdownStop());
			}
		});

		this.idle.onTimeout.subscribe(() => {
			this.logger.warn(starkSessionServiceName + ": the user session has timed out!");
			// dispatch action so an effect can run any logic if needed
			this.store.dispatch(new StarkSessionTimeoutCountdownFinish());
			this.logout();

			let sessionExpiredStateName: string = starkSessionExpiredStateName;
			if (
				this.sessionConfig &&
				typeof this.sessionConfig.sessionExpiredStateName !== "undefined" &&
				this.sessionConfig.sessionExpiredStateName !== ""
			) {
				sessionExpiredStateName = this.sessionConfig.sessionExpiredStateName;
			}
			this.routingService.navigateTo(sessionExpiredStateName);
		});

		this.idle.onTimeoutWarning.subscribe((countdown: number) => {
			if (countdown === this.idle.getTimeout()) {
				this.countdownStarted = true;
				// dispatch action so an effect can run any logic if needed (i.e. displaying a timeout countdown dialog)
				this.store.dispatch(new StarkSessionTimeoutCountdownStart(countdown));
			}
		});
	}

	public configureKeepaliveService(): void {
		if (!this.keepalive) {
			return;
		}

		this.keepalive.interval(this.appConfig.keepAliveInterval); // ping interval in seconds

		let pingRequestHeaders: HttpHeaders = new HttpHeaders();

		if (ENV === "development") {
			this.devAuthenticationHeaders.forEach((value: string | string[], key: string) => {
				pingRequestHeaders = pingRequestHeaders.set(key, value);
			});
		}
		// Add the correlation ID header to the ping requests
		if (this.logger.correlationIdHttpHeaderName && this.logger.correlationIdHttpHeaderName.length > 0 && this.logger.correlationId) {
			pingRequestHeaders = pingRequestHeaders.set(this.logger.correlationIdHttpHeaderName, this.logger.correlationId);
		}

		const pingRequest: HttpRequest<void> = new HttpRequest("GET", <string>this.appConfig.keepAliveUrl, {
			headers: pingRequestHeaders
		});

		// the XSRF config for this request will be automatically added by the XSRF Http Interceptor
		this.keepalive.request(pingRequest);
		this.keepalive.onPing.subscribe(() => this.logger.info(starkSessionServiceName + ": keepAlive ping sent"));
	}

	public setDevAuthenticationHeaders(devAuthenticationHeaders: Map<string, string | string[]>): void {
		this.logger.debug(starkSessionServiceName + ": constructing the authentication headers");
		devAuthenticationHeaders.forEach((value: string | string[], key: string) => {
			// in Angular, a header value can only be string or string[], not null/undefined (https://github.com/angular/angular/issues/18743)
			if (key && typeof value !== "undefined" && value !== null) {
				this._devAuthenticationHeaders.set(key, value);
			}
		});
	}

	public get devAuthenticationHeaders(): Map<string, string | string[]> {
		return this._devAuthenticationHeaders;
	}

	protected startIdleService(): void {
		this.idle.watch();
	}

	protected stopIdleService(): void {
		this.idle.stop();
		this.idle.clearInterrupts();
	}

	protected startKeepaliveService(): void {
		if (this.keepalive) {
			// the Keepalive service is automatically started by the Idle service
			this.keepalive.ping();
		}
	}

	protected stopKeepaliveService(): void {
		if (this.keepalive) {
			this.keepalive.stop();
		}
	}

	public getCurrentUser(): Observable<StarkUser | undefined> {
		return this.session$.pipe(
			map((session: StarkSession) => session.user),
			distinctUntilChanged() // using distinctUntilChanged to make sure to only emit on values different from the last one, to prevent infinite loops.
		);
	}

	public getCurrentLanguage(): Observable<string> {
		return this.session$.pipe(
			map((session: StarkSession) => session.currentLanguage),
			distinctUntilChanged() // using distinctUntilChanged to make sure to only emit on values different from the last one, to prevent infinite loops.
		);
	}

	public setCurrentLanguage(newLanguage: string): void {
		// dispatch corresponding action to allow the user to trigger his own effects if needed
		this.store.dispatch(new StarkChangeLanguage(newLanguage));

		defer(() => this.translateService.use(newLanguage)).subscribe(
			(_translations: any) => this.store.dispatch(new StarkChangeLanguageSuccess(newLanguage)),
			(error: any) => this.store.dispatch(new StarkChangeLanguageFailure(error))
		);
	}
}
