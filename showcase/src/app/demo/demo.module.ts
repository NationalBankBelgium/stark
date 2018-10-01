import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { DemoActionBarComponent } from "./action-bar/demo-action-bar.component";
import { DemoBreadcrumbComponent } from "./breadcrumb/demo-breadcrumb.component";
import { DemoCardComponent } from "./card/demo-card.component";
import { DemoColorsComponent } from "./colors/demo-colors.component";
import { DemoButtonComponent } from "./button/demo-button.component";
import { DemoDatePickerComponent } from "./date-picker/demo-date-picker.component";
import { DemoDateRangePickerComponent } from "./date-range-picker/demo-date-range-picker.component";
import { DemoCollapsibleComponent } from "./collapsible/demo-collapsible.component";
import { DemoSidebarComponent } from "./sidebar/demo-sidebar.component";
import { DemoDropdownComponent } from "./dropdown/demo-dropdown.component";
import { DemoExampleViewerComponent } from "./example-viewer/demo-example-viewer.component";
import { DemoHeaderComponent } from "./header/demo-header.component";
import { DemoFooterComponent } from "./footer/demo-footer.component";
import { DemoKeyboardDirectivesComponent } from "./keyboard-directives/demo-keyboard-directives.component";
import { DemoLanguageSelectorComponent } from "./language-selector/demo-language-selector.component";
import { DemoLogoutComponent } from "./logout/demo-logout.component";
import { DemoPaginationComponent } from "./pagination/demo-pagination.component";
import { DemoPrettyPrintComponent } from "./pretty-print/demo-pretty-print.component";
import { DemoSliderComponent } from "./slider/demo-slider.component";
import { DemoTableComponent } from "./table/demo-table.component";
import { DemoTypographyComponent } from "./typography/demo-typography.component";
import { DemoToastComponent } from "./toast/demo-toast-notification.component";
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
	StarkPaginationModule,
	StarkPrettyPrintModule,
	StarkSliderModule,
	StarkSvgViewBoxModule,
	StarkTableModule,
	StarkCollapsibleModule
} from "@nationalbankbelgium/stark-ui";

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
		StarkAppLogoutModule,
		StarkBreadcrumbModule,
		StarkCollapsibleModule,
		StarkDatePickerModule,
		StarkDateRangePickerModule,
		StarkDropdownModule,
		StarkKeyboardDirectivesModule,
		StarkLanguageSelectorModule,
		StarkPaginationModule,
		StarkPrettyPrintModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkTableModule
	],
	declarations: [
		DemoActionBarComponent,
		DemoBreadcrumbComponent,
		DemoButtonComponent,
		DemoCardComponent,
		DemoCollapsibleComponent,
		DemoColorsComponent,
		DemoDatePickerComponent,
		DemoDateRangePickerComponent,
		DemoDropdownComponent,
		DemoExampleViewerComponent,
		DemoHeaderComponent,
		DemoFooterComponent,
		DemoKeyboardDirectivesComponent,
		DemoLanguageSelectorComponent,
		DemoLogoutComponent,
		DemoPaginationComponent,
		DemoPrettyPrintComponent,
		DemoSidebarComponent,
		DemoSliderComponent,
		DemoTableComponent,
		DemoToastComponent,
		DemoTypographyComponent
	],
	exports: [
		DemoActionBarComponent,
		DemoBreadcrumbComponent,
		DemoButtonComponent,
		DemoCardComponent,
		DemoCollapsibleComponent,
		DemoColorsComponent,
		DemoDatePickerComponent,
		DemoDateRangePickerComponent,
		DemoDropdownComponent,
		DemoExampleViewerComponent,
		DemoHeaderComponent,
		DemoFooterComponent,
		DemoKeyboardDirectivesComponent,
		DemoLanguageSelectorComponent,
		DemoLogoutComponent,
		DemoPaginationComponent,
		DemoPrettyPrintComponent,
		DemoSliderComponent,
		DemoTableComponent,
		DemoToastComponent,
		DemoTypographyComponent
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS }]
})
export class DemoModule {}
