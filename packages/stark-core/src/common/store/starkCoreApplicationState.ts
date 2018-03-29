/**
 * Interface defining the shape of the application state of Stark Core (i.e., what's stored in Redux by Stark)
 */
import { StarkLogging } from "../../logging/entities/index";
// import {StarkSession} from "../../session/entities";
// import {StarkSettings} from "../../settings/entities";

export interface StarkCoreApplicationState
	extends StarkLoggingApplicationState /*, StarkSessionApplicationState, StarkSettingsApplicationState*/ {
	// starkApplicationMetadata: StarkApplicationMetadata;
	// starkLogging: StarkLogging;
	// starkSession: StarkSession;
	// starkSettings: StarkSettings;
	// starkUser: StarkUser;  // not stored in Redux
}
export interface StarkLoggingApplicationState {
	starkLogging: StarkLogging;
}

// export interface StarkSessionApplicationState {
// 	starkSession: StarkSession;
// }
// export interface StarkSettingsApplicationState {
// 	starkSettings: StarkSettings;
// }
