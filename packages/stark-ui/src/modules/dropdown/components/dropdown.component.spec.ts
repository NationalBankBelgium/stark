/* eslint-disable @angular-eslint/component-max-inline-declarations, @angular-eslint/no-lifecycle-call */
import { Component, DebugElement, ViewChild } from "@angular/core";
import { UntypedFormControl, ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { MatLegacyOptionModule as MatOptionModule } from "@angular/material/legacy-core";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { StarkDropdownComponent } from "./dropdown.component";
import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { OverlayContainer } from "@angular/cdk/overlay";
import { Observer } from "rxjs";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("DropdownComponent", () => {
	@Component({
		selector: `host-ng-control-component`,
		template: `
			<stark-dropdown
				[dropdownId]="dropdownId"
				[formControl]="formControl"
				[multiSelect]="multiSelect"
				[optionIdProperty]="optionIdProperty"
				[optionLabelProperty]="optionLabelProperty"
				[options]="options"
				[placeholder]="placeholder"
				[required]="required"
				(selectionChanged)="selectionChanged($event)"
			>
			</stark-dropdown>
		`
	})
	class TestHostNgControlComponent {
		@ViewChild(StarkDropdownComponent, { static: true })
		public dropdownComponent!: StarkDropdownComponent;

		public dropdownId?: string;
		public formControl = new UntypedFormControl();
		// public header?: string;
		public multiSelect?: boolean;
		public optionIdProperty?: string;
		public optionLabelProperty?: string;
		public options: any[] = [];
		public placeholder?: string;
		public selectionChanged = (_value: any | any[]): void => {
			/* noop*/
		};
		public required?: boolean;
	}

	@Component({
		selector: `host-component`,
		template: `
			<stark-dropdown
				[dropdownId]="dropdownId"
				[disabled]="disabled"
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
	class TestHostValueComponent {
		@ViewChild(StarkDropdownComponent, { static: true })
		public dropdownComponent!: StarkDropdownComponent;

		public dropdownId?: string;
		// public header?: string;
		public disabled?: boolean;
		public multiSelect?: boolean;
		public optionIdProperty?: string;
		public optionLabelProperty?: string;
		public options?: any[];
		public placeholder?: string;
		public value: any | any[];
		public selectionChanged = (_value: any | any[]): void => {
			/* noop*/
		};
		public required?: boolean;
	}

	@Component({
		selector: `host-component`,
		template: `
			<stark-dropdown
				[dropdownId]="dropdownId"
				[disabled]="disabled"
				[multiSelect]="multiSelect"
				[optionIdProperty]="optionIdProperty"
				[optionLabelProperty]="optionLabelProperty"
				[options]="options"
				[placeholder]="placeholder"
				[required]="required"
			>
			</stark-dropdown>
		`
	})
	class TestHostComponent {
		@ViewChild(StarkDropdownComponent, { static: true })
		public dropdownComponent!: StarkDropdownComponent;
		public dropdownId?: string;
		// public header?: string;
		public disabled?: boolean;
		public multiSelect?: boolean;
		public optionIdProperty?: string;
		public optionLabelProperty?: string;
		public options: any[] = [];
		public placeholder?: string;
		public required?: boolean;
	}

	let component: StarkDropdownComponent;

	let overlayContainer: OverlayContainer;
	let overlayContainerElement: HTMLElement;

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
	const dropdownPlaceholder = "dropdown placeholder";
	const dropdownValue = "dropdownValue";
	const dropdownId = "dropdownId";
	const dropdownOnChange = (): string => "dummyDropdownOnChange";
	const dropdownOptionIdProperty = "id";
	const dropdownOptionLabelProperty = "label";

	const matSelectSelector = "mat-select";
	const matOptionSelector = ".mat-option";
	const matOptionTextSelector = ".mat-option-text";
	const matSelectTagSelector = "<mat-select";

	const reflectIdAttr = "ng-reflect-id";
	const reflectPlaceholderAttr = "ng-reflect-placeholder";
	const reflectValueAttr = "ng-reflect-value";

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			imports: [CommonModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, TranslateModule.forRoot(), NoopAnimationsModule],
			declarations: [StarkDropdownComponent, TestHostComponent, TestHostValueComponent, TestHostNgControlComponent],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }, TranslateService]
		}).compileComponents()));

	beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
		overlayContainer = oc;
		overlayContainerElement = oc.getContainerElement();
	}));

	afterEach(() => {
		overlayContainer.ngOnDestroy();
	});

	function openMatSelect(hostFixture: ComponentFixture<any>): void {
		const trigger: HTMLElement = hostFixture.debugElement.query(By.css(".mat-select-trigger")).nativeElement;
		trigger.click();
		hostFixture.detectChanges();
	}

	function assertMatSelectValue(hostFixture: ComponentFixture<any>, value: any): void {
		const dropdownComponent: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
		expect(hostFixture.nativeElement.innerHTML).toContain(matSelectTagSelector);
		const dropdownElement: HTMLElement = dropdownComponent.nativeElement.querySelector(matSelectSelector);
		expect(dropdownElement.getAttribute(reflectValueAttr)).toBe(String(value));
		const dropdownSelectedValue: HTMLElement | null = dropdownElement.querySelector(".mat-select-value");
		expect(dropdownSelectedValue).toBeDefined();
		if (dropdownSelectedValue) {
			expect(dropdownSelectedValue.innerHTML).toContain(String(value));
		}
	}

	describe("default", () => {
		let hostComponent: TestHostComponent;
		let hostFixture: ComponentFixture<TestHostComponent>;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
			component = hostComponent.dropdownComponent;

			hostComponent.dropdownId = dropdownId;
			hostComponent.options = simpleOptions;
			hostComponent.placeholder = dropdownPlaceholder;

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
				expect(component.dropdownId).toBe(<any>hostComponent.dropdownId);
				expect(component.selectionChanged).toBeDefined();
				expect(component.multiSelect).toBe(!!hostComponent.multiSelect);
				expect(component.options).toBe(hostComponent.options);
				expect(component.placeholder).toBe(<any>hostComponent.placeholder);
				expect(component.disabled).toBeUndefined();
				expect(component.required).toBe(!!hostComponent.required);
			});

			it("should render the appropriate content", () => {
				const dropdownComponent: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
				expect(dropdownComponent.nativeElement.getAttribute(reflectValueAttr)).toBeNull();
				expect(hostFixture.nativeElement.innerHTML).toContain(matSelectTagSelector);
				const dropdownElement: HTMLElement = dropdownComponent.nativeElement.querySelector(matSelectSelector);
				expect(dropdownElement.getAttribute(reflectValueAttr)).toBeNull();
				expect(dropdownElement.getAttribute(reflectPlaceholderAttr)).toBe(dropdownPlaceholder);
				expect(dropdownElement.getAttribute(reflectIdAttr)).toBe(dropdownId);
			});
		});

		describe("on change", () => {
			describe("required", () => {
				it("should set the right value to the mat-select when 'required' changes", () => {
					hostComponent.required = true;
					hostFixture.detectChanges();
					const selectElement: HTMLElement = hostFixture.nativeElement.querySelector(matSelectSelector);
					expect(selectElement.outerHTML).toMatch(/ng-reflect-required="true"/);

					hostComponent.required = false;
					hostFixture.detectChanges();
					expect(selectElement.outerHTML).toMatch(/ng-reflect-required="false"/);
				});
			});

			describe("disabled", () => {
				it("should set the right value to the mat-select when 'disabled' changes", () => {
					hostComponent.disabled = true;
					hostFixture.detectChanges();
					const selectElement: HTMLElement = hostFixture.nativeElement.querySelector(matSelectSelector);
					expect(selectElement.outerHTML).toMatch(/ng-reflect-disabled="true"/);

					hostComponent.disabled = false;
					hostFixture.detectChanges();
					expect(selectElement.outerHTML).toMatch(/ng-reflect-disabled="false"/g);
				});
			});

			describe("multiSelect", () => {
				it("should set the right value to multiSelect when 'multiSelect' changes", () => {
					hostComponent.multiSelect = true;
					hostFixture.detectChanges();
					expect(component.multiSelect).toBe(true);

					hostComponent.multiSelect = <any>"true";
					hostFixture.detectChanges();
					expect(component.multiSelect).toBe(true);

					hostComponent.multiSelect = <any>"";
					hostFixture.detectChanges();
					expect(component.multiSelect).toBe(true);

					hostComponent.multiSelect = undefined;
					hostFixture.detectChanges();
					expect(component.multiSelect).toBe(false);

					hostComponent.multiSelect = false;
					hostFixture.detectChanges();
					expect(component.multiSelect).toBe(false);

					hostComponent.multiSelect = <any>"false";
					hostFixture.detectChanges();
					expect(component.multiSelect).toBe(false);
				});
			});
		});

		describe("rendering 'options' in 'mat-option' when 'open mat-select'", () => {
			it("should render the right values when 'options' is an array of simple types", () => {
				hostComponent.options = simpleOptions;
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(matOptionSelector);
				expect(optionElements.length).toBe(simpleOptions.length);

				for (let index = 0; index < optionElements.length; index++) {
					const option: Element = optionElements[index];
					const optionText: Element = <Element>option.querySelector(matOptionTextSelector);
					expect(optionText.textContent).toContain(simpleOptions[index]);
				}
			});

			it("should render the right values when 'options' is an array of complex types", () => {
				hostComponent.options = complexOptions;
				hostComponent.optionIdProperty = dropdownOptionIdProperty;
				hostComponent.optionLabelProperty = dropdownOptionLabelProperty;
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(matOptionSelector);
				expect(optionElements.length).toBe(complexOptions.length);

				for (let index = 0; index < optionElements.length; index++) {
					const option: Element = optionElements[index];
					const optionText: Element = <Element>option.querySelector(matOptionTextSelector);
					expect(optionText.textContent).toContain(complexOptions[index][dropdownOptionLabelProperty]);
				}
			});
		});

		describe("should render checkboxes in 'mat-option' based on 'multiSelect' value", () => {
			const checkboxSelector = ".mat-option .mat-pseudo-checkbox";

			it("should display a checkbox for every option in the dropdown when multiSelect is set to 'true'", () => {
				hostComponent.multiSelect = true;
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionCheckboxElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(checkboxSelector);
				expect(optionCheckboxElements.length).toBe(hostComponent.options.length);
			});

			it("should display a checkbox for every option in the dropdown when multiSelect has no value defined", () => {
				hostComponent.multiSelect = <any>"";
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionCheckboxElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(checkboxSelector);
				expect(optionCheckboxElements.length).toBe(hostComponent.options.length);
			});

			it("should NOT render the checkboxes if multiSelect is to any value other than 'true'", () => {
				hostComponent.multiSelect = <any>"false";
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionCheckboxElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(checkboxSelector);
				expect(optionCheckboxElements.length).toBe(0);
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

	describe("using value + selectionChanged", () => {
		let hostComponent: TestHostValueComponent;
		let hostFixture: ComponentFixture<TestHostValueComponent>;

		// Inject the mocked services
		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostValueComponent);
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
			it("should have right inputs set", () => {
				expect(component.selectionChanged).toBeDefined();
				expect(component.disabled).toBeUndefined();
				expect(component.value).toBe(hostComponent.value);
			});

			it("should render the appropriate content", () => {
				const dropdownComponent: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
				expect(dropdownComponent.nativeElement.getAttribute(reflectValueAttr)).toBe(dropdownValue); // ngModel is replaced by Angular to "ng-reflect-value"
				expect(hostFixture.nativeElement.innerHTML).toContain(matSelectTagSelector);
				const dropdownElement: HTMLElement = dropdownComponent.nativeElement.querySelector(matSelectSelector);
				expect(dropdownElement.getAttribute(reflectValueAttr)).toBe(dropdownValue);
				expect(dropdownElement.getAttribute(reflectPlaceholderAttr)).toBe(dropdownPlaceholder);
				expect(dropdownElement.getAttribute(reflectIdAttr)).toBe(dropdownId);
			});
		});

		describe("on change", () => {
			describe("value", () => {
				it("should set the right value to the formControl when 'value' changes", () => {
					hostComponent.value = "dummy-value";
					hostFixture.detectChanges();
					const selectElement: HTMLElement = hostFixture.nativeElement.querySelector(matSelectSelector);
					expect(selectElement.outerHTML).toMatch(/ng-reflect-value="dummy-value"/);
				});
			});
		});

		describe("on select option", () => {
			it("should emit the right value to 'selectionChanged' when 'simple types' options", fakeAsync(() => {
				hostComponent.options = simpleOptions;
				hostComponent.optionIdProperty = undefined;
				hostComponent.optionLabelProperty = undefined;
				hostComponent.value = undefined;
				spyOn(hostComponent, "selectionChanged");
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(matOptionSelector);
				expect(optionElements.length).toBe(simpleOptions.length);
				(<HTMLElement>optionElements[2]).click();
				hostFixture.detectChanges();
				tick();

				expect(hostComponent.selectionChanged).toHaveBeenCalledTimes(1);
				expect(hostComponent.selectionChanged).toHaveBeenCalledWith(simpleOptions[2]);
				assertMatSelectValue(hostFixture, simpleOptions[2]);

				hostFixture.destroy();
				flush();
			}));

			it("should emit the right value to 'selectionChanged' when 'complex types' options", fakeAsync(() => {
				hostComponent.options = complexOptions;
				hostComponent.optionIdProperty = dropdownOptionIdProperty;
				hostComponent.optionLabelProperty = dropdownOptionLabelProperty;
				hostComponent.value = undefined;
				spyOn(hostComponent, "selectionChanged");
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(matOptionSelector);
				expect(optionElements.length).toBe(complexOptions.length);
				(<HTMLElement>optionElements[2]).click();
				hostFixture.detectChanges();
				tick();

				expect(hostComponent.selectionChanged).toHaveBeenCalledTimes(1);
				expect(hostComponent.selectionChanged).toHaveBeenCalledWith(complexOptions[2][dropdownOptionIdProperty]);
				assertMatSelectValue(hostFixture, complexOptions[2][dropdownOptionIdProperty]);

				hostFixture.destroy();
				flush();
			}));
		});
	});

	describe("using reactive forms", () => {
		let hostComponent: TestHostNgControlComponent;
		let hostFixture: ComponentFixture<TestHostNgControlComponent>;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostNgControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
			component = hostComponent.dropdownComponent;

			hostComponent.dropdownId = dropdownId;
			hostComponent.selectionChanged = dropdownOnChange;
			hostComponent.options = simpleOptions;
			hostComponent.placeholder = dropdownPlaceholder;
			hostComponent.formControl.setValue(dropdownValue);

			hostFixture.detectChanges();
		});

		describe("on initialization", () => {
			it("should have right inputs set", () => {
				expect(component.disabled).toBe(hostComponent.formControl.disabled);
				expect(component.required).toBe(!!hostComponent.required);
				expect(component.value).toBe(hostComponent.formControl.value);
			});

			it("should render the appropriate content", () => {
				const dropdownComponent: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
				expect(dropdownComponent.nativeElement.getAttribute("ng-reflect-form")).toBe("[object Object]"); // formControl is replaced by Angular to "ng-reflect-form"
				expect(hostFixture.nativeElement.innerHTML).toContain(matSelectTagSelector);
				const dropdownElement: HTMLElement = dropdownComponent.nativeElement.querySelector(matSelectSelector);
				expect(dropdownElement.getAttribute(reflectValueAttr)).toBe(dropdownValue);
				expect(dropdownElement.getAttribute(reflectPlaceholderAttr)).toBe(dropdownPlaceholder);
				expect(dropdownElement.getAttribute(reflectIdAttr)).toBe(dropdownId);
			});
		});

		describe("on change", () => {
			describe("required", () => {
				it("should change the validators of the 'formControl' when 'required' changes", () => {
					hostComponent.required = true;
					hostComponent.formControl.reset();
					hostFixture.detectChanges();

					expect(hostComponent.formControl.validator).not.toBeNull();
					// Solution found on Angular GitHub issue: https://github.com/angular/angular/issues/13461
					expect(hostComponent.formControl.errors).toEqual({ required: true });

					hostComponent.required = false;
					hostFixture.detectChanges();
					expect(hostComponent.formControl.validator).not.toBeNull();
					expect(hostComponent.formControl.errors).toBeNull();
				});
			});

			describe("formControl.disabled", () => {
				it("should set the right value to the mat-select when 'formControl.disabled' changes", () => {
					hostComponent.formControl.disable();
					hostFixture.detectChanges();
					const selectElement: HTMLElement = hostFixture.nativeElement.querySelector(matSelectSelector);
					expect(selectElement.outerHTML).toMatch(/ng-reflect-disabled="true"/);

					hostComponent.formControl.enable();
					hostFixture.detectChanges();
					expect(selectElement.outerHTML).toMatch(/ng-reflect-disabled="false"/);
				});

				it("shouldn't trigger a 'valueChange' event when the formControl is disabled or enabled with emitEvent set to false", () => {
					const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

					hostComponent.formControl.valueChanges.subscribe(mockObserver);

					hostComponent.formControl.disable({ emitEvent: false });
					hostFixture.detectChanges();

					expect(component.disabled).toBe(true);

					hostComponent.formControl.enable({ emitEvent: false });
					hostFixture.detectChanges();

					expect(component.disabled).toBe(false);
					expect(mockObserver.next).not.toHaveBeenCalled(); // because the 'emitEvent' is false
					expect(mockObserver.error).not.toHaveBeenCalled();
					expect(mockObserver.complete).not.toHaveBeenCalled();
				});

				it("should trigger a 'valueChange' event when the formControl is disabled or enabled with emitEvent set to true", () => {
					const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

					hostComponent.formControl.valueChanges.subscribe(mockObserver);

					hostComponent.formControl.disable(); // 'emitEvent' true by default
					hostFixture.detectChanges();

					expect(component.disabled).toBe(true);
					expect(mockObserver.next).toHaveBeenCalledTimes(1);
					expect(mockObserver.error).not.toHaveBeenCalled();
					expect(mockObserver.complete).not.toHaveBeenCalled();
					mockObserver.next.calls.reset();

					hostComponent.formControl.enable(); // 'emitEvent' true by default
					hostFixture.detectChanges();

					expect(component.disabled).toBe(false);
					expect(mockObserver.next).toHaveBeenCalledTimes(1);
					expect(mockObserver.error).not.toHaveBeenCalled();
					expect(mockObserver.complete).not.toHaveBeenCalled();
				});
			});

			describe("formControl.value", () => {
				it("should set the right value to the formControl when 'value' changes", () => {
					hostComponent.formControl.setValue("dummy-value");
					hostFixture.detectChanges();

					const selectElement: HTMLElement = hostFixture.nativeElement.querySelector(matSelectSelector);
					expect(selectElement.outerHTML).toMatch(/ng-reflect-value="dummy-value"/);
				});
			});
		});

		describe("on select option", () => {
			it("should emit the right value to 'formControl' when 'simple types' options", fakeAsync(() => {
				const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

				hostComponent.options = simpleOptions;
				hostComponent.optionIdProperty = undefined;
				hostComponent.optionLabelProperty = undefined;
				hostComponent.formControl.valueChanges.subscribe(mockObserver);
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(matOptionSelector);
				expect(optionElements.length).toBe(simpleOptions.length);
				(<HTMLElement>optionElements[1]).click();
				hostFixture.detectChanges();
				tick();

				expect(hostComponent.formControl.value).toEqual(simpleOptions[1]);
				expect(mockObserver.next).toHaveBeenCalled();
				expect(mockObserver.next).toHaveBeenCalledWith(simpleOptions[1]);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
				assertMatSelectValue(hostFixture, simpleOptions[1]);

				hostFixture.destroy();
				flush();
			}));

			it("should emit the right value to 'formControl' when 'complex types' options", fakeAsync(() => {
				const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

				hostComponent.options = complexOptions;
				hostComponent.optionIdProperty = dropdownOptionIdProperty;
				hostComponent.optionLabelProperty = dropdownOptionLabelProperty;
				hostComponent.formControl.valueChanges.subscribe(mockObserver);
				hostFixture.detectChanges();

				openMatSelect(hostFixture);
				const optionElements: NodeListOf<Element> = overlayContainerElement.querySelectorAll(matOptionSelector);
				expect(optionElements.length).toBe(complexOptions.length);
				(<HTMLElement>optionElements[2]).click();
				hostFixture.detectChanges();
				tick();

				expect(hostComponent.formControl.value).toEqual(complexOptions[2][dropdownOptionIdProperty]);
				expect(mockObserver.next).toHaveBeenCalled();
				expect(mockObserver.next).toHaveBeenCalledWith(complexOptions[2][dropdownOptionIdProperty]);
				expect(mockObserver.error).not.toHaveBeenCalled();
				expect(mockObserver.complete).not.toHaveBeenCalled();
				assertMatSelectValue(hostFixture, complexOptions[2][dropdownOptionIdProperty]);

				hostFixture.destroy();
				flush();
			}));
		});
	});
	// FIXME re-enable those tests as soon as a solution to replace the md-select-header as been found: https://github.com/angular/material2/pull/7835
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
});
