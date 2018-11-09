import { Component } from "@angular/core";

@Component({
	selector: "demo-dropdown",
	templateUrl: "./demo-dropdown.component.html"
})
export class DemoDropdownComponent {
	public selectedNumber: string;

	public numberDropdownOnChange(selectedValue: string): void {
		this.selectedNumber = selectedValue;
	}
}
