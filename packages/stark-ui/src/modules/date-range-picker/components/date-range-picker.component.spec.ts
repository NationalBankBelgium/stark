import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { EventEmitter } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
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
	let fixture: ComponentFixture<StarkDateRangePickerComponent>;
	let component: StarkDateRangePickerComponent;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkTimestampMaskDirective, StarkDatePickerComponent, StarkDateRangePickerComponent],
			imports: [NoopAnimationsModule, MatDatepickerModule, MatFormFieldModule, TranslateModule.forRoot(), ReactiveFormsModule],
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
			expect(component.isDisabled).toBeUndefined();
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
			component.isDisabled = true;
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

		it("the datepickers value should be set correctly", () => {
			const date = new Date(2018, 6, 3);
			component.startDate = date;
			component.endDate = date;
			fixture.detectChanges();
			expect(component.startPicker.pickerInput.value).not.toBeNull();
			expect((<moment.Moment>component.startPicker.pickerInput.value).toDate()).toEqual(date);
			expect(component.endPicker.pickerInput.value).not.toBeNull();
			expect((<moment.Moment>component.endPicker.pickerInput.value).toDate()).toEqual(date);
		});
	});

	describe("dates selection", () => {
		it("the end date should be undefined before the start date", () => {
			component.startDate = new Date(2018, 6, 5);
			component.endDate = new Date(2018, 6, 4);
			fixture.detectChanges();
			component.checkDates();
			expect(component.endDate).toBeUndefined();
		});

		it("the end date should be correctly set if after the start date", () => {
			const endDate = new Date(2018, 6, 7);
			component.startDate = new Date(2018, 6, 6);
			component.endDate = endDate;
			fixture.detectChanges();
			component.checkDates();
			expect(component.endDate).toEqual(endDate);
		});

		it("the end date should be correctly set if after the start date is undefined", () => {
			const endDate = new Date(2018, 6, 8);
			component.startDate = undefined;
			component.endDate = endDate;
			fixture.detectChanges();
			component.checkDates();
			expect(component.endDate).toEqual(endDate);
		});
	});
});
