import { Weather } from "../Weather.js";
import { Zone } from "../ZoneWeather.js";
import ja from "./ja.js";

type Locale = "ja";

function getLocaleData(locale: Locale = "ja") {
    switch (locale) {
        case "ja": return ja
        default: return ja
    }
}

export function getWeatherName(weather: Weather, locale?: Locale) {
    return getLocaleData(locale).weather[weather]
}

export function getZoneName(zone: Zone, locale?: Locale) {
    return getLocaleData(locale).zone[zone]
}

export default Locale;