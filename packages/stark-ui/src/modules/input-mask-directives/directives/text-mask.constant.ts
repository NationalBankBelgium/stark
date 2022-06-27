/**
 * Util class containing some constants with predefined masks for common mask patterns to be used with the {@link StarkTextMaskDirective}.
 */
export class StarkTextMasks {
	/**
	 * Mask for credit card numbers: "dddd-dddd-dddd-dddd"
	 */
	public static CREDITCARD_NUMBER = "0000-0000-0000-0000";

	/**
	 * Mask for Belgian Structured Communication numbers: "+++ddd/dddd/ddddd+++"
	 */
	public static STRUCTURED_COMMUNICATION_NUMBER = "+++000/0000/00000+++";
}
