import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { StarkPrettyPrintFormat } from "../types";

/**
 * @ignore
 */
export const starkPrettyPrintServiceName = "starkPrettyPrintService";

/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkPrettyPrintService}
 */
export const STARK_PRETTY_PRINT_SERVICE: InjectionToken<StarkPrettyPrintService> = new InjectionToken<StarkPrettyPrintService>(
	starkPrettyPrintServiceName
);

/**
 * Service that make the interface between Prettier and Prism
 */
export interface StarkPrettyPrintService {
	format(data: string, format: StarkPrettyPrintFormat, highlightingEnabled: boolean): Observable<string>;
}
