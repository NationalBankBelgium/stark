import { StarkResponseWrapper } from "./response-wrapper.entity.intf";
import { StarkResource } from "../resource.entity.intf";

export interface StarkSingleItemResponseWrapper<T extends StarkResource> extends StarkResponseWrapper<T> {}
