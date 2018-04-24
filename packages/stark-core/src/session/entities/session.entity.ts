import { StarkUser } from "../../user/entities/index";
import { StarkSession } from "./session.entity.intf";

export class StarkSessionImpl implements StarkSession {
	public currentLanguage: string;

	public user: StarkUser | undefined;

	//public condensedModeEnabled:boolean;
	//public browser:string;
	//public browserVersion:string;
	//public device:string;
	//public loginTimestamp:string;
	//public lastSessionRefreshTimestamp:string;
}
