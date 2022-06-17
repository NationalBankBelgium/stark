import { Directive, ElementRef, forwardRef, Inject, Input, Optional, PLATFORM_ID, Provider, Renderer2 } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TextMaskBaseDirective } from "./text-mask-base.directive";
import { StarkTextMaskConfig } from "./text-mask-config.intf";
import IMask from "imask";
import { IMaskFactory } from "angular-imask";
import { BooleanInput } from "@angular/cdk/coercion";

/**
 * @ignore
 */
const directiveName = "[starkEmailMask]";

/**
 * @ignore
 */
export const STARK_EMAIL_MASK_NEW_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => StarkEmailMaskDirective),
	multi: true
};

/**
 * @ignore
 */
const DEFAULT_EMAIL_PATTERN = "name@domain.tld";

@Directive({
	host: {
		"(input)": "_handleInput($event)",
		"(blur)": "onTouched()",
		"(compositionstart)": "_compositionStart()",
		"(compositionend)": "_compositionEnd($event.target.value)"
	},
	selector: directiveName,
	exportAs: "starkEmailMask",
	providers: [STARK_EMAIL_MASK_NEW_VALUE_ACCESSOR]
})
export class StarkEmailMaskDirective extends TextMaskBaseDirective<IMask.MaskedPatternOptions, StarkTextMaskConfig> {
	// tslint:disable-next-line:variable-name
	public static ngAcceptInputType_maskConfig: BooleanInput;

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	/* tslint:disable:no-input-rename */
	@Input("starkEmailMask")
	public override maskConfig = true;

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
			mask: DEFAULT_EMAIL_PATTERN,
			blocks: {
				name: { mask: /^[\w-\\.]+$/g },
				domain: { mask: /^[\w-]+$/g },
				tld: { mask: /^\w+$/g }
			},
			guide: true,
			eager: false,
			keepCharPositions: true,
			placeholderChar: "_"
		};
	}

	protected override normalizeMaskConfig(maskConfig: boolean | string | StarkTextMaskConfig, defaultMask: StarkTextMaskConfig): any {
		const mask: StarkTextMaskConfig = this.mergeMaskConfig(maskConfig, defaultMask);
		return {
			...mask,
			...defaultMask,
			blocks: {
				name: { mask: /^[\w-\\.]+$/g },
				domain: { mask: /^[\w-]+$/g },
				tld: { mask: /^\w+$/g }
			}
		};
	}

	protected override mergeMaskConfig(
		maskConfig: StarkTextMaskConfig | string | boolean,
		defaultMask: StarkTextMaskConfig
	): StarkTextMaskConfig {
		if (typeof maskConfig === "boolean") {
			return { ...defaultMask, mask: maskConfig ? DEFAULT_EMAIL_PATTERN : "" };
		}
		if (typeof maskConfig === "string") {
			return { ...defaultMask, mask: maskConfig };
		}
		return { ...defaultMask, ...maskConfig };
	}
}
