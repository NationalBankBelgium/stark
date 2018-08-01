import { OnInit, Input, Renderer2, ElementRef } from "@angular/core";

/**
 * Abstract class to add the right stark class color to the elementRef
 */
export abstract class AbstractStarkUiComponent implements OnInit {
	/**
	 * Color theme
	 */
	@Input()
	public color?: string; // Needs to be public for Angular to be able to read this property inside the template.

	protected constructor(protected renderer: Renderer2, protected elementRef: ElementRef) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		if (this.color) {
			this.renderer.addClass(this.elementRef.nativeElement, "stark-" + this.color);
		}
	}
}
