import { BigFishId } from "../BigFishData.js";
import { OceanFishingTime } from "../OceanFishingTime.js";
import { OceanFishingZone } from "../OceanFishingZone.js";
import { Weather } from "../Weather.js";
import { ZoneId } from "../ZoneWeather.js";

export default interface LocalesData {
    weather: Record<Weather, string>,
    zone: Record<ZoneId, string>,
    bigFish: Record<BigFishId, string>,
    oceanFishing: {
        time: Record<OceanFishingTime, string>,
        zone: Record<OceanFishingZone, string>,
    }
}