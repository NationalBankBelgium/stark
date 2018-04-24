import { createSelector, createFeatureSelector, MemoizedSelector } from "@ngrx/store";
import { StarkSession } from "../entities/index";

export { sessionReducer, starkSessionStoreKey } from "./session.reducer";

export interface StarkSessionState {
	session: StarkSession;
}

export const selectStarkSession: MemoizedSelector<object, StarkSession> = createSelector(
	createFeatureSelector<StarkSessionState>("StarkSession"),
	(state: StarkSessionState) => state.session
);
