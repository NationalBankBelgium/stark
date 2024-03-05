import { Inject, Injectable, Optional } from "@angular/core";
import { Observable, of } from "rxjs";
import { exhaustMap, map, takeUntil } from "rxjs/operators";
import { STARK_SESSION_SERVICE, StarkSessionActions, StarkSessionService } from "@nationalbankbelgium/stark-core";
import { StarkSessionTimeoutWarningDialogComponent } from "../components/session-timeout-warning-dialog/session-timeout-warning-dialog.component";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Actions, createEffect, EffectNotification, ofType, OnRunEffects } from "@ngrx/effects";
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
	public starkSessionTimeoutWarning$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(StarkSessionActions.sessionTimeoutCountdownStart),
				map((action) => {
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
			),
		{ dispatch: false }
	);

	/**
	 * This method is used to close the dialog if the session timeout countdown has finished
	 *
	 * `dispatch: false` => because this effect does not dispatch an action
	 */
	public starkSessionTimeoutWarningClose$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(StarkSessionActions.sessionTimeoutCountdownFinish),
				map(() => {
					this.dialogService.closeAll();
				})
			),
		{ dispatch: false }
	);

	/**
	 * This method will be triggered before the session is open to determine if we should use the session timeout warning effect or not.
	 *
	 * See {@link https://github.com/ngrx/platform/blob/7.4.0/docs/effects/api.md#onruneffects|NGRX OnRunEffects}.
	 *
	 * @param resolvedEffects$ - The effects stream to be executed
	 */
	public ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification> {
		if (this.starkSessionUiConfig && this.starkSessionUiConfig.timeoutWarningDialogDisabled === true) {
			return this.actions$.pipe(exhaustMap(() => resolvedEffects$.pipe(takeUntil(of("stop")))));
		}

		return this.actions$.pipe(exhaustMap(() => resolvedEffects$));
	}
}
