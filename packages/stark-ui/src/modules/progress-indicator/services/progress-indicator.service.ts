/* tslint:disable:completed-docs*/
import { select, Store } from "@ngrx/store";
import { defer, Observable, of, Subject, throwError, timer } from "rxjs";
import { flatMap, map, retryWhen, switchMap, take, tap } from "rxjs/operators";
import { Inject, Injectable } from "@angular/core";

import { StarkProgressIndicatorService, starkProgressIndicatorServiceName } from "./progress-indicator.service.intf";
import {
	StarkProgressIndicatorDeregister,
	StarkProgressIndicatorHide,
	StarkProgressIndicatorRegister,
	StarkProgressIndicatorShow
} from "../actions";
import { StarkProgressIndicatorConfig, StarkProgressIndicatorConfigImpl, StarkProgressIndicatorType } from "../entities";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { selectStarkProgressIndicator } from "../reducers";
import { StarkUIApplicationState } from "../../../common/store";

/**
 * Service to handle the visibility of a progress indicator (e.g., spinner, progress percentage, ...) programmatically.
 */
@Injectable()
export class StarkProgressIndicatorServiceImpl implements StarkProgressIndicatorService {
	protected progressIndicatorMap$: Observable<Map<string, StarkProgressIndicatorConfig>>;
	protected progressIndicatorMap: Map<string, StarkProgressIndicatorConfig>;

	/**
	 * Map containing a subject per topic
	 */
	public topicsShowMap$: Map<string, Subject<string>>;

	/**
	 * Class constructor
	 * Subscription is made to the progressIndicatorMap, containing the configuration for the progressIndicator
	 * @param logger - The logger of the application
	 * @param store - The store of the application
	 */
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService, public store: Store<StarkUIApplicationState>) {
		this.logger.debug(starkProgressIndicatorServiceName + " loaded");

		this.progressIndicatorMap$ = this.store.pipe(select(selectStarkProgressIndicator));

		this.progressIndicatorMap$.subscribe((progressIndicatorMap: Map<string, StarkProgressIndicatorConfig>) => {
			this.progressIndicatorMap = progressIndicatorMap;
		});

		this.topicsShowMap$ = new Map<string, Subject<string>>();
	}

	/**
	 * Dispatches the REGISTER action in case the topic does not exist yet in the Store (starkProgressIndicator), otherwise
	 * a REFRESH_CONFIG action is dispatched to increase the listenersCount by 1
	 */
	public register(topic: string, type: StarkProgressIndicatorType): void {
		const progressIndicatorConfig: StarkProgressIndicatorConfig = new StarkProgressIndicatorConfigImpl(topic, type, false);
		this.store.dispatch(new StarkProgressIndicatorRegister(progressIndicatorConfig));
	}

	/**
	 * Dispatches the DEREGISTER action in case the topic exists in the Store (starkProgressIndicator) and its listenersCount is 1, otherwise
	 * a REFRESH_CONFIG action is dispatched to decrease the listenersCount by 1
	 */
	public deregister(topic: string): void {
		if (this.progressIndicatorMap.has(topic)) {
			this.store.dispatch(new StarkProgressIndicatorDeregister(topic));
		}
	}

	/**
	 * Dispatches the SHOW action in case the indicator is not shown yet, otherwise a REFRESH_CONFIG action is dispatched
	 * to increase the pendingListenersCount by 1
	 */
	public show(topic: string): void {
		const maxRetries: number = 15;
		const interval: number = 50; // milliseconds
		const logMessagePrefix: string = starkProgressIndicatorServiceName + ": Show - progress indicator for topic '" + topic + "'";

		if (!this.topicsShowMap$.has(topic)) {
			this.topicsShowMap$.set(topic, new Subject()); // create the subject in case it does not exist yet for this topic
		}

		// try to find the indicator with the given topic a maximum of 'maxRetries' times before throwing an error
		defer(() => {
			if (this.progressIndicatorMap.has(topic)) {
				this.store.dispatch(new StarkProgressIndicatorShow(topic));
				return of(logMessagePrefix + " shown.");
			} else {
				return throwError(logMessagePrefix + " not found!");
			}
		})
			.pipe(
				retryWhen((errors: Observable<any>) => {
					let retries: number = 0;
					return errors.pipe(
						flatMap((error: any) => {
							if (retries < maxRetries) {
								retries++;
								return timer(interval);
							} else {
								return throwError(error);
							}
						})
					);
				}),
				tap((result: any) => {
					if (this.topicsShowMap$.has(topic)) {
						const topicShow$: Subject<string> = <Subject<string>>this.topicsShowMap$.get(topic);

						topicShow$.next(result); // emit result in the subject of the topic so that 'hide' can continue (in case it was called)
						// complete and remove the subject so that next calls to 'hide' don't need to wait (unless 'show' is called first)
						topicShow$.complete();
						this.topicsShowMap$.delete(topic);
					}
				})
			)
			.subscribe({
				error: (error: string) => this.logger.error(error)
			});
	}

	/**
	 * Dispatches the HIDE action in case the indicator has no pending listeners (only 1), otherwise a REFRESH_CONFIG action is dispatched
	 * to decrease the pendingListenersCount by 1
	 */
	public hide(topic: string): void {
		const logMessagePrefix: string = starkProgressIndicatorServiceName + ": Hide - progress indicator for topic '" + topic + "'";

		const hide$: Observable<string> = defer(() => {
			if (this.progressIndicatorMap.has(topic)) {
				this.store.dispatch(new StarkProgressIndicatorHide(topic));
				return of(logMessagePrefix + " hidden.");
			} else {
				return throwError(logMessagePrefix + " not found!");
			}
		});

		let composedHide$: Observable<string> = hide$;

		// check if the 'hide' needs to wait for the 'show' to finish, otherwise it is executed immediately
		if (this.topicsShowMap$.has(topic)) {
			const topicShow$: Subject<string> = <Subject<string>>this.topicsShowMap$.get(topic);

			composedHide$ = topicShow$.pipe(
				switchMap(() => {
					return hide$; // call the 'hide' logic after the 'show' finishes
				}),
				take(1)
			); // unsubscribe from the 'show' in this chain (every call to the hide() method must listen only to one emission)
		}

		composedHide$.subscribe({
			error: (error: string) => {
				this.logger.error(error);
			}
		});
	}

	public isVisible(topic: string): Observable<boolean | undefined> {
		return this.progressIndicatorMap$.pipe(
			map((progressIndicatorMap: Map<string, StarkProgressIndicatorConfig> | undefined) => {
				const progressIndicator: StarkProgressIndicatorConfig | undefined = progressIndicatorMap
					? progressIndicatorMap.get(topic)
					: undefined;
				if (!progressIndicator) {
					return undefined;
				}
				return progressIndicator.visible;
			})
		);
	}
}
