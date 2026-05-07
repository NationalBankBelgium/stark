import { Component } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { StarkTableColumnProperties } from "@nationalbankbelgium/stark-ui";

interface DummyType {
	id: number;
	title: { label: string; value: number };
	description: string;
}

const DUMMY_DATA: DummyType[] = [
	{ id: 1, title: { label: "first title (value: 1)", value: 1 }, description: "number one" },
	{ id: 10, title: { label: "second title (value: 2)", value: 2 }, description: "second description" },
	{ id: 12, title: { label: "third title (value: 3)", value: 3 }, description: "the third description" },
	{ id: 2, title: { label: "fourth title (value: 4)", value: 4 }, description: "description number four" },
	{ id: 23, title: { label: "fifth title (value: 5)", value: 5 }, description: "fifth description" },
	{ id: 222, title: { label: "sixth title (value: 6)", value: 6 }, description: "the sixth description" },
	{ id: 112, title: { label: "seventh title (value: 7)", value: 7 }, description: "seventh description" },
	{ id: 232, title: { label: "eighth title (value: 8)", value: 8 }, description: "description number eight" },
	{ id: 154, title: { label: "ninth title (value: 9)", value: 9 }, description: "the ninth description" },
	{ id: 27, title: { label: "tenth title (value: 10)", value: 10 }, description: "description number ten" },
	{ id: 86, title: { label: "eleventh title (value: 11)", value: 11 }, description: "eleventh description" },
	{ id: 44, title: { label: "twelfth title (value: 12)", value: 12 }, description: "the twelfth description" }
];

@Component({
	selector: "showcase-table-with-selection-and-row-index",
	templateUrl: "./table-with-selection-and-row-index.component.html"
})
export class TableWithSelectionAndRowIndexComponent {
	public data: DummyType[] = DUMMY_DATA;

	public columns: StarkTableColumnProperties[] = [
		{ name: "id", label: "Id", isFilterable: true, isSortable: true },
		{
			name: "title",
			label: "Title",
			cellFormatter: (value: { label: string }): string => "~" + value.label
		},
		{ name: "description", label: "Description" }
	];

	public showRowIndex = true;

	private _enableSelection = true;

	public get enableSelection(): boolean {
		return this._enableSelection;
	}

	public set enableSelection(value: boolean) {
		this._enableSelection = value;
		if (value) {
			this.selection = new SelectionModel<DummyType>(true, []);
		} else {
			this.selection = <any>undefined;
		}
	}

	public selection: SelectionModel<DummyType> = new SelectionModel<DummyType>(true, []);
}
