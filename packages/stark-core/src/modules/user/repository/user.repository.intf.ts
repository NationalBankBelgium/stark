import { Observable } from "rxjs";
import { StarkUser } from "../entities";
import { StarkSingleItemResponseWrapper } from "../../http/entities";

export const starkUserRepositoryName: string = "StarkUserRepository";

/**
 * Repository responsible for user information.
 */
export interface StarkUserRepository {
	/**
	 * Fetch the user profile from the back-end
	 */
	getUser(): Observable<StarkSingleItemResponseWrapper<StarkUser>>;
}
