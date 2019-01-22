import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
	selector: "demo-dropdown",
	templateUrl: "./demo-dropdown.component.html"
})
export class DemoDropdownComponent implements OnInit {
	public isDisabled: boolean;

	public selectedService: string;

	public serviceDropdownOptions: any[];

	public serviceFormControl: FormControl;

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.serviceDropdownOptions = [
			{ id: "PR", value: "IT application" },
			{ id: "IO", value: "Informatics infrastructure and operations" },
			{ id: "CS", value: "IT customer services" }
		];

		this.serviceFormControl = new FormControl();
		this.serviceFormControl.valueChanges.subscribe((value: any) => (this.selectedService = value));
	}

	public toggleDisabling(): void {
		if (this.isDisabled) {
			this.serviceFormControl.disable();
		} else {
			this.serviceFormControl.enable();
		}
	}
}
