import { StarkHttpSerializerImpl } from "./http-serializer";
import { StarkResource } from "../entities";
import { StarkSerializable } from "../../../serialization";

/**
 * Implementation of {@link StarkHttpSerializer}.
 * This serializer will use a discriminator property to decide what type to use for serialization.
 *
 */
export class StarkHttpDiscriminatorSerializer<T extends StarkResource> extends StarkHttpSerializerImpl<T> {
	private discriminatorProperty: string;
	private typesMap: Map<any, StarkSerializable>;

	/**
	 *
	 * @param discriminatorProperty - The discriminator property
	 * @param typesMap - Map of types based on the discriminator property value
	 */
	public constructor(discriminatorProperty: string, typesMap: Map<any, StarkSerializable>) {
		super();
		this.discriminatorProperty = discriminatorProperty;
		this.typesMap = typesMap;
	}

	public getType(rawOrResource: T | object | string): StarkSerializable | undefined {
		let obj: object;
		if (typeof rawOrResource === "string") {
			obj = JSON.parse(rawOrResource);
		} else {
			obj = rawOrResource;
		}

		const discriminator: any = obj[this.discriminatorProperty];

		return this.typesMap.get(discriminator);
	}
}
