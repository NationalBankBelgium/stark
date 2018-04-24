import { StarkError } from "../../../common";

export interface StarkHttpErrorBase extends StarkError {
	type: string;
	title: string;
	titleKey: string;
	titleKeyParameters?: string[];
	instance?: string;
	timestamp?: string;
	metadata?: object;
}
