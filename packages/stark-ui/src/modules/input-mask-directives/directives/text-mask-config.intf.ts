import { AnyMaskedOptions } from "imask";

/**
 * Defines the base configuration for the mask directives provided by Stark-UI.
 */
export interface StarkTextMaskBaseConfig {
	/**
	 * Whether to show the mask while the user is typing in the input field in order to guide him.
	 *
	 * Default: `true`.
	 *
	 * this able the lazyMode of the imaskjs
	 *
	 * see {@link https://imask.js.org/guide.html#lazy}
	 *
	 */
	guide?: boolean;

	/**
	 * When typing define when display the fix characters
	 *
	 * default: `false`
	 *
	 * -true display the fix characters before typing next one
	 * -false isplay the fix characters after typing next one
	 *
	 * see {@link https://imask.js.org/guide.html#eager}
	 */
	eager?: boolean;

	/**
	 * Placeholder character represents the fillable spot in the mask.
	 *
	 * Default: `"_"`.
	 *
	 *
	 */
	placeholderChar?: string;

	/**
	 * Whether to keep the spaces used by character after they are added/deleted.
	 *
	 * Default: `true`.
	 *
	 */
	keepCharPositions?: boolean;
}

/**
 * Defines the configuration object for the {@link StarkTextMaskDirective}.
 */
export interface StarkTextMaskConfig extends StarkTextMaskBaseConfig {
	/**
	 * Array or a function that defines how the user input is going to be masked. If is set to `false`, the mask will be removed.
	 *
	 * See {@link https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#mask}
	 */
	mask: string | boolean | RegExp;

	/**
	 * Function that can modify the conformed value before it is displayed on the screen.
	 *
	 * See {@link https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#pipe}
	 */
	// pipe?: PipeFunction;

	blocks?: { [p: string]: AnyMaskedOptions };

	// FIXME using type insteadof of any
	definitions?: { [p: string]: any };
}
