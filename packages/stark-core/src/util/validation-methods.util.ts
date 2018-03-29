export class StarkValidationMethodsUtil {
	/**
	 * Return true if the passed object is NOT undefined.
	 * @param value
	 */
	public static validateIfDefined(_instance: any, value: any): boolean {
		return typeof value !== "undefined";
	}
	
	/**
	 * Return true if the passed object is NOT undefined and NOT null.
	 * @param value
	 */
	public static validateIfDefinedAndNotNull(_instance: any, value: any): boolean {
		return typeof value !== "undefined" && value !== null;
	}
}
