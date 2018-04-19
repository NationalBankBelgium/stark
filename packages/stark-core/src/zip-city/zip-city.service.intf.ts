"use strict";
import { StarkZipCityOptionsItem } from "./zip-city-options-item.intf";

export interface StarkZipCityService {
	toCity(zip: string): string | undefined;
	formatCity(city: string): string;
	toZip(city: string): string | undefined;
	isValid(zip: string, city: string): boolean;
	zipsLike(value: string): string[];
	citiesLike(value: string): string[];
	getZipOptions(zip: string): StarkZipCityOptionsItem[];
}
