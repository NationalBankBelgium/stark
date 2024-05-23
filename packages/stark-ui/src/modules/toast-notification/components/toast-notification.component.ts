import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA, MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkMessageType } from "@nationalbankbelgium/stark-ui/src/common";
import { StarkToastMessage } from "./toast-message.intf";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";

/**
 * @ignore
 */
const componentName = "stark-toast-notification";

/**
 * Component display stark's toast notification (based on Angular Material's MatSnackBar) with custom html
 */
@Component({
	selector: "stark-toast-notification",
	templateUrl: "./toast-notification.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkToastNotificationComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * The message data linked to the toast notification.
	 */
	public message: StarkToastMessage;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param snackBar - Tha snackBar used to display the toast
	 * @param data - The data linked to the toast notification
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		public snackBar: MatSnackBar,
		@Inject(MAT_SNACK_BAR_DATA) public data: StarkToastMessage,
		renderer: Renderer2,
		elementRef: ElementRef
	) {
		super(renderer, elementRef);
		this.message = data;
		this.logger.debug(componentName + ": data received : %o", this.message);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
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
	 * Generate the CSS class of the toast notification based on its type
	 * @returns A string containing the CSS class of the toast notification
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
