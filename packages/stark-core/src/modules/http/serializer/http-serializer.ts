import { Deserialize, Serialize } from "cerialize";
import { StarkHttpSerializer } from "./http-serializer.intf";
import { StarkResource } from "../entities";
import { StarkSerializable } from "../../../serialization";

/**
 * Implementation of {@link StarkHttpSerializer} which uses the cerialize library behind the hoods.
 * This is the default implementation used by {@link StarkHttpServiceImpl} for serializing/deserializing entities.
 *
 * The class takes optionally a type Serializable in its constructor..
 */
export class StarkHttpSerializerImpl<T extends StarkResource> implements StarkHttpSerializer<T> {
	/** @internal */
	protected _type: StarkSerializable | undefined;

	/**
	 * @param type - Default Type Serializable
	 */
	public constructor(type?: StarkSerializable) {
		this._type = type;
	}

	public serialize(resource: T): string | object {
		return Serialize(resource, this.getType(resource));
	}

	public deserialize(raw: string | object): T {
		return Deserialize(raw, this.getType(raw));
	}

	/**
	 * The Serializable type to use for deserialization/serialization.
	 */
	protected getType(_rawOrResource?: T | object | string): StarkSerializable | undefined {
		return this._type ? this._type : undefined;
	}
}
