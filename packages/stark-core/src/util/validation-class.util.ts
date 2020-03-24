/**
 * Class containing utils to be used for class validation decorators of the {@link https://github.com/typestack/class-validator|class-validator} library
 */
export class StarkClassValidationUtil {
	/**
	 * Returns `true` if the given value is **not** `undefined`.
	 * @param _instance - The instance of the class being validated
	 * @param value - The value of the property being validated
	 */
	public static validateIfDefined(_instance: any, value: any): boolean {
		return typeof value !== "undefined";
	}

	/**
	 * Returns `true` if the given value is **not** `undefined` and **not** `null`.
	 * @param _instance - The instance of the class being validated
	 * @param value - The value of the property being validated
	 */
	public static validateIfDefinedAndNotNull(_instance: any, value: any): boolean {
		return typeof value !== "undefined" && value !== null;
	}
}
