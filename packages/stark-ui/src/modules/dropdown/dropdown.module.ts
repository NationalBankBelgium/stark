import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { StarkDropdownComponent } from "./components";

@NgModule({
	declarations: [StarkDropdownComponent],
	imports: [CommonModule, TranslateModule, MatSelectModule, MatOptionModule, ReactiveFormsModule],
	exports: [StarkDropdownComponent]
})
export class StarkDropdownModule {}
