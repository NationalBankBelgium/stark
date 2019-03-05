import { EventEmitter } from "@angular/core";

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

	/**
	 * Check if passed eventEmitter is wired up or not.
	 * That means if there is a method linked to this Output or not.
	 * @param eventEmitter - EventEmitter to be checked
	 */
	public static isOutputWiredUp(eventEmitter: EventEmitter<any>): boolean {
		return eventEmitter.observers.length > 0;
	}
}
