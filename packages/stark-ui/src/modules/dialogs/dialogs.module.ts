import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { TranslateModule } from "@ngx-translate/core";
import { StarkAlertDialogComponent, StarkConfirmDialogComponent, StarkPromptDialogComponent } from "./components";

@NgModule({
	declarations: [StarkAlertDialogComponent, StarkConfirmDialogComponent, StarkPromptDialogComponent],
	imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatInputModule, TranslateModule, MatIconModule],
	exports: [StarkAlertDialogComponent, StarkConfirmDialogComponent, StarkPromptDialogComponent]
})
export class StarkDialogsModule {}
