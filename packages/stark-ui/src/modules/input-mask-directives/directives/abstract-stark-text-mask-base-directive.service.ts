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

export type StarkMaskConfigType = StarkTextMaskBaseConfig | StarkNumberMaskConfig | StarkTimestampMaskConfig | string | boolean;

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
	public maskConfig?: StarkMaskConfigType;

	private shouldShowGuide = false;

	/**
	 *
	 * @param _renderer - Angular `Renderer2` wrapper for DOM manipulations
	 * @param _elementRef - Reference to the DOM element where this directive is applied to.
	 * @param _factory - {@link https://github.com/uNmAnNeR/imaskjs/blob/master/packages/angular-imask/src/imask-factory.ts | imask-factory} used by angular-imask to communicate with imaskjs
	 * @param _platformId - Angular `PLATFORM_ID` which indicates an opaque platform ID about the platform: `browser`, `server`, `browserWorkerApp` or `browserWorkerUi`
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
	}

	/**
	 *
	 */
	// tslint:disable-next-line:contextual-lifecycle
	public override ngAfterViewInit(): void {
		super.ngAfterViewInit();
		if (this.isConfigValid(this.maskConfig)) {
			this.imask = this.normalizeMaskConfig(this.maskConfig);
		}
	}

	/**
	 * Component lifecycle hook
	 * The base {@link https://github.com/uNmAnNeR/imaskjs/blob/master/packages/angular-imask/src/imask.directive.ts|IMaskDirective} directive listens for the change on the `imask` property.
	 * If there is a change on the `maskConfig` input then the `angular-imask` ngOnChanges hook will be triggered
	 * in order to rebuild the `imask`.
	 */
	// tslint:disable-next-line:contextual-lifecycle
	public override ngOnChanges(changes: SimpleChanges): void {
		// if maskConfig changes then apply the change to the imask and propagate changes.
		const unmaskedValue = this.maskRef ? this.maskRef.unmaskedValue : "";
		if (this.rebuildMaskNgOnChanges(changes)) {
			const oldValue = this.imask;
			if (this.isConfigValid(this.maskConfig)) {
				this.imask = this.normalizeMaskConfig(this.maskConfig);
				this.shouldShowGuide = !!this.mergeMaskConfig(this.maskConfig, this.defaultMask)["guide"];
			} else {
				this.imask = undefined;
				this.shouldShowGuide = false;
			}
			changes = { ...changes, imask: new SimpleChange(oldValue, this.imask, true) };
		}
		super.ngOnChanges(changes);

		if (this.maskRef && this.maskRef.unmaskedValue !== unmaskedValue && changes["imask"]) {
			this.maskRef.unmaskedValue = unmaskedValue + " ";
			if (this.shouldShowGuide && this.maskRef.value) {
				this.maskRef.updateOptions({ lazy: true });
			}
		}
	}

	public override _handleInput(event: any): void {
		if (!(event instanceof Event) || !event.target) {
			return;
		}
		let value = event.target["value"];
		// bypass the normal call of the event to show the guide if needed.
		event.stopImmediatePropagation();
		event.stopPropagation();
		if (this.maskRef) {
			// show the mask before entering value
			if (this.shouldShowGuide) {
				this.maskRef.updateOptions({ lazy: false });
			}
			// call the event handler of iMaskJS
			event.target["value"] = value;
			(<any>this.maskRef)._onInput(event);
			if (!this.shouldShowGuide || !this.maskRef.unmaskedValue) {
				this.maskRef.updateOptions({ lazy: true });
				if (!this.maskRef.unmaskedValue) {
					this.maskRef.value = "";
				}
			}
			value = this.maskRef.value;
		}
		super._handleInput(value);
	}

	public override writeValue(value: any): void {
		super.writeValue(value);
		if (this.maskRef) {
			if (this.shouldShowGuide && this.maskRef.unmaskedValue) {
				this.maskRef.updateOptions({ lazy: false });
			} else {
				this.maskRef.updateOptions({ lazy: true });
			}
		}
	}

	/**
	 * Check if it is needed to rebuild the mask on ngOnChanges
	 * @param changes - The list of changes provided by the `ngOnChange` lifecycle hook
	 * @return - `true` if the mask must be rebuilt
	 * - `false` if not
	 */
	protected rebuildMaskNgOnChanges(changes: SimpleChanges): boolean {
		return !!changes["maskConfig"];
	}

	protected abstract defaultMask: MaskConfig;

	/**
	 * merger default mask and current mask and transform option from StarkTextMaskConfig to maskOption for imaskjs
	 * @param maskConfig - The input maskConfig
	 * @Return - The mask configuration for IMaskJs {@link https://imask.js.org/guide.html}
	 */
	protected abstract normalizeMaskConfig(maskConfig: StarkMaskConfigType): Opts;

	protected abstract mergeMaskConfig(maskConfig: StarkMaskConfigType, defaultMask: MaskConfig): MaskConfig;

	protected isConfigValid(config: StarkMaskConfigType | undefined): config is StarkMaskConfigType {
		if (!config) {
			return false;
		}
		if (typeof config["mask"] === "boolean") {
			return config["mask"];
		}
		return !!config;
	}
}
