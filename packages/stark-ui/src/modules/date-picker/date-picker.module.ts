import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatDatepickerModule, MatInputModule } from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { StarkDatePickerComponent } from "./components";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [StarkDatePickerComponent],
	imports: [BrowserModule, MatDatepickerModule, MatInputModule, MatMomentDateModule, TranslateModule],
	exports: [StarkDatePickerComponent]
})
export class StarkDatePickerModule {}
