import { Observable } from "rxjs/Observable";
import { StarkUser } from "../entities/index";
import { StarkSingleItemResponseWrapper } from "../../http/entities/index";

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
