import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators/map";

import { StarkSettingsActionTypes, SetPreferredLanguage } from "../actions";
import { StarkSessionService, starkSessionServiceName } from "../../session/services";

@Injectable()
export class StarkSettingsEffects {
	public sessionService: StarkSessionService;

	public constructor(private actions$: Actions, @Inject(starkSessionServiceName) sessionService: StarkSessionService) {
		this.sessionService = sessionService;
	}

	@Effect()
	public setPreferredLanguage$(): Observable<void> {
		return this.actions$.pipe(
			ofType<SetPreferredLanguage>(StarkSettingsActionTypes.SET_PREFERRED_LANGUAGE),
			map((action: SetPreferredLanguage) =>this.sessionService.setCurrentLanguage(action.language))
		);
	}
}
