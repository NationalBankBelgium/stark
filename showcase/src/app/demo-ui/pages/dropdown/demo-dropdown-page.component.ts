import { Component, ViewEncapsulation } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-dropdown",
	styleUrls: ["./demo-dropdown-page.component.scss"],
	templateUrl: "./demo-dropdown-page.component.html",
	encapsulation: ViewEncapsulation.None // used here to be able to customize the example-viewer background color
})
export class DemoDropdownPageComponent {
	public serviceDropdownOptions = [
		{ id: "PR", value: "SHOWCASE.DEMO.DROPDOWN.PR" },
		{ id: "IO", value: "SHOWCASE.DEMO.DROPDOWN.IO" },
		{ id: "CS", value: "SHOWCASE.DEMO.DROPDOWN.CS" }
	];
	public serviceFormControl = new FormControl("", Validators.required);
	public selectedService = "";

	public selectedServiceWhiteDropdown = "";
	public selectedServices: string[] = [];

	public selectedNumber = "";

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Dropdown component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDropdownComponent.html"
		}
	];

	public numberDropdownOnChange(selectedValue: string): void {
		this.selectedNumber = selectedValue;
	}

	public multipleServicesDropdownOnChange(selectedValues: string[]): void {
		this.selectedServices = selectedValues;
	}

	public whiteDropdownOnChange(selectedValue: string): void {
		this.selectedServiceWhiteDropdown = selectedValue;
	}

	public toggleDisabledReactiveFormControl(): void {
		if (this.serviceFormControl.disabled) {
			this.serviceFormControl.enable();
		} else {
			this.serviceFormControl.disable();
		}
	}
}
