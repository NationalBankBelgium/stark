import { AnyMaskedOptions } from "imask";
import { StarkNumberMaskConfig } from "./number-mask-config.intf";
import { StarkTextMaskBaseConfig } from "./text-mask-config.intf";
import { IMaskDirective, IMaskFactory } from "angular-imask";
import {
	AfterViewInit,
	ElementRef,
	Inject,
	Injectable,
	OnChanges,
	OnDestroy,
	Optional,
	PLATFORM_ID,
	Renderer2,
	SimpleChange,
	SimpleChanges
} from "@angular/core";
import { StarkTimestampMaskConfig } from "./timestamp-mask-config.intf";
import { COMPOSITION_BUFFER_MODE } from "@angular/forms";

export type MaskConfigType = StarkTextMaskBaseConfig | StarkNumberMaskConfig | StarkTimestampMaskConfig | string | boolean;

/**
 * Base class of the InputMask directive
 * This class provide common functions needed for all inputMask
 */
@Injectable() // needed to avoid the compilation error ´NG2007: Class is using Angular features but is not decorated. Please add an explicit Angular decorator.´
export abstract class AbstractStarkTextMaskBaseDirective<
		Opts extends AnyMaskedOptions,
		MaskConfig extends StarkTextMaskBaseConfig | StarkNumberMaskConfig | StarkTimestampMaskConfig
	>
	extends IMaskDirective<Opts>
	implements AfterViewInit, OnDestroy, OnChanges
{
	/**
	 * Configuration object for the mask to be displayed in the input field.
	 */
	public maskConfig?: MaskConfigType;
	/**
	 * @ignore
	 */
	private elementRef: ElementRef;
	/**
	 * @ignore
	 */
	private listener?: EventListener;

	/**
	 *
	 * @param _renderer - Angular `Renderer2` wrapper for DOM manipulations
	 * @param _elementRef - Reference to the DOM element where this directive is applied to.
	 * @param _factory - ´IMaskFactory` for the imaskjs library {@link https://github.com/uNmAnNeR/imaskjs/blob/master/packages/angular-imask/src/imask-factory.ts | imask-factory}
	 * @param _platformId - Angular ´PlatformId´ needed for imaskJs
	 * @param _compositionMode - Injected token to control if form directives buffer IME input until the "compositionend" event occurs.
	 */
	protected constructor(
		_renderer: Renderer2,
		_elementRef: ElementRef,
		_factory: IMaskFactory,
		@Inject(PLATFORM_ID) _platformId: string,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
	) {
		super(_elementRef, _renderer, _factory, _platformId, _compositionMode);
		if (this.maskConfig) {
			this.imask = this.normalizeMaskConfig(this.maskConfig, this.defaultMask());
		}
		this.elementRef = _elementRef;
	}

	/**
	 * Component lifecycle hook
	 * the base diretive listen for the change on the imask property.
	 * if it's needed to rebuild the `imask` property, we rebuild it at add the property `imask` in the changes array.
	 */
	// tslint:disable-next-line:contextual-lifecycle
	public override ngOnChanges(changes: SimpleChanges): void {
		const maskRefDefine = !!this.maskRef;
		// if maskConfig changes then apply the change to the imask and propagate changes.
		if (this.rebuildMaskNgOnChanges(changes)) {
			const oldValue = this.imask;
			if (this.maskConfig || this.maskConfig === "") {
				this.imask = this.normalizeMaskConfig(this.maskConfig, this.defaultMask());
			} else {
				this.imask = undefined;
			}
			changes = { ...changes, imask: new SimpleChange(oldValue, this.imask, true) };
		}
		super.ngOnChanges(changes);

		// Add input event and must be handled after the maskRef therefor it will be register after an maskRef has been created
		if (maskRefDefine !== !!this.maskRef) {
			if (maskRefDefine) {
				this.elementRef.nativeElement.removeEventListener("input", this.inputAfterMaskRef.bind(this));
			} else {
				this.elementRef.nativeElement.addEventListener("input", this.inputAfterMaskRef.bind(this));
			}
		}
	}

	/**
	 * Add the event input listener after the mask has been created
	 */
	// tslint:disable-next-line:contextual-lifecycle
	public override ngAfterViewInit(): void {
		super.ngAfterViewInit();
		if (this.maskRef) {
			this.elementRef.nativeElement.addEventListener("input", this.inputAfterMaskRef.bind(this));
		}
	}

	/**
	 * remove the event listener when destroy the directive
	 */
	public override ngOnDestroy(): void {
		super.ngOnDestroy();
		if (this.listener) {
			this.elementRef.nativeElement.removeEventListener("input", this.inputAfterMaskRef.bind(this));
		}
	}

	public override _handleInput(value: any): void {
		super._handleInput(value);
	}

	/**
	 * Show the guide after the mask has been updated
	 * @param _value
	 */
	public inputAfterMaskRef(_value: any): void {
		// empty string should be considered as valid for the starkEmailMask directive without parameters
		if (this.maskConfig || this.maskConfig === "") {
			const mergerConfig: MaskConfig = this.mergeMaskConfig(this.maskConfig, this.defaultMask());
			if (mergerConfig["guide"] && this.maskRef) {
				this.maskRef.updateOptions({ lazy: this.maskRef.unmaskedValue === "" });
			}
		}
	}

	/**
	 * Check if it is needed to rebuild the mask on ngOnChanges
	 * @param changes list of changes provided by the ngOnChange
	 * @return - true if the mask must be rebuilt
	 * - false if not
	 * @protected
	 */
	protected rebuildMaskNgOnChanges(changes: SimpleChanges): boolean {
		return !!changes["maskConfig"];
	}

	protected abstract defaultMask(): MaskConfig;

	/**
	 * merger default mask and current mask and transform option from StarkTextMaskConfig to maskOption for imaskjs
	 * @param maskConfig
	 * @param defaultMask
	 * @protected
	 */
	protected abstract normalizeMaskConfig(maskConfig: MaskConfigType, defaultMask: MaskConfig): Opts;

	protected abstract mergeMaskConfig(maskConfig: MaskConfigType, defaultMask: MaskConfig): MaskConfig;
}
