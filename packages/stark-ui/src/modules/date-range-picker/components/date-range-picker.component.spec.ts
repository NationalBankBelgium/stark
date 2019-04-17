/* tslint:disable:no-null-keyword completed-docs max-inline-declarations no-big-function */
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Component, EventEmitter, ViewChild } from "@angular/core";
import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { TranslateModule } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkDatePickerComponent } from "../../date-picker";
import { StarkDateRangePickerComponent } from "./date-range-picker.component";
import { StarkDateRangePickerEvent } from "./date-range-picker-event.intf";
import { StarkTimestampMaskDirective } from "../../input-mask-directives";
import moment from "moment";

describe("DateRangePickerComponent", () => {
	describe("uncontrolled", () => {
		let fixture: ComponentFixture<StarkDateRangePickerComponent>;
		let component: StarkDateRangePickerComponent;

		beforeEach(async(() => {
			return TestBed.configureTestingModule({
				declarations: [StarkTimestampMaskDirective, StarkDatePickerComponent, StarkDateRangePickerComponent],
				imports: [
					NoopAnimationsModule,
					MatDatepickerModule,
					MatFormFieldModule,
					FormsModule,
					ReactiveFormsModule,
					TranslateModule.forRoot()
				],
				providers: [
					{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
					{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService },
					{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
					{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
					{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
				]
			}).compileComponents();
		}));

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
				expect(component.endMaxDate).toBeUndefined();
				expect(component.endMinDate).toBeUndefined();
				expect(component.rangePickerId).toBeDefined();
				expect(component.rangePickerId).toEqual("");
				expect(component.rangePickerName).toBeDefined();
				expect(component.rangePickerName).toEqual("");
				expect(component.startDate).toBeUndefined();
				expect(component.startDateLabel).toBeDefined();
				expect(component.startDateLabel).toEqual("STARK.DATE_RANGE_PICKER.FROM");
				expect(component.startMaxDate).toBeUndefined();
				expect(component.startMinDate).toBeUndefined();
				expect(component.dateRangeChanged).toBeDefined();
				expect(component.dateRangeChanged).toEqual(new EventEmitter<StarkDateRangePickerEvent>());
			});
		});

		describe("datepickers properties binding", () => {
			it("the ids of the datepickers should be set correctly", () => {
				component.rangePickerId = "test-id";
				fixture.detectChanges();
				let input: HTMLElement = fixture.nativeElement.querySelector("#test-id-start-input");
				expect(input).not.toBeNull();
				input = fixture.nativeElement.querySelector("#test-id-end-input");
				expect(input).not.toBeNull();
				let picker: HTMLElement = fixture.nativeElement.querySelector("#test-id-start");
				expect(picker).not.toBeNull();
				picker = fixture.nativeElement.querySelector("#test-id-end");
				expect(picker).not.toBeNull();
			});

			it("the names of the datepickers should be set correctly", () => {
				component.rangePickerName = "test-name";
				fixture.detectChanges();
				let input: HTMLElement = fixture.nativeElement.querySelector('[name="test-name-start"]');
				expect(input).not.toBeNull();
				input = fixture.nativeElement.querySelector('[name="test-name-end"]');
				expect(input).not.toBeNull();
			});

			it("the datepickers should be disabled when isDisabled is true", () => {
				component.disabled = true;
				fixture.detectChanges();
				expect(component.startPicker.pickerInput.disabled).toBe(true);
				expect(component.endPicker.pickerInput.disabled).toBe(true);
			});

			it("the placeholders of the datepickers should be set correctly", () => {
				component.startDateLabel = "startDateLabel";
				component.endDateLabel = "endDateLabel";
				fixture.detectChanges();
				let input: HTMLElement = fixture.nativeElement.querySelector('[ng-reflect-placeholder="startDateLabel"]');
				expect(input).not.toBeNull();
				input = fixture.nativeElement.querySelector('[ng-reflect-placeholder="endDateLabel"]');
				expect(input).not.toBeNull();
			});

			it("the datepickers min date should be set correctly", () => {
				const minDate = new Date(2018, 6, 1);
				component.startMinDate = minDate;
				component.endMinDate = minDate;
				fixture.detectChanges();
				expect(component.startPicker.pickerInput.min).not.toBeNull();
				expect((<moment.Moment>component.startPicker.pickerInput.min).toDate()).toEqual(minDate);
				expect(component.endPicker.pickerInput.min).not.toBeNull();
				expect((<moment.Moment>component.endPicker.pickerInput.min).toDate()).toEqual(minDate);
			});

			it("the datepickers max date should be set correctly", () => {
				const maxDate = new Date(2018, 6, 2);
				component.startMaxDate = maxDate;
				component.endMaxDate = maxDate;
				fixture.detectChanges();
				expect(component.startPicker.pickerInput.max).not.toBeNull();
				expect((<moment.Moment>component.startPicker.pickerInput.max).toDate()).toEqual(maxDate);
				expect(component.endPicker.pickerInput.max).not.toBeNull();
				expect((<moment.Moment>component.endPicker.pickerInput.max).toDate()).toEqual(maxDate);
			});

			it("the datepickers value should be set correctly", fakeAsync(() => {
				const date = new Date(2018, 6, 3);
				component.startDate = date;
				component.endDate = date;
				fixture.detectChanges();
				tick();

				expect(component.startPicker.value).not.toBeNull("The value of the startDate date-picker should be set.");
				expect(component.startPicker.value).toEqual(date);
				expect(component.endPicker.value).not.toBeNull("The value of the endDate date-picker should be set.");
				expect(component.endPicker.value).toEqual(date);
			}));
		});

		describe("dates selection", () => {
			it("the end date should be invalid if before startdate", () => {
				component.startDate = new Date(2018, 6, 5);
				component.endDate = new Date(2018, 6, 4);
				fixture.detectChanges();

				expect(component.endDateFormControl.status).toBe("INVALID");
			});

			it("the end date should be correctly set if after the start date", () => {
				const endDate = new Date(2018, 6, 7);
				component.startDate = new Date(2018, 6, 6);
				component.endDate = endDate;
				fixture.detectChanges();

				expect(component.endDate).toEqual(endDate);
			});

			it("the end date should be correctly set if after the start date is undefined", () => {
				const endDate = new Date(2018, 6, 8);
				component.startDate = undefined;
				component.endDate = endDate;
				fixture.detectChanges();

				expect(component.endDate).toEqual(endDate);
			});
		});
	});

	@Component({
		selector: "test-model",
		template: `
			<stark-date-range-picker [(ngModel)]="dateRange"></stark-date-range-picker>
		`
	})
	class TestModelComponent {
		@ViewChild(StarkDateRangePickerComponent)
		public dateRangePicker!: StarkDateRangePickerComponent;

		public dateRange = {};
	}

	describe("with ngModel", () => {
		let fixture: ComponentFixture<TestModelComponent>;
		let hostComponent: TestModelComponent;
		let component: StarkDateRangePickerComponent;

		beforeEach(async(() =>
			TestBed.configureTestingModule({
				declarations: [StarkTimestampMaskDirective, StarkDatePickerComponent, StarkDateRangePickerComponent, TestModelComponent],
				imports: [
					NoopAnimationsModule,
					MatDatepickerModule,
					MatFormFieldModule,
					FormsModule,
					ReactiveFormsModule,
					TranslateModule.forRoot()
				],
				providers: [
					{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
					{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService },
					{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
					{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
					{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
				]
			}).compileComponents()));

		beforeEach(() => {
			fixture = TestBed.createComponent(TestModelComponent);
			hostComponent = fixture.componentInstance;
			component = hostComponent.dateRangePicker;
		});

		it("should update when model is updated", fakeAsync(() => {
			const expected = { startDate: new Date(2019, 0, 1), endDate: new Date(2019, 0, 2) };

			hostComponent.dateRange = expected;
			fixture.detectChanges();

			tick();

			expect(component.startDate).toBeDefined();
			expect(component.endDate).toBeDefined();

			expect(component.startDate).toEqual(expected.startDate);
			expect(component.endDate).toEqual(expected.endDate);
		}));
	});

	@Component({
		selector: "test-form-group",
		template: `
			<stark-date-range-picker [rangeFormGroup]="formGroup">
				<ng-container start-date-errors>START-ERROR</ng-container>
				<ng-container end-date-errors>END-ERROR</ng-container>
			</stark-date-range-picker>
		`
	})
	class TestFormGroupComponent {
		@ViewChild(StarkDateRangePickerComponent)
		public dateRangePicker!: StarkDateRangePickerComponent;

		public formGroup = new FormGroup({
			startDate: new FormControl(),
			endDate: new FormControl()
		});
	}

	describe("with formGroup", () => {
		let fixture: ComponentFixture<TestFormGroupComponent>;
		let hostComponent: TestFormGroupComponent;
		let component: StarkDateRangePickerComponent;

		beforeEach(async(() =>
			TestBed.configureTestingModule({
				declarations: [
					StarkTimestampMaskDirective,
					StarkDatePickerComponent,
					StarkDateRangePickerComponent,
					TestFormGroupComponent
				],
				imports: [
					NoopAnimationsModule,
					MatDatepickerModule,
					MatFormFieldModule,
					FormsModule,
					ReactiveFormsModule,
					TranslateModule.forRoot()
				],
				providers: [
					{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
					{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService },
					{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
					{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
					{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
				]
			}).compileComponents()));

		beforeEach(() => {
			fixture = TestBed.createComponent(TestFormGroupComponent);
			hostComponent = fixture.componentInstance;
			component = hostComponent.dateRangePicker;
		});

		it("should update when form group is updated", () => {
			const expected = { startDate: new Date(2019, 0, 1), endDate: new Date(2019, 0, 2) };

			hostComponent.formGroup.setValue(expected);
			fixture.detectChanges();

			expect(component.startDate).toBeDefined();
			expect(component.endDate).toBeDefined();

			expect(component.startDate).toEqual(expected.startDate);
			expect(component.endDate).toEqual(expected.endDate);
		});

		it("should show errors at the correct input", () => {
			const { startDate: startDateFC, endDate: endDateFC } = hostComponent.formGroup.controls;
			const alwaysFail = (): ValidationErrors => ({ alwaysFail: "error" });

			startDateFC.setValidators(alwaysFail);
			startDateFC.setValue(new Date());
			startDateFC.markAsTouched();
			startDateFC.markAsDirty();

			endDateFC.setValidators(alwaysFail);
			endDateFC.setValue(new Date());
			endDateFC.markAsTouched();
			endDateFC.markAsDirty();

			fixture.detectChanges();

			const startDateError = fixture.nativeElement.querySelectorAll("mat-form-field mat-error").item(0);
			expect(startDateError).not.toBeNull();
			expect(startDateError.textContent).toEqual("START-ERROR");

			const endDateError = fixture.nativeElement.querySelectorAll("mat-form-field mat-error").item(1);
			expect(endDateError).not.toBeNull();
			expect(endDateError.textContent).toEqual("END-ERROR");
		});
	});
});
