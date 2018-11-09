/*tslint:disable:completed-docs no-big-function*/
import createSpyObj = jasmine.createSpyObj;
import { Observable, ReplaySubject, Observer, Subject } from "rxjs";
import { async, TestBed } from "@angular/core/testing";
import {
	STARK_SESSION_SERVICE,
	StarkSessionService,
	StarkSessionTimeoutCountdownStart,
	StarkSessionTimeoutCountdownFinish,
	StarkInitializeSession
} from "@nationalbankbelgium/stark-core";
import { MockStarkSessionService } from "@nationalbankbelgium/stark-core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { EffectNotification } from "@ngrx/effects";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StarkSessionTimeoutWarningDialogComponent } from "../components/session-timeout-warning-dialog.component";
import { StarkSessionTimeoutWarningDialogEffects } from "../effects/session-timeout-warning.effects";
import { STARK_SESSION_UI_CONFIG, StarkSessionUiConfig } from "../entities/stark-session-ui-config";

import Spy = jasmine.Spy;

describe("Effects: StarkSessionTimeoutWarningDialogEffects", () => {
	let effectsClass: StarkSessionTimeoutWarningDialogEffects;
	let mockSessionService: StarkSessionService;
	let mockDialogService: MatDialog;
	let mockSessionUiConfig: StarkSessionUiConfig;
	let actions: Observable<any>;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			imports: [NoopAnimationsModule, MatDialogModule, TranslateModule.forRoot(), MatButtonModule],
			providers: [
				StarkSessionTimeoutWarningDialogEffects,
				provideMockActions(() => actions),
				TranslateService,
				{
					provide: MatDialog,
					useValue: createSpyObj("MatDialogSpy", ["open", "close", "closeAll"])
				},
				{ provide: StarkSessionTimeoutWarningDialogComponent, useValue: StarkSessionTimeoutWarningDialogComponent },
				{ provide: STARK_SESSION_SERVICE, useFactory: () => new MockStarkSessionService() },
				{ provide: STARK_SESSION_UI_CONFIG, useValue: new StarkSessionUiConfig() }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		effectsClass = TestBed.get(StarkSessionTimeoutWarningDialogEffects);
		mockSessionService = TestBed.get(STARK_SESSION_SERVICE);
		mockDialogService = TestBed.get(MatDialog);
		mockSessionUiConfig = TestBed.get(STARK_SESSION_UI_CONFIG);
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(effectsClass.sessionService).not.toBeNull();
			expect(effectsClass.sessionService).toBeDefined();
			expect(effectsClass.starkSessionUiConfig).not.toBeNull();
			expect(effectsClass.starkSessionUiConfig).toBeDefined();
		});
	});

	describe("On StarkSessionTimeoutWarning$", () => {
		it("Should open a dialog when the timeout countdown begins", () => {
			const afterClosedResult: string = "keep-logged";
			const afterClosed$: Subject<string> = new Subject();

			(<Spy>mockDialogService.open).and.returnValue({
				afterClosed: () => {
					return afterClosed$;
				}
			});

			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			const subject: ReplaySubject<any> = new ReplaySubject(1);
			actions = subject.asObservable();

			effectsClass.starkSessionTimeoutWarning$().subscribe(mockObserver);

			expect(mockSessionService.pauseUserActivityTracking).not.toHaveBeenCalled();
			expect(mockDialogService.open).not.toHaveBeenCalled();

			subject.next(new StarkSessionTimeoutCountdownStart(20));

			expect(mockSessionService.pauseUserActivityTracking).toHaveBeenCalled();
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
			expect(mockDialogService.open).toHaveBeenCalledTimes(1);
			expect(mockDialogService.open).toHaveBeenCalledWith(StarkSessionTimeoutWarningDialogComponent, { data: 20 });

			expect(mockSessionService.resumeUserActivityTracking).not.toHaveBeenCalled();

			afterClosed$.next(afterClosedResult);

			expect(mockSessionService.resumeUserActivityTracking).toHaveBeenCalledTimes(1);
		});
	});

	describe("On StarkSessionTimeoutWarningClose$", () => {
		it("Should close the dialog when the countdown finishes", () => {
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const subject: ReplaySubject<any> = new ReplaySubject(1);
			actions = subject.asObservable();

			effectsClass.starkSessionTimeoutWarningClose$().subscribe(mockObserver);

			expect(mockDialogService.closeAll).not.toHaveBeenCalled();

			subject.next(new StarkSessionTimeoutCountdownFinish());

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
			expect(mockDialogService.closeAll).toHaveBeenCalledTimes(1);
		});
	});

	describe("On ngrxOnRunEffects", () => {
		it("Should stop the effects immediately when the option timeoutWarningDialogDisabled is true", () => {
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const actions$: ReplaySubject<any> = new ReplaySubject(1);
			actions = actions$.asObservable();
			spyOn(effectsClass.actions$, "pipe").and.callThrough();

			mockSessionUiConfig.timeoutWarningDialogDisabled = true;

			const mockResolvedEffectsSubject: Subject<any> = new Subject<any>();
			const mockResolvedEffects$: Observable<any> = mockResolvedEffectsSubject.asObservable();

			const resolvedEffectsObservable: Observable<EffectNotification> = effectsClass.ngrxOnRunEffects(mockResolvedEffects$);
			expect(effectsClass.actions$.pipe).toHaveBeenCalledTimes(1);

			resolvedEffectsObservable.subscribe(mockObserver);

			(<Spy>mockObserver.next).calls.reset();

			actions$.next("dummy acton");
			actions$.next("another dummy acton");

			actions$.next(new StarkInitializeSession(<any>{}));
			mockResolvedEffectsSubject.next("this should never be emitted");

			expect(mockObserver.next).not.toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
		});

		it("Should run the effects immediately when the option timeoutWarningDialogDisabled is false", () => {
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const actions$: ReplaySubject<any> = new ReplaySubject(1);
			actions = actions$.asObservable();
			spyOn(effectsClass.actions$, "pipe").and.callThrough();

			mockSessionUiConfig.timeoutWarningDialogDisabled = false;

			const mockResolvedEffectsSubject: Subject<any> = new Subject<any>();
			const mockResolvedEffects$: Observable<any> = mockResolvedEffectsSubject.asObservable();

			const resolvedEffectsObservable: Observable<EffectNotification> = effectsClass.ngrxOnRunEffects(mockResolvedEffects$);
			expect(effectsClass.actions$.pipe).toHaveBeenCalledTimes(1);

			resolvedEffectsObservable.subscribe(mockObserver);

			actions$.next("dummy initial action1");
			mockResolvedEffectsSubject.next("dummy resolved effect");

			expect(mockObserver.next).toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			(<Spy>mockObserver.next).calls.reset();

			// the effects should keep on running with any action
			actions$.next("dummy action1");
			mockResolvedEffectsSubject.next("another dummy resolved effect");

			expect(mockObserver.next).toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
		});

		it("Should run the effects immediately when the option timeoutWarningDialogDisabled is undefined", () => {
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const actions$: ReplaySubject<any> = new ReplaySubject(1);
			actions = actions$.asObservable();
			spyOn(effectsClass.actions$, "pipe").and.callThrough();

			mockSessionUiConfig.timeoutWarningDialogDisabled = undefined;

			const mockResolvedEffectsSubject: Subject<any> = new Subject<any>();
			const mockResolvedEffects$: Observable<any> = mockResolvedEffectsSubject.asObservable();

			const resolvedEffectsObservable: Observable<EffectNotification> = effectsClass.ngrxOnRunEffects(mockResolvedEffects$);
			expect(effectsClass.actions$.pipe).toHaveBeenCalledTimes(1);

			resolvedEffectsObservable.subscribe(mockObserver);

			actions$.next("dummy initial action1");
			mockResolvedEffectsSubject.next("dummy resolved effect");

			expect(mockObserver.next).toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			(<Spy>mockObserver.next).calls.reset();

			// the effects should keep on running with any action
			actions$.next("dummy action1");
			mockResolvedEffectsSubject.next("another dummy resolved effect");

			expect(mockObserver.next).toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
		});
	});
});
