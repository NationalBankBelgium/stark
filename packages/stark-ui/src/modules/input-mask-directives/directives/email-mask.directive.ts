import { Directive, ElementRef, forwardRef, Inject, Input, OnChanges, Optional, Provider, Renderer2, SimpleChanges } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CombinedPipeMask } from "text-mask-core";
import { emailMask } from "text-mask-addons";
import { MaskedInputDirective, TextMaskConfig as Ng2TextMaskConfig } from "angular2-text-mask";

/**
 * Name of the directive
 */
const directiveName: string = "[starkEmailMask]";

/**
 * @ignore
 */
export const STARK_EMAIL_MASK_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => StarkEmailMaskDirective),
	multi: true
};

/**
 * Directive to display an email mask in input elements. This directive internally uses the {@link https://github.com/text-mask/text-mask/tree/master/core|text-mask-core} library
 * to provide the input mask functionality.
 *
 * **`IMPORTANT:`** Currently the Email Mask supports only input of type text, tel, url, password, and search.
 * Due to a limitation in browser API, other input types, such as email or number, cannot be supported.
 *
 * ### Disabling the mask
 * Passing `false` to the directive will disable the mask: `<input type="text" [starkEmailMask]="false">`
 *
 * @example
 * <input type="text" starkEmailMask> <!-- without config the mask will also be displayed -->
 * <!-- or -->
 * <input type="text" [starkEmailMask]="yourMaskConfig">
 * <!-- or -->
 * <input type="text" [(ngModel)]="yourModelValue" starkEmailMask>
 * <!-- or -->
 * <input type="text" [(ngModel)]="yourModelValue" [starkEmailMask]="yourMaskConfig">
 * <!-- or -->
 * <input type="text" [formControl]="yourFormControl" starkEmailMask>
 * <!-- or -->
 * <input type="text" [formControl]="yourFormControl" [starkEmailMask]="yourMaskConfig">
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
	exportAs: "starkEmailMask",
	providers: [STARK_EMAIL_MASK_VALUE_ACCESSOR]
})
export class StarkEmailMaskDirective extends MaskedInputDirective implements OnChanges {
	/**
	 * Whether to display the email mask in the input field.
	 */
	/* tslint:disable:no-input-rename */
	@Input("starkEmailMask")
	public maskConfig?: boolean = true; // enabled by default

	/**
	 * Class constructor
	 * @param _renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param _elementRef - Reference to the DOM element where this directive is applied to.
	 * @param _compositionMode  - Injected token to control if form directives buffer IME input until the "compositionend" event occurs.
	 */
	public constructor(
		_renderer: Renderer2,
		_elementRef: ElementRef,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
	) {
		super(_renderer, _elementRef, _compositionMode);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnChanges(changes: SimpleChanges): void {
		this.textMaskConfig = this.normalizeMaskConfig(this.maskConfig);

		super.ngOnChanges(changes);
	}

	/**
	 * Create a valid configuration to be passed to the MaskedInputDirective
	 * @param maskConfig - The provided configuration via the directive's input
	 */
	public normalizeMaskConfig(maskConfig: boolean = true): Ng2TextMaskConfig {
		// in case the directive is used without inputs: "<input type='text' starkEmailMask>" the maskConfig becomes an empty string ''
		// therefore "undefined" or string values will also enable the mask
		maskConfig = typeof maskConfig !== "boolean" ? true : maskConfig;

		if (!maskConfig) {
			return { mask: false }; // remove the mask
		} else {
			// TODO: Ng2TextMaskConfig is not the same as Core TextMaskConfig
			// even though emailMask is passed as a mask, it is actually made of both a mask and a pipe bundled together for convenience
			// https://github.com/text-mask/text-mask/tree/master/addons
			const { mask, pipe }: CombinedPipeMask = emailMask;
			return { mask: <any>mask, pipe: <any>pipe };
		}
	}
}
