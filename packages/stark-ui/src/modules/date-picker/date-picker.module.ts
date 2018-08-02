import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { StarkDatePickerComponent } from "./components";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [StarkDatePickerComponent],
	imports: [CommonModule, MatDatepickerModule, MatInputModule, MatMomentDateModule, TranslateModule],
	exports: [StarkDatePickerComponent]
})
export class StarkDatePickerModule {}
