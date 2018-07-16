import { MatButtonModule, MatIconModule, MatTabsModule, MatTooltipModule, MatSnackBarModule } from "@angular/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ActionBarComponent } from "./action-bar/action-bar.component";
import { ExampleViewerComponent } from "./example-viewer/example-viewer.component";
import { TableComponent } from "./table/table.component";
import { SharedModule } from "../shared/shared.module";
import { StarkActionBarModule, StarkSliderModule, StarkTableModule } from "@nationalbankbelgium/stark-ui";

@NgModule({
	imports: [
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		CommonModule,
		TranslateModule,
		SharedModule,
		StarkActionBarModule,
		StarkSliderModule,
		StarkTableModule
	],
	declarations: [ActionBarComponent, ExampleViewerComponent, TableComponent],
	exports: [ActionBarComponent, ExampleViewerComponent, TableComponent]
})
export class DemoModule {}
