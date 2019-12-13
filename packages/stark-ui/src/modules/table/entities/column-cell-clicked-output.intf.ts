/**
 * Definition of the output value of StarkTableColumn cellClicked Output
 */
export interface StarkColumnCellClickedOutput {
	/**
	 * The value of the cell that was clicked
	 */
	value: any;

	/**
	 * The column name that the cell belongs to
	 */
	columnName: string;

	/**
	 * The row object that contains the cell that was clicked
	 */
	row: object;
}
