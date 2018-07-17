import { MatButtonModule, MatCardModule, MatIconModule, MatTabsModule, MatTooltipModule, MatSnackBarModule } from "@angular/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ActionBarComponent } from "./action-bar/action-bar.component";
import { ButtonComponent } from "./button/button.component";
import { ExampleViewerComponent } from "./example-viewer/example-viewer.component";
import { TableComponent } from "./table/table.component";
import { SharedModule } from "../shared/shared.module";
import { StarkActionBarModule, StarkSliderModule, StarkTableModule, StarkSvgViewBoxModule } from "@nationalbankbelgium/stark-ui";

@NgModule({
	imports: [
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		CommonModule,
		TranslateModule,
		SharedModule,
		StarkActionBarModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkTableModule
	],
	declarations: [ActionBarComponent, ButtonComponent, ExampleViewerComponent, TableComponent],
	exports: [ActionBarComponent, ButtonComponent, ExampleViewerComponent, TableComponent]
})
export class DemoModule {}
