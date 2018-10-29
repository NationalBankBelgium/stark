import { StarkActionBarConfig, StarkCustomizablePredefinedAction, StarkDefaultPredefinedAction } from "../../action-bar";

/**
 * This interface describes the properties of the action bar displayed in the generic search component.
 */
export interface StarkGenericSearchActionBarConfig extends StarkActionBarConfig {
	/**
	 * Configuration of the search action displayed in the Generic Search component
	 */
	search?: StarkDefaultPredefinedAction;

	/**
	 * Configuration of the new action displayed in the Generic Search component
	 */
	new?: StarkCustomizablePredefinedAction;

	/**
	 * Configuration of the reset action displayed in the Generic Search component
	 */
	reset?: StarkCustomizablePredefinedAction;
}
