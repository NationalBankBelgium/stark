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
import { UIRouterModule } from "@uirouter/angular";
import {
	STARK_DATE_FORMATS,
	StarkActionBarModule,
	StarkAppDataModule,
	StarkAppLogoutModule,
	StarkAppMenuModule,
	StarkBreadcrumbModule,
	StarkCollapsibleModule,
	StarkDatePickerModule,
	StarkDateRangePickerModule,
	StarkDropdownModule,
	StarkKeyboardDirectivesModule,
	StarkLanguageSelectorModule,
	StarkMinimapModule,
	StarkPaginationModule,
	StarkPrettyPrintModule,
	StarkSliderModule,
	StarkSvgViewBoxModule,
	StarkTableModule
} from "@nationalbankbelgium/stark-ui";
import {
	DemoActionBarPageComponent,
	DemoAppDataPageComponent,
	DemoBreadcrumbPageComponent,
	DemoCollapsiblePageComponent,
	DemoDatePickerPageComponent,
	DemoDateRangePickerPageComponent,
	DemoDropdownPageComponent,
	DemoFooterPageComponent,
	DemoKeyboardDirectivesPageComponent,
	DemoLanguageSelectorPageComponent,
	DemoLogoutPageComponent,
	DemoMenuPageComponent,
	DemoMessagePanePageComponent,
	DemoMinimapPageComponent,
	DemoPaginationPageComponent,
	DemoPrettyPrintPageComponent,
	DemoSidebarPageComponent,
	DemoSliderPageComponent,
	DemoTablePageComponent,
	DemoToastPageComponent
} from "./pages";
import { SharedModule } from "../shared/shared.module";
import { DEMO_STATES } from "./routes";
import {
	TableRegularComponent,
	TableWithCustomActionsComponent,
	TableWithCustomStylingComponent,
	TableWithFixedHeaderComponent,
	TableWithSelectionComponent,
	TableWithTranscludedActionBarComponent
} from "./components";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: DEMO_STATES
		}),
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
		StarkAppDataModule,
		StarkAppMenuModule,
		StarkBreadcrumbModule,
		StarkCollapsibleModule,
		StarkDatePickerModule,
		StarkDateRangePickerModule,
		StarkDropdownModule,
		StarkKeyboardDirectivesModule,
		StarkLanguageSelectorModule,
		StarkMinimapModule,
		StarkPaginationModule,
		StarkPrettyPrintModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkTableModule
	],
	declarations: [
		DemoActionBarPageComponent,
		DemoAppDataPageComponent,
		DemoBreadcrumbPageComponent,
		DemoCollapsiblePageComponent,
		DemoDatePickerPageComponent,
		DemoDateRangePickerPageComponent,
		DemoDropdownPageComponent,
		DemoFooterPageComponent,
		DemoKeyboardDirectivesPageComponent,
		DemoLanguageSelectorPageComponent,
		DemoLogoutPageComponent,
		DemoMenuPageComponent,
		DemoMessagePanePageComponent,
		DemoMinimapPageComponent,
		DemoPaginationPageComponent,
		DemoPrettyPrintPageComponent,
		DemoSidebarPageComponent,
		DemoSliderPageComponent,
		DemoTablePageComponent,
		TableRegularComponent,
		TableWithSelectionComponent,
		TableWithCustomActionsComponent,
		TableWithTranscludedActionBarComponent,
		TableWithFixedHeaderComponent,
		TableWithCustomStylingComponent,
		DemoToastPageComponent
	],
	exports: [
		DemoActionBarPageComponent,
		DemoAppDataPageComponent,
		DemoBreadcrumbPageComponent,
		DemoCollapsiblePageComponent,
		DemoDatePickerPageComponent,
		DemoDateRangePickerPageComponent,
		DemoDropdownPageComponent,
		DemoFooterPageComponent,
		DemoKeyboardDirectivesPageComponent,
		DemoLanguageSelectorPageComponent,
		DemoLogoutPageComponent,
		DemoMenuPageComponent,
		DemoMessagePanePageComponent,
		DemoMinimapPageComponent,
		DemoPaginationPageComponent,
		DemoPrettyPrintPageComponent,
		DemoSliderPageComponent,
		DemoTablePageComponent,
		DemoToastPageComponent
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS }]
})
export class DemoUiModule {}
