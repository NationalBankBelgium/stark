"use strict";

import { StarkUser } from "../../user/entities/index";

export interface StarkSession {
	/**
	 * The current session's language
	 */
	currentLanguage: string;

	/**
	 * The current user logged in the application (if there is one logged in), otherwise it will be undefined
	 */
	user: StarkUser | undefined;
}
