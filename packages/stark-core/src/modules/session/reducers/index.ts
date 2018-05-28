import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkSession } from "../entities";
import { StarkSessionActions } from "../actions";
import { sessionReducer } from "../reducers";

export interface StarkSessionState {
	session: StarkSession;
}

export const starkSessionReducers: ActionReducerMap<StarkSessionState, StarkSessionActions> = {
	session: sessionReducer
};

export const selectStarkSessionFeature: MemoizedSelector<object, StarkSessionState> = createFeatureSelector<StarkSessionState>(
	"StarkSession"
);

export const selectStarkSession: MemoizedSelector<object, StarkSession> = createSelector(
	selectStarkSessionFeature,
	(state: StarkSessionState) => state.session
);
