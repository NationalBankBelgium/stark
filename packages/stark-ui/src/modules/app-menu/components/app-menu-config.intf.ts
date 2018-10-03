import { StarkMenuGroup } from "./app-menu-group.intf";
import { StarkMenuSection } from "./app-menu-section.intf";
/**
 * StarkMenuConfig interface
 */
export interface StarkMenuConfig {
	menuGroups?: StarkMenuGroup[];
	menuSections?: StarkMenuSection[];
}
