/**
 * Definition of the output value of StarkTableColumn filterChanged Output
 */
export interface StarkColumnFilterChangedOutput {
	/**
	 * Name of the property that will be the source of the column.
	 */
	name: string;

	/**
	 * Value of the filter
	 * Wildcards can be used: "*" to match any anything and "?" to match one character.
	 * Use "\*" and "\?" to match exactly the characters "*" and "?"
	 */
	filterValue?: string;
}
