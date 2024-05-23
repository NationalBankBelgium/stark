import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
/* stark-core imports */
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
/* stark-ui imports */
import { StarkPrettyPrintComponent } from "./pretty-print.component";
import { STARK_PRETTY_PRINT_SERVICE, StarkPrettyPrintService, StarkPrettyPrintServiceImpl } from "../services";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { Observer, of, throwError } from "rxjs";

/**
 *
 * To be able to test changes to the input fields, the Pretty-Print component is hosted inside the TestComponentHost class.
 */
@Component({
	selector: `host-component`,
	template: ` <stark-pretty-print [data]="data" [format]="format" [enableHighlighting]="enableHighlighting"></stark-pretty-print> `
})
class TestHostComponent {
	@ViewChild(StarkPrettyPrintComponent, { static: true })
	public prettyPrintComponent!: StarkPrettyPrintComponent;

	public data?: string;
	public format?: string;
	public enableHighlighting?: boolean;
}

describe("PrettyPrintComponent", () => {
	let component: StarkPrettyPrintComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;
	let mockPrettyPrintService: SpyObj<StarkPrettyPrintService>;

	const rawHtmlData: string = [
		"<!DOCTYPE html><html><head>",
		"<style>body {background-color: powderblue;}h1{color: blue;}flashy{color: red;}</style>",
		"</head><body><h1>This is a heading</h1>",
		'<p class="flashy">This is a flashy paragraph.</p>',
		"</body></html>"
	].join("");

	const formattedHtmlData: string = [
		"<!doctype html>",
		"<html>",
		"  <head>",
		"    <style>",
		"      body {",
		"        background-color: powderblue;",
		"      }",
		"      h1 {",
		"        color: blue;",
		"      }",
		"      flashy {",
		"        color: red;",
		"      }",
		"    </style>",
		"  </head>",
		"  <body>",
		"    <h1>This is a heading</h1>",
		'    <p class="flashy">This is a flashy paragraph.</p>',
		"  </body>",
		"</html>",
		""
	].join("\n");

	const rawAngularHtmlData: string = [
		"<!DOCTYPE html><html><head>",
		"<style>body {background-color: powderblue;}h1{color: blue;}flashy{color: red;}</style>",
		"</head><body><h1>This is a {{heading|uppercase}}</h1>",
		'<p class="flashy">This is a flashy paragraph.</p>',
		'<button class="dummy-class" [class.active]="isActive" color="primary" (click)=triggerAction($event)>Click me</button>',
		"</body></html>"
	].join("");

	const formattedAngularHtmlData: string = [
		"<!doctype html>",
		"<html>",
		"  <head>",
		"    <style>",
		"      body {",
		"        background-color: powderblue;",
		"      }",
		"      h1 {",
		"        color: blue;",
		"      }",
		"      flashy {",
		"        color: red;",
		"      }",
		"    </style>",
		"  </head>",
		"  <body>",
		"    <h1>This is a {{ heading | uppercase }}</h1>",
		'    <p class="flashy">This is a flashy paragraph.</p>',
		"    <button",
		'      class="dummy-class"',
		'      [class.active]="isActive"',
		'      color="primary"',
		'      (click)="triggerAction($event)"',
		"    >",
		"      Click me",
		"    </button>",
		"  </body>",
		"</html>",
		""
	].join("\n");

	beforeEach(waitForAsync(() => {
		mockPrettyPrintService = createSpyObj<StarkPrettyPrintService>("prettyPrintService", ["format"]);
		return TestBed.configureTestingModule({
			declarations: [StarkPrettyPrintComponent, TestHostComponent],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_PRETTY_PRINT_SERVICE, useValue: mockPrettyPrintService }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostFixture.detectChanges(); // trigger initial data binding

		component = hostComponent.prettyPrintComponent;
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});

		it("should NOT have any inputs set", () => {
			expect(component.data).toBeUndefined();
			expect(component.format).toBeUndefined();
			expect(component.enableHighlighting).toBeUndefined();
		});

		it("should NOT have called the service", () => {
			expect(mockPrettyPrintService.format).not.toHaveBeenCalled();
		});
	});

	describe("call the PrettyPrintService", () => {
		it("should NOT call the service when not format input are set", waitForAsync(() => {
			hostComponent.data = rawHtmlData;
			hostFixture.detectChanges();

			expect(component.data).toBe(rawHtmlData);
			expect(mockPrettyPrintService.format).not.toHaveBeenCalled();
		}));

		it("should NOT call the service when not data input are set", () => {
			hostComponent.format = "html";
			hostFixture.detectChanges();

			expect(component.format).toBe("html");
			expect(mockPrettyPrintService.format).not.toHaveBeenCalled();
		});

		it("should call the service when input are set", () => {
			mockPrettyPrintService.format.and.returnValue(of(formattedHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostFixture.detectChanges();

			expect(mockPrettyPrintService.format).toHaveBeenCalledTimes(1);
			expect(mockPrettyPrintService.format).toHaveBeenCalledWith(rawHtmlData, "html", false);
		});

		it("should call the service when input date change", () => {
			mockPrettyPrintService.format.and.returnValue(of(formattedHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostFixture.detectChanges();

			expect(mockPrettyPrintService.format).toHaveBeenCalledTimes(1);
			expect(mockPrettyPrintService.format).toHaveBeenCalledWith(rawHtmlData, "html", false);

			mockPrettyPrintService.format.calls.reset();
			mockPrettyPrintService.format.and.returnValue(of(formattedAngularHtmlData));

			hostComponent.data = rawAngularHtmlData;
			hostFixture.detectChanges();

			expect(mockPrettyPrintService.format).toHaveBeenCalledTimes(1);
			expect(mockPrettyPrintService.format).toHaveBeenCalledWith(rawAngularHtmlData, "html", false);
		});

		it("should call the service when input format change", () => {
			mockPrettyPrintService.format.and.returnValue(of(formattedHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostFixture.detectChanges();

			expect(mockPrettyPrintService.format).toHaveBeenCalledTimes(1);
			expect(mockPrettyPrintService.format).toHaveBeenCalledWith(rawHtmlData, "html", false);

			mockPrettyPrintService.format.calls.reset();

			hostComponent.format = "xml";
			hostFixture.detectChanges();

			expect(mockPrettyPrintService.format).toHaveBeenCalledTimes(1);
			expect(mockPrettyPrintService.format).toHaveBeenCalledWith(rawHtmlData, "xml", false);
		});

		it("should call the service when input enableHighlighting change", () => {
			mockPrettyPrintService.format.and.returnValue(of(formattedHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostFixture.detectChanges();

			expect(mockPrettyPrintService.format).toHaveBeenCalledTimes(1);
			expect(mockPrettyPrintService.format).toHaveBeenCalledWith(rawHtmlData, "html", false);

			mockPrettyPrintService.format.calls.reset();

			hostComponent.enableHighlighting = true;
			hostFixture.detectChanges();

			expect(mockPrettyPrintService.format).toHaveBeenCalledTimes(1);
			expect(mockPrettyPrintService.format).toHaveBeenCalledWith(rawHtmlData, "html", true);
		});
	});

	describe("handle observable subscription next", () => {
		it("should call ChangeDetectorRef.detectChanges", () => {
			const changeDetectorRef = hostFixture.debugElement.injector.get(ChangeDetectorRef);
			// spy on private class prototype
			const detectChangesSpy = spyOn(changeDetectorRef.constructor.prototype, "detectChanges");

			mockPrettyPrintService.format.and.returnValue(of(formattedHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostFixture.detectChanges();

			expect(detectChangesSpy).toHaveBeenCalledTimes(1);
		});

		it("should set the prettyString with correct values and bind to the correct html tag", () => {
			mockPrettyPrintService.format.and.returnValue(of(formattedHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostFixture.detectChanges();

			let formattedData = component.prettyString;

			const regExLessThan = /&lt;/gi;
			const regExGreaterThan = /&gt;/gi;
			const regExQuote = /&quot;/gi;

			formattedData = formattedData.replace(regExLessThan, "<").replace(regExGreaterThan, ">").replace(regExQuote, '"');

			expect(formattedData).toBe(formattedHtmlData);
			expect(component.highlightingEnabled).toBe(false);

			const preElement: HTMLPreElement | null = <HTMLPreElement>hostFixture.nativeElement.querySelector("pre");
			expect(preElement).toBeDefined();
			expect(preElement.innerHTML).toContain("&lt;!doctype html&gt");
			expect(preElement.innerHTML).toContain('&lt;p class="flashy"&gt');
			expect(preElement.innerHTML).toContain("&lt;style&gt;");
			expect(preElement.innerHTML).toContain("&lt;/style&gt;");
		});

		it("should highlight when success and enableHighlighting", fakeAsync(() => {
			const prettyPrintService: StarkPrettyPrintService = new StarkPrettyPrintServiceImpl(component.logger);
			const mockFormatObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			prettyPrintService.format(rawHtmlData, "html", true).subscribe(mockFormatObserver);
			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const highlightedHtmlData = <string>mockFormatObserver.next.calls.first().args[0];

			mockPrettyPrintService.format.and.returnValue(of(highlightedHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostComponent.enableHighlighting = true;
			hostFixture.detectChanges();

			expect(component.highlightingEnabled).toBe(true);

			const preElement: HTMLPreElement | null = <HTMLPreElement>hostFixture.nativeElement.querySelector("pre");
			expect(preElement).toBeDefined();
			expect(preElement.innerHTML).toContain('<code class="language-markup">');
			expect(preElement.innerHTML).toContain('<span class="token punctuation">&lt;</span>p</span>');
			expect(preElement.innerHTML).toContain('<span class="token punctuation">&lt;</span>head</span>');
			expect(preElement.innerHTML).toContain('<span class="token attr-name">class</span>');
		}));
	});

	describe("handle observable subscription error", () => {
		it("should call ChangeDetectorRef.detectChanges", () => {
			const changeDetectorRef = hostFixture.debugElement.injector.get(ChangeDetectorRef);
			// spy on private class prototype
			const detectChangesSpy = spyOn(changeDetectorRef.constructor.prototype, "detectChanges");

			mockPrettyPrintService.format.and.returnValue(throwError(rawHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostFixture.detectChanges();

			expect(detectChangesSpy).toHaveBeenCalledTimes(1);
		});

		it("should not highlight when error", () => {
			mockPrettyPrintService.format.and.returnValue(throwError(rawHtmlData));

			hostComponent.format = "html";
			hostComponent.data = rawHtmlData;
			hostComponent.enableHighlighting = true;
			hostFixture.detectChanges();

			let formattedData = component.prettyString;

			expect(formattedData).toBe(rawHtmlData);
			expect(component.highlightingEnabled).toBe(false);
		});
	});
});
