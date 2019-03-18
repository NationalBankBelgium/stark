import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { StoreModule } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { UIRouterModule } from "@uirouter/angular";
import {
	StarkActionBarModule,
	StarkAppDataModule,
	StarkAppLogoutModule,
	StarkAppMenuModule,
	StarkBreadcrumbModule,
	StarkCollapsibleModule,
	StarkDatePickerModule,
	StarkDateRangePickerModule,
	StarkDialogsModule,
	StarkDropdownModule,
	StarkGenericSearchModule,
	StarkInputMaskDirectivesModule,
	StarkRestrictInputDirectiveModule,
	StarkLanguageSelectorModule,
	StarkMinimapModule,
	StarkPaginationModule,
	StarkPrettyPrintModule,
	StarkProgressIndicatorModule,
	StarkRouteSearchModule,
	StarkSliderModule,
	StarkSvgViewBoxModule,
	StarkTableModule,
	StarkTransformInputDirectiveModule
} from "@nationalbankbelgium/stark-ui";
import {
	DemoActionBarPageComponent,
	DemoAppDataPageComponent,
	DemoBreadcrumbPageComponent,
	DemoCollapsiblePageComponent,
	DemoDatePickerPageComponent,
	DemoDateRangePickerPageComponent,
	DemoDialogsPageComponent,
	DemoDropdownPageComponent,
	DemoFooterPageComponent,
	DemoGenericSearchFormComponent,
	DemoGenericSearchPageComponent,
	demoGenericSearchReducers,
	DemoGenericService,
	DemoInputMaskDirectivesPageComponent,
	DemoRestrictInputDirectivePageComponent,
	DemoLanguageSelectorPageComponent,
	DemoLogoutPageComponent,
	DemoMenuPageComponent,
	DemoMessagePanePageComponent,
	DemoMinimapPageComponent,
	DemoPaginationPageComponent,
	DemoPrettyPrintPageComponent,
	DemoProgressIndicatorPageComponent,
	DemoRouteSearchPageComponent,
	DemoSidebarPageComponent,
	DemoSliderPageComponent,
	DemoTablePageComponent,
	DemoToastPageComponent,
	DemoTransformInputDirectivePageComponent
} from "./pages";
import { SharedModule } from "../shared/shared.module";
import { DEMO_STATES } from "./routes";
import {
	TableRegularComponent,
	TableWithCustomActionsComponent,
	TableWithCustomStylingComponent,
	TableWithFixedActionsComponent,
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
		ReactiveFormsModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatDividerModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatOptionModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		MatSlideToggleModule,
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
		StarkDialogsModule,
		StarkDropdownModule,
		StarkGenericSearchModule,
		StarkInputMaskDirectivesModule,
		StarkRestrictInputDirectiveModule,
		StarkTransformInputDirectiveModule,
		StarkLanguageSelectorModule,
		StarkMinimapModule,
		StarkPaginationModule,
		StarkProgressIndicatorModule,
		StarkPrettyPrintModule,
		StarkRouteSearchModule,
		StarkSliderModule,
		StarkSvgViewBoxModule,
		StarkTableModule,
		StoreModule.forFeature("DemoGenericSearch", demoGenericSearchReducers)
	],
	declarations: [
		DemoActionBarPageComponent,
		DemoAppDataPageComponent,
		DemoBreadcrumbPageComponent,
		DemoCollapsiblePageComponent,
		DemoDatePickerPageComponent,
		DemoDateRangePickerPageComponent,
		DemoDialogsPageComponent,
		DemoDropdownPageComponent,
		DemoFooterPageComponent,
		DemoGenericSearchPageComponent,
		DemoRestrictInputDirectivePageComponent,
		DemoLanguageSelectorPageComponent,
		DemoLogoutPageComponent,
		DemoInputMaskDirectivesPageComponent,
		DemoMenuPageComponent,
		DemoMessagePanePageComponent,
		DemoMinimapPageComponent,
		DemoPaginationPageComponent,
		DemoPrettyPrintPageComponent,
		DemoProgressIndicatorPageComponent,
		DemoRouteSearchPageComponent,
		DemoSidebarPageComponent,
		DemoSliderPageComponent,
		DemoTablePageComponent,
		TableRegularComponent,
		TableWithSelectionComponent,
		TableWithCustomActionsComponent,
		TableWithTranscludedActionBarComponent,
		TableWithFixedHeaderComponent,
		TableWithCustomStylingComponent,
		TableWithFixedActionsComponent,
		DemoToastPageComponent,
		DemoGenericSearchFormComponent,
		DemoTransformInputDirectivePageComponent
	],
	exports: [
		DemoActionBarPageComponent,
		DemoAppDataPageComponent,
		DemoBreadcrumbPageComponent,
		DemoCollapsiblePageComponent,
		DemoDatePickerPageComponent,
		DemoDateRangePickerPageComponent,
		DemoDialogsPageComponent,
		DemoDropdownPageComponent,
		DemoFooterPageComponent,
		DemoGenericSearchPageComponent,
		DemoRestrictInputDirectivePageComponent,
		DemoLanguageSelectorPageComponent,
		DemoLogoutPageComponent,
		DemoInputMaskDirectivesPageComponent,
		DemoMenuPageComponent,
		DemoMessagePanePageComponent,
		DemoMinimapPageComponent,
		DemoPaginationPageComponent,
		DemoPrettyPrintPageComponent,
		DemoProgressIndicatorPageComponent,
		DemoRouteSearchPageComponent,
		DemoSliderPageComponent,
		DemoTablePageComponent,
		DemoToastPageComponent,
		DemoGenericSearchFormComponent
	],
	providers: [DemoGenericService]
})
export class DemoUiModule {}
