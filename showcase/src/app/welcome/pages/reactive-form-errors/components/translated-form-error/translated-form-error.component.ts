import { Component, HostBinding, OnInit } from "@angular/core";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { NgxFormErrorComponent, NgxFormFieldError } from "@nationalbankbelgium/ngx-form-errors";

@Component({
	selector: "app-translated-form-error",
	templateUrl: "./translated-form-error.component.html"
})
export class TranslatedFormErrorComponent implements NgxFormErrorComponent, OnInit {
	@HostBinding("class")
	public cssClass = "translated-form-error";

	public errors: NgxFormFieldError[] = [];
	public errors$!: Observable<NgxFormFieldError[]>;
	public fieldName!: string;

	public constructor(public translateService: TranslateService) {}

	public ngOnInit(): void {
		this.translateService.onLangChange.subscribe((_ev: LangChangeEvent) => {
			this.updateTranslateFieldName(this.translateService.instant(this.fieldName));
		});
	}

	public subscribeToErrors(): void {
		this.errors$.subscribe((errors: NgxFormFieldError[]) => {
			this.errors = errors;

			if (errors.length) {
				// the formField can be retrieved from the "fieldName" param of any of the errors
				this.fieldName = errors[0].params.fieldName;
				this.updateTranslateFieldName(this.translateService.instant(this.fieldName));
			}
		});
	}

	public updateTranslateFieldName(translatedFieldName: string): void {
		for (const error of this.errors) {
			error.params = { ...error.params, fieldName: translatedFieldName };
		}
	}

	public trackError(index: number): number {
		return index;
	}
}
