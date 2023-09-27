import { AfterViewChecked, Directive, ElementRef, Inject, Input, OnInit, Renderer2 } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

/**
 * @ignore
 */
const directiveName = "[starkSvgViewBox]";

/**
 * Default value for the width and height of the 'viewBox' attribute if it is not given as an input.
 */
export const STARK_DEFAULT_VIEW_BOX_SIZE = 24;

/**
 * Directive to add the 'viewBox' attribute to an SVG element.
 *
 * Specially useful to fix the issue with the Angular Material's MatIcon directive which prevents the icons from
 * being re-sized via CSS due to the 'viewBox' property not being added to the SVG element.
 *
 *  - {@link https://github.com/angular/material2/issues/4422|Angular Material issue #4422}
 *
 *  - {@link https://github.com/angular/material2/issues/5488|Angular Material issue #5488}
 */
@Directive({
	selector: directiveName
})
export class StarkSvgViewBoxDirective implements AfterViewChecked, OnInit {
	/**
	 * Width and height to be set to the 'viewBox' attribute of the SVG element.
	 */
	/* eslint-disable @angular-eslint/no-input-rename */
	@Input("starkSvgViewBox")
	private viewBoxSize: number = STARK_DEFAULT_VIEW_BOX_SIZE;

	/**
	 * SVG element to which the viewBox attribute should be added.
	 */
	private svgIcon?: SVGElement;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param element - Reference to the DOM element where this directive is applied to.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService,
		public element: ElementRef<HTMLElement>,
		public renderer: Renderer2
	) {}

	/**
	 * Directive lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(directiveName + ": directive initialized");
	}

	/**
	 * Directive lifecycle hook
	 */
	public ngAfterViewChecked(): void {
		// the svg icon inside the <mat-icon> is only present at this point
		// ensure that this should be set only once since the ngAfterViewChecked is triggered continuously
		if (!this.svgIcon) {
			this.svgIcon = this.element.nativeElement.querySelector("svg") || undefined;
			this.viewBoxSize = this.viewBoxSize || STARK_DEFAULT_VIEW_BOX_SIZE;

			// set the "viewBox" attribute only if the SVG element doesn't have any defined
			if (this.svgIcon) {
				// viewBox value: the points "seen" in the SVG drawing area. Four values separated by white space or commas. (min x, min y, width, height)
				const viewBoxValue = `0 0 ${this.viewBoxSize} ${this.viewBoxSize}`;
				this.renderer.setAttribute(this.svgIcon, "viewBox", viewBoxValue);
			}
		}
	}
}
