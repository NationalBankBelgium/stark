import { StarkHttpErrorBase } from "./http-error-base.entity.intf";

export interface StarkHttpErrorDetail extends StarkHttpErrorBase {
	detail: string;
	detailKey: string;
	detailKeyParameters?: string[];
	fields?: string[];
	status?: string;
	index?: number;
}
