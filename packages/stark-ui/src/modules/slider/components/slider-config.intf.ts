import { StarkSliderPips } from "./slider-pips.intf";

/**
 * Interface to be used together with the {@link StarkSliderConfig}
 * when using advanced formatting options for the {@link StarkSliderComponent}.
 */
export interface StarkSliderFormatter {
	/**
	 * Function to convert a number to a string with a specific format
	 */
	to(rawValue: number): string; // format a number

	/**
	 * Function to parse the formatted string back to a number
	 */
	from(formattedValue: string): number; // get a number back
}

/**
 * Interface to be implemented when using the {@link StarkSliderComponent}.
 * It is in fact a subset of the options supported by the {@link https://github.com/leongersen/noUiSlider/|noUiSlider} library.
 */
export interface StarkSliderConfig {
	/**
	 * Several ways to handle user interaction.
	 *
	 * See {@link https://refreshless.com/nouislider/behaviour-option/|noUiSlider API: Behaviour}
	 */
	behaviour?: string;

	/**
	 * This can be used to control the (green) bar between the handles, or the edges of the slider.
	 *
	 * See {@link https://refreshless.com/nouislider/slider-options/#section-connect|noUiSlider API: Connect}
	 */
	connect?: boolean | boolean[];

	/**
	 * Formatter containing `to()` function to encode the values and a `from()` function to decode them.
	 */
	format?: StarkSliderFormatter;

	/**
	 * Slider's orientation: `"horizontal"` or `"vertical"`.
	 *
	 * **In case of vertical sliders, a default height is set via CSS rules which you can override if needed.**
	 *
	 * Default: `"horizontal"`
	 */
	orientation?: "horizontal" | "vertical";

	/**
	 * Config object to define how the pips will be displayed in the slider.
	 */
	pips?: StarkSliderPips;

	/**
	 * All the values that are part of the range. The object should contain at least `min` and `max` properties.
	 *
	 * See {@link https://refreshless.com/nouislider/slider-values/#section-range|noUiSlider API: Range}
	 */
	range: {
		min: number | number[];
		max: number | number[];
		[value: string]: number | number[];
	};

	/**
	 * The minimum amount of units that an slider can change within the range.
	 *
	 * See {@link https://refreshless.com/nouislider/slider-values/#section-step|noUiSlider API: Step}
	 */
	step?: number;

	/**
	 * Enable/disable the display of tooltips.
	 * You can also pass a formatter function to format the tooltips content.
	 *
	 * See: {@link https://refreshless.com/nouislider/slider-options/#section-tooltips|noUiSlider API: Tooltips}
	 *
	 * Default: `false`
	 */
	tooltips?: boolean | boolean[] | StarkSliderFormatter;
}
