import isEqual from "lodash-es/isEqual";
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import * as noUiSliderLibrary from "nouislider";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDOMUtil } from "../../../util/dom";
import { StarkSliderConfig } from "./slider-config.intf";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * @ignore
 */
const componentName = "stark-slider";

/**
 * Component to display a slider with one or more handles
 */
@Component({
	selector: "stark-slider",
	templateUrl: "./slider.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkSliderComponent extends AbstractStarkUiComponent implements AfterViewInit, OnChanges, OnInit {
	/**
	 * Whether the slider is disabled.
	 *
	 * Default: `false`
	 */
	@Input()
	public isDisabled?: boolean;

	/**
	 * Configuration object for the slider instance to be created.
	 */
	@Input()
	public sliderConfig!: StarkSliderConfig;

	/**
	 * HTML "id" attribute of the element.
	 */
	@Input()
	public sliderId = "undefined";

	/**
	 * Array of numeric values to be set to the slider.
	 * For simple sliders with just one handle, the array should contain only one value.
	 * For range sliders, the array should contain two or more values.
	 */
	@Input()
	public values!: number[];

	/**
	 * Event to be emitted when the slider's value(s) change.
	 */
	@Output()
	public readonly changed = new EventEmitter<number[]>();

	/**
	 * Stores the latest value, to be able to see if values have been changed
	 */
	public latestUnencodedValues?: number[];

	/**
	 * set to true if the slider is in horizontal mode
	 */
	public isHorizontal = false;

	/**
	 * a reference to the `noUiSlider` component
	 */
	public slider!: noUiSliderLibrary.noUiSlider;

	/**
	 * a reference to the noUiSlider library
	 */
	public noUiSliderLibrary: any;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		renderer: Renderer2,
		elementRef: ElementRef
	) {
		super(renderer, elementRef);
		this.noUiSliderLibrary = noUiSliderLibrary;
	}

	/**
	 * Component lifecycle hook that is called after data-bound properties of a directive are initialized.
	 */
	public override ngOnInit(): void {
		super.ngOnInit();

		if (!this.values) {
			throw new Error("StarkSliderComponent: values should be set.");
		}
		if (!this.sliderConfig) {
			throw new Error("StarkSliderComponent: sliderConfig should be set.");
		}

		this.isHorizontal = this.sliderConfig.orientation !== "vertical";
		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Component lifecycle hook that is called after a component's view has been fully initialized.
	 */
	public ngAfterViewInit(): void {
		this.createSliderInstance();
		this.attachSliderInstanceUpdateHandler();
	}

	/**
	 * Component lifecycle hook that is called when any data-bound property of a directive changes.
	 * @param onChangesObj - Contains the changed properties
	 */
	public ngOnChanges(onChangesObj: SimpleChanges): void {
		// cannot compare using slider.get() method because it returns the current formatted values (we need to compare the unencoded values)
		if (onChangesObj["values"] && !onChangesObj["values"].isFirstChange() && !isEqual(this.latestUnencodedValues, this.values)) {
			this.updateSliderInstanceValues();
		}
	}

	/**
	 * Create an instance of the slider component
	 */
	public createSliderInstance(): void {
		const sliderElement: HTMLElement = <HTMLElement>(
			StarkDOMUtil.getElementsBySelector(this.elementRef.nativeElement, ".stark-slider .slider")[0]
		);

		const sliderOptions: noUiSliderLibrary.Options = { ...this.sliderConfig, start: this.values };
		this.noUiSliderLibrary.create(sliderElement, sliderOptions);
		this.slider = (<noUiSliderLibrary.Instance>sliderElement).noUiSlider;
	}

	/**
	 * Attach the update handler to the slider component
	 */
	public attachSliderInstanceUpdateHandler(): void {
		this.slider.on("update", (_values: string[], _handle: number, unencodedValues: number[]) => {
			if (!isEqual(this.values, unencodedValues)) {
				this.values = unencodedValues;
				this.latestUnencodedValues = unencodedValues;

				this.changed.emit(this.values);
			}
		});
	}

	/**
	 * Update the slider instance values
	 */
	public updateSliderInstanceValues(): void {
		this.slider.set(this.values);
	}
}
