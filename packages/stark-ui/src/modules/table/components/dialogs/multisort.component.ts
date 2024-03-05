import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { StarkTableColumnComponent } from "../column.component";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";
import { StarkTableColumnSortingDirection } from "../../entities";

/**
 * Content of the data to be passed to the StarkTableMultisortDialogComponent
 */
export interface StarkTableMultisortDialogData {
	/**
	 * Sortable StarkTable columns whose configuration can be defined in this dialog component
	 */
	columns: StarkTableColumnComponent[];
}

/**
 * Rule object to be configured in the StarkTableMultisortDialogComponent
 */
export interface StarkSortingRule {
	/**
	 * Sortable StarkTable column
	 */
	column: StarkTableColumnComponent;
	/**
	 * Sorting direction: "ascending" or "descending"
	 */
	sortDirection: StarkTableColumnSortingDirection;
	/**
	 * Priority of this rule. Priority is a number between 0 and 100 where 0 represents the higher priority
	 */
	sortPriority: number;
}

/**
 * Component to display the multi column sorting configuration
 */
@Component({
	selector: "stark-table-dialog-multisort",
	templateUrl: "./multisort.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: "stark-table-dialog-multisort"
	}
})
export class StarkTableMultisortDialogComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * Array of sorting rules currently applied
	 */
	public rules: StarkSortingRule[] = [];
	/**
	 * The priority to be set to a new rule when added
	 */
	public currentPriority = 0;

	/**
	 * Whether the Add button is disabled
	 */
	public isAddDisabled = false;

	/**
	 * Class constructor
	 * @param dialogRef - Reference to this dialog opened via the MatDialog service
	 * @param data - The data to be passed to this dialog component
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		public dialogRef: MatDialogRef<StarkTableMultisortDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: StarkTableMultisortDialogData,
		renderer: Renderer2,
		elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.data.columns.sort((a: StarkTableColumnComponent, b: StarkTableColumnComponent) => a.sortPriority - b.sortPriority);

		for (const column of this.data.columns) {
			if (column.sortable) {
				if (column.sortDirection) {
					this.currentPriority++;
				}
				this.rules.push({
					column: column,
					sortDirection: column.sortDirection,
					sortPriority: column.sortDirection ? this.currentPriority : 100
				});
			}
		}
		this.sortRules();
	}

	/**
	 * Called when Add button is clicked.
	 * Sets the sorting direction to "asc" to a rule that doesn't have sorting direction yet so it is displayed in the dialog
	 */
	public onAdd(): void {
		for (const rule of this.rules) {
			if (!rule.sortDirection) {
				rule.sortDirection = "asc";
				this.currentPriority++;
				rule.sortPriority = this.currentPriority;
				break;
			}
		}
		this.sortRules();
	}

	/**
	 * Called when Delete button is clicked.
	 * Deletes the given column sorting rule.
	 * @param rule - The column sorting rule to be deleted
	 */
	public onDelete(rule: StarkSortingRule): void {
		rule.sortDirection = "";
		rule.sortPriority = 100;
		this.sortRules();
	}

	/**
	 * Called when Cancel button is clicked.
	 * Closes this dialog discarding any changes done to the original sorting rules.
	 */
	public onCancel(): void {
		this.dialogRef.close(false);
	}

	/**
	 * Called when the sorting rule changes.
	 * @param oldRule - New state of the sorting rule
	 * @param newRule - Previous state of the sorting rule
	 */
	public onColumnChange(oldRule: StarkSortingRule, newRule: StarkSortingRule): void {
		newRule.sortDirection = oldRule.sortDirection;
		newRule.sortPriority = oldRule.sortPriority;
		oldRule.sortDirection = "";
		oldRule.sortPriority = 100;
		this.sortRules();
	}

	/**
	 * Called when Save button is clicked.
	 * Close the dialog returning the updated rules defined back to the dialog opener.
	 */
	public onSave(): void {
		this.dialogRef.close(this.rules);
	}

	/**
	 * Sort all sorting rules by priority
	 */
	public sortRules(): void {
		this.rules.sort((a: StarkSortingRule, b: StarkSortingRule) => a.sortPriority - b.sortPriority);
		this.isAddDisabled = this.rules.filter((rule: StarkSortingRule) => !!rule.sortDirection).length === this.rules.length;
	}

	/**
	 * @ignore
	 */
	public trackRuleFn(_index: number, item: StarkSortingRule): string {
		return item.column.name;
	}
}
