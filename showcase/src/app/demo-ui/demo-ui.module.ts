import { NgModule } from "@angular/core";
import { MatOptionModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { StoreModule } from "@ngrx/store";
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
	StarkDateTimePickerModule,
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
	DemoTransformInputDirectivePageComponent,
	DemoDateTimePickerPageComponent,
	demoGenericSearchStoreKey
} from "./pages";
import { SharedModule } from "../shared/shared.module";
import { DEMO_STATES } from "./routes";
import {
	TableRegularComponent,
	TableWithItemsPerPageSelectorComponent,
	TableWithCustomActionsComponent,
	TableWithCustomStylingComponent,
	TableWithFixedActionsComponent,
	TableWithFixedHeaderComponent,
	TableWithFooterComponent,
	TableWithCustomCellRenderingComponent,
	TableWithSelectionComponent,
	TableWithTranscludedActionBarComponent,
	TableWithCollapsibleRowsComponent
} from "./components";
import { ExampleViewerModule } from "../example-viewer";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: DEMO_STATES
		}),
		MatAutocompleteModule,
		MatDividerModule,
		MatFormFieldModule,
		MatInputModule,
		MatOptionModule,
		MatSlideToggleModule,
		SharedModule,
		StarkActionBarModule,
		StarkAppLogoutModule,
		StarkAppDataModule,
		StarkAppMenuModule,
		StarkBreadcrumbModule,
		StarkCollapsibleModule,
		StarkDatePickerModule,
		StarkDateRangePickerModule,
		StarkDateTimePickerModule,
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
		StarkTableModule,
		ExampleViewerModule,
		StoreModule.forFeature(demoGenericSearchStoreKey, demoGenericSearchReducers)
	],
	declarations: [
		DemoActionBarPageComponent,
		DemoAppDataPageComponent,
		DemoBreadcrumbPageComponent,
		DemoCollapsiblePageComponent,
		DemoDatePickerPageComponent,
		DemoDateRangePickerPageComponent,
		DemoDateTimePickerPageComponent,
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
		TableWithItemsPerPageSelectorComponent,
		TableWithSelectionComponent,
		TableWithCustomActionsComponent,
		TableWithTranscludedActionBarComponent,
		TableWithFixedHeaderComponent,
		TableWithFooterComponent,
		TableWithCustomCellRenderingComponent,
		TableWithCustomStylingComponent,
		TableWithFixedActionsComponent,
		DemoToastPageComponent,
		DemoGenericSearchFormComponent,
		DemoTransformInputDirectivePageComponent,
		TableWithCollapsibleRowsComponent
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
