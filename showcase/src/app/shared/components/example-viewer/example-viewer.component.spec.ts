import { Component, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { HAMMER_LOADER } from "@angular/platform-browser";
import { Observable, of, Subject, throwError } from "rxjs";
import { delay, filter } from "rxjs/operators";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";

import { ExampleFile, ExampleViewerComponent } from "./example-viewer.component";
import { FileService } from "../../services";
import SpyObj = jasmine.SpyObj;
import Spy = jasmine.Spy;

describe("ExampleViewerComponent", () => {
	@Component({
		selector: "host-component",
		template: `
			<example-viewer [id]="id" [extensions]="extensions" [filesPath]="filesPath" [exampleTitle]="exampleTitle"></example-viewer>
		`
	})
	class TestHostComponent {
		@ViewChild(ExampleViewerComponent)
		public exampleViewer!: ExampleViewerComponent;

		public id = "";
		public extensions: string[] = [];
		public filesPath?: string;
		public exampleTitle?: string;
	}

	// IMPORTANT: The official way to test components using ChangeDetectionStrategy.OnPush is to wrap it with a test host component
	// see https://github.com/angular/angular/issues/12313#issuecomment-444623173
	let hostFixture: ComponentFixture<TestHostComponent>;
	let hostComponent: TestHostComponent;
	let component: ExampleViewerComponent;
	let fileService: SpyObj<FileService>;
	let logger: SpyObj<StarkLoggingService>;

	// Router config
	const mockStateName = "mock-state-name";
	const router: MockStarkRoutingService = new MockStarkRoutingService();
	router.getCurrentStateName.and.returnValue(mockStateName);

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [ExampleViewerComponent, TestHostComponent],
			imports: [NoopAnimationsModule, MatButtonModule, MatTabsModule, MatTooltipModule, StarkPrettyPrintModule],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_ROUTING_SERVICE, useValue: router },
				{
					provide: FileService,
					useValue: jasmine.createSpyObj("FileServiceSpy", ["fetchFile"])
				},
				{
					// See https://github.com/NationalBankBelgium/stark/issues/1088
					provide: HAMMER_LOADER,
					useValue: (): Promise<any> => new Subject<any>().toPromise()
				}
			],
			schemas: [NO_ERRORS_SCHEMA] // tells the Angular compiler to ignore unrecognized elements and attributes: mat-icon
		}).compileComponents();
	}));

	beforeEach(() => {
		logger = TestBed.get(STARK_LOGGING_SERVICE);
		fileService = TestBed.get(FileService);
		fileService.fetchFile.and.callFake(() => of("initial dummy file content"));

		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		component = hostComponent.exampleViewer;
		hostFixture.detectChanges(); // trigger initial data binding
	});

	describe("current state", () => {
		it("should be set on init", () => {
			expect(component.exampleState).toBe(mockStateName);
		});
	});

	describe("@Input() exampleTitle", () => {
		it("should change the exampleTitle according to the @Input", () => {
			const h3: HTMLHeadingElement = hostFixture.nativeElement.querySelector("mat-card-header h3");
			hostComponent.exampleTitle = "Test title";
			hostFixture.detectChanges();
			expect(h3.textContent).toContain(hostComponent.exampleTitle);
		});
	});

	describe("@Input() extensions", () => {
		it("should show the tabs when the file exist", (done: DoneFn) => {
			hostComponent.extensions = ["CSS", "JS", "HTML", "SCSS", "TS"];
			hostFixture.detectChanges();

			let button: HTMLButtonElement = hostFixture.nativeElement.querySelector("mat-card-header button");
			button.click();
			let tabs: any[] = hostFixture.nativeElement.querySelectorAll(".mat-tab-labels .mat-tab-label");
			expect(tabs.length).toBe(0);

			fileService.fetchFile.and.callFake(() => {
				fileFetched.next("file has been fetched");
				return of("some file content");
			});

			const fileFetched: Subject<string> = new Subject();
			const allFilesFetched: Observable<string> = fileFetched.asObservable().pipe(
				filter((_value: string, index: number) => index === component.extensions.length - 1),
				delay(10) // we need to give some time until the tabs are refreshed
			);

			allFilesFetched.subscribe(() => {
				hostFixture.detectChanges();

				button = hostFixture.nativeElement.querySelector("mat-card-header button");
				button.click();

				tabs = hostFixture.nativeElement.querySelectorAll(".mat-tab-labels .mat-tab-label");
				expect(tabs.length).toBe(component.extensions.length);
				done();
			});

			component.fetchExampleFiles();
		});
	});

	describe("@Input() id", () => {
		it("should not render an anchor when not set", () => {
			hostComponent.id = "";
			hostFixture.detectChanges();

			const anchorIcon = hostFixture.nativeElement.querySelector("mat-card-title a.anchor-link");
			expect(anchorIcon).toBeNull("anchor link element found.");
		});

		it("should render an anchor when set", () => {
			hostComponent.id = "some-hash";
			hostFixture.detectChanges();

			const anchorIcon = hostFixture.nativeElement.querySelector("mat-card-title a.anchor-link");
			expect(anchorIcon).not.toBeNull("anchor link element not found.");
		});
	});

	describe("fetchExampleFiles()", () => {
		beforeEach(() => {
			spyOn(component, "addExampleFile");
			fileService.fetchFile.calls.reset();
			logger.error.calls.reset();

			component.extensions = ["HTML", "TS", "CSS"];
		});

		it("should not do anything when the file doesn't exist", () => {
			fileService.fetchFile.and.returnValue(throwError("file does not exist"));
			expect(fileService.fetchFile).not.toHaveBeenCalled();
			component.fetchExampleFiles();
			expect(fileService.fetchFile).toHaveBeenCalledTimes(component.extensions.length);
			expect(logger.error).toHaveBeenCalledTimes(component.extensions.length);
			expect(component.addExampleFile).not.toHaveBeenCalled();
		});

		it("should call addExampleFiles() when the file exists passing the data of the file and its metadata", () => {
			fileService.fetchFile.and.returnValue(of("dummy file content"));
			component.fetchExampleFiles();
			expect(fileService.fetchFile).toHaveBeenCalledTimes(component.extensions.length);
			expect(component.addExampleFile).toHaveBeenCalledTimes(component.extensions.length);

			component.extensions.forEach((extension: string, index: number) => {
				const exampleFile: ExampleFile = (<Spy>component.addExampleFile).calls.argsFor(index)[0];
				expect(exampleFile.data).toBeDefined();
				expect(exampleFile.extension).toBe(extension);
				expect(exampleFile.format).toBeDefined();
			});
		});

		it("should call the FileService passing the right url of the file including the base URL if any", () => {
			fileService.fetchFile.and.returnValue(of("dummy file content"));
			component.filesPath = "dummy-example-file";
			component.appBaseHref = "";
			component.fetchExampleFiles();
			expect(fileService.fetchFile).toHaveBeenCalledTimes(component.extensions.length);

			component.extensions.forEach((extension: string, index: number) => {
				const filePath: string = fileService.fetchFile.calls.argsFor(index)[0];
				expect(filePath).toBe(component.examplesFolder + component.filesPath + "." + extension.toLowerCase());
			});

			fileService.fetchFile.calls.reset();
			component.appBaseHref = "mock-bae-href/";
			component.fetchExampleFiles();
			expect(fileService.fetchFile).toHaveBeenCalledTimes(component.extensions.length);

			component.extensions.forEach((extension: string, index: number) => {
				const filePath: string = fileService.fetchFile.calls.argsFor(index)[0];
				expect(filePath).toBe(
					component.appBaseHref + component.examplesFolder + component.filesPath + "." + extension.toLowerCase()
				);
			});
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
