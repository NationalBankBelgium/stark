import { Component, OnInit } from "@angular/core";
import {FormControl, Validators} from "@angular/forms";

@Component({
	selector: "demo-dropdown",
	templateUrl: "./demo-dropdown.component.html"
})
export class DemoDropdownComponent implements OnInit {
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

		this.serviceFormControl = new FormControl("", Validators.required);
	}

	public toggleDisabling(): void {
		if (this.serviceFormControl.disabled) {
			this.serviceFormControl.enable();
		} else {
			this.serviceFormControl.disable();
		}
	}
}
