import { InjectionToken } from "@angular/core";
import { StarkUser } from "../../../user";

export const STARK_MOCK_DATA: InjectionToken<StarkMockData> = new InjectionToken<StarkMockData>("STARK_MOCK_DATA");

export interface StarkMockData {
	[key: string]: any;
	profiles?: StarkUser[];
}
