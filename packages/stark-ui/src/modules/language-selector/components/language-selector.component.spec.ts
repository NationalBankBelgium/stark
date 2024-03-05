/* angular imports */
import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { DateAdapter } from "@angular/material/core";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
/* stark-core imports */
import {
	STARK_APP_METADATA,
	STARK_LOGGING_SERVICE,
	STARK_SESSION_SERVICE,
	StarkApplicationMetadata,
	StarkApplicationMetadataImpl,
	StarkLanguages
} from "@nationalbankbelgium/stark-core";

import { MockStarkLoggingService, MockStarkSessionService } from "@nationalbankbelgium/stark-core/testing";
/* stark-ui imports */
import { StarkLanguageSelectorComponent, StarkLanguageSelectorMode } from "./language-selector.component";
import { StarkDropdownModule } from "@nationalbankbelgium/stark-ui/src/modules/dropdown";
import { of, throwError } from "rxjs";

/**
 * To be able to test changes to the input fields, the Language-Selector component is hosted inside the TestComponentHost class.
 */
@Component({
	selector: `host-component`,
	template: ` <stark-language-selector mode="mode"></stark-language-selector> `
})
class TestHostComponent {
	@ViewChild(StarkLanguageSelectorComponent, { static: true })
	public languageSelectorComponent!: StarkLanguageSelectorComponent;

	public mode?: StarkLanguageSelectorMode;
}

describe("LanguageSelectorComponent", () => {
	let component: StarkLanguageSelectorComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;

	let appMetadata: StarkApplicationMetadata;
	appMetadata = new StarkApplicationMetadataImpl();
	appMetadata.supportedLanguages = [StarkLanguages.EN_US, StarkLanguages.FR_BE, StarkLanguages.NL_BE];

	describe("on initialization", () => {
		const mockSessionService: MockStarkSessionService = new MockStarkSessionService();
		mockSessionService.getCurrentLanguage.and.returnValue(of("fr"));

		beforeEach(waitForAsync(() => compileComponent(mockSessionService)));

		beforeEach(() => {
			initializeComponent();
		});

		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});

		it("should have inputs", () => {
			expect(component.languageSelectorId).toBeDefined();
			expect(component.mode).toBeDefined();
			expect(component.selectedLanguage).toBeDefined();
		});
	});

	describe("on failing initialization", () => {
		const mockSessionService: MockStarkSessionService = new MockStarkSessionService();
		mockSessionService.getCurrentLanguage.and.returnValue(throwError("dummy-error"));

		beforeEach(waitForAsync(() => compileComponent(mockSessionService)));

		beforeEach(() => {
			initializeComponent();
		});

		it("should log an error when the sessionService.getCurrentLanguage fails", () => {
			expect(component.logger).toBeDefined();
			expect(component.logger.error).toHaveBeenCalledTimes(1);
		});
	});

	describe("on changeLanguage", () => {
		const mockSessionService: MockStarkSessionService = new MockStarkSessionService();
		mockSessionService.getCurrentLanguage.and.returnValue(of("fr"));

		beforeEach(waitForAsync(() => compileComponent(mockSessionService)));

		beforeEach(() => {
			initializeComponent();
		});

		it("should change the selected language", () => {
			expect(component.selectedLanguage).toBe("fr");
			component.changeLanguage("nl");
			expect(component.selectedLanguage).toBe("nl");
			component.changeLanguage("en");
			expect(component.selectedLanguage).toBe("en");
			component.changeLanguage("fr");
			expect(component.selectedLanguage).toBe("fr");
			component.changeLanguage("en");
			expect(component.selectedLanguage).toBe("en");
		});
	});

	/**
	 * This function contains the component compilation code
	 * Instead of repeating the code, it is placed in a separate function
	 */
	function compileComponent(mockSessionService: MockStarkSessionService): Promise<any> {
		return TestBed.configureTestingModule({
			imports: [
				CommonModule,
				MatButtonToggleModule,
				MatFormFieldModule,
				MatSelectModule,
				StarkDropdownModule,
				TranslateModule.forRoot()
			],
			declarations: [StarkLanguageSelectorComponent, TestHostComponent],
			providers: [
				{ provide: STARK_APP_METADATA, useValue: appMetadata },
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_SESSION_SERVICE, useValue: mockSessionService },
				DateAdapter
			]
		}).compileComponents();
	}

	/**
	 * This function contains the component initialization code
	 * Instead of repeating the code, it is placed in a separate function
	 */
	function initializeComponent(): void {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostFixture.detectChanges(); // trigger initial data binding
		component = hostComponent.languageSelectorComponent;
	}
});
