import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { StarkAlertDialogContent } from "./alert-dialog-content.intf";

/**
 * Possible results of the {@link StarkAlertDialogComponent} after being closed.
 *
 * - "ok": The user clicked on the "Ok" button
 * - `undefined`: The dialog was cancelled by either clicking outside of dialog or by pressing the ESC key
 */
export type StarkAlertDialogResult = "ok" | undefined;

/**
 * Alert dialog component to be opened via the Angular Material's {@link MatDialog} service
 */
@Component({
	selector: "stark-alert-dialog",
	templateUrl: "./alert-dialog.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: "stark-alert-dialog"
	}
})
export class StarkAlertDialogComponent {
	/**
	 * Class constructor
	 * @param dialogRef - Reference this dialog instance
	 * @param content - Content to be shown in the alert dialog (dynamically translated via the Translate service if the
	 * provided text is defined in the translation keys)
	 */
	public constructor(
		public dialogRef: MatDialogRef<StarkAlertDialogComponent, StarkAlertDialogResult>,
		@Inject(MAT_DIALOG_DATA) public content: StarkAlertDialogContent
	) {}

	/**
	 * Callback method to be triggered when the "Ok" button is clicked
	 */
	public onOk(): void {
		this.dialogRef.close("ok");
	}
}
