import { StateDeclaration, RawParams } from "@uirouter/core";

export interface StarkStateConfigWithParams {
	state: StateDeclaration;
	paramValues: RawParams;
}
