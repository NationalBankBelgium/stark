import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { async, ComponentFixtureAutoDetect, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule, MatIconModule, MatTabsModule, MatTooltipModule } from "@angular/material";
import * as hljs from "highlight.js";
import { HighlightJsModule, HIGHLIGHT_JS } from "angular-highlight-js";

import { ExampleViewerComponent } from "./example-viewer.component";
import { FileService } from "./file.service";
import { throwError, of } from "rxjs";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import SpyObj = jasmine.SpyObj;

export function highlightJsFactory(): any {
	return hljs;
}
describe("ExampleViewerComponent", () => {
	let component: ExampleViewerComponent;
	let fileService: FileService;
	let fixture: ComponentFixture<ExampleViewerComponent>;
	let logger: SpyObj<StarkLoggingService>;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [ExampleViewerComponent],
			imports: [
				BrowserAnimationsModule,
				HttpClientModule,
				HighlightJsModule.forRoot({
					provide: HIGHLIGHT_JS,
					useFactory: highlightJsFactory
				}),
				MatButtonModule,
				MatIconModule,
				MatTabsModule,
				MatTooltipModule
			],
			providers: [
				{ provide: ComponentFixtureAutoDetect, useValue: true },
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				FileService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		logger = TestBed.get(STARK_LOGGING_SERVICE);
		fixture = TestBed.createComponent(ExampleViewerComponent);
		component = fixture.componentInstance;
		fileService = fixture.debugElement.injector.get<FileService>(FileService as any);
	});

	describe("@Input() title", () => {
		it("should change the title according to the @Input", () => {
			const h2: any = fixture.nativeElement.querySelector(".example-viewer-title-spacer h2");
			component.title = "Test title";
			fixture.detectChanges();
			expect(h2.textContent).toContain(component.title);
		});
	});

	describe("@Input() extensions", () => {
		it("should show the tabs when the file exist", () => {
			spyOn(fileService, "fetchFile").and.returnValue(of("test"));
			component.fetchFiles();
			const button: any = fixture.nativeElement.querySelector(".example-viewer-title button");
			button.click();
			const tabs: any = fixture.nativeElement.querySelectorAll(".mat-tab-labels .mat-tab-label");
			expect(tabs.length).toBe(component.extensions.length);
		});
	});

	describe("fetchFiles()", () => {
		it("should not do anything when the file doesn't exist", () => {
			logger.debug.calls.reset();
			spyOn(component, "addFileContent");
			spyOn(fileService, "fetchFile").and.returnValue(throwError("http failure"));
			component.fetchFiles();
			expect(component.addFileContent).not.toHaveBeenCalled();
			expect(fileService.fetchFile).toHaveBeenCalledTimes(component.extensions.length);
			expect(logger.error).toHaveBeenCalled();
		});

		it("should call the callback when the file exists", () => {
			spyOn(component, "addFileContent");
			spyOn(fileService, "fetchFile").and.returnValue(of("test"));
			component.fetchFiles();
			expect(component.addFileContent).toHaveBeenCalledTimes(component.extensions.length);
			expect(fileService.fetchFile).toHaveBeenCalledTimes(component.extensions.length);
		});
	});

	describe("toggleSourceView()", () => {
		it("should toggle the showSource property", () => {
			component.showSource = true;
			component.toggleSourceView();
			expect(component.showSource).toBe(false);
			component.toggleSourceView();
			expect(component.showSource).toBe(true);
		});
	});
});
