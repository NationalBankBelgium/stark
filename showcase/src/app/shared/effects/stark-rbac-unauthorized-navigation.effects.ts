import { Injectable, Injector, NgZone } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map } from "rxjs/operators";
import { StarkRBACAuthorizationActions } from "@nationalbankbelgium/stark-rbac";
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

	public starkRBACNavigationUnauthorized$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(StarkRBACAuthorizationActions.userNavigationUnauthorized),
				map((action) => {
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
			),
		{ dispatch: false }
	);

	public starkRBACNavigationUnauthorizedRedirected$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(StarkRBACAuthorizationActions.userNavigationUnauthorizedRedirected),
				map((action) => {
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
			),
		{ dispatch: false }
	);

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
