import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { StarkConfirmDialogContent } from "./confirm-dialog-content.intf";

/**
 * Possible results of the {@link StarkConfirmDialogComponent} after being closed.
 *
 * - "ok": The user clicked on the "Ok" button
 * - "cancel": The dialog was cancelled by clicking on the "Cancel" button
 * - `undefined`: The dialog was cancelled either by clicking outside of dialog or by pressing the ESC key
 */
export type StarkConfirmDialogResult = "ok" | "cancel" | undefined;

/**
 * Confirmation dialog component to be opened via the Angular Material's {@link MatDialog} service
 */
@Component({
	selector: "stark-confirm-dialog",
	templateUrl: "./confirm-dialog.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: "stark-confirm-dialog"
	}
})
export class StarkConfirmDialogComponent {
	/**
	 * Class constructor
	 * @param dialogRef - Reference this dialog instance
	 * @param content - Content to be shown in the confirmation dialog (dynamically translated via the [@link TranslateService} service if the
	 * provided text is defined in the translation keys)
	 */
	public constructor(
		public dialogRef: MatDialogRef<StarkConfirmDialogComponent, StarkConfirmDialogResult>,
		@Inject(MAT_DIALOG_DATA) public content: StarkConfirmDialogContent
	) {}

	/**
	 * Callback method to be triggered when the "Cancel" button is clicked
	 */
	public onCancel(): void {
		this.dialogRef.close("cancel");
	}

	/**
	 * Callback method to be triggered when the "Ok" button is clicked
	 */
	public onOk(): void {
		this.dialogRef.close("ok");
	}
}
