import { Directive } from "@angular/core";

/**
 * This directive can be used inside <stark-table> if you want rows to be collapsible.
 *
 * @example
 * <stark-table>
 *     <ng-container *starkTableExpandDetail="let row">
 * 	    <!-- anything you want to display -->
 *     </ng-container>
 * </stark-table>
 */
@Directive({
	selector: "[starkTableExpandDetail]"
})
export class StarkTableExpandDetailDirective {}
