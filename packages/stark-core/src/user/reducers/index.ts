import { createSelector, createFeatureSelector, MemoizedSelector } from "@ngrx/store";
import { StarkUser } from "../../user/entities/index";
import { StarkSessionState } from "../../session/reducers/index";
export * from "./user.reducer";

export const selectStarkUser: MemoizedSelector<object, StarkUser | undefined> = createSelector(
	createFeatureSelector<StarkSessionState>("StarkUser"),
	(state: StarkSessionState) => state.session.user
);
