import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	StarkErrorImpl,
	StarkLoggingService,
	StarkRoutingService
} from "@nationalbankbelgium/stark-core";
import { StarkPrettyPrintFormat } from "@nationalbankbelgium/stark-ui";
import { FileService } from "../../services";

export interface ExampleFile {
	extension: string;
	data: string;
	format: StarkPrettyPrintFormat;
}

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: "example-viewer",
	templateUrl: "./example-viewer.component.html",
	styleUrls: ["./example-viewer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleViewerComponent implements OnInit {
	@Input()
	public extensions = ["HTML", "TS", "CSS"];
	@Input()
	public filesPath = "undefined";
	@Input()
	public exampleTitle = "undefined";
	@Input()
	public id = "";

	public exampleState: string;

	public appBaseHref: string;
	public examplesFolder = "assets/examples/";
	public exampleFiles: ExampleFile[] = [];
	public showSource = false;

	public constructor(
		private fileService: FileService,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) private routingService: StarkRoutingService
	) {
		this.appBaseHref = this.getAppBaseHref();
		this.exampleState = this.routingService.getCurrentStateName();
	}

	public ngOnInit(): void {
		this.fetchExampleFiles();
	}

	public fetchExampleFiles(): void {
		for (const extension of this.extensions) {
			this.fileService.fetchFile(this.appBaseHref + this.examplesFolder + this.filesPath + "." + extension.toLowerCase()).subscribe(
				(data: string) =>
					this.addExampleFile({
						extension: extension,
						data: data,
						format: this.translateExtensionToFormat(extension)
					}),
				(error: HttpErrorResponse) => this.logger.error("Error while fetching files", new StarkErrorImpl(error))
			);
		}
	}

	/**
	 * Get the final baseHref based on the path location of the Showcase app. Useful when deployed on GitHub Pages
	 */
	public getAppBaseHref(): string {
		// the final url in GitHub Pages will be something like "/showcase/latest/" or "/showcase/some-version/"
		const finalUrlRegex = /(\/showcase\/[\d\D][^/]+(\/|\/$|$))/;
		const trailingSlashRegex = /\/$/;
		const matches: RegExpExecArray | null = finalUrlRegex.exec(window.location.pathname);

		let finalBaseHref = "";

		if (matches && matches[1]) {
			finalBaseHref = matches[1]; // match group 1 contains the base url (i.e. "/showcase/latest/")
		}

		// add a trailing slash to the url in case it doesn't have any
		if (!finalBaseHref.match(trailingSlashRegex)) {
			finalBaseHref = finalBaseHref + "/";
		}

		return finalBaseHref;
	}

	public addExampleFile(fileContent: ExampleFile): void {
		this.exampleFiles.push(fileContent);
	}

	public toggleSourceView(): void {
		this.showSource = !this.showSource;
	}

	public trackExampleFile(_index: number, file: ExampleFile): string {
		return file.extension;
	}

	private translateExtensionToFormat(extension: string): StarkPrettyPrintFormat {
		switch (extension.toLowerCase()) {
			case "js":
				return "javascript";

			case "ts":
				return "typescript";

			default:
				return <StarkPrettyPrintFormat>extension;
		}
	}
}
