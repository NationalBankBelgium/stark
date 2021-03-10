/* tslint:disable:completed-docs no-identical-functions */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, EventEmitter, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateModule } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkGenericSearchComponent } from "./generic-search.component";
import { StarkSearchFormComponent } from "../../classes";
import { StarkActionBarComponent } from "../../../action-bar/components";

@Component({
	selector: "search-form-component",
	template: ""
})
class TestSearchFormComponent implements StarkSearchFormComponent<any> {
	public searchForm: FormGroup = new FormGroup({});
	public workingCopyChanged = new EventEmitter<any>();

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
	template: ` <stark-generic-search> </stark-generic-search> `
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
				MatMenuModule,
				NoopAnimationsModule,
				TranslateModule.forRoot()
			],
			declarations: [
				StarkActionBarComponent,
				StarkGenericSearchComponent,
				TestSearchFormComponent,
				TestHostComponent,
				BadTestHostComponent
			],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }],
			schemas: [NO_ERRORS_SCHEMA] // to avoid errors due to "mat-icon" and "matTooltip" directives not known (which we don't want to add in these tests)
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
