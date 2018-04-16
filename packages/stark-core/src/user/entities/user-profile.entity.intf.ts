"use strict";

export interface StarkUserProfile {
	username: string;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	language?: string;
	referenceNumber?: string;
	isAnonymous?: boolean;

	/**
	 * This property will contain any additional details for the user profile returned by the backend
	 */
	custom?: object;
}
