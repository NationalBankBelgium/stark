/**
 * Interface defining the shape of the application state of Stark Core (i.e., what's stored in Redux by Stark)
 */
import { StarkLoggingState } from "../../logging/reducers/index";
import { StarkSessionState } from "../../session/reducers/index";
// import {StarkSettingsState} from "../../settings/reducers/index";

export interface StarkCoreApplicationState extends StarkLoggingState, StarkSessionState /*, StarkSettingsState*/ {
	// starkApplicationMetadata: StarkApplicationMetadata;
	// starkLogging: StarkLogging;
	// starkSession: StarkSession;
	// starkSettings: StarkSettings;
	// starkUser: StarkUser;  // not stored in Redux
}
