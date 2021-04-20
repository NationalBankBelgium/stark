import { createAction, props, union } from "@ngrx/store";
import { HeroMovieSearchCriteria } from "../entities";
import { demoGenericSearchStoreKey } from "../constants";

export const setCriteria = createAction(`[${demoGenericSearchStoreKey}] Set criteria`, props<{ criteria: HeroMovieSearchCriteria }>());
export const removeCriteria = createAction(`[${demoGenericSearchStoreKey}] Remove criteria`);
export const hasSearched = createAction(`[${demoGenericSearchStoreKey}] Has searched`);
export const hasSearchedReset = createAction(`[${demoGenericSearchStoreKey}] Has searched reset`);

/**
 * @ignore
 */
const all = union({ setCriteria, removeCriteria, hasSearched, hasSearchedReset });
export type Types = typeof all;
