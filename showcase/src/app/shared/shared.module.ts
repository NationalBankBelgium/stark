import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";
import { TranslateModule } from "@ngx-translate/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ExampleViewerComponent, ReferenceBlockComponent, TableOfContentsComponent } from "./components";
import { FileService } from "./services";

@NgModule({
	imports: [
		FlexLayoutModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		CommonModule,
		StarkPrettyPrintModule,
		TranslateModule
	],
	providers: [FileService],
	declarations: [ExampleViewerComponent, ReferenceBlockComponent, TableOfContentsComponent],
	entryComponents: [],
	exports: [ExampleViewerComponent, ReferenceBlockComponent, TableOfContentsComponent, FlexLayoutModule]
})
export class SharedModule {}
