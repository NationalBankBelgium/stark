import { InjectionToken } from "@angular/core";

/**
 * Type defining the position of the MatSnackBar on the screen.
 */
export type StarkToastNotificationPosition = "bottom left" | "bottom right" | "top left" | "top right";

/**
 * {@link https://v7.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkToastNotificationPosition}
 */
export const STARK_TOAST_NOTIFICATION_OPTIONS: InjectionToken<StarkToastNotificationOptions> = new InjectionToken<StarkToastNotificationOptions>(
	"StarkToastNotificationOptions"
);

/**
 * Available options for the toast notifications to be shown via the {@link StarkToastNotificationComponent}
 */
export interface StarkToastNotificationOptions {
	/**
	 * How many milliseconds the toast will be displayed before automatically closing.
	 * If set to `0`, the toast will stay open until closed manually
	 */
	delay: number;

	/**
	 * The position where the toast will be shown: any combination of `"bottom"/"left"/"center"/"start"/"end"` and `"top"/"right"`
	 */
	position: StarkToastNotificationPosition;

	/**
	 * Array containing the CSS classes to be applied to the action button (if the message contains an action to be displayed)
	 */
	actionClasses: string[];
}
