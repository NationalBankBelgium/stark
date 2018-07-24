import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StarkDatePickerModule } from "./../../date-picker";
import { StarkDateRangePickerComponent } from "./date-range-picker.component";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

describe("DateRangePickerComponent", () => {
	let fixture: ComponentFixture<StarkDateRangePickerComponent>;
	let component: StarkDateRangePickerComponent;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkDateRangePickerComponent],
			imports: [NoopAnimationsModule, StarkDatePickerModule, TranslateModule.forRoot()],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService },
				TranslateService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StarkDateRangePickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
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
			let input: HTMLElement = fixture.nativeElement.querySelector('[placeholder="startDateLabel"]');
			expect(input).not.toBeNull();
			input = fixture.nativeElement.querySelector('[placeholder="endDateLabel"]');
			expect(input).not.toBeNull();
		});

		it("the datepickers minDate should be set correctly", () => {
			const minDate: Date = new Date("07-01-2018");
			component.startMinDate = minDate;
			component.endMinDate = minDate;
			fixture.detectChanges();
			expect(component.startPicker.pickerInput.min.toDate()).toEqual(minDate);
			expect(component.endPicker.pickerInput.min.toDate()).toEqual(minDate);
		});

		it("the datepickers maxDate should be set correctly", () => {
			const maxDate: Date = new Date("07-02-2018");
			component.startMaxDate = maxDate;
			component.endMaxDate = maxDate;
			fixture.detectChanges();
			expect(component.startPicker.pickerInput.max.toDate()).toEqual(maxDate);
			expect(component.endPicker.pickerInput.max.toDate()).toEqual(maxDate);
		});

		it("the datepickers value should be set correctly", () => {
			const date: Date = new Date("07-03-2018");
			component.startDate = date;
			component.endDate = date;
			fixture.detectChanges();
			expect(component.startPicker.pickerInput.value.toDate()).toEqual(date);
			expect(component.endPicker.pickerInput.value.toDate()).toEqual(date);
		});
	});

	describe("dates selection", () => {
		it("the end date should be undefined before the start date", () => {
			component.startDate = new Date("07-05-2018");
			component.endDate = new Date("07-04-2018");
			fixture.detectChanges();
			component.checkDates();
			expect(component.endDate).toBeUndefined();
		});

		it("the end date should be correctly set if after the start date", () => {
			const endDate: Date = new Date("07-07-2018");
			component.startDate = new Date("07-06-2018");
			component.endDate = endDate;
			fixture.detectChanges();
			component.checkDates();
			expect(component.endDate).toBe(endDate);
		});

		it("the end date should be correctly set if after the start date is undefined", () => {
			const endDate: Date = new Date("07-08-2018");
			component.startDate = undefined;
			component.endDate = endDate;
			fixture.detectChanges();
			component.checkDates();
			expect(component.endDate).toBe(endDate);
		});
	});
});
