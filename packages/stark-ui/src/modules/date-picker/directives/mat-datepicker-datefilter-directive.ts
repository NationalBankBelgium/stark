import { Directive, Input, OnChanges, Optional, SimpleChanges } from "@angular/core";
import { MatDatepickerInput, MatDateRangeInput } from "@angular/material/datepicker";
import * as moment from "moment";

const directiveName = "starkDatePickerFilter";

export type StarkDatePickerFilter = "OnlyWeekends" | "OnlyWeekdays" | ((date: Date) => boolean);

@Directive({
	selector: "input [matInput][matDatepicker][" + directiveName + "]," + "mat-date-range-input [" + directiveName + "]",
	exportAs: "starkDatePickerFilter"
})
export class StarkMatDatepickerDatefilterDirective implements OnChanges {
	private input: MatDatepickerInput<any> | MatDateRangeInput<any>;

	public constructor(
		@Optional() public matDateInput: MatDatepickerInput<any>,
		@Optional() public matDateRangeInput: MatDateRangeInput<any>
	) {
		if (!matDateInput && !matDateRangeInput) {
			throw new Error(`The directive ${directiveName} must be used on an element with matDateInput or matDateRangeInput directive`);
		} else if (matDateInput) {
			this.input = matDateInput;
		} else {
			this.input = matDateRangeInput;
		}
	}

	@Input()
	public starkDatePickerFilter?: StarkDatePickerFilter;

	public dateFilterfn?: (date: Date) => boolean;

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes["starkDatePickerFilter"]) {
			if (this.starkDatePickerFilter !== undefined) {
				if (this.starkDatePickerFilter === "OnlyWeekdays") {
					// eslint-disable-next-line @typescript-eslint/unbound-method
					this.dateFilterfn = this.filterOnlyWeekdays;
				} else if (this.starkDatePickerFilter === "OnlyWeekends") {
					// eslint-disable-next-line @typescript-eslint/unbound-method
					this.dateFilterfn = this.filterOnlyWeekends;
				} else {
					this.dateFilterfn = this.starkDatePickerFilter;
				}
				this.input.dateFilter = this.callDateFilterFn.bind(this);
			} else {
				this.input.dateFilter = (_date: Date): boolean => true;
			}
		}
	}

	private callDateFilterFn(date: Date | moment.Moment): boolean {
		if (this.dateFilterfn) {
			if (date instanceof Date) {
				return this.dateFilterfn(date);
			}
			if (moment.isMoment(date)) {
				return this.dateFilterfn(date.toDate());
			}
			return true;
		}
		return true;
	}

	/**
	 * Filter only the weekend days
	 * @param date - The date to be checked
	 * @returns Whether the date is a weekend day or not
	 */
	public filterOnlyWeekends(date: Date): boolean {
		const day: number = date.getDay();
		return day === 0 || day === 6;
	}

	/**
	 * Filter only the week days
	 * @param date - The date to be checked
	 * @returns Whether the date is a week day or not
	 */
	public filterOnlyWeekdays(date: Date): boolean {
		const day: number = date.getDay();
		return day !== 0 && day !== 6;
	}
}
