import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { Store } from "@ngrx/store";
import { StarkCoreApplicationState } from "../../../common/store";
import { StarkErrorHandlingActions } from "../actions";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "../../logging/services";

/**
 * Replacement for the default {@link https://v7.angular.io/api/core/ErrorHandler|ErrorHandler} from Angular
 */
@Injectable()
export class StarkErrorHandler implements ErrorHandler {
	/**
	 * @ignore
	 * @internal
	 */
	private _starkLoggingService?: StarkLoggingService;

	/**
	 * @ignore
	 * @internal
	 */
	private _applicationStore?: Store<StarkCoreApplicationState>;

	/**
	 * Class constructor
	 * @param injector - The Angular injector
	 */
	public constructor(private injector: Injector) {}

	/**
	 * Dispatches an {@link StarkErrorHandlingActions.unhandledError} action which the user can then handle
	 * @param error - The encountered error
	 */
	public handleError(error: any): void {
		this.starkLoggingService.error("StarkErrorHandler: an error has occurred : ", error);
		this.applicationStore.dispatch(StarkErrorHandlingActions.unhandledError({ error }));
	}

	/**
	 * @ignore
	 * @internal
	 * @throws When the service is not found (the {@link StarkLoggingService} is not provided in the app).
	 */
	private get starkLoggingService(): StarkLoggingService {
		if (typeof this._starkLoggingService === "undefined") {
			this._starkLoggingService = this.injector.get<StarkLoggingService>(STARK_LOGGING_SERVICE);
			return this._starkLoggingService;
		}

		return this._starkLoggingService;
	}

	/**
	 * @ignore
	 * @internal
	 * @throws When the Store is not found (the NGRX Store module is not imported in the app).
	 */
	private get applicationStore(): Store<StarkCoreApplicationState> {
		if (typeof this._applicationStore === "undefined") {
			this._applicationStore = this.injector.get<Store<StarkCoreApplicationState>>(Store);
			return this._applicationStore;
		}

		return this._applicationStore;
	}
}
