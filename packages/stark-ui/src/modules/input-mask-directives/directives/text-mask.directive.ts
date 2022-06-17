import {
	AfterViewInit,
	Directive,
	ElementRef,
	forwardRef,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Optional,
	PLATFORM_ID,
	Provider,
	Renderer2
} from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import { IMaskFactory } from "angular-imask";
import IMask from "imask";
import { StarkTextMaskConfig } from "./text-mask-config.intf";
import { TextMaskBaseDirective } from "./text-mask-base.directive";

/**
 * @ignore
 */
const directiveName = "[starkTextMask]";

export const STARK_TEXT_MASK_NEW_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => StarkTextMaskDirective),
	multi: true
};

@Directive({
	host: {
		"(input)": "_handleInput($event)",
		"(blur)": "onTouched()",
		"(compositionstart)": "_compositionStart()",
		"(compositionend)": "_compositionEnd($event.target.value)"
	},
	selector: directiveName,
	exportAs: "starkTextMask",
	providers: [STARK_TEXT_MASK_NEW_VALUE_ACCESSOR]
})
export class StarkTextMaskDirective
	extends TextMaskBaseDirective<IMask.MaskedPatternOptions, StarkTextMaskConfig>
	implements AfterViewInit, OnDestroy, OnChanges
{
	/**
	 * Configuration object for the mask to be displayed in the input field.
	 */

	/* tslint:disable:no-input-rename */
	@Input("starkTextMask") public override maskConfig: StarkTextMaskConfig | string = {
		mask: false
	};

	public constructor(
		_renderer: Renderer2,
		_elementRef: ElementRef,
		_factory: IMaskFactory,
		@Inject(PLATFORM_ID) _platformId: string,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
	) {
		super(_renderer, _elementRef, _factory, _platformId, _compositionMode);
	}

	protected override defaultMask(): StarkTextMaskConfig {
		return {
			mask: false,
			guide: true,
			eager: false,
			keepCharPositions: true,
			placeholderChar: "_"
		};
	}

	/**
	 * merger default mask and current mask and transform option from StarkTextMaskConfig to maskOption for imaskjs
	 * @param maskConfig
	 * @param defaultMask
	 * @protected
	 */
	protected override normalizeMaskConfig(
		maskConfig: StarkTextMaskConfig | string,
		defaultMask: StarkTextMaskConfig
	): IMask.MaskedPatternOptions {
		if (!maskConfig) {
			return {
				mask: ""
			};
		}
		const mask: StarkTextMaskConfig = this.mergeMaskConfig(maskConfig, defaultMask);
		const maskActive: boolean = typeof mask.mask === "boolean" ? mask.mask : true;

		if (maskActive) {
			return {
				mask: mask.mask,
				lazy: mask.guide ? !this.maskRef?.unmaskedValue : true,
				eager: mask.eager,
				blocks: mask.blocks,
				definitions: mask.definitions,
				placeholderChar: mask.placeholderChar
			};
		}
		return {
			mask: ""
		};
	}

	protected override mergeMaskConfig(maskConfig: StarkTextMaskConfig | string, defaultMask: StarkTextMaskConfig): StarkTextMaskConfig {
		if (typeof maskConfig === "string") {
			return { ...defaultMask, mask: maskConfig };
		}
		return { ...defaultMask, ...maskConfig };
	}
}
