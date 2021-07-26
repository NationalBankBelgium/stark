import { MenuPositionY } from "@angular/material/menu";

/**
 * Definition of the filter in the {@link StarkTableComponent}
 */
export interface StarkTableColumnFilter {
	/**
	 * Name of the column to filter.
	 */
	columnName: string;

	/**
	 * Value of the filter.
	 *
	 * The following wildcards are supported:
	 * - `*` to match any character(s)
	 * - `?` to match one character
	 *
	 * Use `\*` and `\?` to match exactly the characters `"*"` and `"?"`
	 */
	filterValue?: string;

	/**
	 * Whether the filter in the {@link StarkTableComponent} must be reset when the data changes.
	 *
	 * Default: `false`.
	 */
	resetFilterOnDataChange?: boolean;

	/**
	 * The position where the column filter box should be displayed.
	 *
	 * Default: `"below"`
	 */
	filterPosition?: MenuPositionY;
}
