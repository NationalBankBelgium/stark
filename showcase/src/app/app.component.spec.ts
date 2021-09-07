/* tslint:disable:completed-docs no-lifecycle-call */
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { STARK_APP_SIDEBAR_SERVICE } from "@nationalbankbelgium/stark-ui";
import { MockStarkAppSidebarService } from "@nationalbankbelgium/stark-ui/testing";
import { UIRouterModule } from "@uirouter/angular";
import { AppComponent } from "./app.component";
import {
	STARK_APP_METADATA,
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	STARK_SESSION_SERVICE,
	STARK_USER_SERVICE,
	StarkApplicationMetadata,
	StarkApplicationMetadataImpl,
	StarkLanguages,
	StarkUser
} from "@nationalbankbelgium/stark-core";
import {
	MockStarkLoggingService,
	MockStarkRoutingService,
	MockStarkSessionService,
	MockStarkUserService
} from "@nationalbankbelgium/stark-core/testing";
import { of } from "rxjs";
import Spy = jasmine.Spy;

describe(`App`, () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let appMetadata: StarkApplicationMetadata;
	appMetadata = new StarkApplicationMetadataImpl();
	appMetadata.supportedLanguages = [StarkLanguages.EN_US, StarkLanguages.FR_BE, StarkLanguages.NL_BE];
	const mockUser: StarkUser = {
		uuid: "1",
		username: "username",
		firstName: "firstName",
		lastName: "lastName",
		email: "email",
		phone: "02/221.12.34",
		language: "en",
		selectedLanguage: "en",
		referenceNumber: "12345",
		roles: ["employee"],
		isAnonymous: false
	};
	/**
	 * async beforeEach
	 */
	beforeEach(
		waitForAsync(() => {
			return (
				TestBed.configureTestingModule({
					declarations: [AppComponent],
					imports: [TranslateModule.forRoot(), UIRouterModule.forRoot({ useHash: true })],
					schemas: [NO_ERRORS_SCHEMA],
					providers: [
						{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
						{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService },
						{ provide: STARK_APP_SIDEBAR_SERVICE, useValue: new MockStarkAppSidebarService() },
						{ provide: STARK_USER_SERVICE, useValue: new MockStarkUserService() },
						{ provide: STARK_SESSION_SERVICE, useValue: new MockStarkSessionService() },
						{ provide: STARK_APP_METADATA, useValue: appMetadata },
						TranslateService
					]
				})
					/**
					 * Compile template and css
					 */
					.compileComponents()
			);
		})
	);

	/**
	 * Synchronous beforeEach
	 */
	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;

		(<Spy>component.userService.fetchUserProfile).calls.reset();
		(<Spy>component.userService.fetchUserProfile).and.returnValue(of(mockUser));

		/**
		 * Trigger initial data binding
		 */
		fixture.detectChanges();
	});

	it(`should be readly initialized`, () => {
		expect(fixture).toBeDefined();
		expect(component).toBeDefined();
	});

	it("should log ngOnInit", () => {
		(<Spy>component.logger.debug).calls.reset();
		expect(component.logger.debug).not.toHaveBeenCalled();

		component.ngOnInit();
		expect(component.logger.debug).toHaveBeenCalled();
	});
});
