import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { BehaviorSubject, Observable } from "rxjs";
import { StarkProgressIndicatorActions } from "../actions";
import { StarkProgressIndicatorFullConfig, StarkProgressIndicatorType } from "../entities";
import { StarkProgressIndicatorServiceImpl } from "../services";
import { progressIndicatorReducer } from "../reducers";
import { StarkUIApplicationState } from "@nationalbankbelgium/stark-ui/src/common";
import Spy = jasmine.Spy;
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { TestBed } from "@angular/core/testing";

describe("ProgressIndicatorService", () => {
	let mockStore: MockStore<StarkUIApplicationState>;
	let progressIndicatorService: ProgressIndicatorServiceHelper;
	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();
	let mockProgressIndicatorMap: Map<string, StarkProgressIndicatorFullConfig>;

	const dummyTopic = "some topic";
	const dummyType: StarkProgressIndicatorType = StarkProgressIndicatorType.SPINNER;
	let progressIndicatorState$: BehaviorSubject<Map<string, StarkProgressIndicatorFullConfig>>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore<StarkUIApplicationState>()]
		});

		mockStore = TestBed.inject(MockStore);
		spyOn(mockStore, "dispatch");
		spyOn(mockStore, "pipe");
		mockStore = jasmine.createSpyObj("store", ["dispatch", "pipe"]);
		mockProgressIndicatorMap = new Map<string, StarkProgressIndicatorFullConfig>();
		progressIndicatorState$ = new BehaviorSubject(mockProgressIndicatorMap);
		(<Spy>mockStore.pipe).and.returnValue(progressIndicatorState$);

		progressIndicatorService = new ProgressIndicatorServiceHelper(mockLogger, mockStore);

		(<Spy<(action: StarkProgressIndicatorActions.Types) => void>>mockStore.dispatch).and.callFake(
			(action: StarkProgressIndicatorActions.Types) => {
				// reducer
				progressIndicatorService.progressIndicatorMap = progressIndicatorReducer(
					progressIndicatorService.progressIndicatorMap,
					action
				);
			}
		);
	});

	describe("on initialization", () => {
		it("should subscribe to the store to fetch the latest value of the starkProgressIndicator map", () => {
			expect(mockStore.pipe).toHaveBeenCalledTimes(1);
			expect(progressIndicatorService.progressIndicatorMap).toBe(mockProgressIndicatorMap);
			expect(progressIndicatorService.progressIndicatorMap$).toBeDefined();
		});
	});

	describe("register", () => {
		it("should dispatch the REGISTER action in case the topic does not exist yet in the store", () => {
			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(false);

			progressIndicatorService.register(dummyTopic, dummyType);

			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);
			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);

			const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
				progressIndicatorService.progressIndicatorMap.get(dummyTopic)
			);

			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);

			expect(progressIndicatorConfig.topic).toBe(dummyTopic);
			expect(progressIndicatorConfig.type).toBe(dummyType);
			expect(progressIndicatorConfig.visible).toBe(false);
			expect(progressIndicatorConfig.listenersCount).toEqual(1);
			expect(progressIndicatorConfig.pendingListenersCount).toEqual(0);
		});

		it("should dispatch the REGISTER action in case the topic already exists in the store and increase the listenersCount by 1", () => {
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.register(dummyTopic, dummyType);

			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);
			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);

			const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
				progressIndicatorService.progressIndicatorMap.get(dummyTopic)
			);

			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);

			expect(progressIndicatorConfig.topic).toBe(dummyTopic);
			expect(progressIndicatorConfig.type).toBe(dummyType);
			expect(progressIndicatorConfig.visible).toBe(false);
			expect(progressIndicatorConfig.listenersCount).toEqual(2);
			expect(progressIndicatorConfig.pendingListenersCount).toEqual(0);
		});
	});

	describe("show", () => {
		it(
			"should dispatch the SHOW action in case the topic exists in the store but not yet visible " +
				"and increase the pendingListenersCount by 1",
			() => {
				progressIndicatorService.register(dummyTopic, dummyType);
				progressIndicatorService.show(dummyTopic);

				expect(mockStore.dispatch).toHaveBeenCalledTimes(2);

				expect(mockStore.dispatch).toHaveBeenCalledTimes(2);

				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.show.type);

				const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
					progressIndicatorService.progressIndicatorMap.get(dummyTopic)
				);

				expect(progressIndicatorConfig.topic).toBe(dummyTopic);
				expect(progressIndicatorConfig.type).toBe(dummyType);
				expect(progressIndicatorConfig.visible).toBe(true);
				expect(progressIndicatorConfig.listenersCount).toEqual(1);
				expect(progressIndicatorConfig.pendingListenersCount).toEqual(1);
			}
		);

		it("should NOT dispatch any action in case the topic does not exist in the store", (done: DoneFn) => {
			progressIndicatorService.show(dummyTopic);

			setTimeout(() => {
				expect(mockStore.dispatch).not.toHaveBeenCalled();
				done();
			}, 800); // wait for observer to finish all the "show retries"
		});

		it("should dispatch the SHOW action right after the topic is created and increase the pendingListenersCount by 1", (done: DoneFn) => {
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.register(dummyTopic, dummyType);

			setTimeout(() => {
				expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.show.type);

				const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
					progressIndicatorService.progressIndicatorMap.get(dummyTopic)
				);
				expect(progressIndicatorConfig.topic).toBe(dummyTopic);
				expect(progressIndicatorConfig.type).toBe(dummyType);
				expect(progressIndicatorConfig.visible).toBe(true);
				expect(progressIndicatorConfig.listenersCount).toEqual(1);
				expect(progressIndicatorConfig.pendingListenersCount).toEqual(1);

				done();
			}, 50);
		});

		it("should dispatch the SHOW action twice and increase the ListenersCount and the pendingListenersCount by 2", (done: DoneFn) => {
			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(false);

			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);

			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);

			setTimeout(() => {
				expect(mockStore.dispatch).toHaveBeenCalledTimes(4);

				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(3)[0].type).toBe(StarkProgressIndicatorActions.show.type);

				expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);

				const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
					progressIndicatorService.progressIndicatorMap.get(dummyTopic)
				);

				expect(progressIndicatorConfig.topic).toBe(dummyTopic);
				expect(progressIndicatorConfig.type).toBe(dummyType);
				expect(progressIndicatorConfig.visible).toBe(true);
				expect(progressIndicatorConfig.listenersCount).toEqual(2);
				expect(progressIndicatorConfig.pendingListenersCount).toEqual(2);
				done();
			}, 50);
		});
	});

	describe("hide", () => {
		it("should dispatch the HIDE action in case the topic exists and decrease the pendingListenersCount by 1", (done: DoneFn) => {
			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(false);
			progressIndicatorService.register(dummyTopic, dummyType);
			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);

			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.hide(dummyTopic);

			setTimeout(() => {
				expect(mockStore.dispatch).toHaveBeenCalledTimes(3);

				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.hide.type);

				const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
					progressIndicatorService.progressIndicatorMap.get(dummyTopic)
				);

				expect(progressIndicatorConfig.topic).toBe(dummyTopic);
				expect(progressIndicatorConfig.type).toBe(dummyType);
				expect(progressIndicatorConfig.visible).toBe(false);
				expect(progressIndicatorConfig.listenersCount).toEqual(1);
				expect(progressIndicatorConfig.pendingListenersCount).toEqual(0);

				done();
			}, 100);
		});

		it("should dispatch the HIDE action and decrease the pendingListenersCount by 1", (done: DoneFn) => {
			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(false);

			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.hide(dummyTopic);

			setTimeout(() => {
				expect(mockStore.dispatch).toHaveBeenCalledTimes(5);

				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(3)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(4)[0].type).toBe(StarkProgressIndicatorActions.hide.type);

				const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
					progressIndicatorService.progressIndicatorMap.get(dummyTopic)
				);

				expect(progressIndicatorConfig.topic).toBe(dummyTopic);
				expect(progressIndicatorConfig.type).toBe(dummyType);
				expect(progressIndicatorConfig.visible).toBe(true);
				expect(progressIndicatorConfig.listenersCount).toEqual(2);
				expect(progressIndicatorConfig.pendingListenersCount).toEqual(1);
				done();
			}, 100);
		});
	});

	describe("register after showing/hiding", () => {
		it("should dispatch the show/hide actions in order", (done: DoneFn) => {
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.hide(dummyTopic);
			progressIndicatorService.register(dummyTopic, dummyType);

			setTimeout(() => {
				const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
					progressIndicatorService.progressIndicatorMap.get(dummyTopic)
				);
				expect(progressIndicatorConfig.topic).toBe(dummyTopic);
				expect(progressIndicatorConfig.type).toBe(dummyType);
				expect(progressIndicatorConfig.visible).toBe(false);
				expect(progressIndicatorConfig.listenersCount).toEqual(1);
				expect(progressIndicatorConfig.pendingListenersCount).toEqual(0);

				expect(mockStore.dispatch).toHaveBeenCalledTimes(3);
				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.hide.type);

				expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);

				done();
			}, 200);
		});

		it("should dispatch only the show action if 'hide' is called before 'show'", (done: DoneFn) => {
			progressIndicatorService.hide(dummyTopic);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.register(dummyTopic, dummyType);

			setTimeout(() => {
				const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
					progressIndicatorService.progressIndicatorMap.get(dummyTopic)
				);
				expect(progressIndicatorConfig.topic).toBe(dummyTopic);
				expect(progressIndicatorConfig.type).toBe(dummyType);
				expect(progressIndicatorConfig.visible).toBe(true);
				expect(progressIndicatorConfig.listenersCount).toEqual(1);
				expect(progressIndicatorConfig.pendingListenersCount).toEqual(1);

				expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.show.type);

				expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);

				done();
			}, 200);
		});
	});

	describe("deregister", () => {
		it("should dispatch the DEREGISTER action in case the topic exists and its listenersCount is 1", () => {
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.deregister(dummyTopic);

			expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
			expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.deregister.type);

			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkProgressIndicatorActions.deregister({ topic: dummyTopic }));
			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(false);
		});

		it("should dispatch the DEREGISTER action in case the topic exists and decrease the listenersCount by 1", () => {
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.deregister(dummyTopic);

			expect(mockStore.dispatch).toHaveBeenCalledTimes(3);
			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
			expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.register.type);
			expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.deregister.type);

			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);

			const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
				progressIndicatorService.progressIndicatorMap.get(dummyTopic)
			);

			expect(progressIndicatorConfig.topic).toBe(dummyTopic);
			expect(progressIndicatorConfig.type).toBe(dummyType);
			expect(progressIndicatorConfig.visible).toBe(false);
			expect(progressIndicatorConfig.listenersCount).toEqual(1);
			expect(progressIndicatorConfig.pendingListenersCount).toEqual(0);
		});

		it("should NOT dispatch any action in case the topic does not exist in the store", () => {
			expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(false);

			progressIndicatorService.deregister(dummyTopic);

			expect(mockStore.dispatch).not.toHaveBeenCalled();
		});

		it("should dispatch the DEREGISTER action and remove the topic from the store", (done: DoneFn) => {
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.hide(dummyTopic);

			setTimeout(() => {
				progressIndicatorService.deregister(dummyTopic);
			}, 100);
			// Wait for show / hide to finish.
			// There is a 100 ms delay between show and hide, to allow the observables to catch-up

			setTimeout(() => {
				expect(mockStore.dispatch).toHaveBeenCalledTimes(4);
				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.hide.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(3)[0].type).toBe(StarkProgressIndicatorActions.deregister.type);

				expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(false);
				done();
			}, 100);
		});

		it("should NOT remove the topic from the store when there are still listeners", (done: DoneFn) => {
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.hide(dummyTopic);

			setTimeout(() => {
				progressIndicatorService.deregister(dummyTopic);
			}, 100);
			// Wait for show / hide to finish.
			// There is a 100 ms delay between show and hide, to allow the observables to catch-up

			setTimeout(() => {
				const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
					progressIndicatorService.progressIndicatorMap.get(dummyTopic)
				);

				expect(mockStore.dispatch).toHaveBeenCalledTimes(5);
				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(3)[0].type).toBe(StarkProgressIndicatorActions.hide.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(4)[0].type).toBe(StarkProgressIndicatorActions.deregister.type);

				expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);
				expect(progressIndicatorConfig.topic).toBe(dummyTopic);
				expect(progressIndicatorConfig.type).toBe(dummyType);
				expect(progressIndicatorConfig.visible).toBe(false);
				expect(progressIndicatorConfig.listenersCount).toEqual(1);
				expect(progressIndicatorConfig.pendingListenersCount).toEqual(0);

				done();
			}, 100);
		});

		it("should NOT remove the topic from the store when there are still listeners regardless of the pendingListeners", (done: DoneFn) => {
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.hide(dummyTopic);

			setTimeout(() => {
				setTimeout(() => {
					progressIndicatorService.deregister(dummyTopic);
				}, 100);
				// Wait for show / hide to finish.
				// There is a 100 ms delay between show and hide, to allow the observables to catch-up

				setTimeout(() => {
					const progressIndicatorConfig: StarkProgressIndicatorFullConfig = <StarkProgressIndicatorFullConfig>(
						progressIndicatorService.progressIndicatorMap.get(dummyTopic)
					);

					expect(mockStore.dispatch).toHaveBeenCalledTimes(6);

					expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
					expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.register.type);
					expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.show.type);
					expect((<Spy>mockStore.dispatch).calls.argsFor(3)[0].type).toBe(StarkProgressIndicatorActions.show.type);
					expect((<Spy>mockStore.dispatch).calls.argsFor(4)[0].type).toBe(StarkProgressIndicatorActions.hide.type);
					expect((<Spy>mockStore.dispatch).calls.argsFor(5)[0].type).toBe(StarkProgressIndicatorActions.deregister.type);

					expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);

					expect(progressIndicatorConfig.topic).toBe(dummyTopic);
					expect(progressIndicatorConfig.type).toBe(dummyType);
					expect(progressIndicatorConfig.visible).toBe(true);
					expect(progressIndicatorConfig.listenersCount).toEqual(1);
					expect(progressIndicatorConfig.pendingListenersCount).toEqual(1);

					done();
				}, 100);
			});
		});
	});

	describe("deregister", () => {
		it("should dispatch the DEREGISTER action and NOT remove the topic from the store in case there are multiple listeners", (done: DoneFn) => {
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.hide(dummyTopic);
			progressIndicatorService.hide(dummyTopic);

			setTimeout(() => {
				progressIndicatorService.deregister(dummyTopic);
			}, 100);
			// Wait for show / hide to finish.
			// There is a 100 ms delay between show and hide, to allow the observables to catch-up

			setTimeout(() => {
				expect(mockStore.dispatch).toHaveBeenCalledTimes(7);

				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(3)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(4)[0].type).toBe(StarkProgressIndicatorActions.hide.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(5)[0].type).toBe(StarkProgressIndicatorActions.hide.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(6)[0].type).toBe(StarkProgressIndicatorActions.deregister.type);

				expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(true);
				done();
			}, 100);
		});

		it("should remove the topic from the store after all the different actions were dispatched in order", (done: DoneFn) => {
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.register(dummyTopic, dummyType);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.show(dummyTopic);
			progressIndicatorService.hide(dummyTopic);
			progressIndicatorService.hide(dummyTopic);

			setTimeout(() => {
				progressIndicatorService.deregister(dummyTopic);
				progressIndicatorService.deregister(dummyTopic);
			}, 100);

			setTimeout(() => {
				expect(mockStore.dispatch).toHaveBeenCalledTimes(8);

				expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(1)[0].type).toBe(StarkProgressIndicatorActions.register.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(2)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(3)[0].type).toBe(StarkProgressIndicatorActions.show.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(4)[0].type).toBe(StarkProgressIndicatorActions.hide.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(5)[0].type).toBe(StarkProgressIndicatorActions.hide.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(6)[0].type).toBe(StarkProgressIndicatorActions.deregister.type);
				expect((<Spy>mockStore.dispatch).calls.argsFor(6)[0].type).toBe(StarkProgressIndicatorActions.deregister.type);

				expect(progressIndicatorService.progressIndicatorMap.has(dummyTopic)).toBe(false);
				done();
			}, 100);
		});
	});
});

class ProgressIndicatorServiceHelper extends StarkProgressIndicatorServiceImpl {
	public declare progressIndicatorMap: Map<string, StarkProgressIndicatorFullConfig>;
	public declare progressIndicatorMap$: Observable<Map<string, StarkProgressIndicatorFullConfig>>;
}
