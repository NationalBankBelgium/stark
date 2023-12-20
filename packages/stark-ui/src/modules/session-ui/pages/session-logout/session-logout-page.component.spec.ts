import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { STARK_APP_CONFIG, STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkApplicationConfig } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppLogoModule } from "@nationalbankbelgium/stark-ui/src/modules/app-logo";
import { StarkSessionCardComponent } from "../../components/session-card/session-card.component";
import { StarkSessionLogoutPageComponent } from "./session-logout-page.component";

describe("SessionLogoutPageComponent", () => {
	let component: StarkSessionLogoutPageComponent;
	let fixture: ComponentFixture<StarkSessionLogoutPageComponent>;

	const mockStarkAppConfig: Partial<StarkApplicationConfig> = {
		baseUrl: "base-url"
	};

	beforeEach(waitForAsync(() => {
		const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();

		return TestBed.configureTestingModule({
			declarations: [StarkSessionCardComponent, StarkSessionLogoutPageComponent],
			imports: [CommonModule, MatCardModule, StarkAppLogoModule, TranslateModule.forRoot()],
			providers: [
				{ provide: STARK_ROUTING_SERVICE, useValue: MockStarkRoutingService }, // needed by AppLogo component
				{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger },
				{ provide: STARK_APP_CONFIG, useValue: mockStarkAppConfig }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StarkSessionLogoutPageComponent);
		component = fixture.componentInstance;
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(fixture).toBeDefined();
			expect(component).toBeDefined();
			expect(component.appConfig).not.toBeNull();
			expect(component.appConfig).toBeDefined();
			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});
	});

	describe("logon", () => {
		it("should open url", () => {
			spyOn(window, "open");
			component.logon();
			expect(window.open).toHaveBeenCalledTimes(1);
			expect(window.open).toHaveBeenCalledWith("base-url", "_self");
		});
	});
});
