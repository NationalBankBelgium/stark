/*tslint:disable:completed-docs*/
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { MatListModule } from "@angular/material/list";
import { StarkAppMenuComponent } from "./app-menu.component";
import { StarkAppMenuItemComponent } from "./app-menu-item.component";
import { UIRouterModule } from "@uirouter/angular";

describe("StarkAppMenuComponent", () => {
	let component: StarkAppMenuComponent;
	let fixture: ComponentFixture<StarkAppMenuComponent>;

	/**
	 * async beforeEach
	 */
	beforeEach(async(() => {
		return (
			TestBed.configureTestingModule({
				declarations: [StarkAppMenuComponent, StarkAppMenuItemComponent],
				imports: [MatListModule, UIRouterModule],
				providers: [
					{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
					{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService }
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
		fixture = TestBed.createComponent(StarkAppMenuComponent);
		component = fixture.componentInstance;
	});

	describe("sections", () => {
		it("should have a section when menuSections property of parentMenuConfig is set", () => {
			component.parentMenuConfig = {
				menuSections: [
					{
						label: "Section",
						menuGroups: [
							{
								id: "id-item",
								label: "Label",
								isVisible: true,
								isEnabled: true,
								targetState: "test"
							}
						]
					}
				]
			};
			fixture.detectChanges();
			const sectionTitle: HTMLElement = fixture.nativeElement.querySelector(".stark-section-title");
			expect(sectionTitle).toBeDefined();
		});
	});
});
