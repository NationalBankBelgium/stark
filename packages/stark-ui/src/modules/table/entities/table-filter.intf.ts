import { StarkTableColumnFilter } from "./table-column-filter.intf";
import { MenuPositionY } from "@angular/material/menu";

/**
 * Represents the column filtering options of the {@link StarkTableComponent}.
 */
export interface StarkTableFilter {
	/**
	 * Whether or not to display the global filter.
	 *
	 * Default: `true`.
	 */
	globalFilterPresent?: boolean;

	/**
	 * Value of the filter for all displayed columns.
	 *
	 * The following wildcards are supported:
	 * - `*` to match any character(s)
	 * - `?` to match one character
	 *
	 * Use `\*` and `\?` to match exactly the characters `"*"` and `"?"`
	 */
	globalFilterValue?: string;

	/**
	 * Array of {@link StarkTableColumnFilter} objects that define column filters
	 */
	columns?: StarkTableColumnFilter[];

	/**
	 * Whether the filter in the {@link StarkTableComponent} must be reset when the data changes.
	 *
	 * Default: `false`.
	 */
	resetGlobalFilterOnDataChange?: boolean;

	/**
	 * The position in which the global filter box for the table should be displayed.
	 *
	 * Default: `"below"`
	 */
	filterPosition?: MenuPositionY;
}
