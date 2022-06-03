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
import { AbstractStarkTextMaskBaseDirective } from "./abstract-stark-text-mask-base-directive.service";
import { StarkTextMaskConfig } from "./text-mask-config.intf";

/**
 * @ignore
 */
const directiveName = "[starkTextMask]";

/**
 * @ignore
 */
export const STARK_TEXT_MASK_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => StarkTextMaskDirective),
	multi: true
};

/**
 * Directive to display a mask in input elements. This directive internally uses the {@ling https://github.com/uNmAnNeR/imaskjs/blob/master/packages/angular-imask/src/imask.directive.ts|imaskjs}
 * library to provide the input mask functionality.
 *
 * ### Disabling the mask
 * Passing an `undifined` value as config to the directive will disable the mask.
 *
 * @example
 * <input type="text" [starkTextMask]="yourMaskConfig">
 * <!-- or -->
 * <input type="text" [(ngModel)]="yourModelValue" [starkTextMask]="yourMaskConfig">
 * <!-- or -->
 * <input type="text" [formControl]="yourFormControl" [starkTextMask]="yourMaskConfig">
 */
@Directive({
	host: {
		"(input)": "_handleInput($event)",
		"(blur)": "onTouched()",
		"(compositionstart)": "_compositionStart()",
		"(compositionend)": "_compositionEnd($event.target.value)"
	},
	selector: directiveName,
	exportAs: "starkTextMask",
	providers: [STARK_TEXT_MASK_VALUE_ACCESSOR]
})
export class StarkTextMaskDirective
	extends AbstractStarkTextMaskBaseDirective<IMask.MaskedPatternOptions, StarkTextMaskConfig>
	implements AfterViewInit, OnDestroy, OnChanges
{
	/**
	 * Configuration object for the mask to be displayed in the input field.
	 */

	/* tslint:disable:no-input-rename */
	@Input("starkTextMask") public override maskConfig: StarkTextMaskConfig | string = {
		mask: false
	};

	/**
	 *
	 * @param _renderer - Angular `Renderer2` wrapper for DOM manipulations
	 * @param _elementRef - Reference to the DOM element where this directive is applied to.
	 * @param _factory - ´IMaskFactory` for the imaskjs library {@link https://github.com/uNmAnNeR/imaskjs/blob/master/packages/angular-imask/src/imask-factory.ts | imask-factory}
	 * @param _platformId - Angular ´PlatformId´ needed for imaskJs
	 * @param _compositionMode - Injected token to control if form directives buffer IME input until the "compositionend" event occurs.
	 */
	public constructor(
		_renderer: Renderer2,
		_elementRef: ElementRef,
		_factory: IMaskFactory,
		@Inject(PLATFORM_ID) _platformId: string,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
	) {
		super(_renderer, _elementRef, _factory, _platformId, _compositionMode);
	}

	protected override defaultMask: StarkTextMaskConfig = {
		mask: false,
		guide: true,
		eager: false,
		keepCharPositions: true,
		placeholderChar: "_"
	};

	/**
	 * merger default mask and current mask and transform option from StarkTextMaskConfig to maskOption for imaskjs
	 */
	protected override normalizeMaskConfig(maskConfig: StarkTextMaskConfig | string): IMask.MaskedPatternOptions {
		if (!maskConfig) {
			return {
				mask: ""
			};
		}
		const mask: StarkTextMaskConfig = this.mergeMaskConfig(maskConfig, this.defaultMask);
		const maskActive: boolean = typeof mask.mask === "boolean" ? mask.mask : true;

		if (maskActive) {
			return {
				mask: typeof mask.mask === "string" ? mask.mask : "",
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

	/**
	 * Merge the properties of the maskConfig
	 */
	protected override mergeMaskConfig(maskConfig: StarkTextMaskConfig | string, defaultMask: StarkTextMaskConfig): StarkTextMaskConfig {
		if (typeof maskConfig === "string") {
			return { ...defaultMask, mask: maskConfig };
		}
		return { ...defaultMask, ...maskConfig };
	}
}
