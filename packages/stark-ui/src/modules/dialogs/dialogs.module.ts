import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { StarkAlertDialogComponent, StarkConfirmDialogComponent, StarkPromptDialogComponent } from "./components";

@NgModule({
	declarations: [StarkAlertDialogComponent, StarkConfirmDialogComponent, StarkPromptDialogComponent],
	imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatInputModule, TranslateModule, MatIconModule],
	exports: [StarkAlertDialogComponent, StarkConfirmDialogComponent, StarkPromptDialogComponent]
})
export class StarkDialogsModule {}
