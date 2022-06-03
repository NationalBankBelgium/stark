import { Directive, ElementRef, forwardRef, Inject, Input, Optional, PLATFORM_ID, Provider, Renderer2 } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import IMask from "imask";
import { StarkNumberMaskConfigNew } from "./number-mask-config-new.intf";
import { StarkTextMaskBaseDirective } from "./stark-text-mask-base.directive";
import { IMaskFactory } from "angular-imask";

/**
 * @ignore
 */
const directiveName = "[starkNumberMaskNew]";

/**
 * @ignore
 */
export const STARK_NUMBER_MASK_NEW_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => StarkNumberMaskNewDirective),
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
		"(input)": "_handleInput($event)",
		"(blur)": "onTouched()",
		"(compositionstart)": "_compositionStart()",
		"(compositionend)": "_compositionEnd($event.target.value)"
	},
	selector: directiveName,
	exportAs: "starkNumberMaskNew",
	providers: [STARK_NUMBER_MASK_NEW_VALUE_ACCESSOR]
})
export class StarkNumberMaskNewDirective extends StarkTextMaskBaseDirective<IMask.MaskedNumberOptions, StarkNumberMaskConfigNew> {
	public constructor(
		_renderer: Renderer2,
		_elementRef: ElementRef,
		_factory: IMaskFactory,
		@Inject(PLATFORM_ID) _platformId: string,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
	) {
		super(_renderer, _elementRef, _factory, _platformId, _compositionMode);
	}

	/* tslint:disable:no-input-rename */
	@Input("starkNumberMaskNew")
	public override maskConfig: StarkNumberMaskConfigNew = {};

	protected override defaultMask(): StarkNumberMaskConfigNew {
		return {
			prefix: "",
			suffix: "",
			allowDecimal: false,
			allowLeadingZeroes: false,
			allowNegative: true,
			decimalLimit: 2,
			decimalSymbol: ".",
			requireDecimal: false,
			includeThousandsSeparator: true,
			thousandsSeparatorSymbol: ",",
			integerLimit: undefined
		};
	}

	public override normalizedMaskConfig(maskConfig: string | StarkNumberMaskConfigNew, defaultMask: StarkNumberMaskConfigNew): any {
		if (!maskConfig) {
			return undefined;
		}
		const mask: StarkNumberMaskConfigNew = this.mergedMaskConfig(maskConfig, defaultMask);

		const numberMask: IMask.MaskedNumberOptions = {
			mask: Number,
			scale: mask.allowDecimal ? mask.decimalLimit : 0,
			signed: mask.allowNegative,
			thousandsSeparator: mask.includeThousandsSeparator ? mask.thousandsSeparatorSymbol : "",
			padFractionalZeros: mask.allowLeadingZeroes,
			normalizeZeros: mask.requireDecimal,
			radix: mask.decimalSymbol,
			max: mask.integerLimit ? Math.pow(10, mask.integerLimit) - 1 : undefined,
			min: mask.integerLimit && mask.allowNegative ? Math.pow(10, mask.integerLimit) * -1 + 1 : undefined
		};

		if (!!mask.suffix || !!mask.prefix) {
			return {
				mask: (mask.prefix ? mask.prefix : "") + " block " + (mask.suffix ? mask.suffix : ""),
				blocks: {
					block: numberMask
				}
			};
		}
		return numberMask;
	}

	public override mergedMaskConfig(
		maskConfig: string | StarkNumberMaskConfigNew,
		defaultMask: StarkNumberMaskConfigNew
	): StarkNumberMaskConfigNew {
		if (typeof maskConfig === "string") {
			return { ...defaultMask };
		}
		return { ...defaultMask, ...maskConfig };
	}
}
