import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-dropdown",
	styleUrls: ["./demo-dropdown-page.component.scss"],
	templateUrl: "./demo-dropdown-page.component.html",
	encapsulation: ViewEncapsulation.None //used here to be able to customize the example-viewer background color
})
export class DemoDropdownPageComponent implements OnInit {
	public selectedService: string;
	public selectedServiceWhiteDropdown: string;
	public selectedServices: string[];
	public selectedRequiredServices: string[];
	public selectedNumber: string;

	public serviceDropdownOptions: any[];

	public referenceList: ReferenceLink[];

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.serviceDropdownOptions = [
			{ id: "PR", value: "SHOWCASE.DEMO.DROPDOWN.PR" },
			{ id: "IO", value: "SHOWCASE.DEMO.DROPDOWN.IO" },
			{ id: "CS", value: "SHOWCASE.DEMO.DROPDOWN.CS" }
		];

		this.referenceList = [
			{
				label: "Stark Dropdown component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDropdownComponent.html"
			}
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

	public whiteDropdownOnChange(selectedValue: string): void {
		this.selectedServiceWhiteDropdown = selectedValue;
	}
}
