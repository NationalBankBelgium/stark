import { Injectable, Injector, NgZone } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { STARK_TOAST_NOTIFICATION_SERVICE, StarkMessageType, StarkToastNotificationService } from "@nationalbankbelgium/stark-ui";
import { StarkErrorHandlingActionTypes, StarkUnhandledError } from "@nationalbankbelgium/stark-core";
import uniqueId from "lodash-es/uniqueId";

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
	public constructor(private actions$: Actions, private injector: Injector, private zone: NgZone) {}

	@Effect({ dispatch: false })
	public starkUnhandledError$(): Observable<void> {
		return this.actions$.pipe(
			ofType<StarkUnhandledError>(StarkErrorHandlingActionTypes.UNHANDLED_ERROR),
			map((action: StarkUnhandledError) => {
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
