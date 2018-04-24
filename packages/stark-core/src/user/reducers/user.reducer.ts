import { StarkUserActions, StarkUserActionTypes } from "../actions/index";
import { StarkUser } from "../entities/index";

export const starkUserStoreKey: string = "starkUser";

const INITIAL_STATE: undefined = undefined;

export function userReducer(
	state: Readonly<StarkUser[]> | undefined = INITIAL_STATE,
	action: StarkUserActions
): Readonly<StarkUser[]> | undefined {
	// the new state will be calculated from the data coming in the actions
	switch (action.type) {
		case StarkUserActionTypes.GET_ALL_USERS_SUCCESS:
			return action.users;

		default:
			return state;
	}
}
