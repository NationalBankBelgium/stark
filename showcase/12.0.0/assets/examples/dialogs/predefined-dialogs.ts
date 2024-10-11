import { Component, Inject } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import {
	StarkAlertDialogComponent,
	StarkAlertDialogContent,
	StarkAlertDialogResult,
	StarkConfirmDialogComponent,
	StarkConfirmDialogContent,
	StarkConfirmDialogResult,
	StarkPromptDialogComponent,
	StarkPromptDialogContent,
	StarkPromptDialogResult
} from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-dialogs",
	templateUrl: "./demo-dialogs.component.html"
})
export class DemoDialogsComponent {
	public dialogStatus = "";

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		public dialogService: MatDialog
	) {}

	public showAlert(): void {
		this.dialogService
			.open<StarkAlertDialogComponent, StarkAlertDialogContent, StarkAlertDialogResult>(StarkAlertDialogComponent, {
				data: {
					title: "This is an alert title",
					textContent: "You can specify some description text in here.",
					ok: "Got it!"
				},
				ariaLabel: "Alert Dialog Demo"
			})
			.afterClosed()
			.subscribe((result: StarkAlertDialogResult) => {
				if (result === "ok") {
					this.dialogStatus = `Alert dialog closed with value '${result}'`;
				} else {
					this.dialogStatus = `Alert dialog cancelled with value '${result}'`;
				}
			});
	}

	public showConfirm(): void {
		this.dialogService
			.open<StarkConfirmDialogComponent, StarkConfirmDialogContent, StarkConfirmDialogResult>(StarkConfirmDialogComponent, {
				data: {
					title: "Would you like to delete your debt?",
					textContent: "All of the banks have agreed to forgive you your debts.",
					ok: "Please do it!",
					cancel: "Sounds like a scam"
				},
				ariaLabel: "Lucky day"
			})
			.afterClosed()
			.subscribe((result: StarkConfirmDialogResult) => {
				if (result === "ok") {
					this.dialogStatus = "You decided to get rid of your debt.";
				} else {
					this.dialogStatus = "You decided to keep your debt.";
				}
			});
	}

	public showPrompt(): void {
		this.dialogService
			.open<StarkPromptDialogComponent, StarkPromptDialogContent, StarkPromptDialogResult>(StarkPromptDialogComponent, {
				data: {
					title: "What would you name your dog?",
					textContent: "Bowser is a common name.",
					placeholder: "Dog name",
					initialValue: "",
					ok: "Okay!",
					cancel: "I'm a cat person"
				},
				ariaLabel: "Dog name"
			})
			.afterClosed()
			.subscribe((result: StarkPromptDialogResult) => {
				if (result === "cancel") {
					this.dialogStatus = "You didn't name your dog.";
				} else {
					this.dialogStatus = `You decided to name your dog '${result}'`;
				}
			});
	}
}
