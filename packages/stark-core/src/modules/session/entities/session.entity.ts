import { StarkUser } from "../../user/entities";
import { StarkSession } from "./session.entity.intf";

/**
 * This class is only for serialization purposes
 * @ignore
 */
export class StarkSessionImpl implements StarkSession {
	public currentLanguage!: string;

	public user?: StarkUser;

	// public condensedModeEnabled:boolean;
	// public browser:string;
	// public browserVersion:string;
	// public device:string;
	// public loginTimestamp:string;
	// public lastSessionRefreshTimestamp:string;
}
