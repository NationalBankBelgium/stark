import { StarkLogging } from "../entities/index";

export { loggingReducer, starkLoggingStoreKey } from "./logging.reducer";

export interface StarkLoggingState {
	starkLogging: StarkLogging;
}
