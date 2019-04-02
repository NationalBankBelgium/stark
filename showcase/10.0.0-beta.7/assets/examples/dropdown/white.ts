import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-dropdown",
	styleUrls: ["./demo-dropdown.component.scss"],
	templateUrl: "./demo-dropdown.component.html"
})
export class DemoDropdownComponent implements OnInit {
	public selectedServiceWhiteDropdown: string;

	public serviceDropdownOptions: any[];

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.serviceDropdownOptions = [
			{ id: "PR", value: "IT application" },
			{ id: "IO", value: "Informatics infrastructure and operations" },
			{ id: "CS", value: "IT customer services" }
		];
	}

	public whiteDropdownOnChange(selectedValue: string): void {
		this.selectedServiceWhiteDropdown = selectedValue;
	}
}
