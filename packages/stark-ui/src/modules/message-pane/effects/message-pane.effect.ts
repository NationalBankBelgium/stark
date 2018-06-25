import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { StarkRoutingActions, StarkRoutingActionTypes } from "@nationalbankbelgium/stark-core";

import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneService } from "../services";

@Injectable()
export class StarkMessagePaneEffects {
	/**
	 * Class constructor
	 * @param actions$ - the action to perform
	 * @param messagePaneService - the Message-Pane Service
	 */
	public constructor(
		private actions$: Actions,
		@Inject(STARK_MESSAGE_PANE_SERVICE) private messagePaneService: StarkMessagePaneService
	) {}

	/**
	 * If the 'clearOnNavigation' option is set to 'true',
	 * the messages will be cleared when there is a successful navigation
	 */
	@Effect({ dispatch: false })
	public clearOnNavigationSuccess$(): Observable<any> {
		return this.actions$.pipe(
			ofType<StarkRoutingActions>(StarkRoutingActionTypes.NAVIGATE_SUCCESS),
			map(() => {
				if (this.messagePaneService.clearOnNavigation) {
					this.messagePaneService.clearAll();
				}
			})
		);
	}
}
