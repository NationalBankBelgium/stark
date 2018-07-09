import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DemoComponent } from "./demo.component";
import { SharedModule } from "../shared/shared.module";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";

describe("DemoComponent", () => {
	let component: DemoComponent;
	let fixture: ComponentFixture<DemoComponent>;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [DemoComponent],
			imports: [HttpClientModule, SharedModule],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DemoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
