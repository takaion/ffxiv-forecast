import { Weather } from "../Weather.js";
import { ZoneId } from "../ZoneWeather.js";
import ja from "./ja.js";
import en from "./en.js";

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

export default Locale;