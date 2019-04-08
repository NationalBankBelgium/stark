/* tslint:disable:completed-docs no-identical-functions */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { StarkActionBarModule, StarkGenericSearchComponent, StarkSearchFormComponent } from "@nationalbankbelgium/stark-ui";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";

@Component({
	selector: "search-form-component",
	template: ""
})
class TestSearchFormComponent implements StarkSearchFormComponent<any> {
	public searchForm: FormGroup = new FormGroup({});
	public workingCopyChanged: EventEmitter<any> = new EventEmitter();

	public createSearchForm(_searchCriteria: any): FormGroup {
		return this.searchForm;
	}

	public resetSearchForm(_searchCriteria: any): void {
		/*noop*/
	}
}

@Component({
	selector: "host-component",
	template: `
		<stark-generic-search>
			<search-form-component #searchForm></search-form-component>
		</stark-generic-search>
	`
})
class TestHostComponent {}

@Component({
	selector: "bad-host-component",
	template: `
		<stark-generic-search> </stark-generic-search>
	`
})
class BadTestHostComponent extends TestHostComponent {}

describe("GenericSearchComponent", () => {
	let hostFixture: ComponentFixture<TestHostComponent>;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			imports: [
				CommonModule,
				FormsModule,
				ReactiveFormsModule,
				MatButtonModule,
				MatIconModule,
				MatTooltipModule,
				StarkActionBarModule,
				BrowserAnimationsModule,
				NoopAnimationsModule,
				TranslateModule.forRoot()
			],
			declarations: [StarkGenericSearchComponent, TestSearchFormComponent, TestHostComponent, BadTestHostComponent],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }]
		}).compileComponents();
	}));

	it("should throw error because `searchFormComponent` is not included", () => {
		hostFixture = TestBed.createComponent(BadTestHostComponent);
		expect(() => hostFixture.detectChanges()).toThrowError("StarkGenericSearchComponent: the searchForm content child is required.");
	});

	it("should not throw error because `searchFormComponent` is included", () => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		expect(() => hostFixture.detectChanges()).not.toThrowError();
	});

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostFixture.detectChanges();
	});
});
