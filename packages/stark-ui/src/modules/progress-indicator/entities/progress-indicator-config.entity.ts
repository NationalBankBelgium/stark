import { StarkProgressIndicatorConfig } from "./progress-indicator-config.entity.intf";
import { StarkProgressIndicatorType } from "./progress-indicator-type.entity";

export class StarkProgressIndicatorConfigImpl implements StarkProgressIndicatorConfig {
	private _topic: string;
	private _type: StarkProgressIndicatorType;
	private _visible: boolean;
	private _listenersCount: number;
	private _pendingListenersCount: number;

	public constructor(topic: string, type: StarkProgressIndicatorType, visible: boolean) {
		this._topic = topic;
		this._type = type;
		this._visible = visible;
		this._listenersCount = 1;
		this._pendingListenersCount = 0;
	}

	public get topic(): string {
		return this._topic;
	}

	public get type(): StarkProgressIndicatorType {
		return this._type;
	}

	public get visible(): boolean {
		return this._visible;
	}

	public set visible(value: boolean) {
		this._visible = value;
	}

	public get listenersCount(): number {
		return this._listenersCount;
	}

	public set listenersCount(value: number) {
		this._listenersCount = value;
	}

	public get pendingListenersCount(): number {
		return this._pendingListenersCount;
	}

	public set pendingListenersCount(value: number) {
		this._pendingListenersCount = value;
	}
}
