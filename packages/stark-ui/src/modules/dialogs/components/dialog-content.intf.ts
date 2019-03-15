/**
 * Describes the basic content that can be shown in a predefined Dialog component from Stark.
 * See: {@link StarkAlertDialogComponent}, {@link StarkConfirmDialogComponent}, {@link StarkPromptDialogComponent}
 */
export interface StarkBaseDialogContent {
	/**
	 * Dialog's title.
	 */
	title?: string;

	/**
	 * Dialog's simple text content.
	 */
	textContent?: string;

	/**
	 * Label to be set in the "Ok" button.
	 */
	ok?: string;
}
