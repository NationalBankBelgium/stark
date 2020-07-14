import { Directive, TemplateRef } from "@angular/core";

/**
 * This directive can be used inside <stark-table> if you want to customize the render of the table's cells
 * A set of variables are available and therefore can be used to get the proper result :
 * - rowData : an array that contains information about a data row
 * - cellRawValue : the value of the cell unformatted
 * - cellDisplayedValue : the formatted value of the cell
 *
 * @example
 * <stark-table>
 *     <ng-container [ngSwitch]="true" *starkTableRowContent="let rowData = rowData; let cellRawValue = rawValue; let cellDisplayedValue = displayedValue">
 *          <!-- anycode you want to use to display table's cells -->
 *
 *          <!-- ie: if you want to add an icon under certain circomstances -->
 *          <div *ngSwitchCase="rowData.id === 1">
 *             <span style="color: blue">{{ cellDisplayedValue }}</span>
 *          </div>
 *          <div *ngSwitchCase="cellRawValue > 23">
 *             <mat-icon class="mat-icon-rtl-mirror" svgIcon="thumb-up"></mat-icon> {{ cellDisplayedValue }}
 *          </div>
 *          <div *ngSwitchDefault>{{ cellDisplayedValue }}</div>
 *     </ng-container>
 * </stark-table>
 */
@Directive({
	selector: "[starkTableRowContent]"
})
export class StarkTableRowContentDirective {
	// IMPORTANT: The "projected" content will be injected in the "template" property of this directive
	// This is a workaround to be able to get the "projected" content and to add it as a nested "projected" content of the <stark-table-column>
	public constructor(public readonly template: TemplateRef<any>) {}
}
