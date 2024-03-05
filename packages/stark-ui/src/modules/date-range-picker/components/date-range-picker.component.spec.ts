/* eslint-disable no-null/no-null, @angular-eslint/component-max-inline-declarations */
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Component, EventEmitter, ViewChild } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { TranslateModule } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkDatePickerModule } from "@nationalbankbelgium/stark-ui/src/modules/date-picker";
import { StarkInputMaskDirectivesModule } from "@nationalbankbelgium/stark-ui/src/modules/input-mask-directives";
import { StarkDateRangePickerComponent } from "./date-range-picker.component";
import { StarkDateRangePickerEvent } from "./date-range-picker-event.intf";
import { Observer } from "rxjs";
import moment from "moment";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("DateRangePickerComponent", () => {
	@Component({
		selector: "test-model",
		template: ` <stark-date-range-picker [(ngModel)]="dateRange"></stark-date-range-picker> `
	})
	class TestModelComponent {
		@ViewChild(StarkDateRangePickerComponent, { static: true })
		public dateRangePicker!: StarkDateRangePickerComponent;

		public dateRange = {};
	}

	@Component({
		selector: "test-form-group",
		template: `
			<stark-date-range-picker [rangeFormGroup]="formGroup">
				<ng-container start-date-errors>START-ERROR</ng-container>
				<ng-container end-date-errors>END-ERROR</ng-container>
			</stark-date-range-picker>
		`
	})
	class TestUntypedFormGroupComponent {
		@ViewChild(StarkDateRangePickerComponent, { static: true })
		public dateRangePicker!: StarkDateRangePickerComponent;

		public formGroup = new UntypedFormGroup({
			startDate: new UntypedFormControl(),
			endDate: new UntypedFormControl()
		});
	}

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkDateRangePickerComponent, TestModelComponent, TestUntypedFormGroupComponent],
			imports: [
				NoopAnimationsModule,
				MatDatepickerModule,
				MatFormFieldModule,
				FormsModule,
				ReactiveFormsModule,
				StarkDatePickerModule,
				StarkInputMaskDirectivesModule,
				TranslateModule.forRoot()
			],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
				{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
				{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
			]
		}).compileComponents()));

	describe("uncontrolled", () => {
		let fixture: ComponentFixture<StarkDateRangePickerComponent>;
		let component: StarkDateRangePickerComponent;

		beforeEach(() => {
			fixture = TestBed.createComponent(StarkDateRangePickerComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(fixture).toBeDefined();
				expect(component).toBeDefined();

				expect(component.logger).not.toBeNull();
				expect(component.logger).toBeDefined();
			});

			it("should NOT have any inputs set", () => {
				expect(component.dateFilter).toBeUndefined();
				expect(component.dateMask).toBeUndefined();
				expect(component.endDate).toBeUndefined();
				expect(component.endDateLabel).toBeDefined();
				expect(component.endDateLabel).toEqual("STARK.DATE_RANGE_PICKER.TO");
				expect(component.endMaxDate).toBeNull();
				expect(component.endMinDate).toBeNull();
				expect(component.rangePickerId).toBeDefined();
				expect(component.rangePickerId).toEqual("");
				expect(component.rangePickerName).toBeDefined();
				expect(component.rangePickerName).toEqual("");
				expect(component.startDate).toBeUndefined();
				expect(component.startDateLabel).toBeDefined();
				expect(component.startDateLabel).toEqual("STARK.DATE_RANGE_PICKER.FROM");
				expect(component.startMaxDate).toBeNull();
				expect(component.startMinDate).toBeNull();
				expect(component.dateRangeChanged).toBeDefined();
				expect(component.dateRangeChanged).toEqual(new EventEmitter<StarkDateRangePickerEvent>());
			});
		});

		describe("date pickers properties", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("should be set correctly according to the given inputs and WITHOUT triggering a 'dateRangeChanged' event", () => {
				component.dateRangeChanged.subscribe(mockObserver);

				component.rangePickerId = "test-id";
				component.rangePickerName = "test-name";
				component.startDateLabel = "startDateLabel";
				component.endDateLabel = "endDateLabel";
				const minDate = new Date(2018, 6, 1);
				component.startMinDate = <any>minDate;
				component.endMinDate = <any>minDate;
				const maxDate = new Date(2018, 6, 2);
				component.startMaxDate = <any>maxDate;
				component.endMaxDate = <any>maxDate;
				fixture.detectChanges();

				expect(fixture.nativeElement.querySelector("#test-id-start-input")).toBeTruthy();
				expect(fixture.nativeElement.querySelector("#test-id-end-input")).toBeTruthy();
				expect(fixture.nativeElement.querySelector("#test-id-start")).toBeTruthy();
				expect(fixture.nativeElement.querySelector("#test-id-end")).toBeTruthy();
				expect(fixture.nativeElement.querySelector('[name="test-name-start"]')).toBeTruthy();
				expect(fixture.nativeElement.querySelector('[name="test-name-end"]')).toBeTruthy();
				expect(fixture.nativeElement.querySelector('[ng-reflect-placeholder="startDateLabel"]')).toBeTruthy();
				expect(fixture.nativeElement.querySelector('[ng-reflect-placeholder="endDateLabel"]')).toBeTruthy();
				expect(component.startPicker.pickerInput.min).not.toBeNull();
				expect((<moment.Moment>component.startPicker.pickerInput.min).toDate()).toEqual(minDate);
				expect(component.endPicker.pickerInput.min).not.toBeNull();
				expect((<moment.Moment>component.endPicker.pickerInput.min).toDate()).toEqual(minDate);
				expect(component.startPicker.pickerInput.max).not.toBeNull();
				expect((<moment.Moment>component.startPicker.pickerInput.max).toDate()).toEqual(maxDate);
				expect(component.endPicker.pickerInput.max).not.toBeNull();
				expect((<moment.Moment>component.endPicker.pickerInput.max).toDate()).toEqual(maxDate);

				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the date pickers should be disabled when 'disabled' is true and it should NOT emit a 'dateRangeChanged' event", () => {
				component.dateRangeChanged.subscribe(mockObserver);

				component.disabled = true;
				fixture.detectChanges();
				expect(component.startPicker.pickerInput.disabled).toBe(true);
				expect(component.endPicker.pickerInput.disabled).toBe(true);

				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the date pickers value should be set correctly and they should emit a 'dateRangeChanged' event", () => {
				component.dateRangeChanged.subscribe(mockObserver);

				const date = new Date(2018, 6, 3);
				component.startDate = date;
				fixture.detectChanges();

				expect(component.startPicker.value).not.toBeNull();
				expect(component.startPicker.value).toEqual(date);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({ startDate: date, endDate: undefined });

				mockObserver.next.calls.reset();
				component.endDate = date;
				fixture.detectChanges();

				expect(component.endPicker.value).not.toBeNull();
				expect(component.endPicker.value).toEqual(date);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({ startDate: date, endDate: date });
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});
		});

		describe("dates selection", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("the end date should be correctly set if after the start date and emit the new value in the 'dateRangeChanged' output", () => {
				// initialize start date
				const startDate = new Date(2018, 6, 6);
				component.startPicker.picker.select(moment(startDate)); // select a date in the internal date picker
				fixture.detectChanges();
				component.dateRangeChanged.subscribe(mockObserver);

				expect(component.startDate).toEqual(startDate);
				const endDate = new Date(2018, 6, 7);
				component.endPicker.picker.select(moment(endDate)); // select a date in the internal date picker
				fixture.detectChanges();

				expect(component.endDate).toEqual(endDate);

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({
					startDate: startDate,
					endDate: endDate
				});
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the end date should be correctly set if start date is undefined and emit the new value in the 'dateRangeChanged' output", () => {
				// initialize start date
				component.startPicker.picker.select(<any>undefined); // select a date in the internal date picker
				fixture.detectChanges();
				component.dateRangeChanged.subscribe(mockObserver);

				expect(component.startDate).toBeUndefined();
				const endDate = new Date(2018, 6, 8);
				component.endPicker.picker.select(moment(endDate)); // select a date in the internal date picker
				fixture.detectChanges();

				expect(component.endDate).toEqual(endDate);

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({
					startDate: undefined,
					endDate: endDate
				});
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the end date should be still valid if it is before the startDate BUT the startDate should be set to undefined and it should emit the new value in the 'dateRangeChanged' output", () => {
				// initialize start date
				const startDate = new Date(2018, 6, 5);
				component.startPicker.picker.select(moment(startDate)); // select a date in the internal date picker
				fixture.detectChanges();
				component.dateRangeChanged.subscribe(mockObserver);

				expect(component.startDate).toEqual(startDate);
				const endDate = new Date(2018, 6, 4);
				component.endPicker.picker.select(moment(endDate)); // select a date in the internal date picker
				fixture.detectChanges();

				expect(component.startDate).toBeUndefined();
				expect(component.endDate).toEqual(endDate);
				expect(component.endDateFormControl.status).toBe("VALID");

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({
					startDate: undefined,
					endDate: endDate
				});
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the start date should be still valid if it is after the endDate BUT the endDate should be set to undefined and it should emit the new value in the 'dateRangeChanged' output", () => {
				// initialize end date
				const endDate = new Date(2018, 6, 5);
				component.endPicker.picker.select(moment(endDate)); // select a date in the internal date picker
				fixture.detectChanges();
				component.dateRangeChanged.subscribe(mockObserver);

				expect(component.endDate).toEqual(endDate);
				const startDate = new Date(2018, 6, 6);
				component.startPicker.picker.select(moment(startDate)); // select a date in the internal date picker
				fixture.detectChanges();

				expect(component.endDate).toBeUndefined();
				expect(component.startDate).toEqual(startDate);
				expect(component.startDateFormControl.status).toBe("VALID");

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({
					startDate: startDate,
					endDate: undefined
				});
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});
		});
	});

	describe("with ngModel", () => {
		let hostFixture: ComponentFixture<TestModelComponent>;
		let hostComponent: TestModelComponent;
		let component: StarkDateRangePickerComponent;
		let mockObserver: SpyObj<Observer<any>>;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestModelComponent);
			hostComponent = hostFixture.componentInstance;
			component = hostComponent.dateRangePicker;
			hostFixture.detectChanges();

			mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
		});

		it("should update when model is updated and it should not emit a 'dateRangeChanged' event", fakeAsync(() => {
			component.dateRangeChanged.subscribe(mockObserver);
			const dateRange = { startDate: new Date(2019, 0, 1), endDate: new Date(2019, 0, 2) };

			hostComponent.dateRange = dateRange;
			hostFixture.detectChanges();

			tick();

			expect(component.startDate).toBeDefined();
			expect(component.startDate).toEqual(dateRange.startDate);
			expect(component.endDate).toBeDefined();
			expect(component.endDate).toEqual(dateRange.endDate);

			expect(mockObserver.next).not.toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
		}));
	});

	describe("with formGroup", () => {
		let hostFixture: ComponentFixture<TestUntypedFormGroupComponent>;
		let hostComponent: TestUntypedFormGroupComponent;
		let component: StarkDateRangePickerComponent;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestUntypedFormGroupComponent);
			hostComponent = hostFixture.componentInstance;
			component = hostComponent.dateRangePicker;
			hostFixture.detectChanges();
		});

		describe("date pickers properties", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("the date pickers should be disabled when the form controls are disabled AND a 'valueChange' event should be triggered ONLY IF the 'emitEvent' option is enabled", () => {
				hostComponent.formGroup.valueChanges.subscribe(mockObserver);

				hostComponent.formGroup.disable({ emitEvent: false });
				hostFixture.detectChanges();

				expect(component.startPicker.pickerInput.disabled).toBe(true);
				expect(component.endPicker.pickerInput.disabled).toBe(true);

				hostComponent.formGroup.enable({ emitEvent: false });
				hostFixture.detectChanges();

				expect(component.startPicker.pickerInput.disabled).toBe(false);
				expect(component.endPicker.pickerInput.disabled).toBe(false);
				expect(mockObserver.next).not.toHaveBeenCalled(); // because the 'emitEvent' is false
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();

				hostComponent.formGroup.disable(); // 'emitEvent' true by default
				hostFixture.detectChanges();

				expect(component.startPicker.pickerInput.disabled).toBe(true);
				expect(component.endPicker.pickerInput.disabled).toBe(true);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				mockObserver.next.calls.reset();

				hostComponent.formGroup.enable(); // 'emitEvent' true by default
				hostFixture.detectChanges();

				expect(component.startPicker.pickerInput.disabled).toBe(false);
				expect(component.endPicker.pickerInput.disabled).toBe(false);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("should update start and end dates when values in 'rangeFormGroup' are updated", () => {
				const startDate = new Date(2019, 0, 1);
				const endDate = new Date(2019, 0, 2);

				hostComponent.formGroup.setValue({ startDate, endDate });
				hostFixture.detectChanges();

				expect(component.startDate).toBeDefined();
				expect(component.startDate).toEqual(startDate);
				expect(component.endDate).toBeDefined();
				expect(component.endDate).toEqual(endDate);
			});

			it("the start and end dates should be the same as the values set on the form controls of the 'rangeFormGroup'", () => {
				const startDate = new Date(2018, 6, 3);
				const endDate = new Date(2018, 7, 3);
				hostComponent.formGroup.controls["startDate"].setValue(startDate);
				hostComponent.formGroup.controls["endDate"].setValue(endDate);
				hostFixture.detectChanges();

				expect(component.startDate).toBe(startDate);
				expect(component.endDate).toBe(endDate);
			});

			it("should log an error when the given 'rangeFormGroup' does not contain expected 'startDate' and 'endDate' controls", () => {
				hostComponent.formGroup = new UntypedFormGroup({
					start: new UntypedFormControl(new Date(2019, 0, 1)),
					end: new UntypedFormControl(new Date(2019, 0, 2))
				});
				hostFixture.detectChanges();

				expect(component.logger.error).toHaveBeenCalledTimes(1);
				const errorMessage: string = (<Spy>component.logger.error).calls.argsFor(0)[0];
				expect(errorMessage).toMatch(/formGroup.*startDate.*endDate/);
			});

			it("should show errors at the correct input", () => {
				const { startDate: startDateFormControl, endDate: endDateFormControl } = hostComponent.formGroup.controls;
				const alwaysFail = (): ValidationErrors => ({ alwaysFail: "error" });

				startDateFormControl.setValidators(alwaysFail);
				startDateFormControl.setValue(new Date());
				startDateFormControl.markAsTouched();

				endDateFormControl.setValidators(alwaysFail);
				endDateFormControl.setValue(new Date());
				endDateFormControl.markAsTouched();

				hostFixture.detectChanges();

				const startDateError = hostFixture.nativeElement.querySelectorAll("mat-form-field mat-error").item(0);
				expect(startDateError).not.toBeNull();
				expect(startDateError.textContent).toEqual("START-ERROR");

				const endDateError = hostFixture.nativeElement.querySelectorAll("mat-form-field mat-error").item(1);
				expect(endDateError).not.toBeNull();
				expect(endDateError.textContent).toEqual("END-ERROR");
			});
		});

		describe("dates selection", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("the end date should be correctly set if after the start date and emit the new value in the form control's 'valueChange' observable", () => {
				// initialize start date
				const startDate = new Date(2018, 6, 6);
				component.startPicker.picker.select(moment(startDate)); // select a date in the internal date picker
				hostFixture.detectChanges();
				hostComponent.formGroup.valueChanges.subscribe(mockObserver);

				expect(component.startDate).toEqual(startDate);
				const endDate = new Date(2018, 6, 7);
				component.endPicker.picker.select(moment(endDate)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(component.endDate).toEqual(endDate);

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({
					startDate: startDate,
					endDate: endDate
				});
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the end date should be correctly set if start date is undefined and emit the new value in the form control's 'valueChange' observable", () => {
				// initialize start date
				component.startPicker.picker.select(<any>undefined); // select a date in the internal date picker
				hostFixture.detectChanges();
				hostComponent.formGroup.valueChanges.subscribe(mockObserver);

				expect(component.startDate).toBeUndefined();
				const endDate = new Date(2018, 6, 8);
				component.endPicker.picker.select(moment(endDate)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(component.endDate).toEqual(endDate);

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({
					startDate: undefined,
					endDate: endDate
				});
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the end date should be still valid if it is before the startDate BUT the startDate should be set to undefined and it should emit the new value in the form control's 'valueChange' observable", () => {
				// initialize start date
				const startDate = new Date(2018, 6, 5);
				component.startPicker.picker.select(moment(startDate)); // select a date in the internal date picker
				hostFixture.detectChanges();
				hostComponent.formGroup.valueChanges.subscribe(mockObserver);

				expect(component.startDate).toEqual(startDate);
				const endDate = new Date(2018, 6, 4);
				component.endPicker.picker.select(moment(endDate)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(component.startDate).toBeUndefined();
				expect(component.endDate).toEqual(endDate);
				expect(component.endDateFormControl.status).toBe("VALID");

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({
					startDate: undefined,
					endDate: endDate
				});
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the start date should be still valid if it is after the endDate BUT the endDate should be set to undefined and it should emit the new value in the form control's 'valueChange' observable", () => {
				// initialize end date
				const endDate = new Date(2018, 6, 5);
				component.endPicker.picker.select(moment(endDate)); // select a date in the internal date picker
				hostFixture.detectChanges();
				hostComponent.formGroup.valueChanges.subscribe(mockObserver);

				expect(component.endDate).toEqual(endDate);
				const startDate = new Date(2018, 6, 6);
				component.startPicker.picker.select(moment(startDate)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(component.endDate).toBeUndefined();
				expect(component.startDate).toEqual(startDate);
				expect(component.startDateFormControl.status).toBe("VALID");

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith({
					startDate: startDate,
					endDate: undefined
				});
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});
		});
	});
});
