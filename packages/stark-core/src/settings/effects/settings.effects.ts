"use strict";

import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType /*toPayload */ } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators/map";

import { StarkSettingsActionTypes, SetPreferredLanguage } from "../actions/index";
import { StarkSessionService, starkSessionServiceName } from "../../session/services/index";

//FIXME StateUpdates
@Injectable()
export class StarkSettingsEffects {
	public sessionService: StarkSessionService;

	public constructor(private actions$: Actions, @Inject(starkSessionServiceName) sessionService: StarkSessionService) {
		this.sessionService = sessionService;
	}

	@Effect()
	public setPreferredLanguage$(): Observable<void> {
		return this.actions$.pipe(
			ofType(StarkSettingsActionTypes.SET_PREFERRED_LANGUAGE),
			map((action: Action) => this.sessionService.setCurrentLanguage((<SetPreferredLanguage>action).language))
		);
	}
}
