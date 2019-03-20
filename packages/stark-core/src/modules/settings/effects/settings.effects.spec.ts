/*tslint:disable:completed-docs*/
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { StarkSettingsEffects } from "./settings.effects";
import { StarkSetPreferredLanguage } from "../actions";
import { STARK_SESSION_SERVICE } from "../../session/services";
import { MockStarkSessionService } from "../../session/testing";
import { TestBed } from "@angular/core/testing";
import { Observable, Observer, ReplaySubject } from "rxjs";
import { provideMockActions } from "@ngrx/effects/testing";

describe("Effect: StarkSettingsEffects", () => {
	let settingsEffects: StarkSettingsEffects;

	let mockSessionService: MockStarkSessionService;
	let actions: Observable<any>;

	// Inject module dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				StarkSettingsEffects,
				provideMockActions(() => actions),
				{
					provide: STARK_SESSION_SERVICE,
					useFactory: () => new MockStarkSessionService()
				}
			],
			imports: []
		});

		settingsEffects = TestBed.get(StarkSettingsEffects);
		mockSessionService = TestBed.get(STARK_SESSION_SERVICE);
	});

	describe("On setPreferredLanguage$", () => {
		it("should set the language successfully", () => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			mockSessionService.setCurrentLanguage.and.returnValue(undefined);

			const subject: ReplaySubject<any> = new ReplaySubject(1);
			actions = subject.asObservable();

			settingsEffects.setPreferredLanguage$().subscribe(mockObserver);

			subject.next(new StarkSetPreferredLanguage("NL"));

			expect(mockSessionService.setCurrentLanguage).toHaveBeenCalledWith("NL");
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(undefined);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled(); // effects should never complete!
		});
	});
});
