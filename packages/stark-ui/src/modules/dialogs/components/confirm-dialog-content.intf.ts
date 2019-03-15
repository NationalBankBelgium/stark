import { StarkBaseDialogContent } from "./dialog-content.intf";

/**
 * Content that can be shown in the {@link StarkConfirmDialogComponent}
 */
export interface StarkConfirmDialogContent extends StarkBaseDialogContent {
	/**
	 * Label to be set in the "Cancel" button.
	 */
	cancel?: string;
}
