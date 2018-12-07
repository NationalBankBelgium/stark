/* tslint:disable:completed-docs max-inline-declarations no-identical-functions */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { StarkTableMultisortDialogComponent } from "./dialogs/multisort.component";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkTableComponent } from "./table.component";
import { StarkTableColumnComponent } from "./column.component";
import { StarkPaginationComponent } from "../../pagination/components";
import { StarkTableColumnProperties } from "./column-properties.intf";
import { StarkActionBarConfig } from "../../action-bar/components/action-bar-config.intf";
import { StarkTableFilter } from "./table-filter.intf";
import { StarkTableColumnFilter } from "./table-column-filter.intf";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

@Component({
	selector: `host-component`,
	template: `
		<stark-table
			[columnProperties]="columnProperties"
			[data]="dummyData"
			[filter]="tableFilter"
			[fixedHeader]="fixedHeader"
			[multiSort]="multiSort"
			[rowsSelectable]="rowsSelectable"
			[multiSelect]="multiSelect"
			[orderProperties]="orderProperties"
			[tableRowsActionBarConfig]="tableRowsActionBarConfig"
			[rowClassNameFn]="rowClassNameFn"
			(rowClicked)="rowClickHandler($event)"
		>
		</stark-table>
	`
})
class TestHostComponent {
	@ViewChild(StarkTableComponent)
	public tableComponent: StarkTableComponent;

	public columnProperties: StarkTableColumnProperties[];
	public dummyData: object[];
	public fixedHeader?: string;
	public rowsSelectable?: boolean;
	public multiSelect?: string;
	public multiSort?: string;
	public tableRowsActionBarConfig: StarkActionBarConfig;
	public tableFilter: StarkTableFilter;
	public orderProperties?: string[];
	public rowClassNameFn?: (row: object, index: number) => string;
	public rowClickHandler?: (row: object) => void;
}

/* tslint:disable:no-big-function */
describe("TableComponent", () => {
	let component: StarkTableComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;

	const dummyCompareFn: Function = (obj1: string, obj2: string): number => {
		if (obj1 > obj2) {
			return 1;
		} else if (obj1 < obj2) {
			return -1;
		} else {
			return 0;
		}
	};

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			imports: [
				FormsModule,
				MatCheckboxModule,
				MatDialogModule,
				MatInputModule,
				MatFormFieldModule,
				MatMenuModule,
				MatPaginatorModule,
				MatSelectModule,
				MatTableModule,
				MatTooltipModule,
				NoopAnimationsModule,
				TranslateModule.forRoot()
			],
			declarations: [
				StarkPaginationComponent,
				StarkTableComponent,
				StarkTableColumnComponent,
				StarkTableMultisortDialogComponent,
				TestHostComponent
			],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }, TranslateService],
			schemas: [NO_ERRORS_SCHEMA] // to avoid errors due to "mat-icon" directive not known (which we don't want to add in these tests)
		}).compileComponents();
	}));

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
			expect(component.columnProperties).toBe(hostComponent.columnProperties);
			expect(component.data).toBe(hostComponent.dummyData);
			expect(component.filter).toBeDefined(); // the default filter is set
			expect(component.fixedHeader).toBe(hostComponent.fixedHeader);
			expect(component.multiSelect).toBe(hostComponent.multiSelect);
			expect(component.multiSort).toBe(hostComponent.multiSort);
			expect(component.orderProperties).toBe(hostComponent.orderProperties);
			expect(component.tableRowsActionBarConfig).toBe(hostComponent.tableRowsActionBarConfig);
		});
	});

	describe("on change", () => {
		it("should trigger resetFilterValueOnDataChange and applyFilter methods when data changes", () => {
			spyOn(component, "resetFilterValueOnDataChange");
			spyOn(component, "applyFilter");

			(<Spy>component.resetFilterValueOnDataChange).and.returnValue(false);
			(<Spy>component.resetFilterValueOnDataChange).calls.reset();
			hostComponent.dummyData = [{ name: "test-data" }];
			hostFixture.detectChanges();

			(<Spy>component.resetFilterValueOnDataChange).and.returnValue(false);
			(<Spy>component.resetFilterValueOnDataChange).calls.reset();
			hostComponent.dummyData = [{ name: "test-data-2" }];
			hostFixture.detectChanges();
			expect(component.resetFilterValueOnDataChange).toHaveBeenCalledTimes(1);
			expect(component.applyFilter).not.toHaveBeenCalled();

			(<Spy>component.resetFilterValueOnDataChange).and.returnValue(true);
			(<Spy>component.resetFilterValueOnDataChange).calls.reset();
			hostComponent.dummyData = [{ name: "test-data-1" }];
			hostFixture.detectChanges();
			expect(component.resetFilterValueOnDataChange).toHaveBeenCalledTimes(1);
			expect(component.applyFilter).toHaveBeenCalledTimes(1);
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

		it("should assign right value to isMultiSelectEnabled when multiSelect changes and adapt displayedColumns", () => {
			spyOn(component.displayedColumns, "unshift");
			hostComponent.rowsSelectable = true;
			hostComponent.multiSelect = "true";
			hostFixture.detectChanges();
			expect(component.isMultiSelectEnabled).toBe(true);
			expect(component.displayedColumns.unshift).toHaveBeenCalledTimes(1);
			expect(component.displayedColumns.unshift).toHaveBeenCalledWith("select");

			(<Spy>component.displayedColumns.unshift).calls.reset();
			hostComponent.multiSelect = "false";
			hostFixture.detectChanges();
			expect(component.isMultiSelectEnabled).toBe(false);
			expect(component.displayedColumns.unshift).not.toHaveBeenCalled();
		});

		it("should assign the right value to filter", () => {
			hostComponent.tableFilter = {
				globalFilterValue: "test"
			};
			hostFixture.detectChanges();
			expect(component.filter).toEqual({
				globalFilterValue: "test",
				globalFilterPresent: true
			});
		});

		it("should trigger sortData method when orderProperties changes", () => {
			spyOn(component, "sortData");
			hostComponent.orderProperties = ["test"];
			hostFixture.detectChanges();
			expect(component.sortData).toHaveBeenCalledTimes(1);
			expect(component.orderProperties).toEqual(["test"]);
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

				expect(component.data).toEqual([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 10 }, { a: 20 }]);
			});

			it("should sort data descending", () => {
				hostComponent.orderProperties = ["-a"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.data).toEqual([{ a: 20 }, { a: 10 }, { a: 5 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }, { a: 1 }]);
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
				hostComponent.columnProperties = [{ name: "a", isSortable: true }, { name: "b", isSortable: true }];
				hostComponent.orderProperties = ["-a", "b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.data).toEqual([
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
				hostComponent.columnProperties = [{ name: "a", isSortable: true }, { name: "b", isSortable: true }];
				hostComponent.orderProperties = ["-a", "-b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.data).toEqual([
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

				expect(component.data).toEqual([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 10 }, { a: 20 }]);
				// it seems that Angular optimizes the sorting to call it the minimum times possible
				expect(hostComponent.columnProperties[0].compareFn).toHaveBeenCalledTimes(7); // 7 times instead of 8!!!
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

				expect(component.data).toEqual([
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

				expect(component.data).toEqual([
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
				hostComponent.columnProperties = [{ name: "a.b", isSortable: true }, { name: "b", isSortable: true }];
				hostComponent.orderProperties = ["-a.b", "b"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.data).toEqual([
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
				hostComponent.columnProperties = [{ name: "a", isSortable: true }, { name: "b.a", isSortable: true }];
				hostComponent.orderProperties = ["-a", "-b.a"];

				hostFixture.detectChanges(); // trigger data binding
				component.ngAfterViewInit();

				component.sortData();

				expect(component.data).toEqual([
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

				expect(component.data).toEqual([
					{ a: { b: 1 } },
					{ a: { b: 1 } },
					{ a: { b: 2 } },
					{ a: { b: 3 } },
					{ a: { b: 4 } },
					{ a: { b: 5 } },
					{ a: { b: 6 } },
					{ a: { b: 7 } }
				]);
				// it seems that Angular optimizes the sorting to call it the minimum times possible
				expect(hostComponent.columnProperties[0].compareFn).toHaveBeenCalledTimes(7); // 7 times instead of 8!!!
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
			hostComponent.columnProperties = [{ name: "a", isFilterable: true }, { name: "b", isFilterable: true }];
			hostComponent.dummyData = [
				{ a: 1, b: "b" },
				{ a: 2, b: "b2" },
				{ a: 3, b: "aisfollowedbyc" },
				{ a: 4, b: "b4" },
				{ a: 5, b: "b5" },
				{ a: 6, b: "b6" },
				{ a: 7, b: "b7" }
			];
			hostComponent.tableFilter = {};
			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		describe("global filter", () => {
			it("should trigger the filtering when filterValue is not empty", () => {
				component.filter = {
					globalFilterValue: "1"
				};
				component.applyFilter();

				expect(component.dataSource.filteredData).toEqual([{ a: 1, b: "b" }]);
			});

			it("should trigger the filtering when filterValue contains a wildcard '*'", () => {
				component.filter = {
					globalFilterValue: "a*c"
				};
				component.applyFilter();
				expect(component.dataSource.filteredData).toEqual([{ a: 3, b: "aisfollowedbyc" }]);
			});

			it("should trigger the filtering and return empty data when the data does not contain the filterValue", () => {
				component.filter = {
					globalFilterValue: "85"
				};
				component.applyFilter();
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
				hostComponent.columnProperties = [{ name: "column1", isFilterable: true }, { name: "column2", isFilterable: true }];
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
				hostComponent.columnProperties = [{ name: "column1", isFilterable: true }, { name: "column2", isFilterable: true }];
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
		});
	});

	describe("getUnmetFilterCriteria", () => {
		it("should return an empty criteria array when the item met ALL the filter criteria", () => {
			const itemStr: string = "some dummy item string";
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
			const itemStr: string = "some dummy item string";
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
			hostComponent.columnProperties = [{ name: "a", isSortable: true }, { name: "b", isSortable: true }];
			hostComponent.orderProperties = ["-a", "b"];

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingDirection("a")).toBe("desc");
			expect(component.getColumnSortingDirection("b")).toBe("asc");
		});

		it(`should return an empty string ("") when the given column DOES NOT exist in the orderProperties array`, () => {
			hostComponent.dummyData = [];
			hostComponent.columnProperties = [{ name: "a", isSortable: true }, { name: "b", isSortable: true }];
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
			hostComponent.columnProperties = [{ name: "a", isSortable: true }, { name: "b", isSortable: true }];
			hostComponent.orderProperties = ["-a", "b"];

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();

			expect(component.getColumnSortingPriority("a")).toBe(1);
			expect(component.getColumnSortingPriority("b")).toBe(2);
		});

		it(`should return undefined when the given column DOES NOT exist in the orderProperties array`, () => {
			hostComponent.dummyData = [];
			hostComponent.columnProperties = [{ name: "a", isSortable: true }, { name: "b", isSortable: true }];
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

	describe("resetFilterValueOnDataChange", () => {
		const dummyGlobalFilterValue: string = "dummy global filter value";
		const dummyColumnFilterValue: string = "dummy column filter value";

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
			expect(component.filter.globalFilterValue).toBe("");
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

	describe("setStyling", () => {
		const dummyData: object[] = [
			{ id: 1, description: "dummy 1" },
			{ id: 2, description: "dummy 2" },
			{ id: 3, description: "dummy 3" }
		];
		const returnEvenAndOdd: (row: object, index: number) => string = (_row: object, index: number): string =>
			(index + 1) % 2 === 0 ? "even" : "odd"; // offset index with 1

		beforeEach(() => {
			hostComponent.rowClassNameFn = returnEvenAndOdd;
			hostComponent.columnProperties = [
				{ name: "id", cellClassName: (value: any) => (value === 1 ? "one" : "") },
				{ name: "description", cellClassName: "description-body-cell", headerClassName: "description-header-cell" }
			];
			hostComponent.dummyData = dummyData;

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

	describe("rowClick", () => {
		const dummyData: object[] = [
			{ id: 1, description: "dummy 1" },
			{ id: 2, description: "dummy 2" },
			{
				id: 3,
				description: "dummy 3"
			}
		];

		beforeEach(() => {
			hostComponent.columnProperties = [{ name: "id" }, { name: "description" }];
			hostComponent.dummyData = dummyData;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("should emit event when row is clicked", () => {
			// set observer
			hostComponent.rowClickHandler = () => undefined; // add empty function so spy can find it
			spyOn(hostComponent, "rowClickHandler");
			hostFixture.detectChanges();

			// get a row
			const rowElement: HTMLElement | null = hostFixture.nativeElement.querySelector("tbody tr");
			if (!rowElement) {
				fail("No row element found");
				return;
			}

			// click on the row
			rowElement.dispatchEvent(new Event("click"));
			hostFixture.detectChanges();

			// listener should be called with the data of the first row
			expect(hostComponent.rowClickHandler).toHaveBeenCalled();
			expect(hostComponent.rowClickHandler).toHaveBeenCalledWith(dummyData[0]);

			// the row should not have been selected
			expect(component.selection.isSelected(dummyData[0])).toBe(false);
		});
	});

	describe("selection", () => {
		const dummyData: object[] = [
			{ id: 1, description: "dummy 1" },
			{ id: 2, description: "dummy 2" },
			{
				id: 3,
				description: "dummy 3"
			}
		];

		beforeEach(() => {
			hostComponent.columnProperties = [{ name: "id" }, { name: "description" }];
			hostComponent.dummyData = dummyData;
			hostComponent.rowsSelectable = true;

			hostFixture.detectChanges(); // trigger data binding
			component.ngAfterViewInit();
		});

		it("should emit event when row is selected", () => {
			spyOn(component.selectChanged, "emit");

			const checkboxElement: HTMLElement | null = hostFixture.nativeElement.querySelector("table tbody tr input[type=checkbox]");
			if (!checkboxElement) {
				fail("Checkbox not found.");
				return;
			}
			checkboxElement.dispatchEvent(new Event("click"));
			hostFixture.detectChanges();

			expect(component.selectChanged.emit).toHaveBeenCalledWith([dummyData[0]]);
		});
	});
});
