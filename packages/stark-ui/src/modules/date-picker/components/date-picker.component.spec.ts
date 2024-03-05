/* eslint-disable @angular-eslint/component-max-inline-declarations */
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { Component, ViewChild } from "@angular/core";
import { UntypedFormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatLegacyFormField as MatFormField, MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { TranslateModule } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import moment from "moment";
import { Observer } from "rxjs";
import { DEFAULT_DATE_MASK_CONFIG, StarkDatePickerComponent, StarkDatePickerMaskConfig } from "./date-picker.component";
import { STARK_DATE_FORMATS } from "./date-format.constants";
import { StarkInputMaskDirectivesModule } from "@nationalbankbelgium/stark-ui/src/modules/input-mask-directives";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import Spy = jasmine.Spy;

/**
 * To be able to test changes to the input fields, the Date Picker component is hosted inside the TestHostComponent class.
 * This one uses the Input "value" and the Output "dateChange"
 */
@Component({
	selector: `host-component`,
	template: `
		<mat-form-field>
			<stark-date-picker
				[value]="value"
				[pickerId]="pickerId"
				[pickerName]="pickerName"
				[required]="required"
				[disabled]="isDisabled"
				[placeholder]="placeholder"
				[min]="minDate"
				[max]="maxDate"
				(dateChange)="onValueChange($event)"
			></stark-date-picker>
		</mat-form-field>
	`
})
class TestHostComponent {
	@ViewChild(StarkDatePickerComponent, { static: true })
	public datePickerComponent!: StarkDatePickerComponent;

	public value?: Date;
	public pickerId?: string;
	public pickerName?: string;
	public placeholder?: string;
	public isDisabled?: boolean;
	public required?: boolean;
	public minDate?: Date;
	public maxDate?: Date;

	/**
	 * Simulates the OnValueChanges event of the date-picker component
	 * To be able to test the 'Changes' output
	 * @param value - Date.
	 */
	public onValueChange(value: Date | undefined): void {
		this.value = value;
	}
}

/**
 * To be able to test changes to the input fields, the Date Picker component is hosted inside the TestHostFormControlComponent class.
 * This one does not use the Input "value" nor the Output "dateChange"
 */
@Component({
	selector: `host-form-control-component`,
	template: `
		<mat-form-field>
			<stark-date-picker
				[formControl]="formControl"
				[required]="required"
				[pickerId]="pickerId"
				[pickerName]="pickerName"
				[placeholder]="placeholder"
				[dateMask]="dateMask"
				[min]="minDate"
				[max]="maxDate"
			></stark-date-picker>
		</mat-form-field>
	`
})
class TestHostFormControlComponent {
	@ViewChild(StarkDatePickerComponent, { static: true })
	public datePickerComponent!: StarkDatePickerComponent;

	public formControl = new UntypedFormControl();
	public pickerId?: string;
	public pickerName?: string;
	public dateMask?: StarkDatePickerMaskConfig;
	public placeholder?: string;
	public required?: boolean;
	public minDate?: Date;
	public maxDate?: Date;
}

describe("DatePickerComponent", () => {
	let component: StarkDatePickerComponent;

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkDatePickerComponent, TestHostComponent, TestHostFormControlComponent],
			imports: [
				NoopAnimationsModule,
				MatDatepickerModule,
				MatFormFieldModule,
				MatInputModule,
				MatMomentDateModule,
				FormsModule,
				ReactiveFormsModule,
				StarkInputMaskDirectivesModule,
				TranslateModule.forRoot()
			],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS },
				{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
				{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
			]
		}).compileComponents()));

	describe("MatFormFieldControl", () => {
		let hostComponent: TestHostFormControlComponent;
		let hostFixture: ComponentFixture<TestHostFormControlComponent>;
		const formFieldInvalidClass = "mat-form-field-invalid";

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges(); // trigger initial data binding
		});

		it("if date is initially invalid, the date picker should not be displayed as invalid until the user interacts with it", () => {
			// re-create component with a form control with "required" validator
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostComponent.formControl = new UntypedFormControl(undefined, Validators.required); // initially invalid
			hostFixture.detectChanges(); // trigger initial data binding

			const formFieldDebugElement = hostFixture.debugElement.query(By.directive(MatFormField));
			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeUndefined();

			// more verbose way to create and trigger an event (the only way it works in IE)
			// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
			const blurEvent = document.createEvent("Event");
			blurEvent.initEvent("blur", true, true);
			const inputDebugElement = hostFixture.debugElement.query(By.css("input"));
			inputDebugElement.nativeElement.dispatchEvent(blurEvent); // simulate that the user has touched the input
			hostFixture.detectChanges();

			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeTrue();
		});

		it("if date is initially invalid, the date picker should not be displayed as invalid until the form control is marked as 'touched'", () => {
			// re-create component with a form control with "required" validator
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostComponent.formControl = new UntypedFormControl(undefined, Validators.required); // initially invalid
			hostFixture.detectChanges(); // trigger initial data binding

			const formFieldDebugElement = hostFixture.debugElement.query(By.directive(MatFormField));
			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeUndefined();

			hostComponent.formControl.markAsTouched();
			hostFixture.detectChanges();

			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeTrue();
		});

		it("if date is initially invalid, the date picker should not be displayed as invalid until the form control is marked as 'dirty'", () => {
			// re-create component with a form control with "required" validator
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostComponent.formControl = new UntypedFormControl(undefined, Validators.required); // initially invalid
			hostFixture.detectChanges(); // trigger initial data binding

			const formFieldDebugElement = hostFixture.debugElement.query(By.directive(MatFormField));
			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeUndefined();

			hostComponent.formControl.markAsDirty();
			hostFixture.detectChanges();

			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeTrue();
		});

		it("if marked as required, an asterisk should be appended to the label", () => {
			const formFieldLabelSelector = ".mat-form-field-label";
			const formFieldRequiredMarkerSelector = ".mat-form-field-required-marker";

			hostComponent.placeholder = "this is a placeholder";
			hostFixture.detectChanges();

			expect(hostFixture.debugElement.query(By.css(formFieldLabelSelector))).toBeTruthy();
			expect(hostFixture.debugElement.query(By.css(formFieldRequiredMarkerSelector))).toBeFalsy();

			hostComponent.required = <any>""; // coerced to true
			hostFixture.detectChanges();

			expect(hostFixture.debugElement.query(By.css(formFieldLabelSelector))).toBeTruthy();
			expect(hostFixture.debugElement.query(By.css(formFieldRequiredMarkerSelector))).toBeTruthy();

			hostComponent.required = false;
			hostFixture.detectChanges();

			expect(hostFixture.debugElement.query(By.css(formFieldLabelSelector))).toBeTruthy();
			expect(hostFixture.debugElement.query(By.css(formFieldRequiredMarkerSelector))).toBeFalsy();

			hostComponent.required = true;
			hostFixture.detectChanges();

			expect(hostFixture.debugElement.query(By.css(formFieldLabelSelector))).toBeTruthy();
			expect(hostFixture.debugElement.query(By.css(formFieldRequiredMarkerSelector))).toBeTruthy();
		});
	});

	describe("using formControl", () => {
		let hostComponent: TestHostFormControlComponent;
		let hostFixture: ComponentFixture<TestHostFormControlComponent>;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges(); // trigger initial data binding

			component = hostComponent.datePickerComponent;
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(hostFixture).toBeDefined();
				expect(component).toBeDefined();
				expect(component.logger).not.toBeNull();
				expect(component.logger).toBeDefined();
			});

			it("should NOT have any inputs set", () => {
				expect(component.value).toBeNull();
				expect(component.dateFilter).toBeUndefined();
				expect(component.disabled).toBeFalse();
				expect(component.required).toBeFalse();
				expect(component.max).toBeNull();
				expect(component.min).toBeNull();
				expect(component.pickerId).toBeUndefined();
				expect(component.pickerName).toBeUndefined();
				expect(component.placeholder).toEqual("");
				expect(component.dateChange).toBeDefined();
				expect(component.dateInput).toBeDefined();
			});
		});

		describe("mat-datepicker properties", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("should be set correctly according to the given inputs and WITHOUT triggering a 'valueChange' event", () => {
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				hostComponent.pickerId = "test-id";
				hostComponent.pickerName = "test-name";
				const minDate = new Date(2018, 6, 1);
				hostComponent.minDate = minDate;
				const maxDate = new Date(2018, 6, 2);
				hostComponent.maxDate = maxDate;
				/// hostComponent.required = true;  // IMPORTANT: toggling the 'required' property triggers a 'valueChange' event fired by the Angular 'required' validator (see Validators.required)
				hostFixture.detectChanges();

				expect(hostFixture.nativeElement.querySelector("mat-datepicker#test-id")).toBeTruthy();
				expect(hostFixture.nativeElement.querySelector("input#test-id-input")).toBeTruthy(); // the "-input" suffix is appended to the pickerId
				expect(hostFixture.nativeElement.querySelector("input[name='test-name']")).toBeTruthy();
				/// expect(hostFixture.nativeElement.querySelector("input#test-id-input[required]")).toBeTruthy(); // see comment above about Angular 'required' validator
				expect(component.pickerInput.min).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.min).toDate()).toEqual(minDate);
				expect(component.pickerInput.max).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.max).toDate()).toEqual(maxDate);

				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the MatDatepickerInput should be disabled when the form control is disabled AND it should trigger a 'valueChange' event ONLY IF the 'emitEvent' option is enabled", () => {
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				hostComponent.formControl.disable({ emitEvent: false });
				hostFixture.detectChanges();

				expect(component.pickerInput.disabled).toBeTrue();

				hostComponent.formControl.enable({ emitEvent: false });
				hostFixture.detectChanges();

				expect(component.pickerInput.disabled).toBeFalse();
				expect(mockObserver.next).not.toHaveBeenCalled(); // because the 'emitEvent' is false
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();

				hostComponent.formControl.disable(); // 'emitEvent' true by default
				hostFixture.detectChanges();

				expect(component.pickerInput.disabled).toBeTrue();
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				mockObserver.next.calls.reset();

				hostComponent.formControl.enable(); // 'emitEvent' true by default
				hostFixture.detectChanges();

				expect(component.pickerInput.disabled).toBeFalse();
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the MatDatepickerInput value should be the same as the form control's value", () => {
				const date = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.formControl.setValue(date);
				hostFixture.detectChanges();
				expect(component.pickerInput.value).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.value).toDate()).toEqual(date);
			});

			it("should log an error when 'min' value is after 'max' value", () => {
				hostComponent.maxDate = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.minDate = new Date(2018, 6, 3, 11, 15, 20); // maxDate + 1 hr
				hostFixture.detectChanges();

				expect(component.logger.error).toHaveBeenCalledTimes(1);
				const errorMessage: string = (<Spy>component.logger.error).calls.argsFor(0)[0];
				expect(errorMessage).toMatch(/min date.*cannot be after max date/);
			});
		});

		describe("date mask", () => {
			it("the dateMaskConfig should be DEFAULT_DATE_MASK_CONFIG when 'dateMask' is TRUE or empty string", () => {
				hostComponent.dateMask = true;
				hostFixture.detectChanges();
				expect(component.dateMaskConfig).toBe(DEFAULT_DATE_MASK_CONFIG);

				hostComponent.dateMask = <any>"";
				hostFixture.detectChanges();
				expect(component.dateMaskConfig).toBe(DEFAULT_DATE_MASK_CONFIG);
			});

			it("the dateMaskConfig should be undefined when 'dateMask' is FALSE", () => {
				hostComponent.dateMask = false;
				hostFixture.detectChanges();
				expect(component.dateMaskConfig).toBeUndefined();
			});

			it("the dateMaskConfig should be the same as 'dateMask'", () => {
				const dateMaskConfig: StarkDatePickerMaskConfig = { format: "DD-MM-YYYY" };

				hostComponent.dateMask = dateMaskConfig;
				hostFixture.detectChanges();
				expect(component.dateMaskConfig).toBe(dateMaskConfig);
			});

			it("should throw an error when 'dateMask' is not a valid StarkDatePickerMaskConfig value", () => {
				hostComponent.dateMask = <any>{ someProp: "whatever" };

				expect(() => hostFixture.detectChanges()).toThrowError(/dateMask.*not.*StarkDatePickerMaskConfig/);
			});

			it("should throw an error when 'dateMask' is not compatible with the MAT_DATE_FORMATS provided", () => {
				const expectedError = /dateMask\.format.*parse format.*MAT_DATE_FORMATS.*NOT compatible/;

				// some formats that are incompatible with the parse formats defined in STARK_DATE_FORMATS
				const incompatibleFormats = ["DD/MM/Y", "MM/DD/YYYY", "YYYY/MM/DD", "YYYY MM DD", "YYYY/DD/MM", "L", "l", "HH:mm"];

				for (const format of incompatibleFormats) {
					expect(() => {
						hostComponent.dateMask = { format: format };
						hostFixture.detectChanges();
					}).toThrowError(expectedError);
				}
			});
		});

		describe("date filters", () => {
			it("filterOnlyWeekdays() should filter week days", () => {
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 16))).toBeTrue();
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 17))).toBeTrue();
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 18))).toBeTrue();
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 19))).toBeTrue();
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 20))).toBeTrue();
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 21))).toBeFalse();
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 22))).toBeFalse();
			});

			it("filterOnlyWeekends() should filter week days", () => {
				expect(component.filterOnlyWeekends(new Date(2018, 6, 16))).toBeFalse();
				expect(component.filterOnlyWeekends(new Date(2018, 6, 17))).toBeFalse();
				expect(component.filterOnlyWeekends(new Date(2018, 6, 18))).toBeFalse();
				expect(component.filterOnlyWeekends(new Date(2018, 6, 19))).toBeFalse();
				expect(component.filterOnlyWeekends(new Date(2018, 6, 20))).toBeFalse();
				expect(component.filterOnlyWeekends(new Date(2018, 6, 21))).toBeTrue();
				expect(component.filterOnlyWeekends(new Date(2018, 6, 22))).toBeTrue();
			});

			it("dateFilter should be filterOnlyWeekdays() when dateFilter is 'OnlyWeekdays'", () => {
				component.dateFilter = "OnlyWeekdays";
				hostFixture.detectChanges();
				expect(typeof component.dateFilter).toBe("function");
				if (typeof component.dateFilter === "function") {
					/* eslint-disable-next-line @typescript-eslint/unbound-method */
					expect(component.dateFilter).toBe(component.filterOnlyWeekdays);
				}
			});

			it("dateFilter should be filterOnlyWeekends() when dateFilter is 'OnlyWeekends'", () => {
				component.dateFilter = "OnlyWeekends";
				hostFixture.detectChanges();
				expect(typeof component.dateFilter).toBe("function");
				if (typeof component.dateFilter === "function") {
					/* eslint-disable-next-line @typescript-eslint/unbound-method */
					expect(component.dateFilter).toBe(component.filterOnlyWeekends);
				}
			});

			it("dateFilter should be the given filter function if any", () => {
				expect(component.dateFilter).toBeUndefined();

				const filterFn: any = (date: Date): boolean => {
					const day: number = date.getDay();
					return day === 3;
				};
				component.dateFilter = filterFn;
				hostFixture.detectChanges();
				expect(component.dateFilter).toBe(filterFn);
			});
		});

		describe("date changes", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("should emit the new value in the form control's 'valueChanges' observable", () => {
				const dummyDate = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				component.picker.select(moment(dummyDate)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(dummyDate);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("should emit 'undefined' in the form control's 'valueChanges' observable when the new value is null or undefined", () => {
				// set an initial date
				const initialDummyDate = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.formControl.setValue(initialDummyDate);
				hostFixture.detectChanges();
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				/* eslint-disable-next-line no-null/no-null */
				component.picker.select(<any>null); // set 'null' in the internal date picker
				hostFixture.detectChanges();

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(undefined);
				mockObserver.next.calls.reset();

				// re-initialize date
				hostComponent.formControl.setValue(initialDummyDate, { emitEvent: false });
				hostFixture.detectChanges();
				expect(mockObserver.next).not.toHaveBeenCalled();

				component.picker.select(<any>undefined); // set 'undefined' in the internal date picker
				hostFixture.detectChanges();

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(undefined);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});
		});
	});

	describe("NOT using formControl", () => {
		let hostComponent: TestHostComponent;
		let hostFixture: ComponentFixture<TestHostComponent>;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges(); // trigger initial data binding

			component = hostComponent.datePickerComponent;
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(hostFixture).toBeDefined();
				expect(component).toBeDefined();

				expect(component.logger).not.toBeNull();
				expect(component.logger).toBeDefined();
			});

			it("should NOT have any inputs set", () => {
				expect(component.value).toBeUndefined();
				expect(component.dateFilter).toBeUndefined();
				expect(component.disabled).toBeFalse();
				expect(component.required).toBeFalse();
				expect(component.max).toBeNull();
				expect(component.min).toBeNull();
				expect(component.pickerId).toBeUndefined();
				expect(component.pickerName).toBeUndefined();
				expect(component.placeholder).toEqual("");
				expect(component.dateChange).toBeDefined();
				expect(component.dateInput).toBeDefined();
			});
		});

		describe("mat-datepicker properties", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("should be set correctly according to the given inputs and WITHOUT emitting a 'dateChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateChange.subscribe(mockObserver);

				hostComponent.pickerId = "test-id";
				hostComponent.pickerName = "test-name";
				const minDate = new Date(2018, 6, 1);
				hostComponent.minDate = minDate;
				const maxDate = new Date(2018, 6, 2);
				hostComponent.maxDate = maxDate;
				hostComponent.required = true;
				hostFixture.detectChanges();

				expect(hostFixture.nativeElement.querySelector("mat-datepicker#test-id")).toBeTruthy();
				expect(hostFixture.nativeElement.querySelector("input#test-id-input")).toBeTruthy(); // the "-input" suffix is appended to the pickerId
				expect(hostFixture.nativeElement.querySelector("input[name='test-name']")).toBeTruthy();
				expect(hostFixture.nativeElement.querySelector("input#test-id-input[required]")).toBeTruthy();
				expect(component.pickerInput.min).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.min).toDate()).toEqual(minDate);
				expect(component.pickerInput.max).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.max).toDate()).toEqual(maxDate);

				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the MatDatepickerInput should be disabled when 'disabled' is true and it should NOT emit a 'dateChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateChange.subscribe(mockObserver);

				hostComponent.isDisabled = true;
				hostFixture.detectChanges();
				expect(component.pickerInput.disabled).toBeTrue();

				hostComponent.isDisabled = false;
				hostFixture.detectChanges();
				expect(component.pickerInput.disabled).toBeFalse();

				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the MatDatepickerInput value should be set when the 'value' input is set and it should not emit a 'dateChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateChange.subscribe(mockObserver);

				const date = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.value = date;
				hostFixture.detectChanges();
				expect(component.pickerInput.value).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.value).toDate()).toEqual(date);

				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});
		});

		describe("date changes", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("should emit the new value in the 'dateChange' output", () => {
				spyOn(hostComponent, "onValueChange").and.callThrough();
				component.dateChange.subscribe(mockObserver);

				const dummyDate = new Date(2018, 6, 3, 10, 15, 20);
				component.picker.select(moment(dummyDate)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(hostComponent.onValueChange).toHaveBeenCalledTimes(1);
				expect(hostComponent.onValueChange).toHaveBeenCalledWith(dummyDate);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(dummyDate);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("should emit 'undefined' in the 'dateChange' output when the new value is null or undefined", () => {
				// set an initial date
				const initialDummyDate = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.value = initialDummyDate;
				hostFixture.detectChanges();
				spyOn(hostComponent, "onValueChange").and.callThrough();
				component.dateChange.subscribe(mockObserver);

				/* eslint-disable-next-line no-null/no-null */
				component.picker.select(<any>null); // set 'null' in the internal date picker
				hostFixture.detectChanges();

				expect(hostComponent.onValueChange).toHaveBeenCalledTimes(1);
				expect(hostComponent.onValueChange).toHaveBeenCalledWith(undefined);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(undefined);
				(<Spy>hostComponent.onValueChange).calls.reset();
				mockObserver.next.calls.reset();

				// re-initialize date
				hostComponent.value = initialDummyDate;
				hostFixture.detectChanges();
				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();

				component.picker.select(<any>undefined); // set 'undefined' in the internal date picker
				hostFixture.detectChanges();

				expect(hostComponent.onValueChange).toHaveBeenCalledTimes(1);
				expect(hostComponent.onValueChange).toHaveBeenCalledWith(undefined);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(undefined);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});
		});
	});
});
