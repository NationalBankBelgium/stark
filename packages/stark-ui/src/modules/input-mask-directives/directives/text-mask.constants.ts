/**
 * Util class containing some constants with predefined masks for common mask patterns to be used with the {@link StarkTextMaskDirective}.
 */
export class StarkTextMasks {
	/**
	 * Extracted regex as a workaround to avoid Angular compiler error: "Expression form not supported".
	 *
	 * Using simple string instead of RegExp strings since the compiler has a restricted expression syntax.
	 * See https://v12.angular.io/guide/aot-compiler#expression-syntax
	 * @ignore
	 */
	private static regexSingleDigit = new RegExp("\\d");

	/**
	 * Mask for Belgian Structured Communication numbers: "+++ddd/dddd/ddddd/+++"
	 */
	public static STRUCTURED_COMMUNICATION_NUMBER: (RegExp | string)[] = [
		"+",
		"+",
		"+",
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		"/",
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		"/",
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		"+",
		"+",
		"+"
	];

	/**
	 * Mask for credit card numbers: "dddd-dddd-dddd-dddd"
	 */
	public static CREDITCARD_NUMBER: (RegExp | string)[] = [
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		"-",
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		"-",
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		"-",
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit,
		StarkTextMasks.regexSingleDigit
	];
}
