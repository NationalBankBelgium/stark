/* tslint:disable:completed-docs max-inline-declarations no-commented-code no-big-function no-identical-functions */
import { Component, DebugElement, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { StarkDropdownComponent } from "./dropdown.component";
import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import Spy = jasmine.Spy;

@Component({
	selector: `host-component`,
	template: `
		<stark-dropdown
			[dropdownId]="dropdownId"
			[dropdownFormControl]="formControl"
			[isDisabled]="disabled"
			[multiSelect]="multiSelect"
			[optionIdProperty]="optionIdProperty"
			[optionLabelProperty]="optionLabelProperty"
			[options]="options"
			[placeholder]="placeholder"
			[required]="required"
			(selectionChanged)="selectionChanged($event)"
			[value]="value"
		>
		</stark-dropdown>
	`
})
class TestHostComponent {
	@ViewChild(StarkDropdownComponent)
	public dropdownComponent: StarkDropdownComponent;
	public dropdownId: string;
	public formControl: FormControl;
	// public header?: string;
	public disabled?: boolean;
	public multiSelect?: string;
	public optionIdProperty?: string;
	public optionLabelProperty?: string;
	public options: any[];
	public placeholder: string;
	public value: any | any[];
	public selectionChanged: Function;
	public required?: boolean;
}

describe("DropdownComponent", () => {
	let component: StarkDropdownComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;

	const simpleOptions: string[] = ["1", "2", "3"];
	const complexOptions: object[] = [
		{
			id: 0,
			label: "label0"
		},
		{
			id: 1,
			label: "label1"
		},
		{
			id: 2,
			label: "label2"
		}
	];
	const dropdownPlaceholder: string = "dropdown placeholder";
	const dropdownValue: string = "dropdownValue";
	const dropdownId: string = "dropdownId";
	const dropdownOnChange: any = () => {
		return "dummyDropdownOnChange";
	};
	const dropdownFormControl: FormControl = new FormControl("dropdownFormControl");
	const dropdownOptionIdProperty: string = "id";
	const dropdownOptionLabelProperty: string = "label";
	const matSelectSelector: string = "mat-select";

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			imports: [CommonModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, TranslateModule.forRoot(), NoopAnimationsModule],
			declarations: [StarkDropdownComponent, TestHostComponent],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }, TranslateService],
			schemas: [NO_ERRORS_SCHEMA] // tells the Angular compiler to ignore unrecognized elements and attributes (selectionChange)
		}).compileComponents();
	}));

	describe("Using value + selectionChanged", () => {
		// Inject the mocked services
		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
			component = hostComponent.dropdownComponent;

			hostComponent.dropdownId = dropdownId;
			hostComponent.selectionChanged = dropdownOnChange;
			hostComponent.options = simpleOptions;
			hostComponent.placeholder = dropdownPlaceholder;
			hostComponent.value = dropdownValue;

			hostFixture.detectChanges();
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(hostFixture).toBeDefined();
				expect(component).toBeDefined();
				expect(component.logger).not.toBeNull();
				expect(component.logger).toBeDefined();
			});

			it("should NOT have any inputs set", () => {
				expect(component.dropdownId).toBe(hostComponent.dropdownId);
				expect(component.selectionChanged).toBeDefined();
				expect(component.multiSelect).toBe(hostComponent.multiSelect);
				expect(component.options).toBe(hostComponent.options);
				expect(component.placeholder).toBe(hostComponent.placeholder);
				expect(component.required).toBe(<boolean>hostComponent.required);
				expect(component.value).toBe(hostComponent.value);
			});
		});

		describe("on change", () => {
			describe("required", () => {
				it("should set the right value to the formControl when 'required' changes", () => {
					hostComponent.required = true;
					hostFixture.detectChanges();
					expect(component.formControl.validator !== null).toBe(true);
					// Solution found on Angular GitHub issue: https://github.com/angular/angular/issues/13461
					// tslint:disable-next-line:no-null-keyword
					expect(new FormControl(undefined, component.formControl.validator).errors).toEqual({ required: true });

					hostComponent.required = false;
					hostFixture.detectChanges();
					// tslint:disable-next-line:no-null-keyword
					expect(component.formControl.validator).toBe(<any>null);
				});
			});

			describe("isDisabled", () => {
				it("should set the right value to the formControl when 'isDisabled' changes", () => {
					hostComponent.disabled = true;
					hostFixture.detectChanges();
					expect(component.formControl.disabled).toBe(true);

					hostComponent.disabled = false;
					hostFixture.detectChanges();
					expect(component.formControl.disabled).toBe(false);
				});

				it("should log a warning if 'dropdownFormControl' and 'isDisabled' are set", () => {
					hostComponent.formControl = dropdownFormControl;
					hostComponent.disabled = true;
					hostFixture.detectChanges();
					expect(component.logger.warn).toHaveBeenCalledTimes(1);
					expect((<Spy>component.logger.warn).calls.mostRecent().args[0]).toMatch(/When dropdownFormControl is set/);
				});
			});

			describe("value", () => {
				it("should set the right value to the formControl when 'isDisabled' changes", () => {
					hostComponent.disabled = true;
					hostFixture.detectChanges();
					expect(component.formControl.disabled).toBe(true);

					hostComponent.disabled = false;
					hostFixture.detectChanges();
					expect(component.formControl.disabled).toBe(false);
				});

				it("should log a warning if 'dropdownFormControl' and 'isDisabled' are set", () => {
					hostComponent.formControl = dropdownFormControl;
					hostComponent.disabled = true;
					hostFixture.detectChanges();
					expect(component.logger.warn).toHaveBeenCalledTimes(1);
					expect((<Spy>component.logger.warn).calls.mostRecent().args[0]).toMatch(/When dropdownFormControl is set/);
				});
			});

			describe("multiSelect", () => {
				it("should set the right value to isMultiSelectEnabled when 'multiSelect' changes", () => {
					hostComponent.value = [];
					hostComponent.multiSelect = "true";
					hostFixture.detectChanges();
					expect(component.isMultiSelectEnabled).toBe(true);

					hostComponent.multiSelect = "";
					hostFixture.detectChanges();
					expect(component.isMultiSelectEnabled).toBe(true);

					hostComponent.multiSelect = undefined;
					hostFixture.detectChanges();
					expect(component.isMultiSelectEnabled).toBe(false);
				});
			});

			describe("optionIdProperty & optionLabelProperty", () => {
				it("should set the right value to optionsAreSimpleTypes when 'optionIdProperty' or 'optionLabelProperty' change", () => {
					hostComponent.optionIdProperty = dropdownOptionIdProperty;
					hostFixture.detectChanges();
					expect(component.optionsAreSimpleTypes).toBe(true);

					hostComponent.optionLabelProperty = dropdownOptionLabelProperty;
					hostComponent.options = complexOptions;
					hostFixture.detectChanges();
					expect(component.optionsAreSimpleTypes).toBe(false);

					hostComponent.optionLabelProperty = undefined;
					hostFixture.detectChanges();
					expect(component.optionsAreSimpleTypes).toBe(true);
				});
			});
		});

		describe("options defined as array of simple types", () => {
			it("should render the appropriate content", () => {
				const dropdownComponent: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
				expect(dropdownComponent.nativeElement.getAttribute("ng-reflect-value")).toBe(dropdownValue); // ngModel is replaced by Angular to "ng-reflect-value"
				expect(hostFixture.nativeElement.innerHTML).toContain("<mat-select");
				const dropdownElement: HTMLElement = dropdownComponent.nativeElement.querySelector(matSelectSelector);
				expect(dropdownElement.getAttribute("ng-reflect-placeholder")).toBe(dropdownPlaceholder);
				expect(dropdownElement.getAttribute("ng-reflect-id")).toBe(dropdownId);

				// FIXME find a solution to make those tests work again
				// Angular now does not diplay the option of mat-select in the html file, which means that we have no solution to test those options

				// expect(dropdownElement.html()).toContain("<md-option");
				// const optionElements: IAugmentedJQuery = UnitTestingUtils.getElementsByTagName(element, "md-option");
				// expect(optionElements.length).toBe(3);
				//
				// for (let index: number = 0; index < optionElements.length; index++) {
				// 	const option: IAugmentedJQuery = angular.element(optionElements[index]);
				// 	expect(option.attr("ng-value")).toBe("$ctrl.optionsAreSimpleTypes ? option : option[$ctrl.optionIdProperty]");
				// 	expect(option.attr("value")).toBe(String(index + 1));
				// 	expect(option.text().trim()).toBe(String(index + 1));
				// }
			});
		});
	});

	describe("Using reactive forms", () => {
		// Inject the mocked services
		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
			component = hostComponent.dropdownComponent;

			hostComponent.dropdownId = dropdownId;
			hostComponent.options = simpleOptions;
			hostComponent.placeholder = dropdownPlaceholder;
			hostComponent.formControl = dropdownFormControl;

			hostFixture.detectChanges();
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(hostFixture).toBeDefined();
				expect(component).toBeDefined();
				expect(component.logger).not.toBeNull();
				expect(component.logger).toBeDefined();
			});

			it("should NOT have any inputs set", () => {
				expect(component.dropdownId).toBe(hostComponent.dropdownId);
				expect(component.selectionChanged).toBeDefined();
				expect(component.multiSelect).toBe(hostComponent.multiSelect);
				expect(component.options).toBe(hostComponent.options);
				expect(component.placeholder).toBe(hostComponent.placeholder);
				expect(component.required).toBe(<boolean>hostComponent.required);
				expect(component.dropdownFormControl).toBe(hostComponent.formControl);
			});
		});

		describe("on change", () => {
			it("should assign right value to isMultiSelectEnabled when multiSelect changes", () => {
				hostComponent.multiSelect = "true";
				hostFixture.detectChanges();
				expect(component.isMultiSelectEnabled).toBe(true);

				hostComponent.multiSelect = "false";
				hostFixture.detectChanges();
				expect(component.isMultiSelectEnabled).toBe(false);
			});
		});

		describe("options defined as array of simple types", () => {
			it("should render the appropriate content", () => {
				const dropdownComponent: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
				expect(dropdownComponent.nativeElement.getAttribute("ng-reflect-dropdown-form-control")).toBe("[object Object]"); // ngModel is replaced by Angular to "ng-reflect-value"
				expect(hostFixture.nativeElement.innerHTML).toContain("<mat-select");
				const dropdownElement: HTMLElement = dropdownComponent.nativeElement.querySelector(matSelectSelector);
				expect(dropdownElement.getAttribute("ng-reflect-placeholder")).toBe(dropdownPlaceholder);
				expect(dropdownElement.getAttribute("ng-reflect-id")).toBe(dropdownId);

				// FIXME find a solution to make those tests work again
				// Angular now does not diplay the option of mat-select in the html file, which means that we have no solution to test those options

				// expect(dropdownElement.html()).toContain("<md-option");
				// const optionElements: IAugmentedJQuery = UnitTestingUtils.getElementsByTagName(element, "md-option");
				// expect(optionElements.length).toBe(3);
				//
				// for (let index: number = 0; index < optionElements.length; index++) {
				// 	const option: IAugmentedJQuery = angular.element(optionElements[index]);
				// 	expect(option.attr("ng-value")).toBe("$ctrl.optionsAreSimpleTypes ? option : option[$ctrl.optionIdProperty]");
				// 	expect(option.attr("value")).toBe(String(index + 1));
				// 	expect(option.text().trim()).toBe(String(index + 1));
				// }
			});
		});

		describe("setDefaultBlank", () => {
			it("should set 'defaultBlank' to false when it is not set or it is set to false", () => {
				component.defaultBlank = false;
				component.setDefaultBlank();
				expect(component.defaultBlank).toBe(false);

				component.defaultBlank = <any>undefined;
				component.setDefaultBlank();
				expect(component.defaultBlank).toBe(false);
			});

			it("should set 'defaultBlank' to false when 'required' is true", () => {
				component.defaultBlank = <any>undefined;
				component.required = true;
				component.setDefaultBlank();
				expect(component.defaultBlank).toBe(false);
			});
		});

		// describe("multiSelect", () => {
		// 	const checkboxSelector: string = ".mat-select-panel mat-option mat-pseudo-checkbox";
		//
		// 	it("should display a checkbox for every option in the dropdown when multiSelect is set to 'true'", () => {
		// 		hostComponent.multiSelect = "true";
		// 		hostFixture.detectChanges();

		// const dropdownElement: HTMLElement = getMatSelectNativeElement();
		// const dropdownElement: HTMLElement = hostFixture.nativeElement.querySelector(matSelectSelector);
		// dropdownElement.click();
		// hostFixture.detectChanges();
		// console.log(dropdownElement);
		// (<HTMLElement>hostFixture.nativeElement.querySelector(matSelectSelector)).click();
		// (<HTMLElement>hostFixture.nativeElement.querySelector("mat-select")).click();

		// console.log(hostFixture.nativeElement);
		// const optionCheckboxElements: DebugElement[] = hostFixture.nativeElement.querySelectorAll(checkboxSelector);
		// expect(optionCheckboxElements.length).toBe(3);
		//
		// hostFixture.whenStable().then(() => {
		// 	console.log(hostFixture.nativeElement);
		// 	const optionCheckboxElements: DebugElement[] = hostFixture.nativeElement.querySelectorAll(checkboxSelector);
		// 	expect(optionCheckboxElements.length).toBe(3);
		// 	// done();
		// });
		// });

		// 	it("should display a checkbox for every option in the dropdown when multiSelect has no value defined", (done: DoneFn) => {
		// 		hostComponent.multiSelect = undefined;
		// 		hostFixture.detectChanges();
		//
		// 		// const dropdownElement: HTMLElement = getMatSelectNativeElement();
		// 		// dropdownElement.click();
		// 		(<HTMLElement>hostFixture.nativeElement.querySelector(matSelectSelector)).click();
		// 		// (<HTMLElement>hostFixture.nativeElement.querySelector(matSelectSelector)).click();
		//
		// 		hostFixture.whenStable().then(() => {
		// 			const optionCheckboxElements: DebugElement[] = hostFixture.nativeElement.querySelectorAll(checkboxSelector);
		// 			console.log(optionCheckboxElements);
		// 			expect(optionCheckboxElements.length).toBe(component.options.length);
		// 			done();
		// 		});
		// 	});
		//
		// 	it("should NOT render the checkboxes if multiSelect is to any value other than 'true'", (done: DoneFn) => {
		// 		hostComponent.multiSelect = "whatever";
		// 		hostFixture.detectChanges();
		//
		// 		// const dropdownElement: HTMLElement = getMatSelectNativeElement();
		// 		// dropdownElement.click();
		// 		(<HTMLElement>hostFixture.nativeElement.querySelector(matSelectSelector)).click();
		// 		// (<HTMLElement>hostFixture.nativeElement.querySelector("mat-select")).click();
		//
		// 		hostFixture.whenStable().then(() => {
		// 			const optionCheckboxElements: DebugElement[] = hostFixture.nativeElement.querySelectorAll(checkboxSelector);
		// 			expect(optionCheckboxElements.length).toBe(0);
		// 			done();
		// 		});
		// 	});
		// });
	});

	// FIXME Reenable this test
	// the only thing changing from this test to the previous one are the options.
	// We should fix that to make both test more relevant.

	// describe("options defined as array of objects", () => {
	// 	it("should render the appropriate content", () => {
	// 		expect(component).toContain("<label");
	// 		const labelElement: HTMLElement = hostFixture.debugElement.nativeElement.querySelector("label");
	// 		expect(labelElement.tagName).toBe(dropdownLabel);
	// 		expect(component).toContain("<mat-select");
	// 		const dropdownElement: HTMLElement = hostFixture.debugElement.nativeElement.querySelector("mat-select");
	// 		expect(dropdownElement.getAttribute("id")).toBe(dropdownId);
	// 		expect(dropdownElement.getAttribute("[(ngModel)]")).toBe("value");
	// 		expect(dropdownElement.getAttribute("placeholder")).toBe(dropdownPlaceholder);
	// 		const headerElement: HTMLElement = hostFixture.debugElement.nativeElement.querySelector("mat-select-header");
	// 		expect(headerElement.tagName.trim()).toBe(dropdownHeader);

	// expect(dropdownElement.html()).toContain("<md-option");
	// const optionElements: IAugmentedJQuery = UnitTestingUtils.getElementsByTagName(element, "md-option");
	// expect(optionElements.length).toBe(3);
	//
	// for (let index: number = 0; index < optionElements.length; index++) {
	// 	const option: IAugmentedJQuery = angular.element(optionElements[index]);
	// 	expect(option.attr("ng-value")).toBe("$ctrl.optionsAreSimpleTypes ? option : option[$ctrl.optionIdProperty]");
	// 	expect(option.attr("value")).toBe("option_" + (index + 1));
	// 	expect(option.text().trim()).toBe("this is option " + (index + 1));
	// }
	// 	});
	// });

	// FIXME reenable those tests as soon as a solution to replace the md-select-header as been found: https://github.com/angular/material2/pull/7835
	//
	// describe("header", () => {
	// 	it("should be added to the DOM when header is defined", () => {
	// 		expect(dropdownHeader.length).toBe(1);
	// 	});
	//
	// 	it("should not be added to the DOM when header is undefined", () => {
	// 		hostComponent.header = undefined;
	// 		hostFixture.detectChanges();
	// 		expect(dropdownHeader.length).toBe(0);
	// 	});
	//
	// 	it("should not be added to the DOM when header is an empty string", () => {
	// 		hostComponent.header = "";
	// 		hostFixture.detectChanges();
	// 		expect(dropdownHeader.length).toBe(0);
	// 	});
	// });

	// FIXME reenable and adapt those tests once the solution for the option has been found
});
