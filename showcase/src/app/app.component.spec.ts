/* tslint:disable:completed-docs*/
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

/**
 * Load the implementations that should be tested
 */
import { AppComponent } from "./app.component";
import { AppState } from "./app.service";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import Spy = jasmine.Spy;

describe(`App`, () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	/**
	 * async beforeEach
	 */
	beforeEach(async(() => {
		return (
			TestBed.configureTestingModule({
				declarations: [AppComponent],
				imports: [TranslateModule.forRoot()],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }, AppState, TranslateService]
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
