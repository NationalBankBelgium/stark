/* eslint-disable @angular-eslint/component-max-inline-declarations, @angular-eslint/no-lifecycle-call, import/no-deprecated */
import { SelectionModel } from "@angular/cdk/collections";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { By } from "@angular/platform-browser";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAction, StarkActionBarModule } from "@nationalbankbelgium/stark-ui/src/modules/action-bar";
import { StarkTableMultisortDialogComponent } from "./dialogs/multisort.component";
import { StarkTableComponent } from "./table.component";
import { StarkTableColumnComponent } from "./column.component";
import { StarkMinimapModule } from "@nationalbankbelgium/stark-ui/src/modules/minimap";
import { StarkPaginationModule } from "@nationalbankbelgium/stark-ui/src/modules/pagination";
import { StarkTableRowContentDirective } from "../directives/table-row-content.directive";
import { StarkTableColumnFilter, StarkTableColumnProperties, StarkTableFilter, StarkTableRowActions } from "../entities";
import find from "lodash-es/find";
import noop from "lodash-es/noop";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

@Component({
	selector: `host-component`,
	template: `
		<stark-table
			[columnProperties]="columnProperties"
			[customTableActions]="customTableActions"
			[data]="dummyData"
			[filter]="tableFilter"
			[fixedHeader]="fixedHeader"
			[multiSort]="multiSort"
			[rowsSelectable]="rowsSelectable"
			[multiSelect]="multiSelect"
			[showRowsCounter]="showRowsCounter"
			[showRowIndex]="showRowIndex"
			[orderProperties]="orderProperties"
			[selection]="selection"
			[tableRowActions]="tableRowActions"
			[rowClassNameFn]="rowClassNameFn"
			[expandedRows]="expandedRows"
			(rowClicked)="rowClickHandler($event)"
		>
			<ng-container *ngIf="customRowTesting">
				<ng-container
					[ngSwitch]="true"
					*starkTableRowContent="let rowData = rowData; let cellRawValue = rawValue; let cellDisplayedValue = displayedValue"
				>
					<div class="custom" *ngSwitchCase="rowData.id === 1"
						><span style="color: blue">{{ cellDisplayedValue }}</span></div
					>
					<div class="custom" *ngSwitchCase="rowData.id === 2"
						><span style="color: red">{{ cellDisplayedValue }}</span></div
					>
					<div class="custom" *ngSwitchCase="rowData.id === 3"
						><i>{{ cellDisplayedValue }}</i></div
					>
					<div class="custom" *ngSwitchCase="cellRawValue > 23">
						<mat-icon class="mat-icon-rtl-mirror" svgIcon="thumb-up"></mat-icon>
						{{ cellDisplayedValue }}
					</div>
					<div class="custom" *ngSwitchDefault>{{ cellDisplayedValue }}</div>
				</ng-container>
			</ng-container>
			<ng-container *ngIf="expandRowTesting">
				<ng-container *starkTableExpandDetail="let row">
					{{ row | json }}
				</ng-container>
			</ng-container>
		</stark-table>
	`
})
class TestHostComponent {
	@ViewChild(StarkTableComponent, { static: true })
	public tableComponent!: StarkTableComponent;

	public columnProperties?: StarkTableColumnProperties[];
	public customTableActions?: StarkAction[];
	public dummyData: object[] = [];
	public expandedRows: object[] = [];
	public fixedHeader?: string;
	public rowsSelectable?: boolean;
	public multiSelect?: string;
	public multiSort?: string;
	public showRowsCounter?: boolean;
	public showRowIndex?: boolean;
	public tableRowActions?: StarkTableRowActions;
	public tableFilter?: StarkTableFilter;
	public orderProperties?: string[];
	public selection?: SelectionModel<object>;
	public rowClassNameFn?: (row: object, index: number) => string;
	public rowClickHandler?: (row: object) => void;
	public customRowTesting?: boolean;
	public expandRowTesting?: boolean;
}

describe("TableComponent", () => {
	let component: StarkTableComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;

	const dummyCompareFn: StarkTableColumnProperties["compareFn"] = (obj1: string, obj2: string): number => {
		if (obj1 > obj2) {
			return 1;
		} else if (obj1 < obj2) {
			return -1;
		}

		return 0;
	};

	const triggerClick: Function = (element: HTMLElement): void => {
		// more verbose way to create and trigger an event (the only way it works in IE)
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
		const clickEvent: Event = document.createEvent("Event");
		clickEvent.initEvent("click", true, true);
		element.dispatchEvent(clickEvent);
	};

	const DUMMY_DATA: object[] = [
		{ id: 1, description: "dummy 1" },
		{ id: 2, description: "dummy 2" },
		{ id: 3, description: "dummy 3" }
	];

	const getColumnSelector = (columnName: string): string => `.stark-table th.mat-column-${columnName} div div`;
	const columnSelectSelector = "cdk-column-select";
	const rowSelector = "table tbody tr";

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			imports: [
				// Common
				FormsModule,
				ReactiveFormsModule,
				NoopAnimationsModule,
				TranslateModule.forRoot(),

				// Stark
				StarkActionBarModule,
				StarkPaginationModule,
				StarkMinimapModule,

				// Material
				MatCheckboxModule,
				MatDialogModule,
				MatIconModule,
				MatIconTestingModule,
				MatInputModule,
				MatMenuModule,
				MatSelectModule,
				MatTableModule,
				MatTooltipModule
			],
			declarations: [
				TestHostComponent,
				StarkTableComponent,
				StarkTableColumnComponent,
				StarkTableMultisortDialogComponent,
				StarkTableRowContentDirective
			],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }, TranslateService]
		}).compileComponents()));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostFixture.detectChanges(); // trigger initial data binding

		component = hostComponent.tableComponent;
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.dialogService).not.toBeNull();
			expect(component.dialogService).toBeDefined();
			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});

		it("should NOT have any inputs set", () => {
			expect(component.columnProperties).toEqual([]);
			expect(component.data).toBe(hostComponent.dummyData);
			expect(component.filter).toBeDefined(); // the default filter is set
			expect(component.fixedHeader).toBe(<any>hostComponent.fixedHeader);
			expect(component.multiSelect).toBe(hostComponent.multiSelect);
			expect(component.multiSort).toBe(<any>hostComponent.multiSort);
			expect(component.orderProperties).toBe(hostComponent.orderProperties);
			expect(component.showRowsCounter).toBe(false);
			expect(component.showRowIndex).toBe(false);
			expect(component.tableRowActions).toBe(<any>hostComponent.tableRowActions);
		});
	});

	describe("on change", () => {
		const tableThSelector = ".stark-table thead tr th";

		it("should make a copy of 'data' in 'dataSource' when 'data' changes to keep 'data' immutable", () => {
			const dummyData = [{ name: "test-data" }];
			hostComponent.dummyData = dummyData;
			hostFixture.detectChanges();
			expect(component.data).toEqual(dummyData);
			expect(component.dataSource.data).toEqual(dummyData);
			expect(component.dataSource.data).not.toBe(component.data);
		});

		it("should trigger resetFilterValueOnDataChange and sortData methods when data changes", () => {
			spyOn(component, "resetFilterValueOnDataChange");
			spyOn(component, "sortData");
			spyOn(component, "applyFilter");

			hostComponent.orderProperties = ["name"];
			hostFixture.detectChanges();
			(<Spy>component.resetFilterValueOnDataChange).calls.reset();
			(<Spy>component.sortData).calls.reset();
			hostComponent.dummyData = [{ name: "test-data" }];
			hostFixture.detectChanges();
			expect(component.resetFilterValueOnDataChange).toHaveBeenCalledTimes(1);
			expect(component.sortData).toHaveBeenCalledTimes(1);

			hostComponent.orderProperties = [];
			hostFixture.detectChanges();
			(<Spy>component.resetFilterValueOnDataChange).calls.reset();
			(<Spy>component.sortData).calls.reset();
			hostComponent.dummyData = [{ name: "test-data-1" }];
			hostFixture.detectChanges();
			expect(component.resetFilterValueOnDataChange).toHaveBeenCalledTimes(1);
			expect(component.sortData).not.toHaveBeenCalled();
			expect(component.dataSource.data).toEqual([{ name: "test-data-1" }]);

			hostComponent.orderProperties = undefined;
			hostFixture.detectChanges();
			(<Spy>component.resetFilterValueOnDataChange).calls.reset();
			(<Spy>component.sortData).calls.reset();
			hostComponent.dummyData = [{ name: "test-data-2" }];
			hostFixture.detectChanges();
			expect(component.resetFilterValueOnDataChange).toHaveBeenCalledTimes(1);
			expect(component.sortData).not.toHaveBeenCalled();
			expect(component.dataSource.data).toEqual([{ name: "test-data-2" }]);
		});

		it("should change internal 'selection' when 'selection' is managed by host and then trigger selectChanged", () => {
			const dummySelectedRows = [{ name: "selected-data-1" }, { name: "selected-data-2" }, { name: "selected-data-3" }];
			spyOn(component.selectChanged, "emit");

			hostComponent.selection = new SelectionModel<object>(true, []);
			hostFixture.detectChanges();
			expect(hostComponent.selection).toEqual(component.selection);

			hostComponent.selection.select(...dummySelectedRows);
			expect(component.selection.selected).toEqual(dummySelectedRows);
			expect(component.selection.isSelected(dummySelectedRows[0])).toBe(true);
			expect(component.selection.isSelected(dummySelectedRows[1])).toBe(true);
			expect(component.selection.isSelected(dummySelectedRows[2])).toBe(true);
			expect(component.selectChanged.emit).toHaveBeenCalledTimes(1);
			expect(component.selectChanged.emit).toHaveBeenCalledWith(dummySelectedRows);

			(<Spy>component.selectChanged.emit).calls.reset();
			hostComponent.selection.clear();
			expect(component.selection.selected).toEqual([]);
			expect(component.selectChanged.emit).toHaveBeenCalledTimes(1);
			expect(component.selectChanged.emit).toHaveBeenCalledWith([]);
		});

		it("should change host 'selection' when 'selection' is managed by host and then trigger selectChanged", () => {
			const dummySelectedRows = [{ name: "selected-data-1" }, { name: "selected-data-2" }, { name: "selected-data-3" }];
			spyOn(component.selectChanged, "emit");

			hostComponent.selection = new SelectionModel<object>(true, []);
			hostFixture.detectChanges();
			expect(hostComponent.selection).toEqual(component.selection);

			component.selection.select(...dummySelectedRows);
			expect(hostComponent.selection.selected).toEqual(dummySelectedRows);
			expect(hostComponent.selection.isSelected(dummySelectedRows[0])).toBe(true);
			expect(hostComponent.selection.isSelected(dummySelectedRows[1])).toBe(true);
			expect(hostComponent.selection.isSelected(dummySelectedRows[2])).toBe(true);
			expect(component.selectChanged.emit).toHaveBeenCalledTimes(1);
			expect(component.selectChanged.emit).toHaveBeenCalledWith(dummySelectedRows);

			(<Spy>component.selectChanged.emit).calls.reset();
			component.selection.clear();
			expect(hostComponent.selection.selected).toEqual([]);
			expect(component.selectChanged.emit).toHaveBeenCalledTimes(1);
			expect(component.selectChanged.emit).toHaveBeenCalledWith([]);
		});

		it("should assign right value to isFixedHeaderEnabled when fixedHeader changes", () => {
			hostComponent.fixedHeader = "true";
			hostFixture.detectChanges();
			expect(component.isFixedHeaderEnabled).toBe(true);

			hostComponent.fixedHeader = "false";
			hostFixture.detectChanges();
			expect(component.isFixedHeaderEnabled).toBe(false);
		});

		it("should assign right value to isMultiSortEnabled when multiSort changes", () => {
			hostComponent.multiSort = "true";
			hostFixture.detectChanges();
			expect(component.isMultiSortEnabled).toBe(true);

			hostComponent.multiSort = "false";
			hostFixture.detectChanges();
			expect(component.isMultiSortEnabled).toBe(false);
		});

		it("should assign right value to display/hide 'select' column when 'selection' changes", () => {
			expect(component.displayedColumns.indexOf("select") > -1).toBe(false);
			let rowThElements = <NodeListOf<HTMLElement>>hostFixture.nativeElement.querySelectorAll(tableThSelector);
			expect(rowThElements.length).toBeGreaterThanOrEqual(0);
			let selectThElement = find(rowThElements, (thElement: HTMLElement) => thElement.className.indexOf(columnSelectSelector) > -1);
			expect(selectThElement).toBeUndefined();

			hostComponent.selection = new SelectionModel<object>();
			hostFixture.detectChanges();

			expect(component.displayedColumns.indexOf("select") > -1).toBe(true);
			rowThElements = <NodeListOf<HTMLElement>>hostFixture.nativeElement.querySelectorAll(tableThSelector);
			expect(rowThElements.length).toBeGreaterThan(0);
			selectThElement = find(rowThElements, (thElement: HTMLElement) => thElement.className.indexOf(columnSelectSelector) > -1);
			expect(selectThElement).toBeDefined();

			hostComponent.selection = <any>undefined;
			hostFixture.detectChanges();
			expect(component.displayedColumns.indexOf("select") > -1).toBe(false);
			rowThElements = <NodeListOf<HTMLElement>>hostFixture.nativeElement.querySelectorAll(tableThSelector);
			expect(rowThElements.length).toBeGreaterThanOrEqual(0);
			selectThElement = find(rowThElements, (thElement: HTMLElement) => thElement.className.indexOf(columnSelectSelector) > -1);
			expect(selectThElement).toBeUndefined();
		});

		it("should assign right value to display/hide 'select' column when rowsSelectable changes", () => {
			hostComponent.rowsSelectable = true;
			hostFixture.detectChanges();

			expect(component.displayedColumns.indexOf("select") > -1).toBe(true);
			let rowThElements = <NodeListOf<HTMLElement>>hostFixture.nativeElement.querySelectorAll(tableThSelector);
			expect(rowThElements.length).toBeGreaterThan(0);
			let selectThElement = find(rowThElements, (thElement: HTMLElement) => thElement.className.indexOf(columnSelectSelector) > -1);
			expect(selectThElement).toBeDefined();

			hostComponent.rowsSelectable = false;
			hostFixture.detectChanges();
			expect(component.displayedColumns.indexOf("select") > -1).toBe(false);
			rowThElements = <NodeListOf<HTMLElement>>hostFixture.nativeElement.querySelectorAll(tableThSelector);
			expect(rowThElements.length).toBeGreaterThanOrEqual(0);
			selectThElement = find(rowThElements, (thElement: HTMLElement) => thElement.className.indexOf(columnSelectSelector) > -1);
			expect(selectThElement).toBeUndefined();
		});

		it("should assign right value to _showRowIndex when showRowIndex changes and adapt displayedColumns", () => {
			hostComponent.showRowIndex = true;
			hostFixture.detectChanges();
			expect(component.showRowIndex).toBe(true);
			expect(component.displayedColumns.indexOf("rowIndex") > -1).toBe(true);
			let rowThElements = <NodeListOf<HTMLElement>>hostFixture.nativeElement.querySelectorAll(tableThSelector);
			expect(rowThElements.length).toBeGreaterThan(0);
			let rowIndexThElement = find(
				rowThElements,
				(thElement: HTMLElement) => thElement.className.indexOf("cdk-column-rowIndex") > -1
			);
			expect(rowIndexThElement).toBeDefined();

			hostComponent.showRowIndex = false;
			hostFixture.detectChanges();
			expect(component.showRowIndex).toBe(false);
			expect(component.displayedColumns.indexOf("rowIndex") > -1).toBe(false);
			rowThElements = <NodeListOf<HTMLElement>>hostFixture.nativeElement.querySelectorAll(tableThSelector);
			expect(rowThElements.length).toBeGreaterThanOrEqual(0);
			rowIndexThElement = find(rowThElements, (thElement: HTMLElement) => thElement.className.indexOf("cdk-column-rowIndex") > -1);
			expect(rowIndexThElement).toBeUndefined();
		});

		it("should assign the right value to filter", () => {
			hostComponent.tableFilter = {
				globalFilterValue: "test"
			};
			hostFixture.detectChanges();
			expect(component.filter).toEqual({
				globalFilterValue: "test",
				globalFilterPresent: true,
				filterPosition: "below"
			});
		});

		it("should trigger sortData method when orderProperties changes", () => {
			spyOn(component, "sortData");
			hostComponent.orderProperties = ["test"];
			hostFixture.detectChanges();
			expect(component.sortData).toHaveBeenCalledTimes(1);
			expect(component.orderProperties).toEqual(["test"]);
		});

		it("should display/hide the counter element when 'showRowsCounter' changes", () => {
			const rowsCounterSelector = ".stark-table-rows-counter";
			hostComponent.dummyData = [
				{ name: "dummy-data-1" },
				{ name: "dummy-data-2" },
				{ name: "dummy-data-3" },
				{ name: "dummy-data-4" }
			];
			hostFixture.detectChanges();

			let rowsCounterElement = hostFixture.debugElement.nativeElement.querySelector(rowsCounterSelector);
			expect(rowsCounterElement).toBeNull();
			expect(component.showRowsCounter).toBe(false);

			hostComponent.showRowsCounter = true;
			hostFixture.detectChanges();
			expect(component.showRowsCounter).toBe(true);
			rowsCounterElement = hostFixture.debugElement.nativeElement.querySelector(rowsCounterSelector);
			expect(rowsCounterElement).toBeTruthy();
			const rowsCounterNumberElement = (<HTMLElement>rowsCounterElement).querySelector("span");
			expect(rowsCounterNumberElement).toBeTruthy();
			expect((<HTMLElement>rowsCounterNumberElement).innerText).toContain("4");
		});
	});

	describe("sortData", () => {
		describe("standard data", () => {
			beforeEach(() => {
				hostComponent.columnProperties = [{ name: "a", isSortable: true }];
				hostComponent.dummyData = [{ a: 1 }, { a: 1 }, { a: 3 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 10 }, { a: 20 }];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();
			});

			it("should sort data ascending", () => {
				hostComponent.orderProperties = ["a"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: 1 },
					{ a: 1 },
					{ a: 2 },
					{ a: 3 },
					{ a: 4 },
					{ a: 5 },
					{ a: 10 },
					{ a: 20 }
				]);
			});

			it("should sort data descending", () => {
				hostComponent.orderProperties = ["-a"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: 20 },
					{ a: 10 },
					{ a: 5 },
					{ a: 4 },
					{ a: 3 },
					{ a: 2 },
					{ a: 1 },
					{ a: 1 }
				]);
			});

			it("should sort data descending column A then ascending column B", () => {
				hostComponent.dummyData = [
					{ a: 1, b: 1 },
					{ a: 1, b: 3 },
					{ a: 1, b: 2 },
					{ a: 3, b: 2 },
					{ a: 2, b: 2 },
					{ a: 4, b: 2 },
					{ a: 5, b: 2 },
					{ a: 6, b: 2 },
					{ a: 7, b: 2 }
				];
				hostComponent.columnProperties = [
					{ name: "a", isSortable: true },
					{ name: "b", isSortable: true }
				];
				hostComponent.orderProperties = ["-a", "b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: 7, b: 2 },
					{ a: 6, b: 2 },
					{ a: 5, b: 2 },
					{ a: 4, b: 2 },
					{ a: 3, b: 2 },
					{ a: 2, b: 2 },
					{ a: 1, b: 1 },
					{ a: 1, b: 2 },
					{ a: 1, b: 3 }
				]);
			});

			it("should sort string data descending column A then descending column B", () => {
				hostComponent.dummyData = [
					{ a: "a", b: "a" },
					{ a: "a", b: "c" },
					{ a: "a", b: "b" },
					{ a: "c", b: "b" },
					{ a: "b", b: "b" },
					{ a: "d", b: "b" },
					{ a: "e", b: "b" },
					{ a: "f", b: "b" },
					{ a: "g", b: "b" }
				];
				hostComponent.columnProperties = [
					{ name: "a", isSortable: true },
					{ name: "b", isSortable: true }
				];
				hostComponent.orderProperties = ["-a", "-b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: "g", b: "b" },
					{ a: "f", b: "b" },
					{ a: "e", b: "b" },
					{ a: "d", b: "b" },
					{ a: "c", b: "b" },
					{ a: "b", b: "b" },
					{ a: "a", b: "c" },
					{ a: "a", b: "b" },
					{ a: "a", b: "a" }
				]);
			});

			it("should sort data ascending if compareFn property is set", () => {
				hostComponent.columnProperties = [
					{
						name: "a",
						isSortable: true,
						compareFn: createSpy("compareFnSpy").and.callFake(dummyCompareFn)
					}
				];
				hostComponent.orderProperties = ["a"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				(<Spy>hostComponent.columnProperties[0].compareFn).calls.reset();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: 1 },
					{ a: 1 },
					{ a: 2 },
					{ a: 3 },
					{ a: 4 },
					{ a: 5 },
					{ a: 10 },
					{ a: 20 }
				]);
				expect(hostComponent.columnProperties[0].compareFn).toHaveBeenCalled();
				// Due to browsers, we cannot predict exactly the number of calls. On IE, it is 9 times, on Chrome it can be 7, 8 or 14 times depending on the version
				expect((<Spy>hostComponent.columnProperties[0].compareFn).calls.count()).toBeGreaterThanOrEqual(7);
				expect((<Spy>hostComponent.columnProperties[0].compareFn).calls.count()).toBeLessThanOrEqual(14);
			});

			it("should sort data when click on the column", () => {
				expect(component.dataSource.data).toEqual([
					{ a: 1 },
					{ a: 1 },
					{ a: 3 },
					{ a: 2 },
					{ a: 4 },
					{ a: 5 },
					{ a: 10 },
					{ a: 20 }
				]);

				const column: HTMLElement = hostFixture.debugElement.nativeElement.querySelector(getColumnSelector("a"));
				column.click();
				hostFixture.detectChanges();
				expect(component.dataSource.data).toEqual([
					{ a: 1 },
					{ a: 1 },
					{ a: 2 },
					{ a: 3 },
					{ a: 4 },
					{ a: 5 },
					{ a: 10 },
					{ a: 20 }
				]);

				column.click();
				hostFixture.detectChanges();
				expect(component.dataSource.data).toEqual([
					{ a: 20 },
					{ a: 10 },
					{ a: 5 },
					{ a: 4 },
					{ a: 3 },
					{ a: 2 },
					{ a: 1 },
					{ a: 1 }
				]);

				column.click();
				hostFixture.detectChanges();
				expect(component.dataSource.data).toEqual([
					{ a: 1 },
					{ a: 1 },
					{ a: 3 },
					{ a: 2 },
					{ a: 4 },
					{ a: 5 },
					{ a: 10 },
					{ a: 20 }
				]);
			});

			it("should sort data when click on different columns", () => {
				hostComponent.dummyData = [
					{ a: 2, b: 3, c: 1 },
					{ a: 1, b: 2, c: 3 },
					{ a: 3, b: 1, c: 2 }
				];
				hostComponent.columnProperties = [{ name: "a" }, { name: "b" }, { name: "c" }];
				hostFixture.detectChanges();
				expect(component.dataSource.data).toEqual(hostComponent.dummyData);

				const columnA: HTMLElement = hostFixture.debugElement.nativeElement.querySelector(getColumnSelector("a"));
				const columnB: HTMLElement = hostFixture.debugElement.nativeElement.querySelector(getColumnSelector("b"));
				const columnC: HTMLElement = hostFixture.debugElement.nativeElement.querySelector(getColumnSelector("c"));

				columnA.click();
				expect(component.dataSource.data).toEqual([
					{ a: 1, b: 2, c: 3 },
					{ a: 2, b: 3, c: 1 },
					{ a: 3, b: 1, c: 2 }
				]);
				columnA.click();
				expect(component.dataSource.data).toEqual([
					{ a: 3, b: 1, c: 2 },
					{ a: 2, b: 3, c: 1 },
					{ a: 1, b: 2, c: 3 }
				]);

				columnB.click();
				expect(component.dataSource.data).toEqual([
					{ a: 3, b: 1, c: 2 },
					{ a: 1, b: 2, c: 3 },
					{ a: 2, b: 3, c: 1 }
				]);
				columnB.click();
				expect(component.dataSource.data).toEqual([
					{ a: 2, b: 3, c: 1 },
					{ a: 1, b: 2, c: 3 },
					{ a: 3, b: 1, c: 2 }
				]);

				columnC.click();
				expect(component.dataSource.data).toEqual([
					{ a: 2, b: 3, c: 1 },
					{ a: 3, b: 1, c: 2 },
					{ a: 1, b: 2, c: 3 }
				]);
				columnC.click();
				expect(component.dataSource.data).toEqual([
					{ a: 1, b: 2, c: 3 },
					{ a: 3, b: 1, c: 2 },
					{ a: 2, b: 3, c: 1 }
				]);
			});
		});

		describe("nested data", () => {
			beforeEach(() => {
				hostComponent.dummyData = [
					{ a: { b: 1 } },
					{ a: { b: 1 } },
					{ a: { b: 3 } },
					{ a: { b: 2 } },
					{ a: { b: 4 } },
					{ a: { b: 5 } },
					{ a: { b: 6 } },
					{ a: { b: 7 } }
				];
				hostComponent.columnProperties = [{ name: "a.b", isSortable: true }];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();
			});

			it("should sort data ascending", () => {
				hostComponent.orderProperties = ["a.b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: { b: 1 } },
					{ a: { b: 1 } },
					{ a: { b: 2 } },
					{ a: { b: 3 } },
					{ a: { b: 4 } },
					{ a: { b: 5 } },
					{ a: { b: 6 } },
					{ a: { b: 7 } }
				]);
			});

			it("should sort data descending", () => {
				hostComponent.orderProperties = ["-a.b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: { b: 7 } },
					{ a: { b: 6 } },
					{ a: { b: 5 } },
					{ a: { b: 4 } },
					{ a: { b: 3 } },
					{ a: { b: 2 } },
					{ a: { b: 1 } },
					{ a: { b: 1 } }
				]);
			});

			it("should sort data descending column A.B then ascending column B", () => {
				hostComponent.dummyData = [
					{ a: { b: 1 }, b: 1 },
					{ a: { b: 1 }, b: 3 },
					{ a: { b: 1 }, b: 2 },
					{ a: { b: 3 }, b: 2 },
					{ a: { b: 2 }, b: 2 },
					{ a: { b: 4 }, b: 2 },
					{ a: { b: 5 }, b: 2 },
					{ a: { b: 6 }, b: 2 },
					{ a: { b: 7 }, b: 2 }
				];
				hostComponent.columnProperties = [
					{ name: "a.b", isSortable: true },
					{ name: "b", isSortable: true }
				];
				hostComponent.orderProperties = ["-a.b", "b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: { b: 7 }, b: 2 },
					{ a: { b: 6 }, b: 2 },
					{ a: { b: 5 }, b: 2 },
					{ a: { b: 4 }, b: 2 },
					{ a: { b: 3 }, b: 2 },
					{ a: { b: 2 }, b: 2 },
					{ a: { b: 1 }, b: 1 },
					{ a: { b: 1 }, b: 2 },
					{ a: { b: 1 }, b: 3 }
				]);
			});

			it("should sort data descending column A then descending column B.A", () => {
				hostComponent.dummyData = [
					{ a: 1, b: { a: 1 } },
					{ a: 1, b: { a: 3 } },
					{ a: 1, b: { a: 2 } },
					{ a: 3, b: { a: 2 } },
					{ a: 2, b: { a: 2 } },
					{ a: 4, b: { a: 2 } },
					{ a: 5, b: { a: 2 } },
					{ a: 6, b: { a: 2 } },
					{ a: 7, b: { a: 2 } }
				];
				hostComponent.columnProperties = [
					{ name: "a", isSortable: true },
					{ name: "b.a", isSortable: true }
				];
				hostComponent.orderProperties = ["-a", "-b.a"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: 7, b: { a: 2 } },
					{ a: 6, b: { a: 2 } },
					{ a: 5, b: { a: 2 } },
					{ a: 4, b: { a: 2 } },
					{ a: 3, b: { a: 2 } },
					{ a: 2, b: { a: 2 } },
					{ a: 1, b: { a: 3 } },
					{ a: 1, b: { a: 2 } },
					{ a: 1, b: { a: 1 } }
				]);
			});

			it("should sort data ascending if compareFn property is set", () => {
				hostComponent.columnProperties = [
					{
						name: "a.b",
						isSortable: true,
						compareFn: createSpy("compareFnSpy").and.callFake(dummyCompareFn)
					}
				];
				hostComponent.orderProperties = ["a.b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				(<Spy>hostComponent.columnProperties[0].compareFn).calls.reset();

				component.sortData();

				expect(component.dataSource.data).toEqual([
					{ a: { b: 1 } },
					{ a: { b: 1 } },
					{ a: { b: 2 } },
					{ a: { b: 3 } },
					{ a: { b: 4 } },
					{ a: { b: 5 } },
					{ a: { b: 6 } },
					{ a: { b: 7 } }
				]);
				expect(hostComponent.columnProperties[0].compareFn).toHaveBeenCalled();
				// Due to browsers, we cannot predict exactly the number of calls. On IE, it is 9 times, on Chrome it can be 7, 8 or 14 times depending on the version
				expect((<Spy>hostComponent.columnProperties[0].compareFn).calls.count()).toBeGreaterThanOrEqual(7);
				expect((<Spy>hostComponent.columnProperties[0].compareFn).calls.count()).toBeLessThanOrEqual(14);
			});
		});
	});

	describe("applyFilter", () => {
		function assertFilteredData(tableComponent: StarkTableComponent, tableFilter: StarkTableFilter, expectedData: object[]): void {
			hostComponent.tableFilter = tableFilter;
			hostFixture.detectChanges(); // trigger data binding
			tableComponent.ngAfterViewInit();

			tableComponent.applyFilter();
			expect(tableComponent.dataSource.filteredData).toEqual(expectedData);
		}

		beforeEach(() => {
			hostComponent.columnProperties = [
				{ name: "a", isFilterable: true },
				{ name: "b", isFilterable: true }
			];
			hostComponent.dummyData = [
				{ a: 1, b: "b" },
				{ a: 2, b: "b2" },
				{ a: 3, b: "aisfollowedbyc" },
				{ a: 4, b: "b4" },
				{ a: 5, b: "b5" },
				{ a: 6, b: "b6" },
				{ a: 7, b: "b7" },
				{ a: 7, b: "ThisShouldBeAUniqueValue" }
			];
			hostComponent.tableFilter = {};
			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		describe("global filter", () => {
			it("should trigger the filtering when filterValue is not empty", () => {
				hostComponent.tableFilter = {
					globalFilterValue: "1"
				};
				hostFixture.detectChanges();

				expect(component.dataSource.filteredData).toEqual([{ a: 1, b: "b" }]);
			});

			it("should trigger the filtering when filterValue contains a wildcard '*'", () => {
				hostComponent.tableFilter = {
					globalFilterValue: "a*c"
				};
				hostFixture.detectChanges();

				expect(component.dataSource.filteredData).toEqual([{ a: 3, b: "aisfollowedbyc" }]);
			});

			it("should trigger the filtering and return empty data when the data does not contain the filterValue", () => {
				hostComponent.tableFilter = {
					globalFilterValue: "85"
				};
				hostFixture.detectChanges();

				expect(component.dataSource.filteredData).toEqual([]);
			});

			it("should NOT trigger the filtering when filterValue is empty or undefined", () => {
				component.filter = {
					globalFilterValue: ""
				};
				component.applyFilter();
				expect(component.dataSource.filteredData).toEqual(component.data);
				expect(component.dataSource.filteredData).toEqual(hostComponent.dummyData);

				component.filter = { ...component.filter, globalFilterValue: <any>undefined };
				component.applyFilter();
				expect(component.dataSource.filteredData).toEqual(component.data);
				expect(component.dataSource.filteredData).toEqual(hostComponent.dummyData);
			});

			it("should filter the data based on the filterValue even if such value contains regexp special characters", () => {
				const mockData: object[] = [
					{ column1: "content1" + "?" + "a", column2: "content2n" },
					{ column1: "content1" + "*" + "b", column2: "content2m" },
					{ column1: "content1" + "[" + "c", column2: "content2l" },
					{ column1: "content1" + "]" + "d", column2: "content2k" },
					{ column1: "content1" + "\\" + "e", column2: "content2j" },
					{ column1: "content1" + "(" + "f", column2: "content2i" },
					{ column1: "content1" + ")" + "g", column2: "content2h" },
					{ column1: "content1" + "$" + "h", column2: "content2g" },
					{ column1: "content1" + "-" + "i", column2: "content2f" },
					{ column1: "content1" + "^" + "j", column2: "content2e" },
					{ column1: "content1" + ":" + "k", column2: "content2d" },
					{ column1: "content1" + "!" + "l", column2: "content2c" },
					{ column1: "content1" + "=" + "m", column2: "content2b" },
					{ column1: "content1" + "+" + "n", column2: "content2a" }
				];
				hostComponent.columnProperties = [
					{ name: "column1", isFilterable: true },
					{ name: "column2", isFilterable: true }
				];
				hostComponent.dummyData = mockData;

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				assertFilteredData(component, { globalFilterValue: "*" }, mockData);
				assertFilteredData(component, { globalFilterValue: "\\*" }, [mockData[1]]);
				assertFilteredData(component, { globalFilterValue: "content*e" }, [mockData[4], mockData[9]]);
				assertFilteredData(component, { globalFilterValue: "content*" }, mockData);
				assertFilteredData(component, { globalFilterValue: "\\?" }, [mockData[0]]);
				assertFilteredData(component, { globalFilterValue: "content?b" }, [mockData[12]]);
				assertFilteredData(component, { globalFilterValue: "content??b" }, [mockData[1]]);
				assertFilteredData(component, { globalFilterValue: "content?" }, mockData);
				assertFilteredData(component, { globalFilterValue: "[" }, [mockData[2]]);
				assertFilteredData(component, { globalFilterValue: "]" }, [mockData[3]]);
				assertFilteredData(component, { globalFilterValue: "\\" }, [mockData[4]]);
				assertFilteredData(component, { globalFilterValue: "(" }, [mockData[5]]);
				assertFilteredData(component, { globalFilterValue: ")" }, [mockData[6]]);
				assertFilteredData(component, { globalFilterValue: "$" }, [mockData[7]]);
				assertFilteredData(component, { globalFilterValue: "-" }, [mockData[8]]);
				assertFilteredData(component, { globalFilterValue: "^" }, [mockData[9]]);
				assertFilteredData(component, { globalFilterValue: ":" }, [mockData[10]]);
				assertFilteredData(component, { globalFilterValue: "!" }, [mockData[11]]);
				assertFilteredData(component, { globalFilterValue: "=" }, [mockData[12]]);
				assertFilteredData(component, { globalFilterValue: "+" }, [mockData[13]]);
			});

			it("should update the total number of items to paginate when the filter is changed", () => {
				hostComponent.tableFilter = { globalFilterPresent: true, globalFilterValue: "ThisShouldBeAUniqueValue" };
				hostFixture.detectChanges();
				expect(component.paginationConfig.totalItems).toBe(1);
			});

			it("should add the 'filter-enabled' CSS class to the global filter button only when filterValue is not empty", () => {
				hostComponent.tableFilter = { globalFilterValue: "some value" };
				hostFixture.detectChanges();

				const globalFilterButton = hostFixture.debugElement.query(By.css(".header .actions .button-global-filter"));

				expect(globalFilterButton.classes["filter-enabled"]).toBe(true);

				hostComponent.tableFilter = { globalFilterValue: "" };
				hostFixture.detectChanges();

				expect(globalFilterButton.classes["filter-enabled"]).toBeUndefined();
			});
		});

		describe("column filter", () => {
			it("should trigger the filtering when filterValue is not empty", () => {
				hostComponent.tableFilter = {
					columns: [{ columnName: "a", filterValue: "1" }]
				};

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.applyFilter();
				expect(component.dataSource.filteredData).toEqual([{ a: 1, b: "b" }]);
			});

			it("should trigger the filtering when filterValue contains a wildcard '*'", () => {
				hostComponent.tableFilter = {
					columns: [{ columnName: "b", filterValue: "a*c" }]
				};

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.applyFilter();
				expect(component.dataSource.filteredData).toEqual([{ a: 3, b: "aisfollowedbyc" }]);
			});

			it("should trigger the filtering and return empty data when the data does not contain the filterValue", () => {
				hostComponent.tableFilter = {
					columns: [{ columnName: "a", filterValue: "85" }]
				};

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.applyFilter();
				expect(component.dataSource.filteredData).toEqual([]);
			});

			it("should NOT trigger the filtering when filterValue is empty or undefined", () => {
				hostComponent.tableFilter = {
					columns: [{ columnName: "a", filterValue: "" }]
				};

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.applyFilter();
				expect(component.dataSource.filteredData).toEqual(component.data);
				expect(component.dataSource.filteredData).toEqual(hostComponent.dummyData);

				hostComponent.tableFilter = {
					columns: [{ columnName: "a", filterValue: <any>undefined }]
				};

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.applyFilter();
				expect(component.dataSource.filteredData).toEqual(component.data);
				expect(component.dataSource.filteredData).toEqual(hostComponent.dummyData);
			});

			it("should filter the data based on the filterValue even if such value contains regexp special characters", () => {
				const mockData: object[] = [
					{ column1: "content1" + "?" + "a", column2: "content2n" },
					{ column1: "content1" + "*" + "b", column2: "content2m" },
					{ column1: "content1" + "[" + "c", column2: "content2l" },
					{ column1: "content1" + "]" + "d", column2: "content2k" },
					{ column1: "content1" + "\\" + "e", column2: "content2j" },
					{ column1: "content1" + "(" + "f", column2: "content2i" },
					{ column1: "content1" + ")" + "g", column2: "content2h" },
					{ column1: "content1" + "$" + "h", column2: "content2g" },
					{ column1: "content1" + "-" + "i", column2: "content2f" },
					{ column1: "content1" + "^" + "j", column2: "content2e" },
					{ column1: "content1" + ":" + "k", column2: "content2d" },
					{ column1: "content1" + "!" + "l", column2: "content2c" },
					{ column1: "content1" + "=" + "m", column2: "content2b" },
					{ column1: "content1" + "+" + "n", column2: "content2a" }
				];
				hostComponent.columnProperties = [
					{ name: "column1", isFilterable: true },
					{ name: "column2", isFilterable: true }
				];
				hostComponent.dummyData = mockData;

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "*" }] }, mockData);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "\\*" }] }, [mockData[1]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "content*e" }] }, [mockData[4]]);
				assertFilteredData(component, { columns: [{ columnName: "column2", filterValue: "content*e" }] }, [mockData[9]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "content*" }] }, mockData);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "\\?" }] }, [mockData[0]]);
				assertFilteredData(component, { columns: [{ columnName: "column2", filterValue: "content?b" }] }, [mockData[12]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "content??b" }] }, [mockData[1]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "content?" }] }, mockData);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "[" }] }, [mockData[2]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "]" }] }, [mockData[3]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "\\" }] }, [mockData[4]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "(" }] }, [mockData[5]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: ")" }] }, [mockData[6]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "$" }] }, [mockData[7]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "-" }] }, [mockData[8]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "^" }] }, [mockData[9]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: ":" }] }, [mockData[10]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "!" }] }, [mockData[11]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "=" }] }, [mockData[12]]);
				assertFilteredData(component, { columns: [{ columnName: "column1", filterValue: "+" }] }, [mockData[13]]);
			});

			it("should update the total number of items to paginate when the filter is changed", () => {
				hostComponent.tableFilter = { columns: [{ columnName: "b", filterValue: "ThisShouldBeAUniqueValue" }] };
				hostFixture.detectChanges();
				expect(component.paginationConfig.totalItems).toBe(1);
			});
		});
	});

	describe("column actions", () => {
		const actionsColumnSelector = "table thead tr th.mat-column-Actions";

		it("should display the 'actions' column when 'tableRowActions' contains some actions", () => {
			hostComponent.tableRowActions = {
				actions: [
					{
						id: "edit-item",
						label: "STARK.ICONS.EDIT_ITEM",
						icon: "pencil",
						actionCall: (): void => undefined,
						isEnabled: true
					}
				]
			};
			hostFixture.detectChanges();
			component.ngAfterViewInit();

			const actionsColumnElement = hostFixture.nativeElement.querySelector(actionsColumnSelector);
			expect(actionsColumnElement).not.toBeNull();
		});

		it("should NOT display the 'actions' column when 'tableRowActions' input does NOT contain any action", () => {
			hostComponent.tableRowActions = { actions: [] };
			hostFixture.detectChanges();

			const actionsColumnElement = hostFixture.nativeElement.querySelector(actionsColumnSelector);
			expect(actionsColumnElement).toBeNull();
		});

		it("should NOT display the 'actions' column when 'tableRowActions' input is NOT defined", () => {
			hostComponent.tableRowActions = undefined;
			hostFixture.detectChanges();

			const actionsColumnElement = hostFixture.nativeElement.querySelector(actionsColumnSelector);
			expect(actionsColumnElement).toBeNull();
		});
	});

	describe("column visibility", () => {
		const columns: StarkTableColumnProperties[] = [{ name: "a" }, { name: "b", isVisible: false }, { name: "c", isVisible: true }];
		const data: any = [
			{ a: 1, b: "b1", c: "c1" },
			{ a: 2, b: "b2", c: "c2" },
			{ a: 3, b: "b3", c: "c3" }
		];
		beforeEach(() => {
			hostComponent.columnProperties = columns;
			hostComponent.dummyData = data;
			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("column a should be visible and column b hidden", () => {
			const tableHeaderElements: NodeListOf<HTMLTableHeaderCellElement> = hostFixture.nativeElement.querySelectorAll("table th");
			expect(tableHeaderElements.length).toBe(columns.length); // Will fail when columns are not rendered instead of hidden

			tableHeaderElements.forEach((tableHeaderElement: HTMLTableHeaderCellElement) => {
				const text: string = (tableHeaderElement.textContent || "").trim();

				const column: StarkTableColumnProperties | undefined = (<StarkTableColumnProperties[]>hostComponent.columnProperties).find(
					({ name }: StarkTableColumnProperties) => name === text
				);
				expect(column).toBeTruthy();
				if (!column) {
					return;
				}

				const isHidden: boolean = tableHeaderElement.classList.contains("hidden");
				expect(isHidden).toBe(
					column.isVisible === false,
					`th of column "${column.name}" should be ${column.isVisible === false ? "hidden" : "visible"}`
				);
			});
		});
	});

	describe("getUnmetFilterCriteria", () => {
		it("should return an empty criteria array when the item met ALL the filter criteria", () => {
			const itemStr = "some dummy item string";
			const itemObj: object = {
				name: "some dummy name",
				user: "item string"
			};
			const filterCriteria: RegExp[] = [/ome/, /dum/, /ring/];

			let unmetCriteria: RegExp[] = component.getUnmetFilterCriteria(itemStr, filterCriteria);
			expect(unmetCriteria.length).toBe(0);
			unmetCriteria = component.getUnmetFilterCriteria(itemObj, filterCriteria);
			expect(unmetCriteria.length).toBe(0);
		});

		it("should return a non-empty criteria array when the item met SOME or NONE filter criteria", () => {
			const itemStr = "some dummy item string";
			const itemObj: object = {
				name: "some dummy name",
				user: "item string"
			};
			let filterCriteria: RegExp[] = [/ome/, /whatever/, /ring/];

			let unmetCriteria: RegExp[] = component.getUnmetFilterCriteria(itemStr, filterCriteria);
			expect(unmetCriteria.length).toBe(1);
			expect(unmetCriteria).toEqual([/whatever/]);

			unmetCriteria = component.getUnmetFilterCriteria(itemObj, filterCriteria);
			expect(unmetCriteria.length).toBe(1);
			expect(unmetCriteria).toEqual([/whatever/]);

			filterCriteria = [/something/, /whatever/, /foo/];

			unmetCriteria = component.getUnmetFilterCriteria(itemStr, filterCriteria);
			expect(unmetCriteria.length).toBe(filterCriteria.length);
			expect(unmetCriteria).toEqual([/something/, /whatever/, /foo/]);

			unmetCriteria = component.getUnmetFilterCriteria(itemObj, filterCriteria);
			expect(unmetCriteria.length).toBe(filterCriteria.length);
			expect(unmetCriteria).toEqual([/something/, /whatever/, /foo/]);
		});
	});

	describe("getColumnSortingDirection", () => {
		it("should return the sorting direction of the given column if such column exists in the orderProperties array", () => {
			hostComponent.dummyData = [];
			hostComponent.columnProperties = [
				{ name: "a", isSortable: true },
				{ name: "b", isSortable: true }
			];
			hostComponent.orderProperties = ["-a", "b"];

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingDirection("a")).toBe("desc");
			expect(component.getColumnSortingDirection("b")).toBe("asc");
		});

		it(`should return an empty string ("") when the given column DOES NOT exist in the orderProperties array`, () => {
			hostComponent.dummyData = [];
			hostComponent.columnProperties = [
				{ name: "a", isSortable: true },
				{ name: "b", isSortable: true }
			];
			hostComponent.orderProperties = ["-a", "b"];

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingDirection("c")).toBe("");

			hostComponent.orderProperties = [];

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingDirection("c")).toBe("");

			hostComponent.orderProperties = undefined;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingDirection("c")).toBe("");
		});
	});

	describe("getColumnSortingPriority", () => {
		it("should return the sorting priority of the given column according to its position in the orderProperties array", () => {
			hostComponent.dummyData = [];
			hostComponent.columnProperties = [
				{ name: "a", isSortable: true },
				{ name: "b", isSortable: true }
			];
			hostComponent.orderProperties = ["-a", "b"];

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingPriority("a")).toBe(1);
			expect(component.getColumnSortingPriority("b")).toBe(2);
		});

		it(`should return undefined when the given column DOES NOT exist in the orderProperties array`, () => {
			hostComponent.dummyData = [];
			hostComponent.columnProperties = [
				{ name: "a", isSortable: true },
				{ name: "b", isSortable: true }
			];
			hostComponent.orderProperties = ["-a", "b"];

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingPriority("c")).toBeUndefined();

			hostComponent.orderProperties = [];

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingPriority("c")).toBeUndefined();

			hostComponent.orderProperties = undefined;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingPriority("c")).toBeUndefined();
		});
	});

	describe("getRowIndex", () => {
		it("should return the right index for every row", () => {
			for (let i = 0; i < component.dataSource.data.length; i++) {
				expect(component.getRowIndex(component.dataSource.data[i])).toBe(i + 1);
			}
		});

		it("should return 'undefined' if dataSource is not initialized yet", () => {
			component.dataSource = <any>undefined;
			expect(component.getRowIndex({ name: "dummy-row-data" })).toBeUndefined();
		});
	});

	describe("resetFilterValueOnDataChange", () => {
		const dummyGlobalFilterValue = "dummy global filter value";
		const dummyColumnFilterValue = "dummy column filter value";

		it("should reset the global filter value and return TRUE when resetGlobalFilterOnDataChange is true", () => {
			hostComponent.tableFilter = {
				globalFilterValue: dummyGlobalFilterValue,
				resetGlobalFilterOnDataChange: true,
				columns: [
					{
						columnName: "a",
						filterValue: dummyColumnFilterValue,
						resetFilterOnDataChange: false
					}
				]
			};
			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			const filterHasBeenReset: boolean = component.resetFilterValueOnDataChange();
			expect(filterHasBeenReset).toBe(true);
			expect(component.filter.globalFilterValue).toBe(undefined);
			expect(component._globalFilterFormCtrl.value).toBeNull();
			expect((<StarkTableColumnFilter[]>component.filter.columns)[0].filterValue).toBe(dummyColumnFilterValue);
		});

		it("should reset the column(s) filter value and return TRUE when the column's resetValueOnDataChange is true", () => {
			hostComponent.tableFilter = {
				globalFilterValue: dummyGlobalFilterValue,
				resetGlobalFilterOnDataChange: false,
				columns: [
					{
						columnName: "a",
						filterValue: dummyColumnFilterValue,
						resetFilterOnDataChange: true
					}
				]
			};
			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			const filterHasBeenReset: boolean = component.resetFilterValueOnDataChange();
			expect(filterHasBeenReset).toBe(true);
			expect(component.filter.globalFilterValue).toBe(dummyGlobalFilterValue);
			expect((<StarkTableColumnFilter[]>component.filter.columns)[0].filterValue).toBe("");
		});

		it("should NOT reset any filter value and return FALSE when all resetValueOnDataChange options are false", () => {
			hostComponent.tableFilter = {
				globalFilterValue: dummyGlobalFilterValue,
				resetGlobalFilterOnDataChange: false,
				columns: [{ columnName: "a", filterValue: dummyColumnFilterValue, resetFilterOnDataChange: false }]
			};
			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			const filterHasBeenReset: boolean = component.resetFilterValueOnDataChange();
			expect(filterHasBeenReset).toBe(false);
			expect(component.filter.globalFilterValue).toBe(dummyGlobalFilterValue);
			expect((<StarkTableColumnFilter[]>component.filter.columns)[0].filterValue).toBe(dummyColumnFilterValue);
		});
	});

	// TODO Move this test in "column.component.spec.ts" once https://github.com/NationalBankBelgium/stark/issues/1469 is solved.
	describe("setCellFormatter", () => {
		const dummyData: object[] = [
			{ id: 1, description: "dummy 1", test: "test-1" },
			{ id: 2, test: "test-2" },
			{ id: 3, description: "dummy 3" }
		];

		beforeEach(() => {
			hostComponent.columnProperties = [
				{ name: "id", cellFormatter: (value: any): string => (value === 1 ? "one" : "") },
				{ name: "description", cellFormatter: (value: any): string => (typeof value === "undefined" ? "-null-" : value) },
				{ name: "test" }
			];
			hostComponent.dummyData = dummyData;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("should display the formatted value in the cell instead of the raw value", () => {
			const rowIdElements = hostFixture.nativeElement.querySelectorAll("table tbody tr td.mat-column-id");

			expect(rowIdElements.length).toBe(3);
			expect(rowIdElements[0].innerText).toEqual("one");
		});

		it("should display the formatted value in the cell even if the raw value is undefined", () => {
			const rowIdElements = hostFixture.nativeElement.querySelectorAll("table tbody tr td.mat-column-description");

			expect(rowIdElements.length).toBe(3);
			expect(rowIdElements[1].innerText).toEqual("-null-");
		});

		it("should NOT display anything when the raw value is undefined and there is no 'cellFormatter' defined for the column", () => {
			const rowIdElements = hostFixture.nativeElement.querySelectorAll("table tbody tr td.mat-column-test");

			expect(rowIdElements.length).toBe(3);
			expect(rowIdElements[2].innerText).toEqual("");
		});
	});

	describe("setStyling", () => {
		const returnEvenAndOdd: (row: object, index: number) => string = (_row: object, index: number): string =>
			(index + 1) % 2 === 0 ? "even" : "odd"; // offset index with 1

		beforeEach(() => {
			hostComponent.rowClassNameFn = returnEvenAndOdd;
			hostComponent.columnProperties = [
				{ name: "id", cellClassName: (value: any): string => (value === 1 ? "one" : "") },
				{ name: "description", cellClassName: "description-body-cell", headerClassName: "description-header-cell" }
			];
			hostComponent.dummyData = DUMMY_DATA;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		describe("setRowClass", () => {
			it("first row should have class 'odd", () => {
				const tableElement: HTMLElement = hostFixture.nativeElement;
				const firstRow: HTMLElement | null = tableElement.querySelectorAll<HTMLElement>("tbody tr").item(0);
				expect(firstRow && firstRow.classList).toContain("odd");
				expect(firstRow && firstRow.classList).not.toContain("even");
			});

			it("second row should have class 'even'", () => {
				const tableElement: HTMLElement = hostFixture.nativeElement;
				const secondRow: HTMLElement | null = tableElement.querySelectorAll<HTMLElement>("tbody tr").item(1);
				expect(secondRow && secondRow.classList).toContain("even");
				expect(secondRow && secondRow.classList).not.toContain("odd");
			});
		});

		it("cell id should have class 'one'", () => {
			const tableElement: HTMLElement = hostFixture.nativeElement;
			const descriptionCell: HTMLElement | null = tableElement.querySelector("tbody tr:nth-child(1) td:nth-child(1)"); // select the id cells
			expect(descriptionCell && descriptionCell.classList).toContain("one");
		});

		it("description header cell should have class 'description-header-cell'", () => {
			const tableElement: HTMLElement = hostFixture.nativeElement;
			const descriptionCell: HTMLElement | null = tableElement.querySelector("thead th:nth-child(2)"); // select the id cells
			expect(descriptionCell && descriptionCell.classList).toContain("description-header-cell");
		});

		it("description body cells should have class 'description-body-cell'", () => {
			const tableElement: HTMLElement = hostFixture.nativeElement;
			const descriptionCells: NodeListOf<HTMLElement> = tableElement.querySelectorAll("tbody td:nth-child(2)"); // select the id cells
			descriptionCells.forEach((descriptionCell: HTMLElement) =>
				expect(descriptionCell && descriptionCell.classList).toContain("description-body-cell")
			);
		});
	});

	describe("customCellRendering", () => {
		beforeEach(() => {
			hostComponent.customRowTesting = true;
			hostComponent.columnProperties = [
				{ name: "id" },
				{ name: "description", cellClassName: (description: string): string => (description === "dummy 2" ? "danger" : "") }
			];
			hostComponent.dummyData = DUMMY_DATA;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("cell should render custom content", () => {
			const tableElement: HTMLElement = hostFixture.nativeElement;
			const contentCell: HTMLElement | null = tableElement.querySelector(".custom"); // select the class cells
			expect(contentCell).toBeTruthy();
		});
	});

	describe("cellClick", () => {
		const onClickCallbackSpy = createSpy("onClickCallback");

		beforeEach(() => {
			hostComponent.columnProperties = [{ name: "id" }, { name: "description", onClickCallback: onClickCallbackSpy }];
			hostComponent.dummyData = DUMMY_DATA;
			hostComponent.rowClickHandler = createSpy("rowClickHandlerSpy", () => undefined); // add empty function so spy can find it

			onClickCallbackSpy.calls.reset();
			(<Spy>hostComponent.rowClickHandler).calls.reset();

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("should trigger 'onClickCallback' property when click on the cell and should not emit on 'rowClicked' when 'onClickCallback' is defined", () => {
			const descriptionColumnElement = hostFixture.nativeElement.querySelector("table tbody tr td.mat-column-description");
			expect(descriptionColumnElement).not.toBeNull();

			// click on the cell
			triggerClick(descriptionColumnElement);

			// We expect "2" due to the check "columnProperties.onClickCallback instanceof Function" in table.component.ts
			expect(onClickCallbackSpy).toHaveBeenCalledTimes(2);
			expect(onClickCallbackSpy).toHaveBeenCalledWith(DUMMY_DATA[0]["description"], DUMMY_DATA[0], "description");
			expect(hostComponent.rowClickHandler).not.toHaveBeenCalled();
		});

		it("should not trigger 'onClickCallback' property when click on the cell but should emit on 'rowClicked' when 'onClickCallback' is not defined", () => {
			const idColumnElement = hostFixture.nativeElement.querySelector("table tbody tr td.mat-column-id");
			expect(idColumnElement).not.toBeNull();

			// click on the cell
			triggerClick(idColumnElement);
			expect(hostComponent.rowClickHandler).toHaveBeenCalledTimes(1);
		});
	});

	describe("rowClick", () => {
		beforeEach(() => {
			hostComponent.columnProperties = [{ name: "id" }, { name: "description" }];
			hostComponent.dummyData = DUMMY_DATA;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("should emit event when row is clicked", () => {
			// set observer
			hostComponent.rowClickHandler = createSpy("rowClickHandlerSpy", () => undefined); // add empty function so spy can find it
			hostFixture.detectChanges();

			// get a row
			const rowElement: HTMLElement | null = hostFixture.nativeElement.querySelector("tbody tr");
			if (!rowElement) {
				fail("No row element found");
				return;
			}

			// click on the row
			triggerClick(rowElement);
			hostFixture.detectChanges();

			// listener should be called with the data of the first row
			expect(hostComponent.rowClickHandler).toHaveBeenCalled();
			expect(hostComponent.rowClickHandler).toHaveBeenCalledWith(DUMMY_DATA[0]);

			// the row should not have been selected
			expect(component.selection.isSelected(DUMMY_DATA[0])).toBe(false);
		});
	});

	describe("selection", () => {
		beforeEach(() => {
			hostComponent.columnProperties = [{ name: "id" }, { name: "description" }];
			hostComponent.dummyData = DUMMY_DATA;
			hostComponent.rowsSelectable = true;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("should emit event when row is selected", () => {
			spyOn(component.selectChanged, "emit");

			const checkboxElement: HTMLElement | null = hostFixture.nativeElement.querySelector("table tbody tr input[type=checkbox]");
			const rowElement: HTMLElement = hostFixture.nativeElement.querySelector(rowSelector);
			expect(rowElement.classList).not.toContain("selected");

			if (!checkboxElement) {
				fail("Checkbox not found.");
				return;
			}
			triggerClick(checkboxElement);
			hostFixture.detectChanges();

			expect(rowElement.classList).toContain("selected");
			expect(component.selectChanged.emit).toHaveBeenCalledWith([DUMMY_DATA[0]]);
			expect(component.selection.isSelected(DUMMY_DATA[0])).toBe(true);
		});

		it("should select the right rows in the template when selecting them through host 'selection' object", () => {
			hostComponent.selection = new SelectionModel<object>(true);
			hostComponent.rowsSelectable = undefined;
			hostFixture.detectChanges();

			expect(component.selection.selected).toEqual([]);
			const rowsElements: HTMLElement[] = hostFixture.nativeElement.querySelectorAll(rowSelector);
			expect(rowsElements).not.toBeNull();
			expect(rowsElements[0].classList).not.toContain("selected");
			expect(rowsElements[1].classList).not.toContain("selected");
			expect(rowsElements[2].classList).not.toContain("selected");

			hostComponent.selection.select(DUMMY_DATA[1]);
			hostFixture.detectChanges();

			expect(component.selection.selected).toEqual([DUMMY_DATA[1]]);
			expect(rowsElements[0].classList).not.toContain("selected");
			expect(rowsElements[1].classList).toContain("selected");
			expect(rowsElements[2].classList).not.toContain("selected");
		});

		describe("select all", () => {
			let selectAllButton: HTMLButtonElement;
			const handleChange = jasmine.createSpy();

			beforeEach(() => {
				hostComponent.columnProperties = [{ name: "id" }, { name: "description" }];
				hostComponent.dummyData = DUMMY_DATA;

				hostComponent.selection = new SelectionModel<object>(true);
				hostComponent.selection.changed.subscribe(handleChange);
				handleChange.calls.reset();

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				selectAllButton = hostFixture.nativeElement.querySelector(
					"table thead tr th.mat-column-select mat-checkbox .mat-checkbox-inner-container"
				);
			});

			it("should select all rows when clicking the select all", () => {
				selectAllButton.click();
				hostFixture.detectChanges();

				expect(handleChange).toHaveBeenCalledTimes(DUMMY_DATA.length);
			});

			it("should select all rows available after filter when clicking the select all", () => {
				component.filter.columns = [{ columnName: "id", filterValue: "1" }];
				hostFixture.detectChanges();

				selectAllButton.click();
				hostFixture.detectChanges();

				expect(handleChange).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("collapsible rows", () => {
		const collapsedClass = "expanded";
		beforeEach(() => {
			hostComponent.expandRowTesting = true;
			hostComponent.columnProperties = [{ name: "id" }, { name: "description" }];
			hostComponent.dummyData = DUMMY_DATA;
			hostComponent.rowClickHandler = (row: object) =>
				(hostComponent.expandedRows = hostComponent.expandedRows.includes(row) ? [] : [row]);

			hostFixture.detectChanges();
			component.ngAfterViewInit();
		});

		it("should show the expanded row(s) when expandedRows is filled", () => {
			const rowElement: HTMLElement = hostFixture.nativeElement.querySelector(rowSelector);
			expect(rowElement.classList).not.toContain(collapsedClass);

			triggerClick(rowElement);
			hostFixture.detectChanges();

			expect(rowElement.classList).toContain(collapsedClass);
			expect(component.expandedRows).toEqual([DUMMY_DATA[0]]);
		});

		it("should hide the expanded row when expandedRows is empty", () => {
			hostComponent.expandedRows = [DUMMY_DATA[0]];
			hostFixture.detectChanges();

			const rowElement: HTMLElement = hostFixture.nativeElement.querySelector(rowSelector);
			expect(rowElement.classList).toContain(collapsedClass);

			triggerClick(rowElement);
			hostFixture.detectChanges();

			expect(rowElement.classList).not.toContain(collapsedClass);
			expect(component.expandedRows).toEqual([]);
		});
	});

	describe("async", () => {
		beforeEach(() => {
			hostComponent.columnProperties = [{ name: "id" }, { name: "description" }];
			hostComponent.dummyData = <any>undefined; // data starts uninitialized

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("should update rows after async data fetch", () => {
			const rowsBeforeData: NodeListOf<HTMLTableRowElement> = hostFixture.nativeElement.querySelectorAll(rowSelector);
			expect(rowsBeforeData.length).toBe(0);

			// "async fetch of data resolves"
			hostComponent.dummyData = DUMMY_DATA;
			hostFixture.detectChanges();

			const rowsAfterData: NodeListOf<HTMLTableRowElement> = hostFixture.nativeElement.querySelectorAll(rowSelector);
			expect(rowsAfterData.length).toBe(DUMMY_DATA.length);
		});

		it("should update pagination total after async data fetch", () => {
			expect(component.paginationConfig.totalItems).toBe(0);

			// "async fetch of data resolves"
			hostComponent.dummyData = DUMMY_DATA;
			hostFixture.detectChanges();

			expect(component.paginationConfig.totalItems).toBe(DUMMY_DATA.length);
		});
	});

	describe("custom table actions", () => {
		const action1: StarkAction = { id: "action-1", label: "action 1", icon: "question", isEnabled: true, actionCall: noop };
		const action2: StarkAction = { id: "action-2", label: "action 2", icon: "question", isEnabled: true, actionCall: noop };

		beforeEach(() => {
			hostComponent.customTableActions = [action1, action2];
			hostFixture.detectChanges();
		});

		it("should render when set", () => {
			const actionElement1 = hostFixture.debugElement.query(By.css("stark-action-bar #-action-1"));
			expect(actionElement1).toBeTruthy("First action should be rendered.");

			const actionElement2 = hostFixture.debugElement.query(By.css("stark-action-bar #-action-2"));
			expect(actionElement2).toBeTruthy("Second action should be rendered.");
		});

		it("should update when changed", () => {
			hostComponent.customTableActions = [action1];
			hostFixture.detectChanges();

			const actionElement1 = hostFixture.debugElement.query(By.css("stark-action-bar #-action-1"));
			expect(actionElement1).toBeTruthy("First action is not rendered.");

			const actionElement2 = hostFixture.debugElement.query(By.css("stark-action-bar #-action-2"));
			expect(actionElement2).toBeNull("Section action should not be rendered.");
		});
	});
});
