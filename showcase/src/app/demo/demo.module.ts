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
import { DemoBreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { ButtonComponent } from "./button/button.component";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { DateRangePickerComponent } from "./date-range-picker/date-range-picker.component";
import { DropdownComponent } from "./dropdown/dropdown.component";
import { ExampleViewerComponent } from "./example-viewer/example-viewer.component";
import { HeaderComponent } from "./header/header.component";
import { KeyboardDirectivesComponent } from "./keyboard-directives/keyboard-directives.component";
import { LogoutComponent } from "./logout/logout.component";
import { PrettyPrintComponent } from "./pretty-print/pretty-print.component";
import { SliderComponent } from "./slider/slider.component";
import { TableComponent } from "./table/table.component";
import { SharedModule } from "../shared/shared.module";
import {
	STARK_DATE_FORMATS,
	StarkActionBarModule,
	StarkAppLogoutModule,
	StarkBreadcrumbModule,
	StarkDatePickerModule,
	StarkDateRangePickerModule,
	StarkDropdownModule,
	StarkKeyboardDirectivesModule,
	StarkPrettyPrintModule,
	StarkSliderModule,
	StarkSvgViewBoxModule,
	StarkTableModule
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
		StarkBreadcrumbModule,
		StarkDropdownModule,
		StarkKeyboardDirectivesModule,
		StarkPrettyPrintModule,
		StarkDatePickerModule,
		StarkDateRangePickerModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkTableModule,
		StarkAppLogoutModule
	],
	declarations: [
		ActionBarComponent,
		DemoBreadcrumbComponent,
		ButtonComponent,
		DatePickerComponent,
		DateRangePickerComponent,
		DropdownComponent,
		ExampleViewerComponent,
		HeaderComponent,
		KeyboardDirectivesComponent,
		LogoutComponent,
		PrettyPrintComponent,
		SliderComponent,
		TableComponent
	],
	exports: [
		ActionBarComponent,
		DemoBreadcrumbComponent,
		ButtonComponent,
		DatePickerComponent,
		DateRangePickerComponent,
		DropdownComponent,
		ExampleViewerComponent,
		HeaderComponent,
		KeyboardDirectivesComponent,
		LogoutComponent,
		PrettyPrintComponent,
		SliderComponent,
		TableComponent
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS }]
})
export class DemoModule {}
