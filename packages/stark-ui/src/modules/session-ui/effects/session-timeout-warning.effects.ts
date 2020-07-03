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

@Injectable()
export class StarkSessionTimeoutWarningDialogEffects implements OnRunEffects {
	/**
	 * Show a warning dialog when the Timeout countdown stars (the user activity tracking is paused until the user closes the dialog)
	 */
	public constructor(
		public actions$: Actions,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		@Optional()
		@Inject(STARK_SESSION_UI_CONFIG)
		public starkSessionUiConfig: StarkSessionUiConfig,
		@Inject(MatDialog) public dialogService: MatDialog
	) {}

	/**
	 * This method is used to display a warning session timeout dialog.
	 * When the dialog is closed, if the "keep-logged" string is received as a result, it means that the user should keep logged
	 * and we resume the user activity tracking.
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
						if (result && result === "keep-logged") {
							this.sessionService.resumeUserActivityTracking();
						}
					});
			})
		);
	}

	/**
	 * This method is used to close the dialog if the session timeout countdown has finished
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
