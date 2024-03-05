import { Observable, Observer, ReplaySubject, Subject } from "rxjs";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockActions } from "@ngrx/effects/testing";
import { EffectNotification } from "@ngrx/effects";
import {
	MatLegacyDialog as MatDialog,
	MatLegacyDialogModule as MatDialogModule,
	MatLegacyDialogRef as MatDialogRef
} from "@angular/material/legacy-dialog";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { STARK_SESSION_SERVICE, StarkSessionActions, StarkSessionService } from "@nationalbankbelgium/stark-core";
import { MockStarkSessionService } from "@nationalbankbelgium/stark-core/testing";
import { StarkSessionTimeoutWarningDialogComponent } from "../components/session-timeout-warning-dialog/session-timeout-warning-dialog.component";
import { StarkSessionTimeoutWarningDialogEffects } from "../effects";
import { STARK_SESSION_UI_CONFIG, StarkSessionUiConfig } from "../entities";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import Spy = jasmine.Spy;

describe("Effects: StarkSessionTimeoutWarningDialogEffects", () => {
	let effectsClass: StarkSessionTimeoutWarningDialogEffects;
	let mockSessionService: StarkSessionService;
	let mockDialogService: SpyObj<MatDialog>;
	let mockSessionUiConfig: StarkSessionUiConfig;
	let actions: Observable<any>;

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
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
				{ provide: STARK_SESSION_SERVICE, useFactory: (): MockStarkSessionService => new MockStarkSessionService() },
				{ provide: STARK_SESSION_UI_CONFIG, useValue: new StarkSessionUiConfig() }
			]
		}).compileComponents()));

	beforeEach(() => {
		effectsClass = TestBed.inject(StarkSessionTimeoutWarningDialogEffects);
		mockSessionService = TestBed.inject(STARK_SESSION_SERVICE);
		mockDialogService = <SpyObj<MatDialog>>TestBed.inject(MatDialog);
		mockSessionUiConfig = TestBed.inject(STARK_SESSION_UI_CONFIG);
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(effectsClass.sessionService).not.toBeNull();
			expect(effectsClass.sessionService).toBeDefined();
			expect(effectsClass.starkSessionUiConfig).not.toBeNull();
			expect(effectsClass.starkSessionUiConfig).toBeDefined();
		});
	});

	describe("on StarkSessionTimeoutWarning$", () => {
		it("should open a dialog when the timeout countdown begins", () => {
			const afterClosedResult = "keep-logged";
			const afterClosed$: Subject<string> = new Subject();

			(<Spy<(...args: any[]) => Partial<MatDialogRef<StarkSessionTimeoutWarningDialogComponent, string>>>>(
				mockDialogService.open
			)).and.returnValue({
				afterClosed: (): Subject<string> => afterClosed$
			});

			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			const subject: ReplaySubject<any> = new ReplaySubject(1);
			actions = subject.asObservable();

			effectsClass.starkSessionTimeoutWarning$.subscribe(mockObserver);

			expect(mockSessionService.pauseUserActivityTracking).not.toHaveBeenCalled();
			expect(mockDialogService.open).not.toHaveBeenCalled();

			subject.next(StarkSessionActions.sessionTimeoutCountdownStart({ countdown: 20 }));

			expect(mockSessionService.pauseUserActivityTracking).toHaveBeenCalled();
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
			expect(mockDialogService.open).toHaveBeenCalledTimes(1);
			expect(mockDialogService.open).toHaveBeenCalledWith(StarkSessionTimeoutWarningDialogComponent, {
				data: 20,
				disableClose: true
			});

			expect(mockSessionService.resumeUserActivityTracking).not.toHaveBeenCalled();

			afterClosed$.next(afterClosedResult);

			expect(mockSessionService.resumeUserActivityTracking).toHaveBeenCalledTimes(1);
		});
	});

	describe("on StarkSessionTimeoutWarningClose$", () => {
		it("should close the dialog when the countdown finishes", () => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const subject: ReplaySubject<any> = new ReplaySubject(1);
			actions = subject.asObservable();

			effectsClass.starkSessionTimeoutWarningClose$.subscribe(mockObserver);

			expect(mockDialogService.closeAll).not.toHaveBeenCalled();

			subject.next(StarkSessionActions.sessionTimeoutCountdownFinish());

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
			expect(mockDialogService.closeAll).toHaveBeenCalledTimes(1);
		});
	});

	describe("on ngrxOnRunEffects", () => {
		it("should stop the effects immediately when the option timeoutWarningDialogDisabled is true", () => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const actions$: ReplaySubject<any> = new ReplaySubject(1);
			actions = actions$.asObservable();
			spyOn(effectsClass.actions$, "pipe").and.callThrough();

			mockSessionUiConfig.timeoutWarningDialogDisabled = true;

			const mockResolvedEffectsSubject: Subject<any> = new Subject<any>();
			const mockResolvedEffects$: Observable<any> = mockResolvedEffectsSubject.asObservable();

			const resolvedEffectsObservable: Observable<EffectNotification> = effectsClass.ngrxOnRunEffects(mockResolvedEffects$);
			expect(effectsClass.actions$.pipe).toHaveBeenCalledTimes(1);

			resolvedEffectsObservable.subscribe(mockObserver);

			mockObserver.next.calls.reset();

			actions$.next("dummy acton");
			actions$.next("another dummy acton");

			actions$.next(StarkSessionActions.initializeSession({ user: <any>{} }));
			mockResolvedEffectsSubject.next("this should never be emitted");

			expect(mockObserver.next).not.toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
		});

		it("should run the effects immediately when the option timeoutWarningDialogDisabled is false", () => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

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

			mockObserver.next.calls.reset();

			// the effects should keep on running with any action
			actions$.next("dummy action1");
			mockResolvedEffectsSubject.next("another dummy resolved effect");

			expect(mockObserver.next).toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
		});

		it("should run the effects immediately when the option timeoutWarningDialogDisabled is undefined", () => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

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

			mockObserver.next.calls.reset();

			// the effects should keep on running with any action
			actions$.next("dummy action1");
			mockResolvedEffectsSubject.next("another dummy resolved effect");

			expect(mockObserver.next).toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
		});
	});
});
