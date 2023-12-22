import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Renderer2,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";
import { STARK_PRETTY_PRINT_SERVICE, StarkPrettyPrintService } from "../services";
import { StarkPrettyPrintFormat } from "../types";

/**
 * @ignore
 */
const componentName = "stark-pretty-print";

/* eslint-disable jsdoc/check-alignment,jsdoc/check-indentation */
/**
 * Component to format and highlight code like HTML, CSS, Typescript...
 * Can be used to display code examples
 *
 * To be able to highlight the pretty-printed code, a CSS file from the PrismJS library is needed.
 * The CSS file of your choice needs to be imported in your client application that uses stark-ui as follows:
 *
```css
@import "~prismjs/themes/prism-okaidia.css";
```
 *
 * The different themes are shown on the PrismJS website
 *   - {@link https://prismjs.com/|PrismJS website}
 *   - {@link https://github.com/PrismJS/prism/tree/master/themes|PrismJS theme files}
 */

/* eslint-enable jsdoc/check-alignment, jsdoc/check-indentation */
@Component({
	selector: "stark-pretty-print",
	templateUrl: "./pretty-print.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkPrettyPrintComponent extends AbstractStarkUiComponent implements OnChanges, OnInit {
	/**
	 * The text to be pretty printed
	 */
	@Input()
	public data = "";

	/**
	 * The format to be used to pretty print the data string
	 */
	@Input()
	public get format(): StarkPrettyPrintFormat | undefined {
		return this._format;
	}

	public set format(value: StarkPrettyPrintFormat | undefined) {
		this._format = typeof value !== "undefined" ? <StarkPrettyPrintFormat>value.toLowerCase() : undefined;
	}

	// Information about input setter coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_format: StarkPrettyPrintFormat | Uppercase<StarkPrettyPrintFormat> | undefined;

	private _format?: StarkPrettyPrintFormat;

	/**
	 * If true, also highlight the pretty printed string
	 */
	@Input()
	public enableHighlighting?: boolean;

	/**
	 * The final prettified string
	 */
	public prettyString = "";

	/**
	 * Whether the prettified string should be highlighted as well
	 */
	public highlightingEnabled = false;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param cdRef - Reference to the change detector attached to this component.
	 * @param prettyPrintService - The `StarkPrettyPrintService` needed to format the data and highlight the inserted data.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		private cdRef: ChangeDetectorRef,
		@Inject(STARK_PRETTY_PRINT_SERVICE) public prettyPrintService: StarkPrettyPrintService,
		renderer: Renderer2,
		elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Component lifecycle hook
	 * @param _onChangesObj - Contains the changed properties
	 */
	public ngOnChanges(_onChangesObj: SimpleChanges): void {
		if (!this.data || !this.format) {
			this.prettyString = this.data;
			return;
		}

		this.highlightingEnabled = !!this.enableHighlighting;
		this.prettyString = "";

		if (this.data && this.data.length > 0) {
			this.prettyPrintService.format(this.data, this.format, this.highlightingEnabled).subscribe(
				(value: string): void => {
					this.prettyString = value;
					this.cdRef.detectChanges();
				},
				(value: string) => {
					// when have an error with the data and format unknown the service throw and observable error and then give back the value
					// in this case we should disable the highlighting.
					this.prettyString = value;
					this.highlightingEnabled = false;
					this.cdRef.detectChanges();
				}
			);
		}
	}
}
