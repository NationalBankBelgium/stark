import { Component, OnInit } from "@angular/core";

@Component({
	selector: "showcase-demo-dropdown",
	styleUrls: ["./dropdown.component.scss"],
	templateUrl: "./dropdown.component.html"
})
export class DropdownComponent implements OnInit {
	public selectedService: string;
	public selectedServices: string[];
	public selectedRequiredServices: string[];
	public selectedNumber: string;

	public serviceDropdownOptions: any[];
	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.serviceDropdownOptions = [
			{ id: "PR", value: "SHOWCASE.DEMO.DROPDOWNS.PR" },
			{ id: "IO", value: "SHOWCASE.DEMO.DROPDOWNS.IO" },
			{ id: "CS", value: "SHOWCASE.DEMO.DROPDOWNS.CS" }
		];
	}

	public serviceDropdownOnChange(selectedValue: string): void {
		this.selectedService = selectedValue;
	}

	public numberDropdownOnChange(selectedValue: string): void {
		this.selectedNumber = selectedValue;
	}

	public multipleServicesDropdownOnChange(selectedValues: string[]): void {
		this.selectedServices = selectedValues;
	}

	public multipleServicesRequiredDropdownOnChange(selectedValues: string[]): void {
		this.selectedRequiredServices = selectedValues;
	}
}
