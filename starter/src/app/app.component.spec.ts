/* eslint-disable @angular-eslint/no-lifecycle-call */
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { STARK_APP_SIDEBAR_SERVICE } from "@nationalbankbelgium/stark-ui";
import { MockStarkAppSidebarService } from "@nationalbankbelgium/stark-ui/testing";
import { AppComponent } from "./app.component";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import Spy = jasmine.Spy;

describe(`App`, () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	/**
	 * async beforeEach
	 */
	beforeEach(waitForAsync(() => {
		return (
			TestBed.configureTestingModule({
				declarations: [AppComponent],
				imports: [TranslateModule.forRoot()],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
					{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService },
					{ provide: STARK_APP_SIDEBAR_SERVICE, useValue: new MockStarkAppSidebarService() },
					TranslateService
				]
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
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;

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
