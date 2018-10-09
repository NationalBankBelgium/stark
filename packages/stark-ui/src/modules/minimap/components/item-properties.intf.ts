/**
 * Represents the properties of an item inside the Stark Minimap component.
 */
export interface StarkMinimapItemProperties {
	/**
	 * The name of the item
	 */
	name: string;

	/**
	 * The label of the item (optional). If not provided, then the name of the item will be used.
	 */
	label?: string;
}
