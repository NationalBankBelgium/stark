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
import { DemoActionBarComponent } from "./action-bar/demo-action-bar.component";
import { DemoDropdownComponent } from "./dropdown/demo-dropdown.component";
import { DemoButtonComponent } from "./button/demo-button.component";
import { DemoDatePickerComponent } from "./date-picker/demo-date-picker.component";
import { DemoDateRangePickerComponent } from "./date-range-picker/demo-date-range-picker.component";
import { DemoExampleViewerComponent } from "./example-viewer/demo-example-viewer.component";
import { DemoHeaderComponent } from "./header/demo-header.component";
import { DemoKeyboardDirectivesComponent } from "./keyboard-directives/demo-keyboard-directives.component";
import { DemoPrettyPrintComponent } from "./pretty-print/demo-pretty-print.component";
import { DemoTableComponent } from "./table/demo-table.component";
import { SharedModule } from "../shared/shared.module";
import {
	StarkActionBarModule,
	StarkKeyboardDirectivesModule,
	StarkPrettyPrintModule,
	StarkSliderModule,
	StarkTableModule,
	StarkSvgViewBoxModule,
	StarkDropdownModule,
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
		StarkDropdownModule,
		StarkKeyboardDirectivesModule,
		StarkPrettyPrintModule,
		StarkDatePickerModule,
		StarkDateRangePickerModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkTableModule
	],
	declarations: [
		DemoActionBarComponent,
		DemoDropdownComponent,
		DemoButtonComponent,
		DemoExampleViewerComponent,
		DemoHeaderComponent,
		DemoKeyboardDirectivesComponent,
		DemoPrettyPrintComponent,
		DemoDatePickerComponent,
		DemoDateRangePickerComponent,
		DemoExampleViewerComponent,
		DemoKeyboardDirectivesComponent,
		DemoTableComponent
	],
	exports: [
		DemoActionBarComponent,
		DemoDropdownComponent,
		DemoButtonComponent,
		DemoDatePickerComponent,
		DemoDateRangePickerComponent,
		DemoExampleViewerComponent,
		DemoHeaderComponent,
		DemoKeyboardDirectivesComponent,
		DemoPrettyPrintComponent,
		DemoTableComponent
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS }]
})
export class DemoModule {}
