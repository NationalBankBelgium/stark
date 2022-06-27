export interface StarkNumberMaskConfig {
	/**
	 * String to be displayed before the amount.
	 *
	 * Default: `""` (empty string)
	 */
	prefix?: string;

	/**
	 * String to be displayed after the amount.
	 *
	 * Default: `""` (empty string)
	 */
	suffix?: string;

	/**
	 * Whether or not to separate thousands.
	 *
	 * Default: `true`
	 */
	includeThousandsSeparator?: boolean;

	/**
	 * Character to be used as thousands separator.
	 *
	 * Default: `","`
	 */
	thousandsSeparatorSymbol?: string;

	/**
	 * Whether or not to allow the user to enter a fraction with the amount.
	 *
	 * Default: `false`
	 */
	allowDecimal?: boolean;

	/**
	 * Character to be used as decimal point.
	 *
	 * Default: `"."`
	 */
	decimalSymbol?: string;

	/**
	 * Number of digits to allow in the decimal part of the number.
	 *
	 * Default: `2`
	 */
	decimalLimit?: number;

	/**
	 * Limit the length of the integer number.
	 *
	 * Default: `undefined` (unlimited)
	 */
	integerLimit?: number;

	/**
	 * Whether or not to always include a decimal point and placeholder for decimal digits after the integer.
	 *
	 * Default: `false`
	 */
	requireDecimal?: boolean;

	/**
	 * Whether or not to allow negative numbers.
	 *
	 * Default: `true`
	 */
	allowNegative?: boolean;

	/**
	 * Whether or not to allow leading zeroes.
	 *
	 * Default: `false`
	 */
	allowLeadingZeroes?: boolean;

	/**
	 * show prefix and suffix on typing
	 *
	 * default: 'true'
	 */

	guide?: boolean;
}
