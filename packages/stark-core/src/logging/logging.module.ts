import { NgModule } from "@angular/core";
// import {ActionReducerMap, StoreModule} from "@ngrx/store";

// import {loggingReducer} from "./reducers/index";
// import {StarkLoggingActions} from "./actions/index";
import { StarkLoggingServiceImpl, starkLoggingServiceName } from "./services/index";
import { starkAppConfigConstantName, StarkApplicationConfigImpl } from "../configuration/entities/index";
// import {StarkLoggingApplicationState} from "../common/store/starkCoreApplicationState";

// const reducers:ActionReducerMap<StarkLoggingApplicationState, StarkLoggingActions> = {
// 	starkLogging: loggingReducer
// };

@NgModule({
	// imports: [StoreModule.forRoot(reducers)],
	imports: [],
	declarations: [],
	providers: [
		{ provide: starkLoggingServiceName, useClass: StarkLoggingServiceImpl },
		{ provide: starkAppConfigConstantName, useClass: StarkApplicationConfigImpl }
	]
})
export class LoggingModule {}
