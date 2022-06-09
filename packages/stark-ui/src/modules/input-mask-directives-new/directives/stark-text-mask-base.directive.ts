import { AnyMaskedOptions } from "imask";
import { StarkNumberMaskConfigNew } from "./number-mask-config-new.intf";
import { StarkTextMaskBaseConfigNew } from "./text-mask-new-config.intf";
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
import { StarkTimestampMaskConfigNew } from "./timestamp-mask-config-new.intf";

@Injectable()
export abstract class StarkTextMaskBaseDirective<
		Opts extends AnyMaskedOptions,
		MaskConfig extends StarkTextMaskBaseConfigNew | StarkNumberMaskConfigNew | StarkTimestampMaskConfigNew
	>
	extends IMaskDirective<Opts>
	implements AfterViewInit, OnDestroy, OnChanges
{
	/**
	 * Configuration object for the mask to be displayed in the input field.
	 */

	/* tslint:disable:no-input-rename */
	public maskConfig: MaskConfig | string = "";

	protected abstract defaultMask(): MaskConfig;

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
		this.imask = this.normalizedMaskConfig(this.maskConfig, this.defaultMask());
		this.elementRef = _elementRef;
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnChanges(changes: SimpleChanges): void {
		const maskRefDefine = !!this.maskRef;
		// if maskConfig changes then apply the change to the imask and propagate changes.
		if (!!changes["maskConfig"]) {
			const oldValue = this.imask;
			this.imask = this.normalizedMaskConfig(this.maskConfig, this.defaultMask());
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
	 * merger default mask and current mask and transform option from StarkTextMaskConfig to maskOption for imaskjs
	 * @param maskConfig
	 * @param defaultMask
	 * @protected
	 */
	protected abstract normalizedMaskConfig(maskConfig: MaskConfig | string, defaultMask: MaskConfig): Opts;

	/**
	 * Add the event input listener after the mask has been created
	 */
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
		const mergerConfig: MaskConfig = this.mergedMaskConfig(this.maskConfig, this.defaultMask());
		if (mergerConfig["guide"] && this.maskRef) {
			this.maskRef.updateOptions({ lazy: this.maskRef.unmaskedValue === "" });
		}
	}

	protected abstract mergedMaskConfig(maskConfig: MaskConfig | string, defaultMask: MaskConfig): MaskConfig;
}
