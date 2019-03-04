import { Component, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
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
import { ReferenceLink } from "../../../shared/components/reference-block";

/* tslint:disable:no-identical-functions */
@Component({
	selector: "demo-dialogs",
	templateUrl: "./dialogs-page.component.html",
	styleUrls: ["./dialogs-page.component.scss"]
})
export class DemoDialogsPageComponent {
	public referenceList: ReferenceLink[];
	public dialogStatus: string;
	public dialogResult: any = "";

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService, public dialogService: MatDialog) {
		this.referenceList = [
			{
				label: "Stark Alert Dialog component",
				url: "blabla"
			},
			{
				label: "Stark Confirm Dialog component",
				url: "blabla"
			},
			{
				label: "Stark Prompt Dialog component",
				url: "blabla"
			}
		];
	}

	public showAlert(): void {
		this.dialogService
			.open<StarkAlertDialogComponent, StarkAlertDialogContent, StarkAlertDialogResult>(StarkAlertDialogComponent, {
				data: {
					title: "SHOWCASE.DEMO.DIALOGS.ALERT.TITLE",
					textContent: "SHOWCASE.DEMO.DIALOGS.ALERT.TEXT",
					ok: "SHOWCASE.DEMO.DIALOGS.ALERT.OK"
				},
				ariaLabel: "Alert Dialog Demo"
			})
			.afterClosed()
			.subscribe((result: StarkAlertDialogResult) => {
				this.dialogResult = result || "undefined";
				if (result === "ok") {
					this.dialogStatus = "SHOWCASE.DEMO.DIALOGS.ALERT.RESULT_OK";
				} else {
					this.dialogStatus = "SHOWCASE.DEMO.DIALOGS.ALERT.RESULT_CANCEL";
				}
			});
	}

	public showConfirm(): void {
		this.dialogService
			.open<StarkConfirmDialogComponent, StarkConfirmDialogContent, StarkConfirmDialogResult>(StarkConfirmDialogComponent, {
				data: {
					title: "SHOWCASE.DEMO.DIALOGS.CONFIRM.TITLE",
					textContent: "SHOWCASE.DEMO.DIALOGS.CONFIRM.TEXT",
					ok: "SHOWCASE.DEMO.DIALOGS.CONFIRM.OK",
					cancel: "SHOWCASE.DEMO.DIALOGS.CONFIRM.CANCEL"
				},
				ariaLabel: "Lucky day"
			})
			.afterClosed()
			.subscribe((result: StarkConfirmDialogResult) => {
				this.dialogResult = result || "undefined";
				if (result === "ok") {
					this.dialogStatus = "SHOWCASE.DEMO.DIALOGS.CONFIRM.RESULT_OK";
				} else {
					this.dialogStatus = "SHOWCASE.DEMO.DIALOGS.CONFIRM.RESULT_CANCEL";
				}
			});
	}

	public showPrompt(): void {
		this.dialogService
			.open<StarkPromptDialogComponent, StarkPromptDialogContent, StarkPromptDialogResult>(StarkPromptDialogComponent, {
				data: {
					title: "SHOWCASE.DEMO.DIALOGS.PROMPT.TITLE",
					textContent: "SHOWCASE.DEMO.DIALOGS.PROMPT.TEXT",
					placeholder: "SHOWCASE.DEMO.DIALOGS.PROMPT.PLACEHOLDER",
					initialValue: "",
					ok: "SHOWCASE.DEMO.DIALOGS.PROMPT.OK",
					cancel: "SHOWCASE.DEMO.DIALOGS.PROMPT.CANCEL"
				},
				ariaLabel: "Dog name"
			})
			.afterClosed()
			.subscribe((result: StarkPromptDialogResult) => {
				this.dialogResult = result || "undefined";
				if (result === "cancel") {
					this.dialogStatus = "SHOWCASE.DEMO.DIALOGS.PROMPT.RESULT_CANCEL";
				} else {
					this.dialogStatus = "SHOWCASE.DEMO.DIALOGS.PROMPT.RESULT_OK";
				}
			});
	}
}
