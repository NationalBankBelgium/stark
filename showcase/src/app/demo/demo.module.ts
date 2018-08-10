import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
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
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { DateRangePickerComponent } from "./date-range-picker/date-range-picker.component";
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
	StarkSvgViewBoxModule,
	StarkDatePickerModule,
	StarkDateRangePickerModule,
	STARK_DATE_FORMATS
} from "@nationalbankbelgium/stark-ui";
import { MAT_DATE_FORMATS } from "@angular/material/core";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCardModule,
		MatCheckboxModule,
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
		StarkDatePickerModule,
		StarkDateRangePickerModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkTableModule
	],
	declarations: [
		ActionBarComponent,
		ButtonComponent,
		ExampleViewerComponent,
		PrettyPrintComponent,
		DatePickerComponent,
		DateRangePickerComponent,
		ExampleViewerComponent,
		KeyboardDirectivesComponent,
		TableComponent
	],
	exports: [
		ActionBarComponent,
		ButtonComponent,
		DatePickerComponent,
		DateRangePickerComponent,
		ExampleViewerComponent,
		KeyboardDirectivesComponent,
		PrettyPrintComponent,
		TableComponent
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS }]
})
export class DemoModule {}
