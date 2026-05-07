import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
	selector: "demo-dropdown",
	templateUrl: "./demo-dropdown.component.html"
})
export class DemoDropdownComponent {
	public serviceDropdownOptions = [
		{ id: "PR", value: "IT applications" },
		{ id: "IO", value: "Informatics infrastructure and operations" },
		{ id: "CS", value: "IT customer services" }
	];
	public serviceFormControl = new FormControl("", Validators.required);

	public toggleDisabledReactiveFormControl(): void {
		if (this.serviceFormControl.disabled) {
			this.serviceFormControl.enable();
		} else {
			this.serviceFormControl.disable();
		}
	}
}
