import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-dropdown",
	templateUrl: "./demo-single-required-selection.html"
})
export class DemoDropdownSingleRequiredSelectionExample implements OnInit {
	public selectedService: string;

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

	public serviceDropdownOnChange(selectedValue: string): void {
		this.selectedService = selectedValue;
	}
}
