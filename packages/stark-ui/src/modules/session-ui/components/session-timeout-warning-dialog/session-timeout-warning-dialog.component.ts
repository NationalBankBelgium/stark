import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { interval, Observable } from "rxjs";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { map, startWith, take, tap } from "rxjs/operators";

/**
 * @ignore
 */
const componentName = "stark-session-timeout-warning-dialog";

/**
 * Component to display a session timeout warning dialog
 */
@Component({
	selector: "stark-session-timeout-warning-dialog",
	templateUrl: "./session-timeout-warning-dialog.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarkSessionTimeoutWarningDialogComponent implements OnInit {
	/**
	 * countdown Time in seconds before the current session expires.
	 */
	public countdown$!: Observable<number>;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param dialogRef - The `MatDialogRef` reference to the `StarkSessionTimeoutWarningDialogComponent`.
	 * @param countdown - Countdown before the session times out
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(MatDialogRef) private dialogRef: MatDialogRef<StarkSessionTimeoutWarningDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private countdown: number
	) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");
		this.countdown$ = interval(1000).pipe(
			take(this.countdown),
			startWith(-1),
			map((value: number) => this.countdown - value - 1), // -1 due to the delay of the dialog animation
			tap((value: number) => {
				if (value === 0) {
					this.dialogRef.close("countdown-finished");
				}
			})
		);
	}

	/**
	 * This methods is used to close the dialog and to send an answer indicating that the user should keep logged.
	 */
	public keepSession(): void {
		this.dialogRef.close("keep-logged");
	}
}
