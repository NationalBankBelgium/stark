import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { StarkDatePickerModule } from "../date-picker";
import { StarkDateRangePickerComponent } from "./components";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [StarkDateRangePickerComponent],
	imports: [BrowserModule, StarkDatePickerModule, TranslateModule],
	exports: [StarkDateRangePickerComponent]
})
export class StarkDateRangePickerModule {}
