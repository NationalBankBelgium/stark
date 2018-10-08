import { StarkMenuGroup } from "./app-menu-group.intf";
import { StarkMenuSection } from "./app-menu-section.intf";

/**
 * StarkMenuConfig interface
 */
export interface StarkMenuConfig {
	/**
	 * Array of menu groups to include in the menu.
	 */
	menuGroups?: StarkMenuGroup[];

	/**
	 * Array of menu sections to include in the menu. The menu sections provide a way to group a set of menu groups.
	 */
	menuSections?: StarkMenuSection[];
}
