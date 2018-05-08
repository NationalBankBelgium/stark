import { autoserialize, autoserializeAs } from "cerialize";
import { StarkResource, StarkDateUtil } from "@nationalbankbelgium/stark-core";

export interface IRequest {}

// TODO: dummy entity to test Stark Http deserialization. Remove once we have a relevant demo
export class Request implements IRequest, StarkResource {
	@autoserialize public uuid: string;

	@autoserialize public etag: string;

	@autoserialize public requesterId: string;

	@autoserialize public requesterName: string;

	@autoserialize public typeId: string;

	@autoserialize public typeTitle: string;

	@autoserializeAs(Date) public startDate: Date;

	@autoserializeAs(Date) public endDate: Date;

	@autoserialize public status: string;

	@autoserialize public comment: string;

	// @autoserializeAs(RequestComment)
	// public commentHistory: RequestComment[] = [];

	@autoserialize public daysLeft: number;

	@autoserialize public daysTotal: number;

	/**
	 * Callback method provided by cerialize in order to post-process the de-serialized json object
	 * @param instance {Requester} instantiated object with its properties already set as defined via the serializer annotations
	 * @param json {Object} raw json object retrieved from the http call
	 * @constructor
	 */
	public static OnDeserialized(instance: Request, json: any): void {
		instance.startDate = <Date>StarkDateUtil.parseDateWithFormat(json.startDate, "YYYY-MM-DD HH:mm:ss");
		instance.endDate = <Date>StarkDateUtil.parseDateWithFormat(json.endDate, "YYYY-MM-DD HH:mm:ss");
		instance.typeId = json.requestTypeId;
	}
}
