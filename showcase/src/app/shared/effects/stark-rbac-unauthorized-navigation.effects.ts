import { Injectable, Injector, NgZone } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
	StarkRBACAuthorizationActionsTypes,
	StarkUserNavigationUnauthorized,
	StarkUserNavigationUnauthorizedRedirected
} from "@nationalbankbelgium/stark-rbac";
import { STARK_TOAST_NOTIFICATION_SERVICE, StarkMessageType, StarkToastNotificationService } from "@nationalbankbelgium/stark-ui";
import uniqueId from "lodash-es/uniqueId";

/**
 * This class is used to determine what to do with an error
 */
@Injectable()
export class StarkRbacUnauthorizedNavigationEffects {
	private _starkToastNotificationService?: StarkToastNotificationService;

	/**
	 * Class constructor
	 * @param actions$ - the action to perform
	 * @param injector - the injector of the class
	 * @param zone - the service to execute actions inside or outside of an Angular Zone.
	 */
	public constructor(private actions$: Actions, private injector: Injector, private zone: NgZone) {}

	@Effect({ dispatch: false })
	public starkRBACNavigationUnauthorized$(): Observable<void> {
		return this.actions$.pipe(
			ofType<StarkUserNavigationUnauthorized>(StarkRBACAuthorizationActionsTypes.RBAC_USER_NAVIGATION_UNAUTHORIZED),
			map((action: StarkUserNavigationUnauthorized) => {
				this.zone.run(() => {
					this.toastNotificationService
						.show({
							id: uniqueId(),
							type: StarkMessageType.ERROR,
							key: action.type,
							code: "Stark-RBAC: unauthorized navigation"
						})
						.subscribe();
				});
			})
		);
	}

	@Effect({ dispatch: false })
	public starkRBACNavigationUnauthorizedRedirected$(): Observable<void> {
		return this.actions$.pipe(
			ofType<StarkUserNavigationUnauthorizedRedirected>(
				StarkRBACAuthorizationActionsTypes.RBAC_USER_NAVIGATION_UNAUTHORIZED_REDIRECTED
			),
			map((action: StarkUserNavigationUnauthorizedRedirected) => {
				this.zone.run(() => {
					this.toastNotificationService
						.show({
							id: uniqueId(),
							type: StarkMessageType.WARNING,
							key: "SHOWCASE.DEMO_RBAC.SERVICES.AUTHORIZATION.REDIRECTION_MESSAGE",
							interpolateValues: { rbacActionType: action.type },
							code: "Stark-RBAC: unauthorized navigation redirected"
						})
						.subscribe();
				});
			})
		);
	}

	/**
	 * Gets the StarkToastNotificationService from the Injector.
	 * @throws When the service is not found (the ToastNotification module is not imported in the app)
	 */
	private get toastNotificationService(): StarkToastNotificationService {
		if (typeof this._starkToastNotificationService === "undefined") {
			this._starkToastNotificationService = this.injector.get<StarkToastNotificationService>(STARK_TOAST_NOTIFICATION_SERVICE);
			return this._starkToastNotificationService;
		}
		return this._starkToastNotificationService;
	}
}
