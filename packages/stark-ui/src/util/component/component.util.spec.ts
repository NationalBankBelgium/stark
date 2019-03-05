import { StarkComponentUtil } from "./component.util";
import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

/* tslint:disable:no-big-function completed-docs */
describe("Util: ComponentUtil", () => {
	describe("isInputEnabled", () => {
		it("shouldReturnTrue", () => {
			let result: boolean = StarkComponentUtil.isInputEnabled("");
			expect(result).toBe(true);

			result = StarkComponentUtil.isInputEnabled("true");
			expect(result).toBe(true);

			result = StarkComponentUtil.isInputEnabled(<any>true);
			expect(result).toBe(true);
		});

		it("shouldReturnFalse", () => {
			let result: boolean = StarkComponentUtil.isInputEnabled("false");
			expect(result).toBe(false);

			result = StarkComponentUtil.isInputEnabled(<any>false);
			expect(result).toBe(false);

			/* tslint:disable-next-line:no-undefined-argument */
			result = StarkComponentUtil.isInputEnabled(undefined);
			expect(result).toBe(false);
		});
	});

	describe("isOutputWiredUp", () => {
		let component: TestComponent;

		beforeEach(async(() => {
			return TestBed.configureTestingModule({
				declarations: [TestHostWiredUpComponent, TestHostNotWiredUpComponent, TestComponent]
			}).compileComponents();
		}));

		it("should return TRUE when there are observers on the passed event emitter", () => {
			const hostFixture: ComponentFixture<TestHostWiredUpComponent> = TestBed.createComponent(TestHostWiredUpComponent);
			const hostComponent: TestHostWiredUpComponent = hostFixture.componentInstance;
			hostFixture.detectChanges(); // trigger initial data binding
			component = hostComponent.testComponent;

			expect(StarkComponentUtil.isOutputWiredUp(component.eventEmitter)).toBe(true);
		});

		it("should return FALSE when there is NO observer on the passed event emitter", () => {
			const hostFixture: ComponentFixture<TestHostNotWiredUpComponent> = TestBed.createComponent(TestHostNotWiredUpComponent);
			const hostComponent: TestHostNotWiredUpComponent = hostFixture.componentInstance;
			hostFixture.detectChanges(); // trigger initial data binding

			component = hostComponent.testComponent;

			expect(StarkComponentUtil.isOutputWiredUp(component.eventEmitter)).toBe(false);
		});
	});
});

@Component({
	selector: "test-component",
	template: `
		<span>Test component</span>
	`
})
class TestComponent {
	@Output()
	public eventEmitter: EventEmitter<string> = new EventEmitter<string>();
}

@Component({
	selector: "host-wired-up-component",
	template: `
		<test-component (eventEmitter)="wiredMethod()"></test-component>
	`
})
class TestHostWiredUpComponent {
	@ViewChild(TestComponent)
	public testComponent: TestComponent;

	public wiredMethod(): void {
		console.log("Event emitted !");
	}
}

@Component({
	selector: "host-not-wired-up-component",
	template: `
		<test-component></test-component>
	`
})
class TestHostNotWiredUpComponent {
	@ViewChild(TestComponent)
	public testComponent: TestComponent;
}
