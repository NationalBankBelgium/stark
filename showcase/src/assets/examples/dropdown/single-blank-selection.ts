import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-dropdown",
	templateUrl: "./demo-single-blank-selection.html"
})
export class DemoDropdownSingleBlankSelectionComponent implements OnInit {
	public selectedNumber: string;

	public numberDropdownOnChange(selectedValue: string): void {
		this.selectedNumber = selectedValue;
	}
}
