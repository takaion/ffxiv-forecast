import { Weather } from "../Weather.js";
import { Zone } from "../ZoneWeather.js";

export default interface LocalesData {
    weather: Record<Weather, string>,
    zone: Record<Zone, string>
}