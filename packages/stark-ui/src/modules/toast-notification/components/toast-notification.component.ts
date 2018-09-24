import { Component, HostBinding, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBar } from "@angular/material/snack-bar";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkMessageType } from "../../../common/message";
import { StarkToastMessage } from "./toast-message.intf";

/**
 * Name of the component
 */
const componentName: string = "stark-toast-notification";

/**
 * Component display stark's toast notification (based on Angular Material's MatSnackBar) with custom html
 */
@Component({
	selector: "stark-toast-notification",
	templateUrl: "./toast-notification.component.html",
	encapsulation: ViewEncapsulation.None
})
export class StarkToastNotificationComponent implements OnInit {
	/**
	 * Adds class="stark-toast-notification" attribute on the host component
	 */
	@HostBinding("class")
	public class: string = componentName;

	/**
	 * The message data linked to the toast notification.
	 */
	public message: StarkToastMessage;

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param snackBar - Tha snackBar used to display the toast
	 * @param data - the data linked to the toast notification
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		public snackBar: MatSnackBar,
		@Inject(MAT_SNACK_BAR_DATA) public data: StarkToastMessage
	) {
		this.message = data;
		this.logger.debug(componentName + ": data received : %o", this.message);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");
	}

	/**
	 * Closes the toast
	 */
	public closeToast(): void {
		// get the reference to the current open toast (this one) from the MatSnackBar service and dismiss it
		if (this.snackBar._openedSnackBarRef) {
			this.snackBar._openedSnackBarRef.dismissWithAction();
		}
	}

	/**
	 * Generate the css class of the toast notification based on its type
	 * @returns a string containing the css class of the toast notification
	 */
	public getMessageTypeClass(): string {
		switch (this.message.type) {
			case StarkMessageType.WARNING:
				return "stark-toast-message-warning";
			case StarkMessageType.ERROR:
				return "stark-toast-message-error";
			case StarkMessageType.INFO:
				return "stark-toast-message-info";
			default:
				this.logger.error(componentName + ": unknown message type.");
				return "";
		}
	}
}
