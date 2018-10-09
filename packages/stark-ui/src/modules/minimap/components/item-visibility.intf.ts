import { StarkMinimapItemProperties } from "./item-properties.intf";

/**
 * Indicates if a item is visible or not
 */
export interface ItemVisibility {
	/**
	 * is the item visible
	 */
	isVisible: boolean;

	/**
	 * the item to display/hide
	 */

	item: StarkMinimapItemProperties;
}
