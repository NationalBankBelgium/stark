import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { Store } from "@ngrx/store";
import { StarkCoreApplicationState } from "../../../common/store";
import { StarkUnhandledError } from "../actions";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "../../logging/services";

@Injectable()
export class StarkErrorHandler implements ErrorHandler {
	private _starkLoggingService: StarkLoggingService;
	private _applicationStore: Store<StarkCoreApplicationState>;

	public constructor(private injector: Injector) {}

	/**
	 * Thie method will dispatch an error method, which the user can then handle
	 * @param error the encountered error
	 */
	public handleError(error: any): void {
		this.starkLoggingService.error("StarkErrorHandler: an error has occurred : ", error);
		this.applicationStore.dispatch(new StarkUnhandledError(error));
	}

	/**
	 * Gets the StarkLoggingService from the Injector.
	 * @throws When the service is not found (the StarkLoggingService is not provided in the app).
	 */
	private get starkLoggingService(): StarkLoggingService {
		if (typeof this._starkLoggingService === "undefined") {
			this._starkLoggingService = this.injector.get<StarkLoggingService>(STARK_LOGGING_SERVICE);
			return this._starkLoggingService;
		}

		return this._starkLoggingService;
	}

	/**
	 * Gets the Application Store from the Injector.
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
