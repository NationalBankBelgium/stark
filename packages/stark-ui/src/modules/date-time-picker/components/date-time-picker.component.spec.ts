/* eslint-disable @angular-eslint/component-max-inline-declarations */
import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { UntypedFormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { TranslateModule } from "@ngx-translate/core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { Observer } from "rxjs";
import moment from "moment";
import {
	STARK_DATE_FORMATS,
	StarkDatePickerModule,
	StarkDatePickerFilter,
	StarkDatePickerMaskConfig
} from "@nationalbankbelgium/stark-ui/src/modules/date-picker";
import { StarkTimestampMaskConfig, StarkInputMaskDirectivesModule } from "@nationalbankbelgium/stark-ui/src/modules/input-mask-directives";
import { DEFAULT_TIME_MASK_CONFIG, StarkDateTimePickerComponent } from "./date-time-picker.component";
import createSpyObj = jasmine.createSpyObj;
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;

@Component({
	selector: "host-component",
	template: `
		<mat-form-field>
			<stark-date-time-picker
				[value]="value"
				[pickerId]="pickerId"
				[pickerName]="pickerName"
				[placeholder]="placeholder"
				[disabled]="isDisabled"
				[required]="required"
				[dateMask]="dateMask"
				[timeMask]="timeMask"
				[dateFilter]="dateFilter"
				[min]="minDate"
				[max]="maxDate"
				(dateTimeChange)="onValueChange($event)"
			></stark-date-time-picker>
		</mat-form-field>
	`
})
class TestHostComponent {
	@ViewChild(StarkDateTimePickerComponent, { static: true })
	public dateTimePickerComponent!: StarkDateTimePickerComponent;

	public value?: Date;
	public pickerId?: string;
	public pickerName?: string;
	public placeholder?: string;
	public isDisabled?: boolean;
	public required?: boolean;
	public dateMask?: StarkDatePickerMaskConfig;
	public timeMask?: StarkTimestampMaskConfig;
	public dateFilter?: StarkDatePickerFilter;
	public minDate?: Date;
	public maxDate?: Date;

	public onValueChange(value: Date): void {
		this.value = value;
	}
}

@Component({
	selector: "host-form-control-component",
	template: `
		<mat-form-field>
			<stark-date-time-picker
				[formControl]="formControl"
				[pickerId]="pickerId"
				[pickerName]="pickerName"
				[placeholder]="placeholder"
				[required]="required"
				[dateMask]="dateMask"
				[timeMask]="timeMask"
				[dateFilter]="dateFilter"
				[min]="minDate"
				[max]="maxDate"
			></stark-date-time-picker>
		</mat-form-field>
	`
})
class TestHostFormControlComponent {
	@ViewChild(StarkDateTimePickerComponent, { static: true })
	public dateTimePickerComponent!: StarkDateTimePickerComponent;

	public formControl = new UntypedFormControl();
	public pickerId?: string;
	public pickerName?: string;
	public placeholder?: string;
	public isDisabled?: boolean;
	public required?: boolean;
	public dateMask?: StarkDatePickerMaskConfig;
	public timeMask?: StarkTimestampMaskConfig;
	public dateFilter?: StarkDatePickerFilter;
	public minDate?: Date;
	public maxDate?: Date;
}

describe("DateTimePickerComponent", () => {
	let component: StarkDateTimePickerComponent;
	const timeInputSelector = ".time-input";

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkDateTimePickerComponent, TestHostComponent, TestHostFormControlComponent],
			imports: [
				NoopAnimationsModule,
				MatDatepickerModule,
				MatTooltipModule,
				MatFormFieldModule,
				MatIconModule,
				MatIconTestingModule,
				MatInputModule,
				MatMomentDateModule,
				FormsModule,
				ReactiveFormsModule,
				StarkDatePickerModule,
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

		it("if date is initially invalid, the date time picker should not be displayed as invalid until the user interacts with the date or time picker", () => {
			// re-create component with a form control with "required" validator
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostComponent.formControl = new UntypedFormControl(undefined, Validators.required); // initially invalid
			hostFixture.detectChanges(); // trigger initial data binding

			let formFieldDebugElement = hostFixture.debugElement.query(By.directive(MatFormField));
			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeUndefined();

			const datePickerInputDebugElement = hostFixture.debugElement.query(By.css("stark-date-picker > input"));
			expect(datePickerInputDebugElement).toBeTruthy();
			// more verbose way to create and trigger an event (the only way it works in IE)
			// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
			let blurEvent = document.createEvent("Event");
			blurEvent.initEvent("blur", true, true);
			datePickerInputDebugElement.nativeElement.dispatchEvent(blurEvent); // simulate that the user has touched the input
			hostFixture.detectChanges();

			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBe(true);

			// re-create component with a form control with "required" validator
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostComponent.formControl = new UntypedFormControl(undefined, Validators.required); // initially invalid
			hostFixture.detectChanges(); // trigger initial data binding

			formFieldDebugElement = hostFixture.debugElement.query(By.directive(MatFormField));
			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeUndefined();

			const timeInputDebugElement = hostFixture.debugElement.query(By.css(".time-picker > input"));
			expect(timeInputDebugElement).toBeTruthy();
			// more verbose way to create and trigger an event (the only way it works in IE)
			// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
			blurEvent = document.createEvent("Event");
			blurEvent.initEvent("blur", true, true);
			timeInputDebugElement.nativeElement.dispatchEvent(blurEvent); // simulate that the user has touched the input
			hostFixture.detectChanges();

			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBe(true);
		});

		it("if date time is initially invalid, the date time picker should not be displayed as invalid until the form control is marked as 'touched'", () => {
			// re-create component with a form control with "required" validator
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostComponent.formControl = new UntypedFormControl(undefined, Validators.required); // initially invalid
			hostFixture.detectChanges(); // trigger initial data binding

			const formFieldDebugElement = hostFixture.debugElement.query(By.directive(MatFormField));
			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeUndefined();

			hostComponent.formControl.markAsTouched();
			hostFixture.detectChanges();

			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBe(true);
		});

		it("if date time is initially invalid, the date time picker should not be displayed as invalid until the form control is marked as 'dirty'", () => {
			// re-create component with a form control with "required" validator
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostComponent.formControl = new UntypedFormControl(undefined, Validators.required); // initially invalid
			hostFixture.detectChanges(); // trigger initial data binding

			const formFieldDebugElement = hostFixture.debugElement.query(By.directive(MatFormField));
			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBeUndefined();

			hostComponent.formControl.markAsDirty();
			hostFixture.detectChanges();

			expect(formFieldDebugElement.classes[formFieldInvalidClass]).toBe(true);
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

			component = hostComponent.dateTimePickerComponent;
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(hostFixture).toBeDefined();
				expect(component).toBeDefined();
				expect(component.logger).toBeTruthy();
			});

			it("should NOT have any inputs set", () => {
				expect(component.value).toBeNull();
				expect(component.dateFilter).toBeUndefined();
				expect(component.disabled).toBe(false);
				expect(component.required).toBe(false);
				expect(component.max).toBeNull();
				expect(component.min).toBeNull();
				expect(component.pickerId).toBeUndefined();
				expect(component.pickerName).toBeUndefined();
				expect(component.placeholder).toEqual("");
				expect(component.dateMask).toBeUndefined();
				expect(component.timeMask).toBe(DEFAULT_TIME_MASK_CONFIG);
				expect(component.dateTimeChange).toBeDefined();
			});

			it("should NOT have any validation errors if the model value is empty", () => {
				expect(hostComponent.formControl.value).toBeNull();
				expect(hostComponent.formControl.errors).toBeNull();
				expect(component.dateTimeFormGroup.errors).toBeNull();
				expect(component.dateTimeFormGroup.controls["date"].errors).toBeNull();
				expect(component.dateTimeFormGroup.controls["time"].errors).toBeNull();
			});
		});

		describe("datepicker properties", () => {
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
				/// expect(hostFixture.nativeElement.querySelector("input#test-id-time-input[required]")).toBeTruthy(); // see comment above about Angular 'required' validator
				expect(component.datePicker.min).not.toBeNull();
				expect(component.datePicker.min?.toDate()).toEqual(minDate);
				expect(component.datePicker.max).not.toBeNull();
				expect(component.datePicker.max?.toDate()).toEqual(maxDate);

				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the datepicker should be disabled when the form control is disabled AND it should trigger a 'valueChange' event ONLY IF the 'emitEvent' option is enabled", () => {
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				hostComponent.formControl.disable({ emitEvent: false });
				hostFixture.detectChanges();

				expect(component.datePicker.disabled).toBe(true);

				hostComponent.formControl.enable({ emitEvent: false });
				hostFixture.detectChanges();

				expect(component.datePicker.disabled).toBe(false);
				expect(mockObserver.next).not.toHaveBeenCalled(); // because the 'emitEvent' is false
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();

				hostComponent.formControl.disable(); // 'emitEvent' true by default
				hostFixture.detectChanges();

				expect(component.datePicker.disabled).toBe(true);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				mockObserver.next.calls.reset();

				hostComponent.formControl.enable(); // 'emitEvent' true by default
				hostFixture.detectChanges();

				expect(component.datePicker.disabled).toBe(false);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the datepicker value should be the same as the date part of the form control's value", () => {
				const date = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.formControl.setValue(date);
				hostFixture.detectChanges();
				expect(component.datePicker.value).not.toBeNull();
				expect(component.datePicker.value).toEqual(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
			});
		});

		describe("date mask", () => {
			it("the dateMask should be passed 'as is' to the internal datepicker", () => {
				hostComponent.dateMask = true;
				hostFixture.detectChanges();
				expect(component.dateMask).toBe(true);

				hostComponent.dateMask = <any>"";
				hostFixture.detectChanges();
				expect(component.dateMask).toBe(<any>"");

				hostComponent.dateMask = false;
				hostFixture.detectChanges();
				expect(component.dateMask).toBe(false);

				const dateMask: StarkDatePickerMaskConfig = { format: "DD-MM-YYYY" };
				hostComponent.dateMask = dateMask;
				hostFixture.detectChanges();
				expect(component.dateMask).toBe(dateMask);
			});
		});

		describe("date filter", () => {
			it("the dateFilter should be passed 'as is' to the internal datepicker", () => {
				expect(component.dateFilter).toBeUndefined();

				const filterFn: any = (date: Date): boolean => {
					const day: number = date.getDay();
					return day === 3;
				};
				hostComponent.dateFilter = filterFn;
				hostFixture.detectChanges();
				expect(component.dateFilter).toBe(filterFn);

				hostComponent.dateFilter = "OnlyWeekdays";
				hostFixture.detectChanges();
				expect(component.dateFilter).toBe("OnlyWeekdays");

				hostComponent.dateFilter = "OnlyWeekends";
				hostFixture.detectChanges();
				expect(component.dateFilter).toBe("OnlyWeekends");
			});
		});

		describe("time input properties", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("should be set correctly according to the specified inputs and WITHOUT triggering a 'valueChange' event", () => {
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				hostComponent.pickerId = "test-id";
				hostComponent.pickerName = "test-name";
				/// hostComponent.required = true;  // IMPORTANT: toggling the 'required' property triggers a 'valueChange' event fired by the Angular 'required' validator (see Validators.required)
				hostFixture.detectChanges();

				expect(hostFixture.debugElement.query(By.css(timeInputSelector))).toBeTruthy();
				expect(hostFixture.nativeElement.querySelector("input#test-id-time-input")).toBeTruthy(); // the "-time-input" suffix is appended to the pickerId
				expect(hostFixture.nativeElement.querySelector("input[name='test-name-time-input']")).toBeTruthy();
				/// expect(hostFixture.nativeElement.querySelector("input#test-id-time-input[required]")).toBeTruthy(); // see comment above about Angular 'required' validator

				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the time input should be disabled when the form control is disabled AND it should trigger a 'valueChange' event ONLY IF the 'emitEvent' option is enabled", () => {
				const timeInputDebugElement = hostFixture.debugElement.query(By.css(timeInputSelector));
				expect(timeInputDebugElement).toBeTruthy();
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				hostComponent.formControl.disable({ emitEvent: false });
				hostFixture.detectChanges();

				expect(timeInputDebugElement.properties["disabled"]).toBe(true);
				expect(component.timeInput.nativeElement.disabled).toBe(true);
				//
				hostComponent.formControl.enable({ emitEvent: false });
				hostFixture.detectChanges();

				expect(timeInputDebugElement.properties["disabled"]).toBe(false);
				expect(component.timeInput.nativeElement.disabled).toBe(false);
				expect(mockObserver.next).not.toHaveBeenCalled(); // because the 'emitEvent' is false
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();

				hostComponent.formControl.disable(); // 'emitEvent' true by default
				hostFixture.detectChanges();

				expect(timeInputDebugElement.properties["disabled"]).toBe(true);
				expect(component.timeInput.nativeElement.disabled).toBe(true);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				mockObserver.next.calls.reset();
				//
				hostComponent.formControl.enable(); // 'emitEvent' true by default
				hostFixture.detectChanges();

				expect(timeInputDebugElement.properties["disabled"]).toBe(false);
				expect(component.timeInput.nativeElement.disabled).toBe(false);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the time input value should be the same as the time part of the form control's value", () => {
				const date = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.formControl.setValue(date);
				hostFixture.detectChanges();
				expect(component.timeInput.nativeElement.value).not.toBeNull();
				expect(component.timeInput.nativeElement.value).toEqual(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
			});
		});

		describe("time mask", () => {
			it("the timeMask should be passed 'as is' to the internal time input only if it is a valid mask config or use the DEFAULT_TIME_MASK otherwise", () => {
				hostComponent.timeMask = <any>true; // invalid mask
				hostFixture.detectChanges();
				expect(component.timeMask).toBe(DEFAULT_TIME_MASK_CONFIG);

				hostComponent.timeMask = <any>""; // invalid mask
				hostFixture.detectChanges();
				expect(component.timeMask).toBe(DEFAULT_TIME_MASK_CONFIG);

				hostComponent.timeMask = <any>false; // invalid mask
				hostFixture.detectChanges();
				expect(component.timeMask).toBe(DEFAULT_TIME_MASK_CONFIG);

				const timeMask: StarkTimestampMaskConfig = { format: "HH:mm" };
				hostComponent.timeMask = timeMask;
				hostFixture.detectChanges();
				expect(component.timeMask).toBe(timeMask);
			});
		});

		describe("date time selection", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("the date time should be correctly set and emit the new value in the form control's 'valueChange' observable", () => {
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				const date = new Date(2018, 6, 7);
				component.datePicker.picker.select(moment(date)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(date);
				mockObserver.next.calls.reset();

				const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 15, 30, 45);
				// type the time in the time input
				component.timeInput.nativeElement.value = `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
				// more verbose way to create and trigger an event (the only way it works in IE)
				// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
				const inputEvent: Event = document.createEvent("Event");
				inputEvent.initEvent("input", true, true);
				component.timeInput.nativeElement.dispatchEvent(inputEvent);
				const changeEvent = document.createEvent("Event");
				changeEvent.initEvent("change", true, true);
				component.timeInput.nativeElement.dispatchEvent(changeEvent);
				hostFixture.detectChanges();

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(dateTime);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the date part should be set to the default date if it is not defined and emit the new value in the form control's 'valueChange' observable", () => {
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				const time = [15, 15, 15]; // later converted to "XX:XX:XX" (the default format is HH:mm:ss)
				const expectedDateTime = new Date(
					component.defaultDate.getFullYear(), // default date
					component.defaultDate.getMonth(),
					component.defaultDate.getDate(),
					...time // + given time
				);
				// type the time in the time input
				component.timeInput.nativeElement.value = time.join(":"); // to have the time string in the format "XX:XX:XX"
				// more verbose way to create and trigger an event (the only way it works in IE)
				// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
				const inputEvent: Event = document.createEvent("Event");
				inputEvent.initEvent("input", true, true);
				component.timeInput.nativeElement.dispatchEvent(inputEvent);
				const changeEvent = document.createEvent("Event");
				changeEvent.initEvent("change", true, true);
				component.timeInput.nativeElement.dispatchEvent(changeEvent);
				hostFixture.detectChanges();

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).not.toHaveBeenCalledWith(component.defaultDate);
				expect(mockObserver.next).toHaveBeenCalledWith(expectedDateTime);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the time part should be set to the default time if it is not defined and emit the new value in the form control's 'valueChange' observable", () => {
				hostComponent.formControl.valueChanges.subscribe(mockObserver);

				const date = new Date(2018, 6, 7, 15, 15, 15, 155);
				const expectedDateTime = new Date(
					date.getFullYear(), // given date
					date.getMonth(),
					date.getDate(),
					component.defaultTime.getHours(), // + default time
					component.defaultTime.getMinutes(),
					component.defaultTime.getSeconds(),
					component.defaultTime.getMilliseconds()
				);
				component.datePicker.picker.select(moment(date)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).not.toHaveBeenCalledWith(date);
				expect(mockObserver.next).toHaveBeenCalledWith(expectedDateTime);
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

			component = hostComponent.dateTimePickerComponent;
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(hostFixture).toBeDefined();
				expect(component).toBeDefined();
				expect(component.logger).toBeTruthy();
			});

			it("should NOT have any inputs set", () => {
				expect(component.value).toBeUndefined();
				expect(component.dateFilter).toBeUndefined();
				expect(component.disabled).toBe(false);
				expect(component.required).toBe(false);
				expect(component.max).toBeNull();
				expect(component.min).toBeNull();
				expect(component.pickerId).toBeUndefined();
				expect(component.pickerName).toBeUndefined();
				expect(component.placeholder).toEqual("");
				expect(component.dateMask).toBeUndefined();
				expect(component.timeMask).toBe(DEFAULT_TIME_MASK_CONFIG);
				expect(component.dateTimeChange).toBeDefined();
			});
		});

		describe("datepicker properties", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("should be set correctly according to the given inputs and WITHOUT emitting a 'dateTimeChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateTimeChange.subscribe(mockObserver);

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
				expect(hostFixture.nativeElement.querySelector("input#test-id-time-input[required]")).toBeTruthy();
				expect(component.datePicker.min).not.toBeNull();
				expect(component.datePicker.min?.toDate()).toEqual(minDate);
				expect(component.datePicker.max).not.toBeNull();
				expect(component.datePicker.max?.toDate()).toEqual(maxDate);

				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the datepicker should be disabled when 'disabled' is true and it should NOT emit a 'dateTimeChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateTimeChange.subscribe(mockObserver);

				hostComponent.isDisabled = true;
				hostFixture.detectChanges();
				expect(component.datePicker.disabled).toBe(true);

				hostComponent.isDisabled = false;
				hostFixture.detectChanges();
				expect(component.datePicker.disabled).toBe(false);

				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the datepicker value should be the same as the date part of the 'value' input and it should not emit a 'dateChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateTimeChange.subscribe(mockObserver);

				const date = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.value = date;
				hostFixture.detectChanges();
				expect(component.datePicker.value).not.toBeNull();
				expect(component.datePicker.value).toEqual(new Date(date.getFullYear(), date.getMonth(), date.getDate()));

				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});
		});

		describe("time input properties", () => {
			let mockObserver: SpyObj<Observer<any>>;

			beforeEach(() => {
				mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			});

			it("should be set correctly according to the specified inputs and WITHOUT emitting a 'dateTimeChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateTimeChange.subscribe(mockObserver);

				hostComponent.pickerId = "test-id";
				hostComponent.pickerName = "test-name";
				hostFixture.detectChanges();

				expect(hostFixture.debugElement.query(By.css(timeInputSelector))).toBeTruthy();
				expect(hostFixture.nativeElement.querySelector("input#test-id-time-input")).toBeTruthy(); // the "-time-input" suffix is appended to the pickerId
				expect(hostFixture.nativeElement.querySelector("input[name='test-name-time-input']")).toBeTruthy();

				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the time input should be disabled when 'disabled' is true and it should NOT emit a 'dateTimeChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateTimeChange.subscribe(mockObserver);

				const timeInputDebugElement = hostFixture.debugElement.query(By.css(timeInputSelector));
				expect(timeInputDebugElement).toBeTruthy();

				hostComponent.isDisabled = true;
				hostFixture.detectChanges();
				expect(timeInputDebugElement.properties["disabled"]).toBe(true);
				expect(component.timeInput.nativeElement.disabled).toBe(true);
				//
				hostComponent.isDisabled = false;
				hostFixture.detectChanges();
				expect(timeInputDebugElement.properties["disabled"]).toBe(false);
				expect(component.timeInput.nativeElement.disabled).toBe(false);

				expect(hostComponent.onValueChange).not.toHaveBeenCalled();
				expect(mockObserver.next).not.toHaveBeenCalled();
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});

			it("the time input value should be the same as the time part of 'value' and it should not emit a 'dateChange' event", () => {
				spyOn(hostComponent, "onValueChange");
				component.dateTimeChange.subscribe(mockObserver);

				const date = new Date(2018, 6, 3, 10, 15, 20);
				hostComponent.value = date;
				hostFixture.detectChanges();
				expect(component.timeInput.nativeElement.value).not.toBeNull();
				expect(component.timeInput.nativeElement.value).toEqual(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);

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
				component.dateTimeChange.subscribe(mockObserver);

				const date = new Date(2018, 6, 3);
				component.datePicker.picker.select(moment(date)); // select a date in the internal date picker
				hostFixture.detectChanges();

				expect(hostComponent.onValueChange).toHaveBeenCalledTimes(1);
				expect(hostComponent.onValueChange).toHaveBeenCalledWith(date);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(date);
				(<Spy>hostComponent.onValueChange).calls.reset();
				mockObserver.next.calls.reset();

				const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 15, 30, 45);
				component.timeInput.nativeElement.value = `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
				// more verbose way to create and trigger an event (the only way it works in IE)
				// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
				const inputEvent: Event = document.createEvent("Event");
				inputEvent.initEvent("input", true, true);
				component.timeInput.nativeElement.dispatchEvent(inputEvent);
				const changeEvent = document.createEvent("Event");
				changeEvent.initEvent("change", true, true);
				component.timeInput.nativeElement.dispatchEvent(changeEvent);
				hostFixture.detectChanges();

				expect(hostComponent.onValueChange).toHaveBeenCalledTimes(1);
				expect(hostComponent.onValueChange).toHaveBeenCalledWith(dateTime);
				expect(mockObserver.next).toHaveBeenCalledTimes(1);
				expect(mockObserver.next).toHaveBeenCalledWith(dateTime);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
			});
		});
	});
});
