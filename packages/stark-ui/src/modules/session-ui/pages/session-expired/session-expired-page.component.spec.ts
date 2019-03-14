/* tslint:disable:completed-docs */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { STARK_APP_CONFIG, STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE,StarkApplicationConfig } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService,MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppLogoModule } from "@nationalbankbelgium/stark-ui";
import { StarkSessionCardComponent } from "../../components/session-card/session-card.component";
import { StarkSessionExpiredPageComponent } from "./session-expired-page.component";

describe("SessionExpiredPageComponent", () => {
	let component: StarkSessionExpiredPageComponent;
	let fixture: ComponentFixture<StarkSessionExpiredPageComponent>;

	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();
	const mockStarkAppConfig: Partial<StarkApplicationConfig> = {
		baseUrl: "base-url"
	};

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkSessionCardComponent, StarkSessionExpiredPageComponent],
			imports: [CommonModule, MatButtonModule, MatCardModule, StarkAppLogoModule, TranslateModule.forRoot(), StarkAppLogoModule],
			providers: [
				{ provide: STARK_ROUTING_SERVICE, useValue: MockStarkRoutingService },
				{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger },
				{ provide: STARK_APP_CONFIG, useValue: mockStarkAppConfig }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StarkSessionExpiredPageComponent);
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

	describe("reload", () => {
		it("should open url", () => {
			spyOn(window, "open");
			component.reload();
			expect(window.open).toHaveBeenCalledTimes(1);
			expect(window.open).toHaveBeenCalledWith("base-url", "_self");
		});
	});
});
