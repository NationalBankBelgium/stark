import { Component } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import * as moment from "moment";
import { StarkDatePickerFilter, StarkMatDatepickerDatefilterDirective } from "./mat-datepicker-datefilter-directive";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { STARK_DATE_FORMATS } from "../components/date-format.constants";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatDatepickerInputHarness, MatDatepickerToggleHarness } from "@angular/material/datepicker/testing";
import createSpy = jasmine.createSpy;

@Component({
	selector: "host-componet",
	template: `
		<mat-form-field>
			<mat-label>date</mat-label>
			<input matInput [matDatepicker]="pickerReactiveForm" [formControl]="formControl" [starkDatePickerFilter]="dateFilter" />
			<mat-datepicker-toggle matIconSuffix [for]="pickerReactiveForm"></mat-datepicker-toggle>
			<mat-datepicker #pickerReactiveForm></mat-datepicker>
		</mat-form-field>
	`
})
class TestHostComponent {
	public formControl = new FormControl<moment.Moment>(moment());

	public dateFilter: StarkDatePickerFilter = "OnlyWeekdays";
}

describe("matDatePickerDateFilterDirective", () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [StarkMatDatepickerDatefilterDirective, TestHostComponent],
			imports: [
				MatDatepickerModule,
				MatFormFieldModule,
				MatInputModule,
				FormsModule,
				ReactiveFormsModule,
				TranslateModule.forRoot(),
				NoopAnimationsModule
			],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS },
				{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
				{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
			]
		});
	}));

	describe("should Filter only weekdays", () => {
		let hostFixture: ComponentFixture<TestHostComponent>;
		let loader: HarnessLoader;
		let hostComponent: TestHostComponent;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
			loader = TestbedHarnessEnvironment.loader(hostFixture);
		});

		it("should disable saturday and sunday", async () => {
			const datepickerToggleHarness = await loader.getHarness(MatDatepickerToggleHarness);
			await datepickerToggleHarness.openCalendar();

			const calendar = await datepickerToggleHarness.getCalendar();
			const cells = await calendar.getCells();

			let date = moment();

			for (let cell of cells) {
				date.set("date", Number(await cell.getText()));
				expect(await cell.isDisabled()).toBe(date.day() === 0 || date.day() === 6);
			}
		});

		it("set weekend should set error on form control", async () => {
			let tuesday = moment().day(3);
			let sunday = moment().day(7);
			let saturday = moment().day(6);
			hostComponent.formControl.setValue(tuesday);
			hostFixture.detectChanges();

			const datepickerInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			expect(await datepickerInputHarness.getValue()).toBe(tuesday.format("LL"));
			await datepickerInputHarness.focus();
			await datepickerInputHarness.setValue(sunday.format("DD-MM-YYYY"));
			await datepickerInputHarness.blur();
			expect(hostComponent.formControl.getError("matDatepickerFilter")).toBeTruthy();
			await datepickerInputHarness.focus();
			await datepickerInputHarness.setValue(saturday.format("DD-MM-YYYY"));
			await datepickerInputHarness.blur();
			expect(hostComponent.formControl.getError("matDatepickerFilter")).toBeTruthy();
		});

		it("set tuesday should not set error on form control", async () => {
			let monday = moment().day(1);
			let tuesday = moment().day(3);
			hostComponent.formControl.setValue(monday);
			hostFixture.detectChanges();
			const datepickerInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			expect(await datepickerInputHarness.getValue()).toBe(monday.format("LL"));
			await datepickerInputHarness.focus();
			await datepickerInputHarness.setValue(tuesday.format("DD-MM-YYYY"));
			await datepickerInputHarness.blur();
			expect(hostComponent.formControl.getError("matDatepickerFilter")).toBeFalsy();
		});
	});

	describe("should filter only weekends", () => {
		let hostFixture: ComponentFixture<TestHostComponent>;
		let loader: HarnessLoader;
		let hostComponent: TestHostComponent;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostComponent.dateFilter = "OnlyWeekends";
			hostFixture.detectChanges();
			loader = TestbedHarnessEnvironment.loader(hostFixture);
		});

		it("should enable only saturday and sunday", async () => {
			const datepickerToggleHarness = await loader.getHarness(MatDatepickerToggleHarness);
			await datepickerToggleHarness.openCalendar();

			const calendar = await datepickerToggleHarness.getCalendar();
			const cells = await calendar.getCells();

			let date = moment();

			for (let cell of cells) {
				date.set("date", Number(await cell.getText()));
				expect(await cell.isDisabled()).toBe(date.day() !== 0 && date.day() !== 6);
			}
		});

		it("set weekend should not set error on form control", async () => {
			let tuesday = moment().day(3);
			let sunday = moment().day(7);
			let saturday = moment().day(6);
			hostComponent.formControl.setValue(tuesday);
			hostFixture.detectChanges();

			const datepickerInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			expect(await datepickerInputHarness.getValue()).toBe(tuesday.format("LL"));
			await datepickerInputHarness.focus();
			await datepickerInputHarness.setValue(sunday.format("DD-MM-YYYY"));
			await datepickerInputHarness.blur();
			expect(hostComponent.formControl.getError("matDatepickerFilter")).toBeFalsy();
			await datepickerInputHarness.focus();
			await datepickerInputHarness.setValue(saturday.format("DD-MM-YYYY"));
			await datepickerInputHarness.blur();
			expect(hostComponent.formControl.getError("matDatepickerFilter")).toBeFalsy();
		});

		it("set tuesday should set error on form control", async () => {
			let monday = moment().day(1);
			let tuesday = moment().day(3);
			hostComponent.formControl.setValue(monday);
			hostFixture.detectChanges();
			const datepickerInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			expect(await datepickerInputHarness.getValue()).toBe(monday.format("LL"));
			await datepickerInputHarness.focus();
			await datepickerInputHarness.setValue(tuesday.format("DD-MM-YYYY"));
			await datepickerInputHarness.blur();
			expect(hostComponent.formControl.getError("matDatepickerFilter")).toBeTruthy();
		});
	});

	describe("should use custom filter function", () => {
		let hostFixture: ComponentFixture<TestHostComponent>;
		let loader: HarnessLoader;
		let hostComponent: TestHostComponent;
		let spyCustomFilter: jasmine.Spy;

		const customFilter: StarkDatePickerFilter = (date: Date) => date.getDate() % 2 === 0;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			spyCustomFilter = createSpy("customFilter", customFilter);
			hostComponent.dateFilter = spyCustomFilter;
			hostFixture.detectChanges();
			loader = TestbedHarnessEnvironment.loader(hostFixture);
		});

		it("should call custom filter function when open calendar", async () => {
			spyCustomFilter.calls.reset();
			spyCustomFilter.and.callThrough();
			const datepickerToggleHarness = await loader.getHarness(MatDatepickerToggleHarness);
			await datepickerToggleHarness.openCalendar();

			const calendar = await datepickerToggleHarness.getCalendar();
			const cells = await calendar.getCells();

			for (let cell of cells) {
				expect(await cell.isDisabled())
					.withContext(await cell.getText())
					.toBe(Number(await cell.getText()) % 2 !== 0);
			}
			expect(spyCustomFilter).toHaveBeenCalledTimes(cells.length);
		});

		it("set invalid date should set error on form control", async () => {
			spyCustomFilter.calls.reset();
			spyCustomFilter.and.callThrough();
			const date = moment().date(1);
			hostComponent.formControl.setValue(date);
			hostFixture.detectChanges();

			const datepickerInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			expect(await datepickerInputHarness.getValue()).toBe(date.format("LL"));
			await datepickerInputHarness.focus();
			await datepickerInputHarness.setValue(date.format("DD-MM-YYYY"));
			await datepickerInputHarness.blur();
			expect(hostComponent.formControl.getError("matDatepickerFilter")).toBeTruthy();
			expect(spyCustomFilter).toHaveBeenCalledWith(date.toDate());
		});

		it("set valid date should not set error on form control", async () => {
			spyCustomFilter.calls.reset();
			spyCustomFilter.and.callThrough();
			const date = moment().date(2);
			hostComponent.formControl.setValue(date);
			hostFixture.detectChanges();

			const datepickerInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			expect(await datepickerInputHarness.getValue()).toBe(date.format("LL"));
			await datepickerInputHarness.focus();
			await datepickerInputHarness.setValue(date.format("DD-MM-YYYY"));
			await datepickerInputHarness.blur();
			expect(hostComponent.formControl.getError("matDatepickerFilter")).toBeFalsy();
			expect(spyCustomFilter).toHaveBeenCalledWith(date.toDate());
		});
	});
});
