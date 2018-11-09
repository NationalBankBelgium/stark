/**
 * Stark specific Component commands
 */
export class StarkComponentUtil {
	/**
	 * Check if passed input is equal to "true", empty string or true.
	 * @param input - Input to be checked
	 */
	public static isInputEnabled(input?: string): boolean {
		return typeof input === "boolean" ? input : input === "true" || input === "";
	}
}
