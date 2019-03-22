import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
	selector: "demo-dropdown",
	styleUrls: ["./demo-dropdown-page.component.scss"],
	templateUrl: "./demo-dropdown-page.component.html",
	encapsulation: ViewEncapsulation.None // used here to be able to customize the example-viewer background color
})
export class DemoDropdownPageComponent implements OnInit, OnDestroy {
	public selectedService: string;
	public serviceFormControl: FormControl;
	public serviceFormControlSubscription: Subscription;
	public selectedServiceWhiteDropdown: string;
	public selectedServices: string[];
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

		this.serviceFormControl = new FormControl("", Validators.required);
	}

	public ngOnDestroy(): void {
		this.serviceFormControlSubscription.unsubscribe();
	}

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
