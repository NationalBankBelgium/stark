import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { GettingStartedPageComponent, HomePageComponent, NewsPageComponent, NoContentPageComponent } from "./pages";
import { NewsItemComponent } from "./components";
import { SharedModule } from "../shared";
import { NEWS_STATES } from "./routes";
import { DemoReactiveFormErrorsPageComponent } from "./pages/reactive-form-errors";
import { TranslatedFormErrorComponent } from "./pages/reactive-form-errors/components/translated-form-error";
import { CardComponent } from "./pages/reactive-form-errors/components/card";
import { NgxFormErrorsModule } from "@nationalbankbelgium/ngx-form-errors";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
@NgModule({
	imports: [
		UIRouterModule.forChild({
			states: NEWS_STATES
		}),
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		MatDividerModule,
		MatInputModule,
		MatFormFieldModule,
		NgxFormErrorsModule.forRoot({ formErrorComponent: TranslatedFormErrorComponent })
	],
	declarations: [
		GettingStartedPageComponent,
		HomePageComponent,
		NoContentPageComponent,
		NewsPageComponent,
		NewsItemComponent,
		DemoReactiveFormErrorsPageComponent,
		TranslatedFormErrorComponent,
		CardComponent
	],
	exports: [
		GettingStartedPageComponent,
		HomePageComponent,
		NoContentPageComponent,
		NewsPageComponent,
		NewsItemComponent,
		DemoReactiveFormErrorsPageComponent
	],
	entryComponents: [TranslatedFormErrorComponent]
})
export class WelcomeModule {}
