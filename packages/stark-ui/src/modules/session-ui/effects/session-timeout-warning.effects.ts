import { Inject, Injectable, Optional } from "@angular/core";
import { Observable, of } from "rxjs";
import { exhaustMap, map, takeUntil } from "rxjs/operators";
import {
	STARK_SESSION_SERVICE,
	StarkSessionActionTypes,
	StarkSessionService,
	StarkSessionTimeoutCountdownFinish,
	StarkSessionTimeoutCountdownStart
} from "@nationalbankbelgium/stark-core";
import { StarkSessionTimeoutWarningDialogComponent } from "../components/session-timeout-warning-dialog/session-timeout-warning-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Actions, Effect, EffectNotification, ofType, OnRunEffects } from "@ngrx/effects";
import { STARK_SESSION_UI_CONFIG, StarkSessionUiConfig } from "../entities";

/**
 * Effects definition to show a warning dialog when the Timeout countdown starts
 * (the user activity tracking is paused until the user closes the dialog).
 */
@Injectable()
export class StarkSessionTimeoutWarningDialogEffects implements OnRunEffects {
	/**
	 * Class constructor
	 * @param actions$ - The action to perform.
	 * @param sessionService - The `StarkSessionService` instance of the application.
	 * @param dialogService - The `MatDialog` instance of the application.
	 * @param starkSessionUiConfig - The `StarkSessionUiConfig` instance of the application (if provided).
	 */
	public constructor(
		public actions$: Actions,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		@Inject(MatDialog) public dialogService: MatDialog,
		@Optional()
		@Inject(STARK_SESSION_UI_CONFIG)
		public starkSessionUiConfig?: StarkSessionUiConfig
	) {}

	/**
	 * This method is used to display a warning session timeout dialog.
	 * When the dialog is closed, if the "keep-logged" string is received as a result, it means that the user should stay logged
	 * and the user activity tracking should be resumed.
	 *
	 * `dispatch: false` => because this effect does not dispatch an action
	 */
	@Effect({ dispatch: false })
	public starkSessionTimeoutWarning$(): Observable<void> {
		return this.actions$.pipe(
			ofType<StarkSessionTimeoutCountdownStart>(StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_START),
			map((action: StarkSessionTimeoutCountdownStart) => {
				this.sessionService.pauseUserActivityTracking();
				this.dialogService
					.open<StarkSessionTimeoutWarningDialogComponent>(StarkSessionTimeoutWarningDialogComponent, {
						data: action.countdown,
						disableClose: true
					})
					.afterClosed()
					.subscribe((result: string) => {
						if (result) {
							if (result === "keep-logged") {
								this.sessionService.resumeUserActivityTracking();
							} else if (result === "close-session") {
								this.sessionService.logout();
							}
						}
					});
			})
		);
	}

	/**
	 * This method is used to close the dialog if the session timeout countdown has finished
	 *
	 * `dispatch: false` => because this effect does not dispatch an action
	 */
	@Effect({ dispatch: false })
	public starkSessionTimeoutWarningClose$(): Observable<void> {
		return this.actions$.pipe(
			ofType<StarkSessionTimeoutCountdownFinish>(StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_FINISH),
			map(() => {
				this.dialogService.closeAll();
			})
		);
	}

	/**
	 * This method will be triggered before the session is open to determine if we should use the session timeout warning effect or not.
	 *
	 * See {@link https://github.com/ngrx/platform/blob/7.4.0/docs/effects/api.md#onruneffects|NGRX OnRunEffects}.
	 *
	 * @param resolvedEffects$ - The effects stream to be executed
	 */
	public ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification> {
		if (this.starkSessionUiConfig && this.starkSessionUiConfig.timeoutWarningDialogDisabled === true) {
			return this.actions$.pipe(
				exhaustMap(() => {
					return resolvedEffects$.pipe(takeUntil(of("stop")));
				})
			);
		}

		return this.actions$.pipe(
			exhaustMap(() => {
				return resolvedEffects$;
			})
		);
	}
}
