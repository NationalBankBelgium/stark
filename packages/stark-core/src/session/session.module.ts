import { NgModule } from "@angular/core";
import { ActionReducerMap, StoreModule } from "@ngrx/store";

import { sessionReducer, StarkSessionState } from "./reducers";
import { StarkSessionActions } from "./actions";
import { StarkSessionServiceImpl, starkSessionServiceName } from "./services";

const reducers: ActionReducerMap<StarkSessionState, StarkSessionActions> = {
	session: sessionReducer
};

@NgModule({
	imports: [StoreModule.forFeature("StarkSession", reducers)],
	declarations: [],
	providers: [{ provide: starkSessionServiceName, useClass: StarkSessionServiceImpl }]
})
export class StarkSessionModule {}
