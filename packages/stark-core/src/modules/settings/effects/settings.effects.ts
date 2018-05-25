import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SetPreferredLanguage, StarkSettingsActionTypes } from "../actions";
import { STARK_SESSION_SERVICE, StarkSessionService } from "../../session/services";

@Injectable()
export class StarkSettingsEffects {
	public sessionService: StarkSessionService;

	public constructor(private actions$: Actions, @Inject(STARK_SESSION_SERVICE) sessionService: StarkSessionService) {
		this.sessionService = sessionService;
	}

	@Effect()
	public setPreferredLanguage$(): Observable<void> {
		return this.actions$.pipe(
			ofType<SetPreferredLanguage>(StarkSettingsActionTypes.SET_PREFERRED_LANGUAGE),
			map((action: SetPreferredLanguage) => this.sessionService.setCurrentLanguage(action.language))
		);
	}
}
