import { Directive, ElementRef, EmbeddedViewRef, TemplateRef } from "@angular/core";

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
export class StarkTableExpandDetailDirective extends TemplateRef<any> {
	public readonly elementRef: ElementRef;

	// IMPORTANT: The "projected" content will be injected in the "template" property of this directive
	// This is a workaround to be able to get the "projected" content and to add it as a nested "projected" content of the <stark-table-column>
	public constructor(public readonly template: TemplateRef<any>) {
		super();
		this.elementRef = this.template.elementRef;
	}

	/**
	 * @ignore
	 * @internal
	 */
	public createEmbeddedView(context: any): EmbeddedViewRef<any> {
		return this.template.createEmbeddedView(context);
	}
}
