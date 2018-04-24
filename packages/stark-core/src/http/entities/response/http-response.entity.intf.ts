import { StarkHttpStatusCodes } from "../../enumerators";

export interface StarkHttpResponse {
	starkHttpStatusCode: StarkHttpStatusCodes;
	starkHttpHeaders: Map<string, string>;
}
