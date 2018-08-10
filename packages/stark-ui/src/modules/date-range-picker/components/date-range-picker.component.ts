import { Component, EventEmitter, Inject, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerFilter, StarkDatePickerComponent } from "./../../date-picker/components/date-picker.component";
import moment from "moment";

/**
 * StarkDateRangePickerEvent interface
 */
export interface StarkDateRangePickerEvent {
	startDate?: Date;
	endDate?: Date;
}

/**
 * Component to display the stark date-range-picker
 */
@Component({
	selector: "stark-date-range-picker",
	templateUrl: "./date-range-picker.component.html",
	encapsulation: ViewEncapsulation.None
})
export class StarkDateRangePickerComponent {
	/**
	 * Filter function or a string
	 * Will be applied to both date-picker
	 */
	@Input()
	public dateFilter?: StarkDatePickerFilter;

	/**
	 * Source Date to be bound to the end datepicker model
	 */
	@Input()
	public endDate?: Date;

	/**
	 * Label to be displayed in the end datepicker
	 */
	@Input()
	public endDateLabel: string = "STARK.DATE_RANGE_PICKER.TO";

	/**
	 * Maximum date of the end date picker
	 */
	@Input()
	public endMaxDate: Date;

	/**
	 * Minimum date of the end date picker
	 */
	@Input()
	public endMinDate: Date;

	/**
	 * Whether the datepickers are disabled
	 */
	@Input()
	public isDisabled?: boolean;

	/**
	 * HTML "name" attribute of the element.
	 */
	@Input()
	public rangePickerId: string = "";

	/**
	 * HTML "name" attribute of the element.
	 */
	@Input()
	public rangePickerName: string = "";

	/**
	 * Source Date to be bound to the start datepicker model
	 */

	@Input()
	public startDate?: Date;

	/**
	 * Label to be displayed in the start datepicker
	 */
	@Input()
	public startDateLabel: string = "STARK.DATE_RANGE_PICKER.FROM";

	/**
	 * Maximum date of the start date picker
	 */
	@Input()
	public startMaxDate: Date;

	/**
	 * Minimum date of the start date picker
	 */
	@Input()
	public startMinDate: Date;

	/**
	 * Output that will emit a specific date whenever the selection has changed
	 */
	@Output()
	public dateRangeChanged: EventEmitter<StarkDateRangePickerEvent> = new EventEmitter<StarkDateRangePickerEvent>();

	/**
	 * Reference to the start datepicker embedded in this component
	 */
	@ViewChild("startPicker")
	public startPicker: StarkDatePickerComponent;

	/**
	 * Reference to the end datepicker embedded in this component
	 */
	@ViewChild("endPicker")
	public endPicker: StarkDatePickerComponent;

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 */
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {
		// empty constructor
	}

	/**
	 * Handle the date changed on the start datepicker
	 */
	public onDateStartChanged(date: Date): void {
		this.startDate = date;
		this.checkDates();
	}

	/**
	 * Handle the date changed on the end datepicker
	 */
	public onDateEndChanged(date: Date): void {
		this.endDate = date;
		this.checkDates();
	}

	/**
	 * Validate the dates and emit the dateRangeChanged event
	 */
	public checkDates(): void {
		if (moment.isDate(this.startDate) && moment.isDate(this.endDate) && moment(this.endDate).isBefore(this.startDate)) {
			this.logger.error("StarkDateRangePicker: Start Date cannot be lower than End Date. End Date will be cleared");
			this.endDate = undefined;
			this.endPicker.pickerInput.value = undefined;
		}
		this.dateRangeChanged.emit({
			startDate: this.startDate,
			endDate: this.endDate
		});
	}
}
