/**
 * Interface defining the shape of the application state of Stark Core (i.e., what's stored in Redux by Stark)
 */
import { StarkLoggingState } from "../../modules/logging/reducers";
import { StarkSessionState } from "../../modules/session/reducers";
// import {StarkSettingsState} from "../../settings/reducers";

export interface StarkCoreApplicationState extends StarkLoggingState, StarkSessionState /*, StarkSettingsState*/ {
	// starkApplicationMetadata: StarkApplicationMetadata;
	// starkSettings: StarkSettings;
	// starkUser: StarkUser;  // not stored in Redux
}
