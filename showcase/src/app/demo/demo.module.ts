import {
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatDividerModule,
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
import { DemoCardComponent } from "./card/demo-card.component";
import { DemoColorsComponent } from "./colors/demo-colors.component";
import { ButtonComponent } from "./button/button.component";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { DateRangePickerComponent } from "./date-range-picker/date-range-picker.component";
import { DemoSidebarComponent } from "./sidebar/demo-sidebar.component";
import { DemoDropdownComponent } from "./dropdown/demo-dropdown.component";
import { ExampleViewerComponent } from "./example-viewer/example-viewer.component";
import { HeaderComponent } from "./header/header.component";
import { KeyboardDirectivesComponent } from "./keyboard-directives/keyboard-directives.component";
import { DemoLanguageSelectorComponent } from "./language-selector/demo-language-selector.component";
import { LogoutComponent } from "./logout/logout.component";
import { DemoPrettyPrintComponent } from "./pretty-print/demo-pretty-print.component";
import { SliderComponent } from "./slider/slider.component";
import { TableComponent } from "./table/table.component";
import { DemoTypographyComponent } from "./typography/demo-typography.component";
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
	StarkLanguageSelectorModule,
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
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatDividerModule,
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
		StarkLanguageSelectorModule,
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
		DemoCardComponent,
		DemoColorsComponent,
		DemoDropdownComponent,
		DemoTypographyComponent,
		ExampleViewerComponent,
		HeaderComponent,
		KeyboardDirectivesComponent,
		DemoLanguageSelectorComponent,
		LogoutComponent,
		DemoPrettyPrintComponent,
		SliderComponent,
		DatePickerComponent,
		DateRangePickerComponent,
		DemoSidebarComponent,
		ExampleViewerComponent,
		KeyboardDirectivesComponent,
		TableComponent
	],
	exports: [
		ActionBarComponent,
		DemoBreadcrumbComponent,
		DemoCardComponent,
		DemoColorsComponent,
		ButtonComponent,
		DatePickerComponent,
		DateRangePickerComponent,
		DemoDropdownComponent,
		DemoTypographyComponent,
		ExampleViewerComponent,
		HeaderComponent,
		KeyboardDirectivesComponent,
		DemoLanguageSelectorComponent,
		LogoutComponent,
		DemoPrettyPrintComponent,
		SliderComponent,
		TableComponent
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS }]
})
export class DemoModule {}
