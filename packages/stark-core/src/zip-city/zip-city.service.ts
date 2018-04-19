"use strict";
import { StarkZipCityService } from "./zip-city.service.intf";
import { StarkZipCityObject } from "./zip-city-object.intf";
import { StarkZipCityOptionsItem } from "./zip-city-options-item.intf";
import { Injectable } from "@angular/core";

/* this service is based on https://www.npmjs.com/package/belgium-zip-city */
/* it imports B-Post lists of Belgian post codes and cities */
const data: StarkZipCityObject = require("belgium-zip-city/data/blob.json");

export const starkZipCityServiceName: string = "StarkZipCityService";

/**
 * @ngdoc service
 * @name stark-core.service:StarkZipCityService
 * @description Service to fetch zip-city codes based on different criteria.
 */
@Injectable()
export class StarkZipCityServiceImpl implements StarkZipCityService {
	public data: StarkZipCityObject = data;

	public constructor() {
		/* empty */
	}

	/* finds the city with given zip code (as a string) if any */
	public toCity(zip: string): string | undefined {
		const matches: string[] | undefined = this.data.zips[zip];
		return matches ? this.formatCity(matches[0]) : undefined;
	}

	/* returns the city name formatted in Title case */
	public formatCity(city: string): string {
		return city.toLowerCase().replace(/\b\w/g, (m: string): string => {
			return m.toUpperCase();
		});
	}

	/* returns the zipCode of a city, undefined if not found */
	public toZip(city: string): string | undefined {
		const citiesObj: { [key: string]: string[] } = this.data.cities;
		const matches: string[] | undefined = citiesObj[city];
		if (matches) {
			return matches[0];
		}
		city = city.toLowerCase();
		for (const item in citiesObj) {
			if (item.toLowerCase() === city) {
				return citiesObj[item][0];
			}
		}
		return undefined;
	}

	/* returns true if zipCode and city name (case insensitive) match */
	public isValid(zip: string, city: string): boolean {
		const matches: string[] | undefined = this.data.zips[zip];
		city = city.toLowerCase();
		if (matches) {
			for (const match of matches) {
				if (match.toLowerCase() === city) {
					return true;
				}
			}
		}
		return false;
	}

	/* returns a string array of all zips starting with the value (string) or empty array if none found */
	public zipsLike(value: string): string[] {
		const matches: string[] = [];
		for (const zip in this.data.zips) {
			if (zip.substring(0, value.length) === value) {
				matches.push(zip);
			}
		}
		return matches;
	}

	/* returns a string array of all cities (nicely formatted) starting with the value (string) or empty array if none found */
	public citiesLike(value: string): string[] {
		const matches: string[] = [];
		value = value.toLowerCase();
		for (const city in this.data.cities) {
			if (city.substring(0, value.length).toLowerCase() === value) {
				matches.push(city);
			}
		}
		return matches.map(this.formatCity);
	}

	/* returns an array of zip/city/label options of all cities matching a zip code, empty array if none found */
	public getZipOptions(zip: string): StarkZipCityOptionsItem[] {
		const matches: string[] = this.data.zips[zip];
		return matches
			? matches.map((match: string): StarkZipCityOptionsItem => {
					return {
						zip: zip,
						city: match,
						label: zip + " " + this.formatCity(match)
					};
				})
			: [];
	}
}
