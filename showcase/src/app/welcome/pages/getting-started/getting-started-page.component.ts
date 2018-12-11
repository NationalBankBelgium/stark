import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { starterStructure, stylesheetImport, stylesCss, starkStylesCss } from "./starter-structure";

@Component({
	selector: "getting-started",
	templateUrl: "./getting-started-page.component.html"
})
export class GettingStartedPageComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public stylesheetImport: string = stylesheetImport;
	public structure: string = starterStructure;
	public stylesCSS: string = stylesCss;
	public starkStylesCSS: string = starkStylesCss;
	public installingProject: string;
	public runningHMR: string;
	public runningProject: string;
	public buildFiles: string;
	public watchMode: string;
	public unitTestRunning: string;
	public watchAndRunTests: string;
	public runEndToEndTests: string;
	public continuousIntegrationTests: string;
	public installType: string;
	public moduleDeclaration: string;
	public prototyping: string;
	public moduleImport: string;

	public ngOnInit(): void {
		this.installingProject =
			"# --depth 1 removes all but one .git commit history\n" +
			"git clone --depth 1 https://github.com/NationalBankBelgium/stark.git";
		this.runningHMR = "npm run server:dev:hmr";
		this.runningProject = "npm run server:prod";
		this.buildFiles =
			"# development\n" +
			"npm run build:dev\n\n" +
			"# production (jit)\n" +
			"npm run build:prod\n\n" +
			"# AoT\n" +
			"npm run build:aot";
		this.watchMode = "npm run watch";
		this.unitTestRunning = "npm run test";
		this.watchAndRunTests = "npm run watch:test";
		this.runEndToEndTests =
			"# update Webdriver (optional, done automatically by postinstall script)\n" +
			"npm run webdriver:update # cfr #35\n\n" +
			"# this will start a test server and launch Protractor\n" +
			"npm run e2e";
		this.continuousIntegrationTests = "# this will test both your JIT and AoT builds\n" + "npm run ci";
		this.installType = "npm install @types/node\n" + "npm install @types/lodash";
		this.moduleDeclaration = 'declare module "my-module" {\n' + "\texport function doesSomething(value: string): string;\n" + "}";
		this.prototyping = "declare var assert: any;\n" + "declare var _: any;\n" + "declare var $: any;";
		this.moduleImport = 'import * as _ from "lodash";';

		this.loggingService.debug("hello from `GettingStarted` component");
	}
}
