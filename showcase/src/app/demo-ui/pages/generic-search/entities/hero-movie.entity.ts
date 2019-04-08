import { StarkResource } from "@nationalbankbelgium/stark-core";
import { autoserialize } from "cerialize";

/**
 * This class is only for serialization purposes
 */
export class HeroMovie implements StarkResource {
	@autoserialize
	public uuid!: string;

	@autoserialize
	public year!: number;

	@autoserialize
	public hero!: string;

	@autoserialize
	public movie!: string;
}
