import { ExampleViewerComponent } from "./example-viewer/example-viewer.component";
import { FileService } from "./example-viewer/file.service";
import { MatButtonModule, MatIconModule, MatTabsModule, MatTooltipModule, MatSnackBarModule } from "@angular/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	imports: [
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		CommonModule,
		StarkPrettyPrintModule,
		TranslateModule
	],
	providers: [FileService],
	declarations: [ExampleViewerComponent],
	entryComponents: [ExampleViewerComponent],
	exports: [ExampleViewerComponent]
})
export class SharedModule {}
