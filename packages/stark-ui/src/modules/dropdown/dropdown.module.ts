import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatLegacyOptionModule as MatOptionModule } from "@angular/material/legacy-core";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { TranslateModule } from "@ngx-translate/core";
import { StarkDropdownComponent } from "./components";

@NgModule({
	declarations: [StarkDropdownComponent],
	imports: [CommonModule, TranslateModule, MatSelectModule, MatOptionModule, ReactiveFormsModule],
	exports: [StarkDropdownComponent]
})
export class StarkDropdownModule {}
