import { Weather } from "../Weather.js";
import { ZoneId } from "../ZoneWeather.js";

export default interface LocalesData {
    weather: Record<Weather, string>,
    zone: Record<ZoneId, string>
}