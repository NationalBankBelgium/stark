import { StarkMenuGroup } from "./app-menu-group.intf";

/**
 * StarkMenuSection interface
 */
export interface StarkMenuSection {
	/**
	 * Text to be displayed as the label in the header of the menu section
	 * (dynamically translated via the Translate service if the provided text is defined in the translation keys).
	 */
	label: string;

	/**
	 * Array of menu groups to include in this section.
	 */
	menuGroups: StarkMenuGroup[];
}
