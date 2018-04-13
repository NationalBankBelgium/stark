import { NgModule } from "@angular/core";
import { ActionReducerMap, StoreModule } from "@ngrx/store";

import { sessionReducer } from "./reducers/index";
import { StarkSessionActions } from "./actions/index";
import { StarkSessionServiceImpl, starkSessionServiceName } from "./services/index";
import { StarkSessionApplicationState } from "../common/store/starkCoreApplicationState";

const reducers:ActionReducerMap<StarkSessionApplicationState, StarkSessionActions> = {
	starkSession: sessionReducer
};

@NgModule({
	imports: [StoreModule.forRoot(reducers)],
	declarations: [],
	providers: [
		{ provide: starkSessionServiceName, useClass: StarkSessionServiceImpl }
	]
})
export class StarkSessionModule {}
