import { NgModule } from "@angular/core";
import { ActionReducerMap, StoreModule } from "@ngrx/store";

import { loggingReducer, StarkLoggingState } from "./reducers/index";
import { StarkLoggingActions } from "./actions/index";
import { StarkLoggingServiceImpl, starkLoggingServiceName } from "./services/index";

const reducers: ActionReducerMap<StarkLoggingState, StarkLoggingActions> = {
	logging: loggingReducer
};

@NgModule({
	imports: [StoreModule.forFeature("StarkLogging", reducers)],
	declarations: [],
	providers: [{ provide: starkLoggingServiceName, useClass: StarkLoggingServiceImpl }]
})
export class StarkLoggingModule {}
