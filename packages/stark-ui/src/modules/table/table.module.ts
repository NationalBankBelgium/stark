import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StarkTableComponent, StarkTableColumnComponent } from "./components";
import { StarkTableMultisortDialogComponent } from "./components/dialogs/multisort.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [StarkTableComponent, StarkTableMultisortDialogComponent, StarkTableColumnComponent],
	entryComponents: [StarkTableMultisortDialogComponent],
	exports: [StarkTableComponent, StarkTableColumnComponent],
	imports: [
		BrowserAnimationsModule,
		FormsModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatPaginatorModule,
		MatSelectModule,
		MatSortModule,
		MatTableModule,
		MatTooltipModule,
		TranslateModule
	]
})
export class StarkTableModule {}
