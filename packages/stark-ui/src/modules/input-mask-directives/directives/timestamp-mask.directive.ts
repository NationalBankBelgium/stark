import { Directive, ElementRef, forwardRef, Inject, Input, OnChanges, Optional, Provider, Renderer2, SimpleChanges } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MaskedInputDirective, TextMaskConfig as Ng2TextMaskConfig } from "angular2-text-mask";
import { MaskArray } from "text-mask-core";
import { StarkTimestampMaskConfig } from "./timestamp-mask-config.intf";
import { createTimestampPipe } from "./timestamp-pipe.fn";

/**
 * @ignore
 */
const directiveName = "[starkTimestampMask]";

/**
 * The Time date format that is used when no other is specified.
 */
const DEFAULT_DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";

/**
 * @ignore
 */
export const STARK_TIMESTAMP_MASK_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// eslint-disable-next-line @angular-eslint/no-forward-ref
	useExisting: forwardRef(() => StarkTimestampMaskDirective),
	multi: true
};

/**
 * Directive to display a timestamp mask in input elements. This directive internally uses the {@link https://github.com/text-mask/text-mask/tree/master/core|text-mask-core} library
 * to provide the input mask functionality.
 *
 * **`IMPORTANT:`** Currently the Number Mask supports only input of type text, tel, url, password, and search.
 * Due to a limitation in browser API, other input types, such as email or number, cannot be supported.
 *
 * ### Disabling the mask
 * Passing an `undefined` value as config to the directive will disable the mask.
 *
 * @example
 * <input type="text" [starkTimestampMask]="yourMaskConfig">
 * <!-- or -->
 * <input type="text" [(ngModel)]="yourModelValue" [starkTimestampMask]="yourMaskConfig">
 * <!-- or -->
 * <input type="text" [formControl]="yourFormControl" [starkTimestampMask]="yourMaskConfig">
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
	exportAs: "starkTimestampMask",
	providers: [STARK_TIMESTAMP_MASK_VALUE_ACCESSOR]
})
export class StarkTimestampMaskDirective extends MaskedInputDirective implements OnChanges {
	/**
	 * Default configuration.
	 * It will be merged with the configuration passed to the directive.
	 */
	private readonly defaultTimestampMaskConfig: StarkTimestampMaskConfig = {
		format: DEFAULT_DATE_TIME_FORMAT
	};

	/**
	 * Configuration object for the mask to be displayed in the input field.
	 */
	/* eslint-disable @angular-eslint/no-input-rename */
	@Input("starkTimestampMask")
	public maskConfig?: StarkTimestampMaskConfig;

	/**
	 * @ignore
	 */
	public elementRef: ElementRef;

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
	public normalizeMaskConfig(maskConfig?: StarkTimestampMaskConfig): Ng2TextMaskConfig {
		if (typeof maskConfig === "undefined") {
			return { mask: false }; // remove the mask
		}

		// TODO: Ng2TextMaskConfig is not the same as Core TextMaskConfig
		const timestampMaskConfig: StarkTimestampMaskConfig = { ...this.defaultTimestampMaskConfig, ...maskConfig };

		return {
			pipe: <any>createTimestampPipe(timestampMaskConfig.format),
			mask: this.convertFormatIntoMask(timestampMaskConfig.format),
			placeholderChar: "_",
			keepCharPositions: true // to avoid weird date values when deleting characters (see https://github.com/NationalBankBelgium/stark/issues/1260)
		};
	}

	/**
	 * Construct a valid Mask out of the given timestamp format string
	 * @param format - The timestamp format string
	 */
	public convertFormatIntoMask(format: string): MaskArray {
		const mask: MaskArray = [];
		for (let i = 0; i < format.length; i++) {
			if (
				format.charAt(i) === "D" ||
				format.charAt(i) === "M" ||
				format.charAt(i) === "Y" ||
				format.charAt(i) === "H" ||
				format.charAt(i) === "m" ||
				format.charAt(i) === "s"
			) {
				mask[i] = /\d/;
			} else {
				mask[i] = format.charAt(i);
			}
		}
		return mask;
	}
}
