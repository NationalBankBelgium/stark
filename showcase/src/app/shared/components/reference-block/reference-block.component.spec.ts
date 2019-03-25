import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { ReferenceBlockComponent } from "./reference-block.component";
import { ReferenceLink } from "./reference-link.intf";
import { By } from "@angular/platform-browser";

describe("ReferenceBlockComponent", () => {
	let component: ReferenceBlockComponent;
	const referenceList: ReferenceLink[] = [
		{
			label: "Stark Table component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkTableComponent.html"
		},
		{
			label: "Stark Table - Column component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkTableColumnComponent.html"
		},
		{
			label: "Stark Table - Multisort Dialog component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkTableMultisortDialogComponent.html"
		}
	];
	let fixture: ComponentFixture<ReferenceBlockComponent>;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [ReferenceBlockComponent],
			imports: [TranslateModule.forRoot()],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }],
			schemas: [NO_ERRORS_SCHEMA] // tells the Angular compiler to ignore unrecognized elements and attributes: mat-icon
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReferenceBlockComponent);
		component = fixture.componentInstance;
		component.links = referenceList;
		fixture.detectChanges(); // trigger initial data binding
	});

	it("should render the appropriate content", () => {
		fixture.detectChanges();

		const pathLinks: DebugElement[] = fixture.debugElement.queryAll(By.css("a"));
		expect(pathLinks.length).toBe(3);

		for (let i = 0; i < pathLinks.length; i++) {
			expect(pathLinks[i].nativeElement.innerHTML).toBe(referenceList[i].label);
			expect(pathLinks[i].nativeElement.getAttribute("href")).toBe(referenceList[i].url);
		}
	});
});
