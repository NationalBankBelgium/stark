/* tslint:disable:completed-docs*/
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkRBACDirectivePermission } from "./permission.intf";
import { StarkShowOnPermissionDirective } from "./show-on-permission.directive";
import { STARK_RBAC_AUTHORIZATION_SERVICE } from "../services";
import { MockStarkRBACAuthorizationService } from "@nationalbankbelgium/stark-rbac/testing";

describe("StarkShowOnPermissionDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let hostComponent: TestComponent;
	const showOnPermission: StarkRBACDirectivePermission = {
		roles: ["admin", "manager"]
	};

	@Component({
		selector: "test-component",
		template: getTemplate("*starkShowOnPermission='showOnPermission'")
	})
	class TestComponent {
		public showOnPermission: StarkRBACDirectivePermission = showOnPermission;
	}

	function getTemplate(showOnPermissionDirective: string): string {
		return `<div><span ${showOnPermissionDirective}>Protected content</span></div>`;
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
			declarations: [StarkShowOnPermissionDirective, TestComponent],
			imports: [],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_RBAC_AUTHORIZATION_SERVICE, useValue: mockAuthorizationService }
			]
		});
	});

	describe("on initialization", () => {
		it("should throw an error in case there is no configuration object provided", () => {
			const newTemplate: string = getTemplate("*starkShowOnPermission=''");

			TestBed.overrideTemplate(TestComponent, newTemplate);

			// compile template and css
			TestBed.compileComponents().catch(() => fail("Component compilation failed"));

			expect(() => initializeComponentFixture()).toThrowError(/must contain 'roles'/);
		});

		/* tslint:disable-next-line:no-identical-functions */
		it("should throw an error in case the given configuration object has no 'roles' property defined", () => {
			const newTemplate: string = getTemplate("*starkShowOnPermission='{}'");

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

		it("should render the protected content ONLY in case the user HAS any of the specified roles", () => {
			mockAuthorizationService.hasAnyRole.and.returnValue(true);
			hostComponent.showOnPermission = { ...showOnPermission }; // set a new instance to trigger change detection in the directive
			fixture.detectChanges();

			let spanElement: NodeListOf<HTMLElement> = fixture.debugElement.nativeElement.querySelectorAll("span");
			expect(spanElement.length).toBe(1);
			expect(spanElement[0].textContent).toContain("Protected content");

			mockAuthorizationService.hasAnyRole.and.returnValue(false);
			hostComponent.showOnPermission = { ...showOnPermission }; // set a new instance to trigger change detection in the directive
			fixture.detectChanges();

			spanElement = fixture.debugElement.nativeElement.querySelectorAll("span");
			expect(spanElement.length).toBe(0);
		});
	});
});
