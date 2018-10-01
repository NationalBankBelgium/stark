/* tslint:disable:completed-docs */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	STARK_USER_SERVICE,
	STARK_SESSION_SERVICE,
	StarkUser,
	StarkUserService,
	StarkRoutingService,
	StarkSessionService
} from "@nationalbankbelgium/stark-core";
import {
	MockStarkLoggingService,
	MockStarkRoutingService,
	MockStarkUserService,
	MockStarkSessionService
} from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { of, throwError } from "rxjs";
import { StarkPreloadingPageComponent } from "./preloading-page.component";
import Spy = jasmine.Spy;

describe("PreloadingPageComponent", () => {
	let component: StarkPreloadingPageComponent;
	let fixture: ComponentFixture<StarkPreloadingPageComponent>;

	const mockUser: StarkUser = { firstName: "John", lastName: "Doe", username: "jdoe", uuid: "mock-uuid", roles: [] };
	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();
	const mockUserService: StarkUserService = new MockStarkUserService();
	const mockSessionService: StarkSessionService = new MockStarkSessionService();
	const mockRoutingService: StarkRoutingService = new MockStarkRoutingService();

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkPreloadingPageComponent],
			imports: [CommonModule, MatButtonModule, TranslateModule.forRoot()],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger },
				{ provide: STARK_ROUTING_SERVICE, useValue: mockRoutingService },
				{ provide: STARK_USER_SERVICE, useValue: mockUserService },
				{ provide: STARK_SESSION_SERVICE, useValue: mockSessionService }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StarkPreloadingPageComponent);
		component = fixture.componentInstance;

		(<Spy>mockUserService.fetchUserProfile).calls.reset();
		(<Spy>mockSessionService.login).calls.reset();
		(<Spy>mockRoutingService.navigateTo).calls.reset();
		(<Spy>mockRoutingService.navigateToHome).calls.reset();
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(fixture).toBeDefined();
			expect(component).toBeDefined();
			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
			expect(component.routingService).not.toBeNull();
			expect(component.routingService).toBeDefined();
			expect(component.userService).not.toBeNull();
			expect(component.userService).toBeDefined();
		});
	});

	describe("ngOnInit", () => {
		it("should log the user in automatically after fetching the user profile successfully", fakeAsync(() => {
			(<Spy>mockUserService.fetchUserProfile).and.returnValue(of(mockUser));
			component.loginDelay = 1; // override login delay to make unit tests faster

			component.ngOnInit();
			tick(1);

			expect(mockUserService.fetchUserProfile).toHaveBeenCalledTimes(1);
			expect(mockSessionService.login).toHaveBeenCalledTimes(1);
			expect(mockSessionService.login).toHaveBeenCalledWith(mockUser);
			expect(component.userFetchingFailed).toBeFalsy();
		}));

		it("should navigate to home or the target state if defined after fetching the user profile successfully", fakeAsync(() => {
			(<Spy>mockUserService.fetchUserProfile).and.returnValue(of(mockUser));
			component.loginDelay = 1; // override login delay to make unit tests faster

			component.ngOnInit();
			tick(1);

			expect(mockRoutingService.navigateToHome).toHaveBeenCalledTimes(1);
			expect(mockRoutingService.navigateTo).not.toHaveBeenCalled();

			(<Spy>mockRoutingService.navigateToHome).calls.reset();
			component.targetState = "dummy state";
			component.targetStateParams = { someParam: "dummy param" };
			component.ngOnInit();
			tick(1);

			expect(mockRoutingService.navigateToHome).not.toHaveBeenCalled();
			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
			expect(mockRoutingService.navigateTo).toHaveBeenCalledWith(component.targetState, component.targetStateParams);
		}));

		it("should NOT do anything when the user profile cannot be fetched", fakeAsync(() => {
			(<Spy>mockUserService.fetchUserProfile).and.returnValue(throwError("could not fetch user profile"));
			component.loginDelay = 1; // override login delay to make unit tests faster

			component.ngOnInit();
			tick(1);

			expect(mockRoutingService.navigateToHome).not.toHaveBeenCalled();
			expect(mockRoutingService.navigateTo).not.toHaveBeenCalled();
			expect(component.userFetchingFailed).toBe(true);
		}));
	});

	describe("reload", () => {
		it("should call reload method of routingService", () => {
			component.reload();
			expect(component.routingService.reload).toHaveBeenCalledTimes(1);
		});
	});
});
