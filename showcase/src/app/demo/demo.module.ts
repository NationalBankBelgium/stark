import {
	MatButtonModule,
	MatCardModule,
	MatIconModule,
	MatTabsModule,
	MatTooltipModule,
	MatSnackBarModule,
	MatFormFieldModule,
	MatInputModule
} from "@angular/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ActionBarComponent } from "./action-bar/action-bar.component";
import { ButtonComponent } from "./button/button.component";
import { ExampleViewerComponent } from "./example-viewer/example-viewer.component";
import { KeyboardDirectivesComponent } from "./keyboard-directives/keyboard-directives.component";
import { TableComponent } from "./table/table.component";
import { SharedModule } from "../shared/shared.module";
import {
	StarkActionBarModule,
	StarkSliderModule,
	StarkTableModule,
	StarkSvgViewBoxModule,
	StarkKeyboardDirectivesModule
} from "@nationalbankbelgium/stark-ui";

@NgModule({
	imports: [
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		CommonModule,
		FormsModule,
		TranslateModule,
		SharedModule,
		StarkActionBarModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkKeyboardDirectivesModule,
		StarkTableModule
	],
	declarations: [ActionBarComponent, ButtonComponent, ExampleViewerComponent, KeyboardDirectivesComponent, TableComponent],
	exports: [ActionBarComponent, ButtonComponent, ExampleViewerComponent, KeyboardDirectivesComponent, TableComponent]
})
export class DemoModule {}
