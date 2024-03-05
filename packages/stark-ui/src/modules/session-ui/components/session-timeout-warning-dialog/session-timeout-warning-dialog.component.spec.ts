/* eslint-disable @angular-eslint/no-lifecycle-call */
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import {
	MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
	MatLegacyDialog as MatDialog,
	MatLegacyDialogModule as MatDialogModule,
	MatLegacyDialogRef as MatDialogRef
} from "@angular/material/legacy-dialog";
import { StarkSessionTimeoutWarningDialogComponent } from "./session-timeout-warning-dialog.component";
import { Observer } from "rxjs";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("SessionTimeoutWarningDialogComponent", () => {
	let component: StarkSessionTimeoutWarningDialogComponent;
	let fixture: ComponentFixture<StarkSessionTimeoutWarningDialogComponent>;

	let mockDialogRef: MatDialogRef<any>;
	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkSessionTimeoutWarningDialogComponent],
			imports: [CommonModule, MatDialogModule],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger },
				{ provide: MatDialog, useValue: MatDialog },
				{ provide: MAT_DIALOG_DATA, useValue: 20 },
				{ provide: MatDialogRef, useValue: createSpyObj("MatDialogRefSpy", ["close"]) }
			]
		}).compileComponents()));

	beforeEach(() => {
		fixture = TestBed.createComponent(StarkSessionTimeoutWarningDialogComponent);
		mockDialogRef = TestBed.inject(MatDialogRef);
		component = fixture.componentInstance;

		mockLogger.debug.calls.reset();
	});

	describe("ngOnInit", () => {
		it("should set the countdown and decrement it every second", fakeAsync(() => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			component.ngOnInit();
			component.countdown$.subscribe(mockObserver);

			expect(mockLogger.debug).toHaveBeenCalledTimes(1);

			tick(20000);

			expect(mockObserver.next).toHaveBeenCalledTimes(21);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).toHaveBeenCalled();

			expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
			expect(mockDialogRef.close).toHaveBeenCalledWith("countdown-finished");
		}));
	});

	describe("keepSession", () => {
		it("should close the windows when the button is clicked", fakeAsync(() => {
			component.ngOnInit();
			component.keepSession();

			expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
			expect(mockDialogRef.close).toHaveBeenCalledWith("keep-logged");
		}));
	});
});
