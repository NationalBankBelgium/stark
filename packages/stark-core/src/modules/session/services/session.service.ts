/* tslint:disable:completed-docs*/
import { HttpHeaders, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { DEFAULT_INTERRUPTSOURCES, Idle } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { TranslateService } from "@ngx-translate/core";
import { select, Store } from "@ngrx/store";
import { StateObject } from "@uirouter/core";
import { validateSync } from "class-validator";
import { defer, Observable, Subject } from "rxjs";
import { map, take } from "rxjs/operators";

import { STARK_LOGGING_SERVICE, StarkLoggingService } from "../../logging/services";
import { StarkSessionService, starkSessionServiceName } from "./session.service.intf";
import { STARK_ROUTING_SERVICE, StarkRoutingService, StarkRoutingTransitionHook } from "../../routing/services";
import { STARK_APP_CONFIG, StarkApplicationConfig } from "../../../configuration/entities/application";
import { StarkPreAuthentication, StarkSession } from "../entities";
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
import { starkSessionExpiredStateName } from "../../../common/routes";
import { StarkCoreApplicationState } from "../../../common/store";
import { selectStarkSession } from "../reducers";
import { StarkConfigurationUtil } from "../../../util/configuration.util";
import { StarkValidationErrorsUtil } from "../../../util";

/**
 * @ignore
 */
export const starkUnauthenticatedUserError: string = "StarkSessionService => user not authenticated";

/**
 * @ignore
 * @ngdoc service
 * @description Service to get/set session settings (language, ...).
 */
@Injectable()
export class StarkSessionServiceImpl implements StarkSessionService {
	public keepalive: Keepalive;
	public session$: Observable<StarkSession>;
	protected _fakePreAuthenticationHeaders: Map<string, string>;
	public countdownStarted: boolean;

	protected fakePreAuthentication: StarkPreAuthentication = {
		roleSeparator: "^",
		descriptionSeparator: "/",
		defaults: {
			language: "F",
			workpost: "XXX",
			referenceNumber: "00000"
		}
	};

	public constructor(
		public store: Store<StarkCoreApplicationState>,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		@Inject(STARK_APP_CONFIG) private appConfig: StarkApplicationConfig,
		public idle: Idle,
		injector: Injector,
		public translateService: TranslateService
	) {
		// ensuring that the app config is valid before doing anything
		StarkConfigurationUtil.validateConfig(this.appConfig, ["session"], starkSessionServiceName);

		if (this.idle.getKeepaliveEnabled() && !this.appConfig.keepAliveDisabled) {
			this.keepalive = injector.get<Keepalive>(Keepalive);
		}

		this.registerTransitionHook();

		this.configureIdleService();
		this.configureKeepaliveService();

		this.session$ = this.store.pipe(select(selectStarkSession));

		// FIXME Where does DEVELOPMENT Variable come from ???
		// if (DEVELOPMENT) {
		// 	this.session$.pipe(
		// 		filter((session: StarkSession) => session.hasOwnProperty("user")),
		// 		tap((session: StarkSession) => this.setFakePreAuthenticationHeaders(session.user))
		// 	).subscribe();
		// }

		if (window) {
			window.addEventListener("beforeunload", () => {
				//ev: BeforeUnloadEvent
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

	protected registerTransitionHook(): void {
		this.routingService.addKnownNavigationRejectionCause(starkUnauthenticatedUserError);

		this.routingService.addTransitionHook(
			StarkRoutingTransitionHook.ON_BEFORE,
			{
				// match any state except the ones that are children of starkAppInit/starkAppExit or the Ui-Router's root state
				entering: (state?: StateObject) => {
					if (state && typeof state.name !== "undefined") {
						return !state.name.match(/(starkAppInit|starkAppExit)/) && !(state.abstract && state.name === "");
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

		const emitXhrResult: Function = (xhrRequest: XMLHttpRequest) => {
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
			xhr.onreadystatechange = () => {
				emitXhrResult(xhr);
			};
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
			const errorMsg: string =
				starkSessionServiceName +
				": " +
				STARK_APP_CONFIG +
				" constant is not valid.\n\n" +
				"- sessionTimeoutWarningPeriod cannot be equal or higher than sessionTimeout\n";

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
			this.routingService.navigateTo(starkSessionExpiredStateName);
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
		pingRequestHeaders = pingRequestHeaders.set(StarkHttpHeaders.NBB_CORRELATION_ID, this.logger.correlationId);

		// FIXME Where does DEVELOPMENT Variable come from ???
		// if (DEVELOPMENT) {
		this.fakePreAuthenticationHeaders.forEach((value: string, key: string) => {
			pingRequestHeaders = pingRequestHeaders.set(key, value);
		});
		// }

		const pingRequest: HttpRequest<void> = new HttpRequest("GET", <string>this.appConfig.keepAliveUrl, {
			headers: pingRequestHeaders
		});

		// the XSRF config for this request will be automatically added by the XSRF Http Interceptor
		this.keepalive.request(pingRequest);
		this.keepalive.onPing.subscribe(() => this.logger.info(starkSessionServiceName + ": keepAlive ping sent"));
	}

	protected setFakePreAuthenticationHeaders(user?: StarkUser): void {
		this.logger.debug(starkSessionServiceName + ": constructing fake pre-authentication headers");

		// set a default language if not known
		const languageHeaderValue: string = user && user.language ? user.language : this.fakePreAuthentication.defaults.language;
		// set a default workpost if not known
		const workpost: string = user && user.workpost ? user.workpost : this.fakePreAuthentication.defaults.workpost;
		// set a default reference number if not known
		const referenceNumber: string =
			user && user.referenceNumber ? user.referenceNumber : this.fakePreAuthentication.defaults.referenceNumber;

		const descriptionHeaderValue: string = referenceNumber + this.fakePreAuthentication.descriptionSeparator + workpost;

		let rolesHeaderValue: string = "";
		if (user && user.roles) {
			rolesHeaderValue = user.roles.join(this.fakePreAuthentication.roleSeparator);
		}

		this._fakePreAuthenticationHeaders = new Map<string, string>();

		if (user) {
			this._fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_USER_NAME, user.username);
			this._fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_FIRST_NAME, user.firstName);
			this._fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_LAST_NAME, user.lastName);
			if (user.email) {
				this._fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_MAIL, user.email);
			}
		}
		this._fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_LANGUAGE, languageHeaderValue);
		this._fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_DESCRIPTION, descriptionHeaderValue);
		this._fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_ROLES, rolesHeaderValue);
	}

	public get fakePreAuthenticationHeaders(): Map<string, string> {
		return this._fakePreAuthenticationHeaders || new Map<string, string>();
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
		return this.session$.pipe(map((session: StarkSession) => session.user));
	}

	public getCurrentLanguage(): Observable<string> {
		return this.session$.pipe(map((session: StarkSession) => session.currentLanguage));
	}

	public setCurrentLanguage(newLanguage: string): void {
		// dispatch corresponding action to allow the user to trigger his own effects if needed
		this.store.dispatch(new StarkChangeLanguage(newLanguage));

		defer(() => this.translateService.use(newLanguage)).subscribe(
			(languageId: string) => this.store.dispatch(new StarkChangeLanguageSuccess(languageId)),
			(error: any) => this.store.dispatch(new StarkChangeLanguageFailure(error))
		);
	}
}
