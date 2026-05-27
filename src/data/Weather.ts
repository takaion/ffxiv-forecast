export const weather = {
    ASTROMAGNETIC_STORMS: "astromagneticStorms",
    ATMOSPHERIC_PHANTASMS: "atmosphericPhantasms",
    BLIZZARDS: "blizzards",
    CLEAR_SKIES: "clearSkies",
    CLOUDS: "clouds",
    DUST_STORMS: "dustStorms",
    FAIR_SKIES: "fairSkies",
    FOG: "fog",
    GALES: "gales",
    GLOOM: "gloom",
    HEAT_WAVES: "heatWaves",
    ILLUSORY_DISTURBANCES: "illusoryDisturbances",
    MOON_DUST: "moonDust",
    RAIN: "rain",
    THUNDER: "thunder",
    THUNDERSTORMS: "thunderstorms",
    UMBRAL_STATIC: "umbralStatic",
    UMBRAL_WIND: "umbralWind",
    SHOWERS: "showers",
    SNOW: "snow",
    WIND: "wind",
} as const;

export type Weather = (typeof weather)[keyof typeof weather];
export default weather