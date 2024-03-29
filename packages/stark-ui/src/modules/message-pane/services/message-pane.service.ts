import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { Inject, Injectable } from "@angular/core";

import { StarkMessagePaneService, starkMessagePaneServiceName } from "./message-pane.service.intf";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

import { StarkMessage, StarkMessageCollection, StarkUIApplicationState, StarkMessageImpl } from "@nationalbankbelgium/stark-ui/src/common";

import { StarkMessagePaneActions } from "../actions";

import { selectStarkMessages } from "../reducers";

/**
 * @ignore
 */
@Injectable()
export class StarkMessagePaneServiceImpl implements StarkMessagePaneService {
	protected messages$: Observable<StarkMessageCollection>;
	public clearOnNavigation = false;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		public store: Store<StarkUIApplicationState>
	) {
		this.logger.debug(starkMessagePaneServiceName + " loaded");
		this.messages$ = this.store.pipe(select(selectStarkMessages));
	}

	public add(messages: StarkMessage[]): void {
		const normalizedMessages: StarkMessage[] = [];

		for (const message of messages) {
			normalizedMessages.push(this.normalizeMessage(message));
		}

		this.store.dispatch(StarkMessagePaneActions.addMessages({ messages: normalizedMessages }));
	}

	public addOne(message: StarkMessage): void {
		message = this.normalizeMessage(message);
		this.store.dispatch(StarkMessagePaneActions.addMessages({ messages: [message] }));
	}

	public getAll(): Observable<StarkMessageCollection> {
		// dispatched action is only for keeping a trace
		this.store.dispatch(StarkMessagePaneActions.getAllMessages());
		return this.messages$;
	}

	public remove(messages: StarkMessage[]): void {
		this.store.dispatch(StarkMessagePaneActions.removeMessages({ messages }));
	}

	public clearAll(): void {
		this.store.dispatch(StarkMessagePaneActions.clearMessages());
	}

	/**
	 * Analyse the priority of the message and give it one if it is undefined. If the priority value is wrong, an error is thrown.
	 * @param message - The message to analyse
	 */
	private normalizeMessage(message: StarkMessage): StarkMessage {
		let normalizedMessage: StarkMessage;

		if (message instanceof StarkMessageImpl) {
			normalizedMessage = message;
		} else {
			normalizedMessage = new StarkMessageImpl(
				message.id,
				message.key,
				message.code,
				message.type,
				message.interpolateValues,
				message.priority
			);
		}

		// Priority should be a value between 1 & 999
		if (typeof normalizedMessage.priority === "undefined") {
			return { ...normalizedMessage, priority: 999 };
		}

		if (normalizedMessage.priority < 1 || normalizedMessage.priority > 999) {
			throw new Error(starkMessagePaneServiceName + ": the priority has to be between 1 and 999");
		}

		return normalizedMessage;
	}
}
