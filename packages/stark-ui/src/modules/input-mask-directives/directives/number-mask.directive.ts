import { Directive, ElementRef, forwardRef, Inject, Input, OnChanges, Optional, Provider, Renderer2, SimpleChanges } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MaskedInputDirective, TextMaskConfig as Ng2TextMaskConfig } from "angular2-text-mask";
import { createNumberMask } from "text-mask-addons";
import { StarkNumberMaskConfig } from "./number-mask-config.intf";

/**
 * @ignore
 */
const directiveName = "[starkNumberMask]";

/**
 * @ignore
 */
export const STARK_NUMBER_MASK_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// eslint-disable-next-line @angular-eslint/no-forward-ref
	useExisting: forwardRef(() => StarkNumberMaskDirective),
	multi: true
};

/**
 * Directive to display a number mask in input elements. This directive internally uses the {@link https://github.com/text-mask/text-mask/tree/master/core|text-mask-core} library
 * to provide the input mask functionality.
 *
 * **`IMPORTANT:`** Currently the Number Mask supports only input of type text, tel, url, password, and search.
 * Due to a limitation in browser API, other input types, such as email or number, cannot be supported.
 *
 * ### Disabling the mask
 * Passing an `undefined` value as config to the directive will disable the mask.
 *
 * @example
 * <input type="text" [starkNumberMask]="yourMaskConfig">
 * <!-- or -->
 * <input type="text" [(ngModel)]="yourModelValue" [starkNumberMask]="yourMaskConfig">
 * <!-- or -->
 * <input type="text" [formControl]="yourFormControl" [starkNumberMask]="yourMaskConfig">
 *
 */
@Directive({
	host: {
		"(input)": "_handleInput($event.target.value)",
		"(blur)": "onTouched()",
		"(compositionstart)": "_compositionStart()",
		"(compositionend)": "_compositionEnd($event.target.value)"
	},
	selector: directiveName,
	exportAs: "starkNumberMask",
	providers: [STARK_NUMBER_MASK_VALUE_ACCESSOR]
})
export class StarkNumberMaskDirective extends MaskedInputDirective implements OnChanges {
	/**
	 * Configuration object for the mask to be displayed in the input field.
	 */
	/* eslint-disable @angular-eslint/no-input-rename */
	@Input("starkNumberMask")
	public maskConfig: StarkNumberMaskConfig = {};

	/**
	 * @ignore
	 */
	public elementRef: ElementRef;

	/**
	 * Default configuration.
	 * It will be merged with the configuration passed to the directive.
	 */
	private readonly defaultNumberMaskConfig: StarkNumberMaskConfig = {
		prefix: "",
		suffix: "",
		includeThousandsSeparator: true,
		thousandsSeparatorSymbol: ",",
		allowDecimal: false,
		decimalSymbol: ".",
		decimalLimit: 2,
		requireDecimal: false,
		allowNegative: true,
		allowLeadingZeroes: false
	};

	/**
	 * Class constructor
	 * @param _renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param _elementRef - Reference to the DOM element where this directive is applied to.
	 * @param _compositionMode - Injected token to control if form directives buffer IME input until the "compositionend" event occurs.
	 */
	public constructor(
		_renderer: Renderer2,
		_elementRef: ElementRef,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
	) {
		super(_renderer, _elementRef, _compositionMode);
		this.elementRef = _elementRef;
	}

	/**
	 * Component lifecycle hook
	 * @param changes - Contains the changed properties
	 */
	public override ngOnChanges(changes: SimpleChanges): void {
		this.textMaskConfig = this.normalizeMaskConfig(this.maskConfig);

		super.ngOnChanges(changes);

		// TODO: temporary workaround to update the model when the maskConfig changes since this is not yet implemented in text-mask and still being discussed
		// see: https://github.com/text-mask/text-mask/issues/657
		if (changes["maskConfig"] && !changes["maskConfig"].isFirstChange() && this.textMaskConfig.mask !== false) {
			// trigger a dummy "input" event in the input to trigger the changes in the model (only if the mask was not disabled!)
			const ev: Event = document.createEvent("Event");
			ev.initEvent("input", true, true);
			(<HTMLInputElement>this.elementRef.nativeElement).dispatchEvent(ev);
		}
	}

	/**
	 * Create a valid configuration to be passed to the MaskedInputDirective
	 * @param maskConfig - The provided configuration via the directive's input
	 */
	public normalizeMaskConfig(maskConfig: StarkNumberMaskConfig): Ng2TextMaskConfig {
		if (typeof maskConfig === "undefined") {
			return { mask: false }; // remove the mask
		}

		// TODO: Ng2TextMaskConfig is not the same as Core TextMaskConfig
		const numberMaskConfig: StarkNumberMaskConfig = { ...this.defaultNumberMaskConfig, ...maskConfig };
		return { mask: <any>createNumberMask(numberMaskConfig) };
	}
}
