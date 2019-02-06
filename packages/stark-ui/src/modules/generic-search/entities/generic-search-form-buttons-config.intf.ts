import { StarkFormButton, StarkFormCustomizablePredefinedButton, StarkFormDefaultPredefinedButton } from "./form-action.intf";

/**
 * This interface describes the properties of the buttons displayed below of the search form in the generic search component.
 */
export interface StarkGenericSearchFormButtonsConfig {
	/**
	 * Configuration of the search button displayed in the Generic Search component
	 */
	search?: StarkFormDefaultPredefinedButton;

	/**
	 * Configuration of the new button displayed in the Generic Search component
	 */
	new?: StarkFormCustomizablePredefinedButton;

	/**
	 * Configuration of the reset button displayed in the Generic Search component
	 */
	reset?: StarkFormCustomizablePredefinedButton;

	/**
	 * Array of {StarkFormButton} buttons that can be displayed beside the default buttons in the Generic Search component
	 */
	custom?: StarkFormButton[];
}
