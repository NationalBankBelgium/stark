import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkPrettyPrintService } from "@nationalbankbelgium/stark-ui/src/modules/pretty-print/services/pretty-print.service.intf";
import { StarkPrettyPrintServiceImpl } from "@nationalbankbelgium/stark-ui/src/modules/pretty-print/services/pretty-print.service";
import { fakeAsync, tick } from "@angular/core/testing";
import SpyObj = jasmine.SpyObj;
import { Observer } from "rxjs";
import createSpyObj = jasmine.createSpyObj;

describe("PrettyPrintService", () => {
	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();
	let prettyPrintService: StarkPrettyPrintService;
	let mockFormatObserver: SpyObj<Observer<any>>;

	const classTokenSelector = 'class="token selector"';
	const classTokenFunction = 'class="token function"';
	const classTokenKeyword = 'class="token keyword"';
	const classTokenProperty = 'class="token property"';
	const marginBottom = "margin-bottom";

	beforeEach(() => {
		prettyPrintService = new StarkPrettyPrintServiceImpl(mockLogger);
		mockFormatObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
	});

	describe("xml", () => {
		const rawXmlData: string = [
			'<menu id="file" value="File"><menuitem value="New" onclick="CreateNewDoc()" />',
			'<menuitem value="Open" onclick="OpenDoc()" />',
			'<menuitem value="Close" onclick="CloseDoc()" /></menu>'
		].join("");

		const formattedXmlData: string = [
			'<menu id="file" value="File">',
			'  <menuitem value="New" onclick="CreateNewDoc()" />',
			'  <menuitem value="Open" onclick="OpenDoc()" />',
			'  <menuitem value="Close" onclick="CloseDoc()" />',
			"</menu>",
			""
		].join("\n");

		it("should nicely format raw XML data", fakeAsync(() => {
			prettyPrintService.format(rawXmlData, "xml", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedXmlData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should nicely format and highlight raw XML data", fakeAsync(() => {
			prettyPrintService.format(rawXmlData, "xml", true).subscribe(mockFormatObserver);
			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).not.toHaveBeenCalledWith(formattedXmlData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const formattedData = <string>mockFormatObserver.next.calls.first().args[0];

			expect(formattedData).toContain("class='language-markup'");
			expect(formattedData).toContain('class="token tag"');
			expect(formattedData).toContain("<span");
			expect(formattedData).toContain("menu");
			expect(formattedData).toContain("CreateNewDoc");
			expect(formattedData).toContain("menuitem");
			expect(formattedData).not.toBe(formattedXmlData);
		}));
	});

	describe("html", () => {
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

		it("should nicely format raw HTML data", fakeAsync(() => {
			prettyPrintService.format(rawHtmlData, "html", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedHtmlData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should nicely format raw Angular HTML data", fakeAsync(() => {
			prettyPrintService.format(rawAngularHtmlData, "html", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedAngularHtmlData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should nicely format and highlight raw HTML data", fakeAsync(() => {
			prettyPrintService.format(rawHtmlData, "html", true).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).not.toHaveBeenCalledWith(formattedHtmlData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const formattedData = <string>mockFormatObserver.next.calls.first().args[0];

			expect(formattedData).toContain("class='language-markup'");
			expect(formattedData).toContain('class="token tag"');
			expect(formattedData).toContain("<p");
			expect(formattedData).toContain("flashy");
			expect(formattedData).not.toBe(formattedHtmlData);
		}));
	});

	describe("CSS", () => {
		const rawCssData: string = [
			"body{background: #D2DA9C url(leftcolbg.jpg)repeat-y left top;color: #FFF;}",
			"p{margin-bottom:1em}ul{margin-left:20px;margin-bottom:1em}"
		].join("");

		const formattedCssData: string = [
			"body {",
			"  background: #d2da9c url(leftcolbg.jpg) repeat-y left top;",
			"  color: #fff;",
			"}",
			"p {",
			"  margin-bottom: 1em;",
			"}",
			"ul {",
			"  margin-left: 20px;",
			"  margin-bottom: 1em;",
			"}\n" // an extra line break is added at the end
		].join("\n"); // should contain line breaks

		it("should nicely format raw CSS data", fakeAsync(() => {
			prettyPrintService.format(rawCssData, "css", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedCssData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should simply display the unformatted raw CSS data in case it is not valid CSS", fakeAsync(() => {
			const invalidRawCssData = rawCssData + "}";
			prettyPrintService.format(invalidRawCssData, "html", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).not.toHaveBeenCalled();
			expect(mockFormatObserver.error).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.error).toHaveBeenCalledWith(invalidRawCssData);
			expect(mockFormatObserver.complete).not.toHaveBeenCalled();
		}));

		it("should nicely format and highlight raw CSS data ", fakeAsync(() => {
			prettyPrintService.format(rawCssData, "css", true).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).not.toHaveBeenCalledWith(formattedCssData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const formattedData = <string>mockFormatObserver.next.calls.first().args[0];

			expect(formattedData).toContain("class='language-css'");
			expect(formattedData).toContain(classTokenSelector);
			expect(formattedData).toContain("<span");
			expect(formattedData).toContain("background");
			expect(formattedData).toContain("color");
			expect(formattedData).toContain(marginBottom);
		}));
	});

	describe("SCSS", () => {
		const rawScssData: string = [
			"$font-stack: Helvetica, sans-serif; $primary-color: #333; body { font: 100% $font-stack; color: $primary-color; }"
		].join("");

		const formattedScssData: string = [
			"$font-stack: Helvetica, sans-serif;",
			"$primary-color: #333;",
			"body {",
			"  font: 100% $font-stack;",
			"  color: $primary-color;",
			"}\n" // an extra line break is added at the end
		].join("\n"); // should contain line breaks

		it("should nicely format raw SCSS data", fakeAsync(() => {
			prettyPrintService.format(rawScssData, "scss", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedScssData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should simply display the unformatted raw SCSS data in case it is not valid SCSS", fakeAsync(() => {
			const invalidRawScssData: string = rawScssData + "}";

			prettyPrintService.format(invalidRawScssData, "scss", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).not.toHaveBeenCalled();
			expect(mockFormatObserver.error).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.error).toHaveBeenCalledWith(invalidRawScssData);
			expect(mockFormatObserver.complete).not.toHaveBeenCalled();
		}));

		it("should nicely format and highlight raw SCSS data ", fakeAsync(() => {
			prettyPrintService.format(rawScssData, "scss", true).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).not.toHaveBeenCalledWith(formattedScssData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const formattedData = <string>mockFormatObserver.next.calls.first().args[0];

			expect(formattedData).toContain("class='language-scss'");
			expect(formattedData).toContain(classTokenSelector);
			expect(formattedData).toContain("<span");
			expect(formattedData).toContain("$primary-color");
			expect(formattedData).toContain("$font-stack");
			expect(formattedData).toContain("Helvetica");
		}));
	});

	describe("SQL", () => {
		const rawSqlData: string = [
			"SELECT DISTINCT Name FROM Production.Product AS p WHERE EXISTS (SELECT * ",
			"FROM Production.ProductModel AS pm WHERE p.ProductModelID = pm.ProductModelID ",
			"AND pm.Name LIKE 'Long-Sleeve Logo Jersey%')"
		].join("");

		const formattedSqlData: string = [
			"SELECT DISTINCT Name",
			"FROM Production.Product AS p",
			"WHERE EXISTS (",
			"    SELECT *",
			"    FROM Production.ProductModel AS pm",
			"    WHERE p.ProductModelID = pm.ProductModelID",
			"      AND pm.Name LIKE 'Long-Sleeve Logo Jersey%'",
			"  )"
		].join("\n"); // should contain line breaks

		it("should nicely format raw SQL data", fakeAsync(() => {
			prettyPrintService.format(rawSqlData, "sql", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedSqlData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should nicely format and highlight raw SQL data ", fakeAsync(() => {
			prettyPrintService.format(rawSqlData, "sql", true).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).not.toHaveBeenCalledWith(formattedSqlData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const formattedData = <string>mockFormatObserver.next.calls.first().args[0];

			expect(formattedData).toContain("class='language-sql'");
			expect(formattedData).toContain(classTokenKeyword);
			expect(formattedData).toContain("<span");
			expect(formattedData).toContain("SELECT");
			expect(formattedData).toContain("FROM");
			expect(formattedData).toContain("WHERE");
		}));
	});

	describe("JSON", () => {
		const rawJsonData: string = [
			'{"menu": { "id": "file", "value": "File",',
			'"menuitem": [{"value": "New", "onclick": "CreateNewDoc()"},',
			'{"value": "Open", "onclick": "OpenDoc()"},',
			'{"value": "Close", "onclick": "CloseDoc()"}]}}'
		].join("");

		const formattedJsonData: string = [
			"{",
			'  "menu": {',
			'    "id": "file",',
			'    "value": "File",',
			'    "menuitem": [',
			'      { "value": "New", "onclick": "CreateNewDoc()" },',
			'      { "value": "Open", "onclick": "OpenDoc()" },',
			'      { "value": "Close", "onclick": "CloseDoc()" }',
			"    ]",
			"  }",
			"}\n" // an extra line break is added at the end
		].join("\n");

		it("should nicely format raw JSON data", fakeAsync(() => {
			prettyPrintService.format(rawJsonData, "json", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedJsonData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should simply display the unformatted raw JSON data in case it is not valid JSON", fakeAsync(() => {
			const invalidRawJsonData: string = rawJsonData.replace(":", "oops");
			prettyPrintService.format(invalidRawJsonData, "json", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).not.toHaveBeenCalled();
			expect(mockFormatObserver.error).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.error).toHaveBeenCalledWith(invalidRawJsonData);
			expect(mockFormatObserver.complete).not.toHaveBeenCalled();
		}));

		it("should nicely format and highlight raw JSON data ", fakeAsync(() => {
			prettyPrintService.format(rawJsonData, "json", true).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).not.toHaveBeenCalledWith(formattedJsonData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const formattedData = <string>mockFormatObserver.next.calls.first().args[0];

			expect(formattedData).toContain("class='language-json'");
			expect(formattedData).toContain(classTokenProperty);
			expect(formattedData).toContain("<span");
			expect(formattedData).toContain("menu");
			expect(formattedData).toContain("CreateNewDoc");
			expect(formattedData).toContain("menuitem");
		}));
	});

	describe("JavaScript", () => {
		const rawJavascriptData: string = [
			"function calculateData(seed, operationFn) {",
			"var data = operationFn(seed);",
			"if (!data){",
			"data = 'could not calculate data';",
			"}",
			"return data;",
			"}"
		].join("");

		const formattedJavascriptData: string = [
			"function calculateData(seed, operationFn) {",
			"  var data = operationFn(seed);",
			"  if (!data) {",
			'    data = "could not calculate data";',
			"  }",
			"  return data;",
			"}\n" // an extra line break is added at the end
		].join("\n");

		it("should nicely format raw javascript data", fakeAsync(() => {
			prettyPrintService.format(rawJavascriptData, "javascript", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedJavascriptData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should simply display the unformatted raw javascript data in case it is not valid javascript", fakeAsync(() => {
			const invalidRawJavascriptData: string = rawJavascriptData + "}";

			prettyPrintService.format(invalidRawJavascriptData, "javascript", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).not.toHaveBeenCalled();
			expect(mockFormatObserver.error).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.error).toHaveBeenCalledWith(invalidRawJavascriptData);
			expect(mockFormatObserver.complete).not.toHaveBeenCalled();
		}));

		it("should nicely format and highlight raw JavaScript data ", fakeAsync(() => {
			prettyPrintService.format(rawJavascriptData, "javascript", true).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).not.toHaveBeenCalledWith(formattedJavascriptData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const formattedData = <string>mockFormatObserver.next.calls.first().args[0];

			expect(formattedData).toContain("class='language-javascript'");
			expect(formattedData).toContain(classTokenKeyword);
			expect(formattedData).toContain("<span");
			expect(formattedData).toContain(classTokenFunction);
			expect(formattedData).toContain("calculateData");
			expect(formattedData).toContain("var");
			expect(formattedData).toContain("operationFn");
			expect(formattedData).toContain("seed");
			expect(formattedData).toContain("return");
		}));
	});

	describe("TypeScript", () => {
		const rawTypescriptData: string = [
			"function calculateData(seed:any, operationFn:Function):any {",
			"var data:any = operationFn(seed);",
			"if (!data){",
			"data = 'could not calculate data';",
			"}",
			"return data;",
			"}"
		].join("");

		const formattedTypescriptData: string = [
			"function calculateData(seed: any, operationFn: Function): any {",
			"  var data: any = operationFn(seed);",
			"  if (!data) {",
			'    data = "could not calculate data";',
			"  }",
			"  return data;",
			"}\n" // an extra line break is added at the end
		].join("\n");

		it("should nicely format raw typescript data", fakeAsync(() => {
			prettyPrintService.format(rawTypescriptData, "typescript", false).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).toHaveBeenCalledWith(formattedTypescriptData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);
		}));

		it("should nicely format and highlight raw TypeScript data ", fakeAsync(() => {
			prettyPrintService.format(rawTypescriptData, "typescript", true).subscribe(mockFormatObserver);

			tick(500);

			expect(mockFormatObserver.next).toHaveBeenCalledTimes(1);
			expect(mockFormatObserver.next).not.toHaveBeenCalledWith(formattedTypescriptData);
			expect(mockFormatObserver.error).not.toHaveBeenCalled();
			expect(mockFormatObserver.complete).toHaveBeenCalledTimes(1);

			const formattedData = <string>mockFormatObserver.next.calls.first().args[0];

			expect(formattedData).toContain("class='language-typescript'");
			expect(formattedData).toContain(classTokenKeyword);
			expect(formattedData).toContain("<span");
			expect(formattedData).toContain(classTokenFunction);
			expect(formattedData).toContain("calculateData");
			expect(formattedData).toContain("var");
			expect(formattedData).toContain("operationFn");
			expect(formattedData).toContain("seed");
			expect(formattedData).toContain("return");
		}));
	});
});
