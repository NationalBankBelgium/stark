import { StarkMenuEntry } from "./app-menu-entry.intf";

/**
 * StarkMenuGroup interface
 */
export interface StarkMenuGroup extends StarkMenuEntry {
	/**
	 * Array of entries described by StarkMenuGroup objects
	 */
	entries?: StarkMenuGroup[];
}
