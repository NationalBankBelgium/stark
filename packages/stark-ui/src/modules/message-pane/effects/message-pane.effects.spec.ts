/*tslint:disable:completed-docs*/
import { TestBed } from "@angular/core/testing";

import { Observable, Observer, ReplaySubject } from "rxjs";
import { provideMockActions } from "@ngrx/effects/testing";

import createSpyObj = jasmine.createSpyObj;

import { StarkMessagePaneEffects } from "../effects";
import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneService } from "../services";
import { StarkNavigateSuccess } from "@nationalbankbelgium/stark-core";
import { MockStarkMessagePaneService } from "../testing/message-pane.mock";

describe("Effect: StarkMessagePaneEffects", () => {
	let messagePaneEffects: StarkMessagePaneEffects;

	let mockMessagePaneService: StarkMessagePaneService;
	let actions: Observable<any>;

	// Inject module dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				StarkMessagePaneEffects,
				provideMockActions(() => actions),
				{
					provide: STARK_MESSAGE_PANE_SERVICE,
					useFactory: () => new MockStarkMessagePaneService()
				}
			],
			imports: []
		});

		messagePaneEffects = TestBed.get(StarkMessagePaneEffects);
		mockMessagePaneService = TestBed.get(STARK_MESSAGE_PANE_SERVICE);
	});

	describe("On clearOnNavigationSuccess$", () => {
		it("Should clear and hide the message pane", () => {
			mockMessagePaneService.clearOnNavigation = true;
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const subject: ReplaySubject<any> = new ReplaySubject(1);
			actions = subject.asObservable();

			messagePaneEffects.clearOnNavigationSuccess$().subscribe(mockObserver);

			subject.next(new StarkNavigateSuccess("previousState", "currentState"));

			expect(mockMessagePaneService.clearAll).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled(); // effects should never complete!
		});

		it("Should not clear and hide the message pane when the 'clearOnNavigation' option is not set", () => {
			mockMessagePaneService.clearOnNavigation = false;
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const subject: ReplaySubject<any> = new ReplaySubject(1);
			actions = subject.asObservable();

			messagePaneEffects.clearOnNavigationSuccess$().subscribe(mockObserver);

			subject.next(new StarkNavigateSuccess("previousState", "currentState"));

			expect(mockMessagePaneService.clearAll).not.toHaveBeenCalled();
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled(); // effects should never complete!
		});
	});
});
