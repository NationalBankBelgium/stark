import { StarkBaseDialogContent } from "./dialog-content.intf";

/**
 * Content that can be shown in the {@link StarkPromptDialogComponent}
 */
export interface StarkPromptDialogContent extends StarkBaseDialogContent {
	/**
	 * Text to be shown as label of the prompt input.
	 */
	label?: string;

	/**
	 * Placeholder text of the prompt input.
	 */
	placeholder?: string;

	/**
	 * Initial value to be set to the prompt input.
	 */
	initialValue?: string;

	/**
	 * Label to be set in the "Cancel" button.
	 */
	cancel?: string;
}
