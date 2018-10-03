import { StarkMenuGroup } from "./app-menu-group.intf";
/**
 * StarkMenuSection interface
 */
export interface StarkMenuSection {
	label: string;
	menuGroups: StarkMenuGroup[];
}
