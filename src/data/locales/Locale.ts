import { Weather } from "../Weather.js";
import { ZoneId } from "../ZoneWeather.js";
import ja from "./ja.js";
import en from "./en.js";
import { BigFishId } from "../BigFishData.js";
import { OceanFishingTime } from "../OceanFishingTime.js";
import { OceanFishingZone } from "../OceanFishingZone.js";

type Locale = "ja" | "en";

function getLocaleData(locale: Locale = "ja") {
    switch (locale) {
        case "ja": return ja
        case "en": return en
    }
}

export function getWeatherName(weather: Weather, locale?: Locale) {
    return getLocaleData(locale).weather[weather]
}

export function getZoneName(zone: ZoneId, locale?: Locale) {
    return getLocaleData(locale).zone[zone]
}

export function getBigFishName(bigFishId: BigFishId, locale?: Locale) {
    return getLocaleData(locale).bigFish[bigFishId]
}

export function getOceanFishingTimeName(time: OceanFishingTime, locale?: Locale) {
    return getLocaleData(locale).oceanFishing.time[time];
}

export function getOceanFishingZoneName(zone: OceanFishingZone, locale?: Locale) {
    return getLocaleData(locale).oceanFishing.zone[zone];
}

export default Locale;