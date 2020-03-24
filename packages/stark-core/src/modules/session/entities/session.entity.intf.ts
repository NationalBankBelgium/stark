import { StarkUser } from "../../user/entities";

/**
 * Interface that describes the information that is stored and available during the whole session of a user.
 */
export interface StarkSession {
	/**
	 * The current session's language
	 */
	currentLanguage: string;

	/**
	 * The current {@link StarkUser} logged in the application (if there is one logged in), otherwise it will be `undefined`
	 */
	user?: StarkUser;
}
