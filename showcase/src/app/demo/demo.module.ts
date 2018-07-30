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
import { PrettyPrintComponent } from "./pretty-print/pretty-print.component";
import { TableComponent } from "./table/table.component";
import { SharedModule } from "../shared/shared.module";
import {
	StarkActionBarModule,
	StarkKeyboardDirectivesModule,
	StarkPrettyPrintModule,
	StarkSliderModule,
	StarkTableModule,
	StarkSvgViewBoxModule
} from "@nationalbankbelgium/stark-ui";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		TranslateModule,
		SharedModule,
		StarkActionBarModule,
		StarkKeyboardDirectivesModule,
		StarkPrettyPrintModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkTableModule
	],
	declarations: [
		ActionBarComponent,
		ButtonComponent,
		ExampleViewerComponent,
		KeyboardDirectivesComponent,
		PrettyPrintComponent,
		TableComponent
	],
	exports: [
		ActionBarComponent,
		ButtonComponent,
		ExampleViewerComponent,
		KeyboardDirectivesComponent,
		PrettyPrintComponent,
		TableComponent
	]
})
export class DemoModule {}
