/*tslint:disable:completed-docs*/
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	STARK_SESSION_SERVICE,
	STARK_APP_CONFIG,
	StarkApplicationConfig
} from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService, MockStarkSessionService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppLogoutComponent } from "./app-logout.component";
import { StarkSvgViewBoxModule } from "../../svg-view-box/svg-view-box.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";
import Spy = jasmine.Spy;

describe("AppLogoutComponent", () => {
	let component: StarkAppLogoutComponent;
	let fixture: ComponentFixture<StarkAppLogoutComponent>;

	const mockStarkAppConfig: Partial<StarkApplicationConfig> = {
		homeStateName: "home"
	};

	/**
	 * async beforeEach
	 */
	beforeEach(async(() => {
		return (
			TestBed.configureTestingModule({
				imports: [MatTooltipModule, MatButtonModule, StarkSvgViewBoxModule, TranslateModule.forRoot()],
				declarations: [StarkAppLogoutComponent],
				providers: [
					{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
					{ provide: STARK_SESSION_SERVICE, useValue: new MockStarkSessionService() },
					{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService },
					{ provide: STARK_APP_CONFIG, useValue: mockStarkAppConfig }
				],
				schemas: [NO_ERRORS_SCHEMA] // tells the Angular compiler to ignore unrecognized elements and attributes (svgIcon)
			})
				/**
				 * Compile template and css
				 */
				.compileComponents()
		);
	}));

	/**
	 * Synchronous beforeEach
	 */
	beforeEach(() => {
		fixture = TestBed.createComponent(StarkAppLogoutComponent);
		component = fixture.componentInstance;

		fixture.detectChanges(); // trigger initial data binding
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(fixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
			expect(component.routingService).not.toBeNull();
			expect(component.routingService).toBeDefined();
			expect(component.sessionService).not.toBeNull();
			expect(component.sessionService).toBeDefined();
			expect(component.appConfig).not.toBeNull();
			expect(component.appConfig).toBeDefined();
		});

		it("should have its imput property filled", () => {
			expect(component.icon).not.toBeNull();
			expect(component.icon).toBeDefined();
			expect(component.icon).toBe("power");
		});
	});

	describe("logout()", () => {
		it("should log out the user", () => {
			// routingService.navigateTo is already a Spy
			(<Spy>component.routingService.navigateTo).calls.reset();
			component.logout();
			expect(component.sessionService.logout).toHaveBeenCalledTimes(1);
			expect(component.routingService.navigateTo).toHaveBeenCalledTimes(1);
			expect(component.routingService.navigateTo).toHaveBeenCalledWith(component.appConfig.homeStateName);
		});
	});
});
