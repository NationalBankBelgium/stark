/* tslint:disable:completed-docs component-max-inline-declarations */
import { Component, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { HAMMER_LOADER } from "@angular/platform-browser";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { StarkActionBarComponent, StarkActionBarComponentMode } from "./action-bar.component";
import { StarkAction } from "./action.intf";
import { StarkActionBarConfig } from "./action-bar-config.intf";
import createSpy = jasmine.createSpy;

describe("ActionBarComponent", () => {
	@Component({
		selector: "host-component",
		template: `
			<stark-action-bar
				[mode]="mode"
				[actionBarId]="actionBarId"
				[actionBarConfig]="actionBarConfig"
				[alternativeActions]="alternativeActions"
			></stark-action-bar>
		`
	})
	class TestHostComponent {
		@ViewChild(StarkActionBarComponent, { static: true })
		public starkActionBar!: StarkActionBarComponent;

		public mode?: StarkActionBarComponentMode;
		public actionBarId?: string;
		public actionBarConfig: StarkActionBarConfig = { actions: [] };
		public alternativeActions?: StarkAction[];
	}

	// IMPORTANT: The official way to test components using ChangeDetectionStrategy.OnPush is to wrap it with a test host component
	// see https://github.com/angular/angular/issues/12313#issuecomment-444623173
	let hostFixture: ComponentFixture<TestHostComponent>;
	let hostComponent: TestHostComponent;
	let component: StarkActionBarComponent;
	const buttonToggleSelector = ".extend-action-bar";

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkActionBarComponent, TestHostComponent],
			imports: [MatButtonModule, MatMenuModule, MatTooltipModule, TranslateModule.forRoot()],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				TranslateService,
				{
					// See https://github.com/NationalBankBelgium/stark/issues/1088
					provide: HAMMER_LOADER,
					useValue: (): Promise<any> => new Subject<any>().toPromise()
				}
			],
			schemas: [NO_ERRORS_SCHEMA] // tells the Angular compiler to ignore unrecognized elements and attributes (svgIcon)
		}).compileComponents();
	}));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		const demoActions: StarkAction[] = [
			{
				id: "userDetailValidate",
				label: "Validate",
				icon: "check",
				actionCall: createSpy("actionCallSpy"),
				isEnabled: false,
				isVisible: true
			},
			{
				id: "userDetailSave",
				label: "Save",
				icon: "content-save",
				actionCall: createSpy("actionCallSpy"),
				isEnabled: true,
				isVisible: true
			}
		];

		hostComponent.actionBarConfig = {
			actions: demoActions,
			isPresent: true
		};
		hostFixture.detectChanges();
		component = hostComponent.starkActionBar;
	});

	describe("@Input() mode", () => {
		it("should have the toggle action bar button visible in full mode", () => {
			hostComponent.mode = "full";
			hostFixture.detectChanges();

			const buttonToggleExtend: HTMLElement = hostFixture.nativeElement.querySelector(buttonToggleSelector);
			expect(buttonToggleExtend).toBeDefined();
		});

		it("should not have the toggle action bar button visible in compact mode", () => {
			hostComponent.mode = "compact";
			hostFixture.detectChanges();

			const buttonToggleExtend: HTMLElement = hostFixture.nativeElement.querySelector(buttonToggleSelector);
			expect(buttonToggleExtend).toBeNull();
		});
	});

	describe("@Input() actionBarId", () => {
		it("should have set the id of the action bar", () => {
			hostComponent.actionBarId = "action-bar-id";
			hostFixture.detectChanges();

			const actionBar: HTMLElement = hostFixture.nativeElement.querySelector("#" + hostComponent.actionBarId);
			expect(actionBar).toBeDefined();
		});
	});

	describe("@Input() actionBarConfig", () => {
		it("should not call the defined action when disabled", () => {
			const menuItem: HTMLElement = hostFixture.nativeElement.querySelector(
				`#${hostComponent.actionBarId}-${hostComponent.actionBarConfig.actions[0].id}`
			);
			menuItem.click();
			expect(hostComponent.actionBarConfig.actions[0].actionCall).not.toHaveBeenCalled();
		});

		it("should call the defined action when enabled", () => {
			const menuItem: HTMLElement = hostFixture.nativeElement.querySelector(
				`#${hostComponent.actionBarId}-${hostComponent.actionBarConfig.actions[1].id}`
			);
			menuItem.click();
			expect(hostComponent.actionBarConfig.actions[1].actionCall).toHaveBeenCalledTimes(1);
		});
	});

	describe("@Input() alternativeActions", () => {
		beforeEach(() => {
			hostComponent.alternativeActions = hostComponent.actionBarConfig.actions;
			hostFixture.detectChanges();
		});

		it("should display", () => {
			const actionBar: HTMLElement = hostFixture.nativeElement.querySelector(".open-alt-actions");
			expect(actionBar).toBeDefined();
		});
	});

	describe("toggle extended action bar", () => {
		it("should toggle the action bar extension", () => {
			hostComponent.mode = "full";
			hostFixture.detectChanges();

			const buttonToggleExtend: HTMLElement = hostFixture.nativeElement.querySelector(buttonToggleSelector);
			spyOn(component, "toggleExtendedActionBar").and.callThrough();
			buttonToggleExtend.click();
			hostFixture.detectChanges();

			expect(component.toggleExtendedActionBar).toHaveBeenCalledTimes(1);
			expect(component.isExtended).toBe(true);
			buttonToggleExtend.click();

			hostFixture.detectChanges();
			expect(component.toggleExtendedActionBar).toHaveBeenCalledTimes(2);
			expect(component.isExtended).toBe(false);
		});
	});
});
