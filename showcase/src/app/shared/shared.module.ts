import { DateAdapter } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { StarkPrettyPrintModule, StarkSvgViewBoxModule } from "@nationalbankbelgium/stark-ui";
import { TranslateModule } from "@ngx-translate/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
	STARK_APP_METADATA,
	STARK_SESSION_SERVICE,
	StarkApplicationMetadata,
	StarkLanguage,
	StarkSessionService
} from "@nationalbankbelgium/stark-core";
import moment from "moment";
import { filter } from "rxjs/operators";
import { ExampleViewerComponent, ReferenceBlockComponent, TableOfContentsComponent } from "./components";
import { FileService } from "./services";

@NgModule({
	imports: [
		FlexLayoutModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		CommonModule,
		StarkPrettyPrintModule,
		TranslateModule,
		StarkSvgViewBoxModule // is needed here for directive to work in the different modules
	],
	providers: [FileService],
	declarations: [ExampleViewerComponent, ReferenceBlockComponent, TableOfContentsComponent],
	entryComponents: [],
	exports: [ExampleViewerComponent, ReferenceBlockComponent, TableOfContentsComponent, FlexLayoutModule, StarkSvgViewBoxModule]
})
export class SharedModule {
	public constructor(
		@Inject(STARK_APP_METADATA) private appMetadata: StarkApplicationMetadata,
		@Inject(STARK_SESSION_SERVICE) private sessionService: StarkSessionService,
		private dateAdapter: DateAdapter<any>
	) {
		/**
		 * When the application language changes, the Moment locale and the Material Moment Adapter (internally used by Stark Date Pickers) should be changed as well
		 * FIXME: currently this logic cannot be implemented in the AppModule and should be implemented in a different module instead (see https://github.com/angular/components/issues/15419)
		 */
		this.sessionService
			.getCurrentLanguage()
			.pipe(filter((currentLang?: string): currentLang is string => typeof currentLang !== "undefined"))
			.subscribe((currentLang: string) => {
				const matchingAppLanguage: StarkLanguage | undefined = this.appMetadata.supportedLanguages.filter(
					(language: StarkLanguage) => language.code === currentLang
				)[0];

				// change the Moment locale to the matching locale from AppMetadata or use the 'currentLang' instead if no locale matched
				// IMPORTANT: Moment won't change the locale (it will keep the current one) if it doesn't know the locale specified
				const momentLocale = matchingAppLanguage
					? moment.locale(matchingAppLanguage.isoCode.toLowerCase())
					: moment.locale(currentLang);

				// finally, the locale of the Material Moment Adapter should be set
				this.dateAdapter.setLocale(momentLocale);
			});
	}
}
