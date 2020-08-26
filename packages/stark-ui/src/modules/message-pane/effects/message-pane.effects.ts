import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { StarkNavigateSuccess, StarkRoutingActionTypes } from "@nationalbankbelgium/stark-core";
import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneService } from "../services";

/**
 * Effects definition for the {@link StarkMessagePaneComponent}.
 */
@Injectable()
export class StarkMessagePaneEffects {
	/**
	 * Class constructor
	 * @param actions$ - The action to perform.
	 * @param messagePaneService - The `StarkMessagePaneService` instance of the application.
	 */
	public constructor(
		private actions$: Actions,
		@Inject(STARK_MESSAGE_PANE_SERVICE) private messagePaneService: StarkMessagePaneService
	) {}

	/**
	 * If the [StarkMessagePaneService clearOnNavigation]{@link StarkMessagePaneService#clearOnNavigation} property is set to `true`,
	 * the messages will be cleared when there is a successful navigation.
	 *
	 * `dispatch: false` => because this effect does not dispatch an action
	 */
	@Effect({ dispatch: false })
	public clearOnNavigationSuccess$(): Observable<any> {
		return this.actions$.pipe(
			ofType<StarkNavigateSuccess>(StarkRoutingActionTypes.NAVIGATE_SUCCESS),
			map(() => {
				if (this.messagePaneService.clearOnNavigation) {
					this.messagePaneService.clearAll();
				}
			})
		);
	}
}
