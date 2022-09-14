import { Directive, ElementRef, forwardRef, Inject, Input, Optional, PLATFORM_ID, Provider, Renderer2 } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AbstractStarkTextMaskBaseDirective, StarkMaskConfigType } from "./abstract-stark-text-mask-base-directive.service";
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
export const STARK_EMAIL_MASK_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => StarkEmailMaskDirective),
	multi: true
};

/**
 * @ignore
 */
const DEFAULT_EMAIL_PATTERN = "name@domain.tld";

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
		"(input)": "_handleInput($event)",
		"(blur)": "onTouched()",
		"(compositionstart)": "_compositionStart()",
		"(compositionend)": "_compositionEnd($event.target.value)"
	},
	selector: directiveName,
	exportAs: "starkEmailMask",
	providers: [STARK_EMAIL_MASK_VALUE_ACCESSOR]
})
export class StarkEmailMaskDirective extends AbstractStarkTextMaskBaseDirective<IMask.MaskedPatternOptions, StarkTextMaskConfig> {
	/**
	 * Whether to display the email mask in the input field.
	 */
	/* tslint:disable:no-input-rename */
	@Input("starkEmailMask")
	public override maskConfig = true; // enabled by default

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	// tslint:disable-next-line:variable-name
	public static ngAcceptInputType_maskConfig: BooleanInput;

	/**
	 *
	 * @param _renderer - Angular `Renderer2` wrapper for DOM manipulations
	 * @param _elementRef - Reference to the DOM element where this directive is applied to.
	 * @param _factory - {@link https://github.com/uNmAnNeR/imaskjs/blob/master/packages/angular-imask/src/imask-factory.ts|IMaskFactory} used by angular-imask in order to communicate with imaskjs
	 * @param _platformId - Angular `PLATFORM_ID` which indicates an opaque platform ID about the platform: `browser`, `server`, `browserWorkerApp` or `browserWorkerUi`
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

	/**
	 * default mask configuration for the emailMask
	 */
	protected override defaultMask: StarkTextMaskConfig = {
		mask: DEFAULT_EMAIL_PATTERN,
		blocks: {
			name: { mask: /^[\w-\\.]+$/g },
			domain: { mask: /^[\w-]+$/g },
			tld: { mask: /^[\w\\.]+$/g }
		},
		guide: true,
		eager: false,
		keepCharPositions: true,
		placeholderChar: "_"
	};

	/**
	 * Used to transform the StarkTextMaskConfig to the mask format for imaskjs
	 * @param maskConfig - The input maskConfiguration
	 */
	protected override normalizeMaskConfig(maskConfig: boolean | string | StarkTextMaskConfig): any {
		return this.mergeMaskConfig(maskConfig, this.defaultMask);
	}

	/**
	 * Merge the maskConfig receive in parameters with the default one.
	 * @param maskConfig - The input mask configuration
	 * 	if type is boolean then copy the `defaultMask` properties and override the `mask` with `DEFAULT_EMAIL_PATTERN` or empty string
	 * 	if type is string, then copy the `defaultMask` properties and override the `mask` with the content of the string
	 * 	else copy `defaultMask] and override the  `maskConfig` properties
	 * @param defaultMask - The default Mask configuration
	 * @return The merged object that contains all properties of `defaultMask` overrided by the value of `maskConfig`
	 */
	protected override mergeMaskConfig(
		maskConfig: StarkTextMaskConfig | string | boolean,
		defaultMask: StarkTextMaskConfig
	): StarkTextMaskConfig {
		if (typeof maskConfig === "boolean") {
			return { ...defaultMask, mask: maskConfig ? DEFAULT_EMAIL_PATTERN : "" };
		}
		if (typeof maskConfig === "string") {
			return { ...defaultMask, mask: maskConfig === "" ? DEFAULT_EMAIL_PATTERN : maskConfig };
		}
		return { ...defaultMask, ...maskConfig };
	}

	/**
	 * check if the config is valid
	 * @param config - the input configuration
	 */
	protected override isConfigValid(config: StarkMaskConfigType | undefined): config is StarkMaskConfigType {
		if (config === "" || config === undefined) {
			return true;
		}
		return super.isConfigValid(config);
	}
}
