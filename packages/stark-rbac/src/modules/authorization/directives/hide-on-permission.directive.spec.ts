/* tslint:disable:completed-docs*/
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkRBACDirectivePermission } from "./permission.intf";
import { StarkHideOnPermissionDirective } from "./hide-on-permission.directive";
import { STARK_RBAC_AUTHORIZATION_SERVICE } from "../services";
import { MockStarkRBACAuthorizationService } from "../testing/authorization.mock";

describe("StarkHideOnPermissionDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let hostComponent: TestComponent;
	const hideOnPermission: StarkRBACDirectivePermission = {
		roles: ["admin", "manager"]
	};

	@Component({
		selector: "test-component",
		template: getTemplate("*starkHideOnPermission='hideOnPermission'")
	})
	class TestComponent {
		public hideOnPermission: StarkRBACDirectivePermission = hideOnPermission;
	}

	function getTemplate(hideOnPermissionDirective: string): string {
		return `<div><span ${hideOnPermissionDirective}>Protected content</span></div>`;
	}

	function initializeComponentFixture(): void {
		fixture = TestBed.createComponent(TestComponent);
		hostComponent = fixture.componentInstance;
		// trigger initial data binding
		fixture.detectChanges();
	}

	const mockAuthorizationService: MockStarkRBACAuthorizationService = new MockStarkRBACAuthorizationService();

	// Inject module dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [StarkHideOnPermissionDirective, TestComponent],
			imports: [],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_RBAC_AUTHORIZATION_SERVICE, useValue: mockAuthorizationService }
			]
		});
	});

	describe("on initialization", () => {
		it("should throw an error in case there is no configuration object provided", () => {
			const newTemplate: string = getTemplate("*starkHideOnPermission=''");

			TestBed.overrideTemplate(TestComponent, newTemplate);

			// compile template and css
			TestBed.compileComponents().catch(() => fail("Component compilation failed"));

			expect(() => initializeComponentFixture()).toThrowError(/must contain 'roles'/);
		});

		/* tslint:disable-next-line:no-identical-functions */
		it("should throw an error in case the given configuration object has no 'roles' property defined", () => {
			const newTemplate: string = getTemplate("*starkHideOnPermission='{}'");

			TestBed.overrideTemplate(TestComponent, newTemplate);

			// compile template and css
			TestBed.compileComponents().catch(() => fail("Component compilation failed"));

			expect(() => initializeComponentFixture()).toThrowError(/must contain 'roles'/);
		});
	});

	describe("authorization", () => {
		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should NOT render the protected content ONLY in case the user HAS any of the specified roles", () => {
			mockAuthorizationService.hasAnyRole.and.returnValue(true);
			hostComponent.hideOnPermission = { ...hideOnPermission }; // set a new instance to trigger change detection in the directive
			fixture.detectChanges();

			let spanElement: NodeListOf<HTMLElement> = fixture.debugElement.nativeElement.querySelectorAll("span");
			expect(spanElement.length).toBe(0);

			mockAuthorizationService.hasAnyRole.and.returnValue(false);
			hostComponent.hideOnPermission = { ...hideOnPermission }; // set a new instance to trigger change detection in the directive
			fixture.detectChanges();

			spanElement = fixture.debugElement.nativeElement.querySelectorAll("span");
			expect(spanElement.length).toBe(1);
			expect(spanElement[0].textContent).toContain("Protected content");
		});
	});
});
