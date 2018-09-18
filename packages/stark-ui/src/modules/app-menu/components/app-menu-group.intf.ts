import { StarkMenuEntry } from "./app-menu-entry.intf";

/**
 * StarkMenuGroup interface
 */
export interface StarkMenuGroup extends StarkMenuEntry {
	entries?: StarkMenuGroup[];
}
