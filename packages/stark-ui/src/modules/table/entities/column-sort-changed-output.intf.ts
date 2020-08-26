import { StarkTableColumnSortingDirection } from "./table-column-sorting-direction.type";

/**
 * Definition of the output value of StarkTableColumn sortChanged Output
 */
export interface StarkColumnSortChangedOutput {
	/**
	 * Name of the property that will be the source of the column.
	 */
	name: string;

	/**
	 * Whether the column is sortable or not.
	 *
	 * Default: `true`
	 */
	sortable: boolean;

	/**
	 * Sorting direction of the column.
	 */
	sortDirection: StarkTableColumnSortingDirection;

	/**
	 * Priority of the column.
	 */
	sortPriority: number;
}
