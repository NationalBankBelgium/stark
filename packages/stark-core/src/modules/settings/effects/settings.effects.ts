import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { StarkSetPreferredLanguage, StarkSettingsActionTypes } from "../actions";
import { STARK_SESSION_SERVICE, StarkSessionService } from "../../session/services";

/**
 * Effects definition to modify the session's settings.
 */
@Injectable()
export class StarkSettingsEffects {
	/**
	 * Class constructor
	 * @param actions$ - The action to perform.
	 * @param sessionService - The `StarkSessionService` instance of the application.
	 */
	public constructor(private actions$: Actions, @Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService) {}

	/**
	 * Sets the language of the current session via the `StarkSessionService` whenever the preferred language changes in the settings.
	 *
	 * `dispatch: false` => because this effect does not dispatch an action
	 */
	@Effect({ dispatch: false })
	public setPreferredLanguage$(): Observable<void> {
		return this.actions$.pipe(
			ofType<StarkSetPreferredLanguage>(StarkSettingsActionTypes.SET_PREFERRED_LANGUAGE),
			map((action: StarkSetPreferredLanguage) => this.sessionService.setCurrentLanguage(action.language))
		);
	}
}
