import { NgModule } from "@angular/core";
import { ActionReducerMap, StoreModule } from "@ngrx/store";

import { sessionReducer, StarkSessionState } from "./reducers/index";
import { StarkSessionActions } from "./actions/index";
import { StarkSessionServiceImpl, starkSessionServiceName } from "./services/index";

const reducers: ActionReducerMap<StarkSessionState, StarkSessionActions> = {
	session: sessionReducer
};

@NgModule({
	imports: [StoreModule.forFeature("StarkSession", reducers)],
	declarations: [],
	providers: [{ provide: starkSessionServiceName, useClass: StarkSessionServiceImpl }]
})
export class StarkSessionModule {}
