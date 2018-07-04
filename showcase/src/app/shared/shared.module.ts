import { ExampleViewerComponent } from "./example-viewer/example-viewer.component";
import { FileService } from "./example-viewer/file.service";
import * as hljs from "highlight.js";
import { HighlightJsModule, HIGHLIGHT_JS } from "angular-highlight-js";
import { MatButtonModule, MatIconModule, MatTabsModule, MatTooltipModule, MatSnackBarModule } from "@angular/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

export function highlightJsFactory(): any {
	return hljs;
}

@NgModule({
	imports: [
		HighlightJsModule.forRoot({
			provide: HIGHLIGHT_JS,
			useFactory: highlightJsFactory
		}),
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		CommonModule
	],
	providers: [FileService],
	declarations: [ExampleViewerComponent],
	entryComponents: [ExampleViewerComponent],
	exports: [ExampleViewerComponent]
})
export class SharedModule {}
