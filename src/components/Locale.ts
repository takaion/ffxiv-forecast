import { Weather } from "../data/Weather.js";
import { ZoneId } from "../data/ZoneWeather.js";
import { BigFishId } from "../data/BigFishData.js";
import { OceanFishingTime } from "../data/OceanFishingTime.js";
import { OceanFishingZone } from "../data/OceanFishingZone.js";
import ja from "../data/locales/ja.js";
import en from "../data/locales/en.js";

type Locale = "ja" | "en";

function getLocaleData(locale: Locale = "ja") {
    switch (locale) {
        case "ja": return ja;
        case "en": return en;
    }
}

export function getWeatherName(weather: Weather, locale?: Locale) {
    return getLocaleData(locale).weather[weather];
}

export function getZoneName(zone: ZoneId, locale?: Locale) {
    return getLocaleData(locale).zone[zone];
}

export function getBigFishName(bigFishId: BigFishId, locale?: Locale) {
    return getLocaleData(locale).bigFish[bigFishId];
}

export function getOceanFishingTimeName(time: OceanFishingTime, locale?: Locale) {
    return getLocaleData(locale).oceanFishing.time[time];
}

export function getOceanFishingZoneName(zone: OceanFishingZone, locale?: Locale) {
    return getLocaleData(locale).oceanFishing.zone[zone];
}

export default Locale;