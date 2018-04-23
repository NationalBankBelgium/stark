"use strict";

import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;
import { Observer } from "rxjs/Observer";

import { StarkSettingsEffects } from "./settings.effects";
import { SetPreferredLanguage } from "../actions/index";
import { StarkSessionService, starkSessionServiceName } from "../../session/services/index";
import { MockStarkSessionService } from "../../session/testing/index";
import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { provideMockActions } from "@ngrx/effects/testing";
import { ReplaySubject } from "rxjs/ReplaySubject";

describe("Effect: StarkSettingsEffects", () => {
	let settingsEffects: StarkSettingsEffects;

	//FIXME StateUpdates
	let mockSessionService: StarkSessionService;
	let actions: Observable<any>;

	// Inject module dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				StarkSettingsEffects,
				provideMockActions(() => actions),
				{
					provide: starkSessionServiceName,
					useFactory: () => new MockStarkSessionService()
				}
			],
			imports: []
		});

		settingsEffects = TestBed.get(StarkSettingsEffects);
		mockSessionService = TestBed.get(starkSessionServiceName);
	});

	describe("On setPreferredLanguage$", () => {
		it("Should set the language successfully", () => {
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			(<Spy>mockSessionService.setCurrentLanguage).and.returnValue({});

			const subject: ReplaySubject<any> = new ReplaySubject(1);
			actions = subject.asObservable();

			settingsEffects.setPreferredLanguage$().subscribe(mockObserver);

			subject.next(new SetPreferredLanguage("NL"));

			expect(mockSessionService.setCurrentLanguage).toHaveBeenCalledWith("NL");
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			const effectResult: any = (<Spy>mockObserver.next).calls.mostRecent().args[0];
			expect(effectResult).toBeDefined();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled(); // effects should never complete!
		});
	});
});
