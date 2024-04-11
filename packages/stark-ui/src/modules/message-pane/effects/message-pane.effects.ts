import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, CreateEffectMetadata, ofType } from "@ngrx/effects";
import { map } from "rxjs/operators";
import { StarkRoutingActions } from "@nationalbankbelgium/stark-core";
import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneService } from "../services";
import { Observable } from "rxjs";

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
	) {
		this.clearOnNavigationSuccess$ = createEffect(
			() =>
				this.actions$.pipe(
					ofType(StarkRoutingActions.navigateSuccess),
					map(() => {
						if (this.messagePaneService.clearOnNavigation) {
							this.messagePaneService.clearAll();
						}
					})
				),
			{ dispatch: false }
		);
	}

	/**
	 * If the [StarkMessagePaneService clearOnNavigation]{@link StarkMessagePaneService#clearOnNavigation} property is set to `true`,
	 * the messages will be cleared when there is a successful navigation.
	 *
	 * `dispatch: false` => because this effect does not dispatch an action
	 */
	public clearOnNavigationSuccess$: Observable<void> & CreateEffectMetadata;
}
