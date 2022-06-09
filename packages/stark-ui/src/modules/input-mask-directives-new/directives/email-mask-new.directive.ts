import { Directive, ElementRef, forwardRef, Inject, Input, Optional, PLATFORM_ID, Provider, Renderer2 } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import { StarkTextMaskBaseDirective } from "./stark-text-mask-base.directive";
import { StarkTextMaskConfigNew } from "./text-mask-new-config.intf";
import IMask from "imask";
import { IMaskFactory } from "angular-imask";
import { BooleanInput } from "@angular/cdk/coercion";

/**
 * @ignore
 */
const directiveName = "[starkEmailMaskNew]";

/**
 * @ignore
 */
export const STARK_EMAIL_MASK_NEW_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => StarkEmailMaskNewDirective),
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
	exportAs: "starkEmailMaskNew",
	providers: [STARK_EMAIL_MASK_NEW_VALUE_ACCESSOR]
})
export class StarkEmailMaskNewDirective extends StarkTextMaskBaseDirective<IMask.MaskedPatternOptions, StarkTextMaskConfigNew> {
	// tslint:disable-next-line:variable-name
	public static ngAcceptInputType_maskConfig: BooleanInput;

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	/* tslint:disable:no-input-rename */
	@Input("starkEmailMaskNew")
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

	protected override defaultMask(): StarkTextMaskConfigNew {
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

	protected override normalizedMaskConfig(
		maskConfig: boolean | string | StarkTextMaskConfigNew,
		defaultMask: StarkTextMaskConfigNew
	): any {
		const mask: StarkTextMaskConfigNew = this.mergedMaskConfig(maskConfig, defaultMask);
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

	protected override mergedMaskConfig(
		maskConfig: StarkTextMaskConfigNew | string | boolean,
		defaultMask: StarkTextMaskConfigNew
	): StarkTextMaskConfigNew {
		if (typeof maskConfig === "boolean") {
			return { ...defaultMask, mask: maskConfig ? DEFAULT_EMAIL_PATTERN : "" };
		}
		if (typeof maskConfig === "string") {
			return { ...defaultMask, mask: maskConfig };
		}
		return { ...defaultMask, ...maskConfig };
	}
}
