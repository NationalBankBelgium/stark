/**
 * The profile of the User
 */
export interface StarkUserProfile {
	/**
	 * The user's username
	 */
	username: string;
	/**
	 * The user's first name
	 */
	firstName: string;
	/**
	 * The user's last name
	 */
	lastName: string;
	/**
	 * The user's email address
	 */
	email?: string;
	/**
	 * The user's phone number
	 */
	phone?: string;
	/**
	 * The user's language
	 */
	language?: string;
	/**
	 * The user's reference number
	 */
	referenceNumber?: string;
	/**
	 * Is the user anonymous or not?
	 */
	isAnonymous?: boolean;
	/**
	 * This property will contain any additional details for the user profile returned by the backend
	 */
	custom?: object;
}
