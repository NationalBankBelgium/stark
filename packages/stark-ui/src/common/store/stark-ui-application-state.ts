import { StarkMessageState } from "../../modules/message-pane/reducers";

/**
 * Interface defining the shape of the application state of Stark Ui extending Core (i.e., what's stored in Redux by Stark)
 */
export interface StarkUIApplicationState extends StarkMessageState {}
