import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { StarkPromptDialogContent } from "./prompt-dialog-content.intf";

/**
 * Possible results of the {@link StarkPromptDialogComponent} after being closed.
 *
 * - `string`: The value provided by the user in the dialog's input after clikcing the "Ok" button.
 * - "cancel": The dialog was cancelled by clicking on the "Cancel" button
 * - `undefined`: The dialog was cancelled either by clicking outside of dialog or by pressing the ESC key
 */
export type StarkPromptDialogResult = string | "cancel" | undefined;

/**
 * Prompt dialog component to be opened via the Angular Material's {@link MatDialog} service
 */
@Component({
	selector: "stark-prompt-dialog",
	templateUrl: "./prompt-dialog.component.html",
	encapsulation: ViewEncapsulation.None,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: "stark-prompt-dialog"
	}
})
export class StarkPromptDialogComponent {
	/**
	 * @ignore
	 */
	public formControl: FormControl;

	/**
	 * Class constructor
	 * @param dialogRef - Reference this dialog instance
	 * @param content - Content to be shown in the prompt dialog (dynamically translated via the [@link TranslateService} service if the
	 * provided text is defined in the translation keys)
	 */
	public constructor(
		public dialogRef: MatDialogRef<StarkPromptDialogComponent, StarkPromptDialogResult>,
		@Inject(MAT_DIALOG_DATA) public content: StarkPromptDialogContent
	) {
		this.formControl = new FormControl(this.content.initialValue);
	}

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
		this.dialogRef.close(this.formControl.value);
	}
}
