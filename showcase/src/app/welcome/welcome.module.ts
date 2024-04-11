import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { MatDividerModule } from "@angular/material/divider";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { NgxFormErrorsModule, NgxFormErrorsMessageService } from "@nationalbankbelgium/ngx-form-errors";
import { SharedModule } from "../shared";
import { GettingStartedPageComponent, NewsPageComponent, ReactiveFormErrorsPageComponent } from "./pages";
import { CardComponent, TranslatedFormErrorComponent } from "./pages/reactive-form-errors/components";
import { NewsItemComponent } from "./components";
import { NEWS_STATES } from "./routes";
import { ExampleViewerModule } from "../example-viewer";

@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: NEWS_STATES
		}),
		SharedModule,
		ExampleViewerModule,
		MatDividerModule,
		MatInputModule,
		MatFormFieldModule,
		NgxFormErrorsModule.forRoot({ formErrorComponent: TranslatedFormErrorComponent })
	],
	declarations: [
		GettingStartedPageComponent,
		NewsPageComponent,
		NewsItemComponent,
		ReactiveFormErrorsPageComponent,
		TranslatedFormErrorComponent,
		CardComponent
	],
	exports: [GettingStartedPageComponent, NewsPageComponent, NewsItemComponent, ReactiveFormErrorsPageComponent]
})
export class WelcomeModule {
	public constructor(private errorMessageService: NgxFormErrorsMessageService) {
		this.errorMessageService.addErrorMessages({
			required: "SHOWCASE.NGX_FORM_ERRORS.FORM.VALIDATION.REQUIRED",
			"matchingPasswords.password.required": "SHOWCASE.NGX_FORM_ERRORS.FORM.VALIDATION.PASSWORD_REQUIRED",
			minlength: "SHOWCASE.NGX_FORM_ERRORS.FORM.VALIDATION.PASSWORD.MIN_LENGTH",
			maxlength: "SHOWCASE.NGX_FORM_ERRORS.FORM.VALIDATION.PASSWORD.MAX_LENGTH",
			pattern: "SHOWCASE.NGX_FORM_ERRORS.FORM.VALIDATION.PASSWORD.PATTERN",
			areEqual: "SHOWCASE.NGX_FORM_ERRORS.FORM.VALIDATION.CONFIRM_PASSWORD.ARE_EQUAL"
		});

		this.errorMessageService.addFieldNames({
			username: "SHOWCASE.NGX_FORM_ERRORS.FIELDS.ALIAS.USER_NAME",
			"matchingPasswords.password": "not used, the alias defined via the directive takes precedence over this",
			"matchingPasswords.confirmPassword": "SHOWCASE.NGX_FORM_ERRORS.FIELDS.ALIAS.CONFIRM_PASSWORD"
		});
	}
}
