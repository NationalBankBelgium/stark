import { GetAllUsersSuccess } from "../actions";
import { StarkUser } from "../entities";
import { userReducer } from "./user.reducer";

const deepFreeze: Function = require("deep-freeze-strict");

describe("Reducer: UsersReducer", () => {
	let users: StarkUser[];

	beforeEach(() => {
		users = <StarkUser[]>[{ uuid: "694", username: "sgonzales" }, { uuid: "351", username: "tmania" }];
	});

	describe("on GET_ALL_USERS_SUCCESS", () => {
		it("should get the users when state given", () => {
			// create the initial state object
			const initialState: StarkUser[] = <StarkUser[]>[];
			deepFreeze(initialState); //Enforce immutability

			// Send the GET_ALL_USERS_SUCCESS action to the userReducer
			const changedState: StarkUser[] = <StarkUser[]>userReducer(initialState, new GetAllUsersSuccess(users));
			expect(changedState[0].uuid).toBe("694");
			expect(changedState[1].uuid).toBe("351");
		});

		it("should get the users when state not defined", () => {
			// Send the GET_ALL_USERS_SUCCESS action to the userReducer
			const changedState: StarkUser[] = <StarkUser[]>userReducer(undefined, new GetAllUsersSuccess(users));
			expect(changedState[0].uuid).toBe("694");
			expect(changedState[1].uuid).toBe("351");
		});
	});

	describe("on any other Action", () => {
		it("should invoke the default state", () => {
			const initialState: StarkUser[] = users;
			deepFreeze(initialState); //Enforce immutability

			// Send the MOCK_ACTION action to the userReducer
			const changedState: StarkUser[] = <StarkUser[]>userReducer(initialState, <any>{
				type: "MOCK_ACTION"
			});

			expect(changedState).toBe(initialState);
		});
	});
});
