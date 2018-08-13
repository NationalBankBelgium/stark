import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";

import * as noUiSliderLibrary from "nouislider";

import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService } from "@nationalbankbelgium/stark-core";

import { StarkDOMUtil } from "../../../util/dom.util";
import { StarkSliderConfig } from "./slider-config.intf";

/**
 * @ignore
 */
const _isEqual: Function = require("lodash/isEqual");

/**
 * Name of the component
 */
const componentName: string = "stark-slider";

/**
 * Component to display a slider with one or more handles
 */
@Component({
	selector: "stark-slider",
	templateUrl: "./slider.component.html",
	encapsulation: ViewEncapsulation.None
})
export class StarkSliderComponent implements AfterViewInit, OnChanges, OnInit {
	/**
	 * Adds class="stark-slider" attribute on the host component
	 */
	@HostBinding("class")
	public class: string = componentName;

	/**
	 * Whether the slider is disabled. Default: false
	 */
	@Input()
	public isDisabled?: boolean;

	/**
	 * Configuration object for the slider instance to be created.
	 */
	@Input()
	public sliderConfig: StarkSliderConfig;

	/**
	 * HTML "id" attribute of the element.
	 */
	@Input()
	public sliderId: string;

	/**
	 * Array of numeric values to be set to the slider.
	 * For simple sliders with just one handle, the array should contain only one value.
	 * For range sliders, the array should contain two or more values.
	 */
	@Input()
	public values: number[];

	/**
	 * Event to be emitted when the slider's value(s) change.
	 */
	@Output()
	public changed?: EventEmitter<number[]> = new EventEmitter();

	/**
	 * Stores the latest value, to be able to see if values have been changed
	 */
	public latestUnencodedValues: number[];

	/**
	 * set to true if the slider is in horizontal mode
	 */
	public isHorizontal: boolean;

	/**
	 * a reference to the noUiSlider component inside the noUiSlider library
	 */
	public slider: noUiSliderLibrary.noUiSlider;

	/**
	 * a reference to the noUiSlider library
	 */
	public noUiSliderLibrary: any;

	/**
	 * Class constructor
	 * @param logger : the logger of the application
	 * @param routingService : the routing service of the application
	 * @param elementRef: provides direct access to the DOM
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		private elementRef: ElementRef
	) {
		this.noUiSliderLibrary = noUiSliderLibrary;
	}

	/**
	 * Component lifecycle hook that is called after data-bound properties of a directive are initialized.
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized");
		this.isHorizontal = this.sliderConfig.orientation !== "vertical";
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
	 * @param Contains the changed properties
	 */
	public ngOnChanges(onChangesObj: SimpleChanges): void {
		if (onChangesObj["values"] && !onChangesObj["values"].isFirstChange()) {
			// cannot compare using slider.get() method because it returns the current formatted values (we need to compare the unencoded values)
			if (!_isEqual(this.latestUnencodedValues, this.values)) {
				this.updateSliderInstanceValues();
			}
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
			if (!_isEqual(this.values, unencodedValues)) {
				this.values = unencodedValues;
				this.latestUnencodedValues = unencodedValues;

				if (this.changed) {
					this.changed.emit(this.values);
				}
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
