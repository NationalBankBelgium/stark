import { NgModule } from "@angular/core";
import { ActionReducerMap, StoreModule } from "@ngrx/store";

import { loggingReducer, StarkLoggingState } from "./reducers";
import { StarkLoggingActions } from "./actions";
import { StarkLoggingServiceImpl, starkLoggingServiceName } from "./services";

const reducers: ActionReducerMap<StarkLoggingState, StarkLoggingActions> = {
	logging: loggingReducer
};

@NgModule({
	imports: [StoreModule.forFeature("StarkLogging", reducers)],
	declarations: [],
	providers: [{ provide: starkLoggingServiceName, useClass: StarkLoggingServiceImpl }]
})
export class StarkLoggingModule {}
