import { StarkActionBarConfig } from "@nationalbankbelgium/stark-ui/src/modules/action-bar";

/**
 * StarkTableRowActions interface
 */
export interface StarkTableRowActions extends StarkActionBarConfig {
	/**
	 * Should the actions always be shown on the right side of the table (sticky)
	 *
	 * Default: `false`
	 */
	isFixed?: boolean;
}
