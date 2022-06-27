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
import { COMPOSITION_BUFFER_MODE } from "@angular/forms";
import { StarkTimestampMaskConfig } from "./timestamp-mask-config.intf";

export type MaskConfigType = StarkTextMaskBaseConfig | StarkNumberMaskConfig | StarkTimestampMaskConfig | string | boolean;

@Injectable()
export abstract class TextMaskBaseDirective<
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

	public constructor(
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
	 */
	// tslint:disable-next-line:contextual-lifecycle
	public override ngOnChanges(changes: SimpleChanges): void {
		const maskRefDefine = !!this.maskRef;
		// if maskConfig changes then apply the change to the imask and propagate changes.
		if (this.rebuildMaskNgOnChanges(changes)) {
			const oldValue = this.imask;
			if (this.maskConfig) {
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
		if (this.maskConfig) {
			const mergerConfig: MaskConfig = this.mergeMaskConfig(this.maskConfig, this.defaultMask());
			if (mergerConfig["guide"] && this.maskRef) {
				this.maskRef.updateOptions({ lazy: this.maskRef.unmaskedValue === "" });
			}
		}
	}

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
