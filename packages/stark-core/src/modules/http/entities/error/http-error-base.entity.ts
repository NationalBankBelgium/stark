import { autoserialize, inheritSerialization } from "cerialize";

import { StarkErrorImpl } from "../../../../common/error";
import { StarkHttpErrorBase } from "./http-error-base.entity.intf";

/**
 * This class is only for serialization purposes
 * @ignore
 */
@inheritSerialization(StarkErrorImpl)
export class StarkHttpErrorBaseImpl extends StarkErrorImpl implements StarkHttpErrorBase {
	public constructor(error: Error) {
		super(error);
		this.name = "STARK_HTTP_ERROR";
	}

	@autoserialize
	public type!: string;

	@autoserialize
	public title!: string;

	@autoserialize
	public titleKey!: string;

	@autoserialize
	public titleKeyParameters!: string[];

	@autoserialize
	public instance!: string;

	// `declare` is necessary because this declaration overrides StarkErrorImpl `timestamp` declaration.
	@autoserialize
	public declare timestamp: string;

	@autoserialize
	public metadata?: object;
}
