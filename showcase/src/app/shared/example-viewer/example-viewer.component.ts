import { Component, OnInit, Input } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FileService } from "./file.service";

@Component({
	selector: "example-viewer",
	templateUrl: "./example-viewer.html",
	styleUrls: ["./example-viewer.scss"],
	providers: [FileService]
})
export class ExampleViewerComponent implements OnInit {
	@Input() public extensions: Array<string> = ["HTML", "TS", "CSS"];
	@Input() public filesPath: string;
	@Input() public title: string;

	public filesContent: Array<Object> = [];
	public showSource: boolean = false;

	public constructor(private service: FileService) {}

	public ngOnInit(): void {
		this.fetchFiles();
	}

	public fetchFiles(): void {
		this.extensions.forEach((extension: string) => {
			this.service
				.fetchFile("/assets/examples/" + this.filesPath + "." + extension.toLowerCase())
				.subscribe(
					(data: string) => this.addFileContent({ extension: extension, file: data }),
					(error: HttpErrorResponse) => console.log(error)
				);
		});
	}

	public addFileContent(fileContent: Object): void {
		this.filesContent.push(fileContent);
	}

	public toggleSourceView(): void {
		this.showSource = !this.showSource;
	}

	public trackFilesContent(_index: number, file: any): string {
		return file.extension;
	}
}
