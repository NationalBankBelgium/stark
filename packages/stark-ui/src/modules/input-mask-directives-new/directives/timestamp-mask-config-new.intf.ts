import moment from "moment";

export interface StarkTimestampMaskConfigNew {
	format?: string;

	usingMoment?: boolean;

	formatFn?: (value: Date | moment.Moment) => string;

	parseFn?: (value: string) => Date | moment.Moment;

	guide?: boolean;
}
