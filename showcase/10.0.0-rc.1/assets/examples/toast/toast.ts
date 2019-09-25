import { Component, Inject } from "@angular/core";
import {
	STARK_TOAST_NOTIFICATION_SERVICE,
	StarkMessageType,
	StarkToastMessage,
	StarkToastNotificationResult,
	StarkToastNotificationService
} from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-toast",
	styleUrls: ["./demo-toast.component.scss"],
	templateUrl: "./demo-toast.component.html"
})
/**
 * Component to demo the toast notifications
 */
export class DemoToastComponent {
	/**
	 * Message, or ID of message displayed in the message in the message box (translations applies).
	 */
	public messageText = "Click one button to test the toast notification.";

	/**
	 * Message, or ID of message displayed in the toast (translations applies).
	 */
	public exampleMessage = "Lorem ipsum dolor sit amet, {{value}}";

	/**
	 * Memorize the state of the "hide toast" button
	 */
	public hideDisabled = true;

	/**
	 * Class constructor
	 * @param toastService - The toast notification service
	 */
	public constructor(@Inject(STARK_TOAST_NOTIFICATION_SERVICE) public toastService: StarkToastNotificationService) {}

	/**
	 * Opens an error toast
	 * @param message - Message displayed in the toast
	 * @param delay - Delay before toast hides (0 to avoid automatic hiding)
	 * @param action - Label of the action button (empty to remove the action button)
	 */
	public openErrorToast(message: string, delay: number = 3000, action?: string): void {
		this.openToast(message, delay, action, StarkMessageType.ERROR);
	}

	/**
	 * Opens an warning toast
	 * @param message - Message displayed in the toast
	 * @param delay - Delay before toast hides (0 to avoid automatic hiding)
	 * @param action - Label of the action button (empty to remove the action button)
	 */
	public openWarningToast(message: string, delay: number = 3000, action?: string): void {
		this.openToast(message, delay, action, StarkMessageType.WARNING);
	}

	/**
	 * Opens a toast
	 * @param message - Message displayed in the toast
	 * @param delay - Delay before toast hides (0 to avoid automatic hiding)
	 * @param action - Label of the action button (empty to remove the action button)
	 * @param type - Type of toast
	 */
	public openToast(message: string, delay?: number, action?: string, type: StarkMessageType = StarkMessageType.INFO): void {
		this.hideDisabled = false;
		const toastData: StarkToastMessage = {
			key: message,
			id: "1",
			code: "abc",
			type: type,
			actionLabel: action,
			interpolateValues: {
				value: "consectetur adipiscing elit. Sed non risus"
			}
		};
		if (typeof delay !== "undefined") {
			toastData.delay = delay;
		}
		this.toastService.show(toastData).subscribe((result: StarkToastNotificationResult) => {
			/** result contains the type of message sent by the toast service */
			switch (result) {
				case StarkToastNotificationResult.CLOSED_ON_DELAY_TIMEOUT:
					this.messageText = "Toast closed automatically after delay timeout.";
					this.hideDisabled = true;
					break;
				case StarkToastNotificationResult.ACTION_CLICKED:
					this.messageText = "You clicked the 'DISMISS' action!";
					this.hideDisabled = true;
					break;
				case StarkToastNotificationResult.HIDDEN:
					this.messageText = "You closed the toast!";
					this.hideDisabled = true;
					break;
				case StarkToastNotificationResult.CLOSED_BY_NEW_TOAST:
					this.messageText = "Toast automatically closed before displaying a new one.";
					break;
				default:
					this.messageText = "";
					this.hideDisabled = true;
					throw new Error("Unknown toast notification result!!");
			}
		});
	}

	/**
	 * Hides the currently displayed toast
	 */
	public hideToast(): void {
		this.toastService.hide();
	}
}
