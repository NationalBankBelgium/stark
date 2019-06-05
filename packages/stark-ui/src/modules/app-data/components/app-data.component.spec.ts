/* tslint:disable:completed-docs no-life-cycle-call */
import { StarkAppDataComponent } from "./app-data.component";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";

// tslint:disable:no-big-function no-identical-functions
describe("AppDataComponent", () => {
	let component: StarkAppDataComponent;
	let fixture: ComponentFixture<StarkAppDataComponent>;

	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkAppDataComponent],
			imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslateModule.forRoot()],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger }, TranslateService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StarkAppDataComponent);
		component = fixture.componentInstance;

		spyOn(component, "removeWindowClickHandler").and.callThrough();
		spyOn(component, "attachWindowClickHandler").and.callThrough();
		spyOn(window, "addEventListener").and.callThrough();
		spyOn(window, "removeEventListener").and.callThrough();
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(fixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});
	});

	describe("OnInit", () => {
		it("OnInit", () => {
			component.ngOnInit();

			expect(component.isDetailHidden).toBe(true);
		});
	});

	describe("ToggleDetail", () => {
		it("should toggle the isDetailHidden boolean property in dropdown mode.", () => {
			component.mode = "dropdown";

			expect(component.isDetailHidden).toBe(true);
			component.toggleDetail();
			expect(component.isDetailHidden).toBe(false);
			component.toggleDetail();
			expect(component.isDetailHidden).toBe(true);
		});

		it("should toggle the isDetailHidden boolean property in menu mode.", () => {
			component.mode = "menu";
			expect(component.isDetailHidden).toBe(true);
			component.toggleDetail();
			expect(component.isDetailHidden).toBe(false);
			component.toggleDetail();
			expect(component.isDetailHidden).toBe(true);
		});

		it("should toggle the isDetailHidden boolean property in default mode.", () => {
			component.mode = undefined;
			expect(component.isDetailHidden).toBe(true);
			component.toggleDetail();
			expect(component.isDetailHidden).toBe(false);
			component.toggleDetail();
			expect(component.isDetailHidden).toBe(true);
		});
	});

	describe("ngOnDestroy", () => {
		it("should call windowClickHandlerMethod", () => {
			component.ngOnDestroy();
			expect(component.removeWindowClickHandler).toHaveBeenCalledTimes(1);
		});
	});

	describe("attachWindowClickHandler", () => {
		it("should add a clickHandler event to the windows", () => {
			component.attachWindowClickHandler();
			expect(window.addEventListener).toHaveBeenCalledTimes(1);
		});
	});

	describe("removeWindowClickHandler", () => {
		it("should remove the clickHandler event from the windows if the clickHandler has been defined", () => {
			component.attachWindowClickHandler();
			component.removeWindowClickHandler();
			expect(window.removeEventListener).toHaveBeenCalledTimes(1);
			expect(component.windowClickHandler).toBeUndefined();
		});

		it("should not remove the clickHandler event from the windows if the clickHandler has not been defined", () => {
			component.windowClickHandler = undefined;
			component.removeWindowClickHandler();
			expect(window.removeEventListener).not.toHaveBeenCalled();
		});
	});
});
