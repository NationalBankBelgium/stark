import { Directive, ElementRef, forwardRef, Inject, Input, Optional, PLATFORM_ID, Provider, Renderer2 } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import { StarkTextMaskBaseDirective } from "./stark-text-mask-base.directive";
import { StarkTextMaskConfigNew } from "./text-mask-new-config.intf";
import { AnyMaskedOptions } from "imask";
import { IMaskFactory } from "angular-imask";

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
export class StarkEmailMaskNewDirective<Opts extends AnyMaskedOptions> extends StarkTextMaskBaseDirective<Opts, StarkTextMaskConfigNew> {
	@Input("starkEmailMaskNew")
	public override maskConfig: StarkTextMaskConfigNew | string = {
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

	protected override defaultMask(): StarkTextMaskConfigNew {
		return {
			mask: "name@domain.tdl",
			blocks: {
				name: { mask: /^[\w-\\.]+$/g },
				domain: { mask: /^[\w-]+$/g },
				tdl: { mask: /^\w+$/g }
			},
			guide: true,
			eager: false,
			keepCharPositions: true,
			placeholderChar: "_"
		};
	}

	protected override normalizedMaskConfig(maskConfig: string | StarkTextMaskConfigNew, defaultMask: StarkTextMaskConfigNew): any {
		const mask: StarkTextMaskConfigNew = this.mergedMaskConfig(maskConfig, defaultMask);
		return {
			...mask,
			...defaultMask,
			mask: "name@domain.tdl",
			blocks: {
				name: { mask: /^[\w-\\.]+$/g },
				domain: { mask: /^[\w-]+$/g },
				tdl: { mask: /^\w+$/g }
			}
		};
	}

	protected override mergedMaskConfig(
		maskConfig: StarkTextMaskConfigNew | string,
		defaultMask: StarkTextMaskConfigNew
	): StarkTextMaskConfigNew {
		if (typeof maskConfig === "string") {
			return { ...defaultMask, mask: maskConfig };
		}
		return { ...defaultMask, ...maskConfig };
	}
}
