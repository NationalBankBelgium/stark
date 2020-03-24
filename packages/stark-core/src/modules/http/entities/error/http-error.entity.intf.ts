import { StarkHttpErrorBase } from "./http-error-base.entity.intf";
import { StarkHttpErrorDetail } from "./http-error-detail.entity.intf";

/**
 * This class contains all the information about the Http error in case of failure of
 * any type of request performed by the {@link StarkHttpService} and it is wrapped in a {@link StarkHttpErrorWrapper}.
 */
export interface StarkHttpError extends StarkHttpErrorBase {
	/**
	 * An array of {@link StarkHttpErrorDetail} objects containing all the information about the Http error.
	 */
	errors: StarkHttpErrorDetail[];
}
