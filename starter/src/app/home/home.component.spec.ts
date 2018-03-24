import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

/**
 * Load the implementations that should be tested.
 */
import { AppState } from "../app.service";
import { HomeComponent } from "./home.component";
import { Title } from "./title";
import { StarkHttpModule } from "@nationalbankbelgium/stark-core";

describe(`Home`, () => {
	let comp: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	/**
	 * async beforeEach.
	 */
	beforeEach(
		async(() => {
			return (
				TestBed.configureTestingModule({
					declarations: [HomeComponent],
					schemas: [NO_ERRORS_SCHEMA],
					imports: [HttpClientTestingModule, StarkHttpModule],
					providers: [AppState, Title]
				})

					/**
					 * Compile template and css.
					 */
					.compileComponents()
			);
		})
	);

	/**
	 * Synchronous beforeEach.
	 */
	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);
		comp = fixture.componentInstance;

		/**
		 * Trigger initial data binding.
		 */
		fixture.detectChanges();
	});

	it("should have default data", () => {
		expect(comp.localState).toEqual({ value: " " });
	});

	it("should have a title", () => {
		expect(!!comp.title).toEqual(true);
	});

	it("should log ngOnInit", () => {
		spyOn(console, "log");
		expect(console.log).not.toHaveBeenCalled();

		comp.ngOnInit();
		expect(console.log).toHaveBeenCalled();
	});
});
