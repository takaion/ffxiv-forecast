export const weather = {
    /** 磁気嵐 */
    ASTROMAGNETIC_STORMS: "astromagneticStorms",
    /** 幻怪 */
    ATMOSPHERIC_PHANTASMS: "atmosphericPhantasms",
    /** 吹雪 */
    BLIZZARDS: "blizzards",
    /** 快晴 */
    CLEAR_SKIES: "clearSkies",
    /** 曇り */
    CLOUDS: "clouds",
    /** 砂塵 */
    DUST_STORMS: "dustStorms",
    /** 晴れ */
    FAIR_SKIES: "fairSkies",
    /** 霧 */
    FOG: "fog",
    /** 暴風 */
    GALES: "gales",
    /** 妖霧 */
    GLOOM: "gloom",
    /** 灼熱波 */
    HEAT_WAVES: "heatWaves",
    /** 幻妖 */
    ILLUSORY_DISTURBANCES: "illusoryDisturbances",
    /** 月砂塵 */
    MOON_DUST: "moonDust",
    /** 雨 */
    RAIN: "rain",
    /** 雷 */
    THUNDER: "thunder",
    /** 雷雨 */
    THUNDERSTORMS: "thunderstorms",
    /** 放電 */
    UMBRAL_STATIC: "umbralStatic",
    /** 霊風 */
    UMBRAL_WIND: "umbralWind",
    /** 暴雨 */
    SHOWERS: "showers",
    /** 雪 */
    SNOW: "snow",
    /** 風 */
    WIND: "wind",
} as const;

export type Weather = (typeof weather)[keyof typeof weather];
export default weather