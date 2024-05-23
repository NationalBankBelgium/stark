import { Injectable, Injector, NgZone } from "@angular/core";
import { Actions, createEffect, CreateEffectMetadata, ofType } from "@ngrx/effects";
import { map } from "rxjs/operators";
import { STARK_TOAST_NOTIFICATION_SERVICE, StarkMessageType, StarkToastNotificationService } from "@nationalbankbelgium/stark-ui";
import { StarkErrorHandlingActions } from "@nationalbankbelgium/stark-core";
import uniqueId from "lodash-es/uniqueId";
import { Observable } from "rxjs";

/**
 * This class is used to determine what to do with an error
 */
@Injectable()
export class StarkErrorHandlingEffects {
	private _starkToastNotificationService?: StarkToastNotificationService;

	/**
	 * Class constructor
	 * @param actions$ - the action to perform
	 * @param injector - the injector of the class
	 * @param zone - the service to execute actions inside or outside of an Angular Zone.
	 */
	public constructor(
		private actions$: Actions,
		private injector: Injector,
		private zone: NgZone
	) {
		this.starkUnhandledError$ = createEffect(
			() => {
				console.log("createEffect called", this.actions$);
				return this.actions$.pipe(
					ofType(StarkErrorHandlingActions.unhandledError),
					map((action) => {
						this.zone.run(() => {
							this.toastNotificationService
								.show({
									id: uniqueId(),
									type: StarkMessageType.ERROR,
									key: action.error.toString(),
									code: "Unhandled error - no code"
								})
								.subscribe();
						});
					})
				);
			},
			{ dispatch: false }
		);
	}

	public starkUnhandledError$: Observable<void> & CreateEffectMetadata;

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
