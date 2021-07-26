import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Renderer2,
	ViewEncapsulation
} from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { Subscription } from "rxjs";

import {
	STARK_APP_METADATA,
	STARK_LOGGING_SERVICE,
	STARK_SESSION_SERVICE,
	StarkApplicationMetadata,
	StarkLanguage,
	StarkLoggingService,
	StarkSessionService
} from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * @ignore
 */
const componentName = "stark-language-selector";

export type StarkLanguageSelectorMode = "dropdown" | "toolbar";

/**
 * Component to select the application's language from a list of available languages passed as parameter.
 */
@Component({
	selector: "stark-language-selector",
	templateUrl: "./language-selector.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkLanguageSelectorComponent extends AbstractStarkUiComponent implements OnInit, OnDestroy {
	/**
	 * HTML id of the language selector component.
	 */
	@Input()
	public languageSelectorId = "";

	/**
	 * In which 'mode' the language selector is displayed: dropdown / toolbar
	 */
	@Input()
	public mode: StarkLanguageSelectorMode = "dropdown";

	/**
	 * The currently selected language
	 */
	@Input()
	public selectedLanguage = "undefined";

	/**
	 * A reference to the sessionService subscription, needed to unsubscribe upon destroy.
	 */
	private sessionServiceSubscription!: Subscription;

	/**
	 * Class constructor
	 * @param appMetadata - The Metadata of the application the contains the supportedLanguages
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param sessionService - The `StarkSessionService` instance of the application.
	 * @param dateAdapter - Needed to change the locale of the DateAdapter
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 * @param cdRef - Reference to the change detector attached to this component.
	 */
	public constructor(
		@Inject(STARK_APP_METADATA) public appMetadata: StarkApplicationMetadata,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		public dateAdapter: DateAdapter<any>,
		renderer: Renderer2,
		elementRef: ElementRef,
		protected cdRef: ChangeDetectorRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.logger.debug(componentName + ": controller initialized");

		this.sessionServiceSubscription = this.sessionService.getCurrentLanguage().subscribe(
			(language: string) => {
				this.selectedLanguage = language;
				this.cdRef.detectChanges(); // necessary because of the ChangeDetectionStrategy.OnPush
			},
			() => this.logger.error(componentName + ": an error occurred getting the current language.")
		);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		if (this.sessionServiceSubscription) {
			this.sessionServiceSubscription.unsubscribe();
		}
	}

	/**
	 * Change the current language based on the selection made by the user
	 */
	public changeLanguage(language: string): void {
		if (this.selectedLanguage !== language) {
			this.logger.debug(componentName + ": setting session current language => " + language);
			this.selectedLanguage = language;
			this.sessionService.setCurrentLanguage(this.selectedLanguage);

			const languageIndex: number = this.appMetadata.supportedLanguages.findIndex((starkLanguage: StarkLanguage) => {
				return starkLanguage.code === this.selectedLanguage;
			});

			if (languageIndex >= 0) {
				const locale: string = this.appMetadata.supportedLanguages[languageIndex].isoCode;
				this.dateAdapter.setLocale(locale);
				this.logger.debug(componentName + ": locale changed to => " + locale);
			}
		}
	}

	/**
	 * @ignore
	 */
	public trackLanguage(_index: number, language: StarkLanguage): string {
		return language.isoCode;
	}
}
