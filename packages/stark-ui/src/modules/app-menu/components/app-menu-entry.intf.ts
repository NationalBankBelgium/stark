/**
 * StarkMenuEntry interface
 */
export interface StarkMenuEntry {
	/**
	 * Id of the container of the menu group/entry
	 */
	id: string;

	/**
	 * Icon to display next to the menu group/entry label.
	 */
	icon?: string;

	/**
	 * Text to be displayed as the label in the header of the menu group/entry
	 * (dynamically translated via the Translate service if the provided text is defined in the translation keys).
	 */
	label: string;

	/**
	 * Whether the menu group/entry should be visible or not.
	 */
	isVisible: boolean;

	/**
	 * Whether the menu group/entry should be enabled for user interaction or not.
	 */
	isEnabled: boolean;

	/**
	 * Name of the Router state that will be navigated to when the header of the menu group/entry is clicked.
	 */
	targetState?: string;

	/**
	 * Params object to be passed to the Router state defined as targetState.
	 */
	targetStateParams?: { [param: string]: any };
}
