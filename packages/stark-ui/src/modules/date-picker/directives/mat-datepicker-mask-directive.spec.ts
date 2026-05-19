import { Component } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { StarkMatDatepickerMaskDirective } from "./mat-datepicker-mask-directive";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import moment from "moment";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { STARK_DATE_FORMATS } from "../components/date-format.constants";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatDatepickerInputHarness } from "@angular/material/datepicker/testing";

@Component({
	selector: "host-componet",
	template: `
		<mat-form-field>
			<mat-label>date</mat-label>
			<input matInput [matDatepicker]="pickerReactiveForm" [formControl]="formControl" required starkDateMask />
			<mat-datepicker-toggle matIconSuffix [for]="pickerReactiveForm"></mat-datepicker-toggle>
			<mat-datepicker #pickerReactiveForm></mat-datepicker>
		</mat-form-field>
	`
})
class TestHostComponent {
	public formControl = new FormControl<moment.Moment>(moment());
}

describe("MatDatepickerMaskDirective", () => {
	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkMatDatepickerMaskDirective, TestHostComponent],
			imports: [
				MatDatepickerModule,
				MatFormFieldModule,
				MatInputModule,
				MatMomentDateModule,
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
		})));

	describe("FormControl", () => {
		let hostComponent: TestHostComponent;
		let hostFixture: ComponentFixture<TestHostComponent>;
		let loader: HarnessLoader;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
			loader = TestbedHarnessEnvironment.loader(hostFixture);
		});

		it("Should display date as literal format", async () => {
			const now = moment();
			hostComponent.formControl.setValue(now);
			hostFixture.detectChanges();

			const matDateInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			expect(await matDateInputHarness.getValue()).toBe(now.format("LL"));
		});

		it("should display date dd-mm-yyyy format when user input data", async () => {
			const now = moment();
			hostComponent.formControl.setValue(now);
			hostFixture.detectChanges();
			const matDateInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			await matDateInputHarness.focus();
			expect(await matDateInputHarness.getValue()).toBe(now.format("DD/MM/YYYY"));
			await matDateInputHarness.blur();
			expect(await matDateInputHarness.getValue()).toBe(now.format("LL"));
		});

		it("should display nothing when no date", async () => {
			// eslint-disable-next-line no-null/no-null
			hostComponent.formControl.setValue(null);
			hostFixture.detectChanges();
			const matDateInputHarness = await loader.getHarness(MatDatepickerInputHarness);
			expect(await matDateInputHarness.getValue()).toBe("");
		});
	});
});
