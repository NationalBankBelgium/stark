import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StarkLocale } from "@nationalbankbelgium/stark-core";
import { StarkTableColumnComponent, StarkTableComponent } from "./components";
import { StarkTableMultisortDialogComponent } from "./components/dialogs/multisort.component";
import { StarkActionBarModule } from "@nationalbankbelgium/stark-ui/src/modules/action-bar";
import { StarkPaginationModule } from "@nationalbankbelgium/stark-ui/src/modules/pagination";
import { StarkMinimapModule } from "@nationalbankbelgium/stark-ui/src/modules/minimap";
import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";
import { StarkTableExpandDetailDirective } from "./directives/table-expand-detail.directive";
import { StarkTableRowContentDirective } from "./directives/table-row-content.directive";

@NgModule({
	declarations: [
		StarkTableComponent,
		StarkTableMultisortDialogComponent,
		StarkTableColumnComponent,
		StarkTableRowContentDirective,
		StarkTableExpandDetailDirective
	],
	exports: [StarkTableComponent, StarkTableColumnComponent, StarkTableRowContentDirective, StarkTableExpandDetailDirective],
	imports: [
		// Common
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		// Material
		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatSelectModule,
		MatSortModule,
		MatTableModule,
		MatTooltipModule,
		// Stark
		StarkActionBarModule,
		StarkPaginationModule,
		StarkMinimapModule
	]
})
export class StarkTableModule {
	/**
	 * Class constructor
	 * @param translateService - The `TranslateService` instance of the application.
	 */
	public constructor(translateService: TranslateService) {
		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeUiTranslations(translateService, english, french, dutch);
	}
}
