import EorzeaTime from "../components/calendar/EorzeaTime.js";
import w, { Weather } from "./Weather.js";

interface WeatherThreshold {
    w: Weather
    /** 当該天気となる`target`値の最大値。`target`値が指定された値未満のとき、指定された天気であると計算される。`target`値は0から99の整数。 */
    t: number
}

const thresholds = {
    // ラノシア
    LIMSA_LOMINSA: [{w: w.CLOUDS, t: 20}, {w: w.CLEAR_SKIES, t: 50}, {w: w.FAIR_SKIES, t: 80}, {w: w.FOG, t: 90}, {w: w.RAIN, t: 100}],
    MIDDLE_LA_NOSCEA: [{w: w.CLOUDS, t: 20}, {w: w.CLEAR_SKIES, t: 50}, {w: w.FAIR_SKIES, t: 70}, {w: w.WIND, t: 80}, {w: w.FOG, t: 90}, {w: w.RAIN, t: 100}],
    LOWER_LA_NOSCEA: [{w: w.CLOUDS, t: 20}, {w: w.CLEAR_SKIES, t: 50}, {w: w.FAIR_SKIES, t: 70}, {w: w.WIND, t: 80}, {w: w.FOG, t: 90}, {w: w.RAIN, t: 100}],
    EASTERN_LA_NOSCEA: [{w: w.FOG, t: 5}, {w: w.CLEAR_SKIES, t: 50}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLOUDS, t: 90}, {w: w.RAIN, t: 95}, {w: w.SHOWERS, t: 100}],
    WESTERN_LA_NOSCEA: [{w: w.FOG, t: 10}, {w: w.CLEAR_SKIES, t: 40}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 80}, {w: w.WIND, t: 90}, {w: w.GALES, t: 100}],
    UPPER_LA_NOSCEA: [{w: w.CLEAR_SKIES, t: 30}, {w: w.FAIR_SKIES, t: 50}, {w: w.CLOUDS, t: 70}, {w: w.FOG, t: 80}, {w: w.THUNDER, t: 90}, {w: w.THUNDERSTORMS, t: 100}],
    OUTER_LA_NOSCEA: [{w: w.CLEAR_SKIES, t: 30}, {w: w.FAIR_SKIES, t: 50}, {w: w.CLOUDS, t: 70}, {w: w.FOG, t: 90}, {w: w.RAIN, t: 100}],
    MIST: [{w: w.CLOUDS, t: 20}, {w: w.CLEAR_SKIES, t: 50}, {w: w.FAIR_SKIES, t: 80}, {w: w.FOG, t: 90}, {w: w.RAIN, t: 100}],
    UNNAMED_ISLAND: [{w: w.CLEAR_SKIES, t: 25}, {w: w.FAIR_SKIES, t: 70}, {w: w.CLOUDS, t: 80}, {w: w.RAIN, t: 90}, {w: w.FOG, t: 95}, {w: w.SHOWERS, t: 100}],
    // 黒衣森
    GRIDANIA: [{w: w.RAIN, t: 20}, {w: w.FOG, t: 30}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 55}, {w: w.CLEAR_SKIES, t: 85}, {w: w.FAIR_SKIES, t: 100}],
    CENTRAL_SHROUD: [{w: w.THUNDER, t: 5}, {w: w.RAIN, t: 20}, {w: w.FOG, t: 30}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 55}, {w: w.CLEAR_SKIES, t: 85}, {w: w.FAIR_SKIES, t: 100}],
    EAST_SHROUD: [{w: w.THUNDER, t: 5}, {w: w.RAIN, t: 20}, {w: w.FOG, t: 30}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 55}, {w: w.CLEAR_SKIES, t: 85}, {w: w.FAIR_SKIES, t: 100}],
    SOUTH_SHROUD: [{w: w.FOG, t: 5}, {w: w.THUNDERSTORMS, t: 10}, {w: w.THUNDER, t: 25}, {w: w.FOG, t: 30}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 70}, {w: w.CLEAR_SKIES, t: 100}],
    NORTH_SHROUD: [{w: w.FOG, t: 5}, {w: w.SHOWERS, t: 10}, {w: w.RAIN, t: 25}, {w: w.FOG, t: 30}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 70}, {w: w.CLEAR_SKIES, t: 100}],
    LAVENDER_BEDS: [{w: w.CLOUDS, t: 5}, {w: w.RAIN, t: 20}, {w: w.FOG, t: 30}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 55}, {w: w.CLEAR_SKIES, t: 85}, {w: w.FAIR_SKIES, t: 100}],
    // ザナラーン
    UL_DAH: [{w: w.CLEAR_SKIES, t: 40}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 85}, {w: w.FOG, t: 95}, {w: w.RAIN, t: 100}],
    WESTERN_THANALAN: [{w: w.CLEAR_SKIES, t: 40}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 85}, {w: w.FOG, t: 95}, {w: w.RAIN, t: 100}],
    CENTRAL_THANALAN: [{w: w.DUST_STORMS, t: 15}, {w: w.CLEAR_SKIES, t: 55}, {w: w.FAIR_SKIES, t: 75}, {w: w.CLOUDS, t: 85}, {w: w.FOG, t: 95}, {w: w.RAIN, t: 100}],
    EASTERN_THANALAN: [{w: w.CLEAR_SKIES, t: 40}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 70}, {w: w.FOG, t: 80}, {w: w.RAIN, t: 85}, {w: w.SHOWERS, t: 100}],
    SOUTHERN_THANALAN: [{w: w.HEAT_WAVES, t: 20}, {w: w.CLEAR_SKIES, t: 60}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLOUDS, t: 90}, {w: w.FOG, t: 100}],
    NORTHERN_THANALAN: [{w: w.CLEAR_SKIES, t: 5}, {w: w.FAIR_SKIES, t: 20}, {w: w.CLOUDS, t: 50}, {w: w.FOG, t: 100}],
    GOBLET: [{w: w.CLEAR_SKIES, t: 40}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 85}, {w: w.FOG, t: 95}, {w: w.RAIN, t: 100}],
    // クルザス
    ISHGARD: [{w: w.SNOW, t: 60}, {w: w.FAIR_SKIES, t: 70}, {w: w.CLEAR_SKIES, t: 75}, {w: w.CLOUDS, t: 90}, {w: w.FOG, t: 100}],
    COERTHAS_CENTRAL_HIGHLANDS: [{w: w.BLIZZARDS, t: 20}, {w: w.SNOW, t: 60}, {w: w.FAIR_SKIES, t: 70}, {w: w.CLEAR_SKIES, t: 75}, {w: w.CLOUDS, t: 90}, {w: w.FOG, t: 100}],
    COERTHAS_WESTERN_HIGHLANDS: [{w: w.BLIZZARDS, t: 20}, {w: w.SNOW, t: 60}, {w: w.FAIR_SKIES, t: 70}, {w: w.CLEAR_SKIES, t: 75}, {w: w.CLOUDS, t: 90}, {w: w.FOG, t: 100}],
    EMPYREUM: [{w: w.SNOW, t: 5}, {w: w.FAIR_SKIES, t: 25}, {w: w.CLEAR_SKIES, t: 65}, {w: w.CLOUDS, t: 80}, {w: w.FOG, t: 100}],
    // アバラシア
    SEA_OF_CLOUDS: [{w: w.CLEAR_SKIES, t: 30}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 70}, {w: w.FOG, t: 80}, {w: w.WIND, t: 90}, {w: w.UMBRAL_WIND, t: 100}],
    AZYS_LLA: [{w: w.FAIR_SKIES, t: 35}, {w: w.CLOUDS, t: 70}, {w: w.THUNDER, t: 100}],
    DIADEM: [{w: w.FAIR_SKIES, t: 30}, {w: w.FOG, t: 60}, {w: w.WIND, t: 90}, {w: w.UMBRAL_WIND, t: 100}],
    // ドラヴァニア
    IDYLLSHIRE: [{w: w.CLOUDS, t: 10}, {w: w.FOG, t: 20}, {w: w.RAIN, t: 30}, {w: w.SHOWERS, t: 40}, {w: w.CLEAR_SKIES, t: 70}, {w: w.FAIR_SKIES, t: 100}],
    DRAVANIAN_FORELANDS: [{w: w.CLOUDS, t: 10}, {w: w.FOG, t: 20}, {w: w.THUNDER, t: 30}, {w: w.DUST_STORMS, t: 40}, {w: w.CLEAR_SKIES, t: 70}, {w: w.FAIR_SKIES, t: 100}],
    DRAVANIAN_HINTERLANDS: [{w: w.CLOUDS, t: 10}, {w: w.FOG, t: 20}, {w: w.RAIN, t: 30}, {w: w.SHOWERS, t: 40}, {w: w.CLEAR_SKIES, t: 70}, {w: w.FAIR_SKIES, t: 100}],
    CHURNING_MISTS: [{w: w.CLOUDS, t: 100}, {w: w.GALES, t: 20}, {w: w.UMBRAL_STATIC, t: 40}, {w: w.CLEAR_SKIES, t: 70}, {w: w.FAIR_SKIES, t: 100}],    
    // モードゥナ
    MOR_DHONA: [{w: w.CLOUDS, t: 15}, {w: w.FOG, t: 30}, {w: w.GLOOM, t: 60}, {w: w.CLEAR_SKIES, t: 75}, {w: w.FAIR_SKIES, t: 100}],
    // ギラバニア
    RHALGR_S_REACH: [{w: w.CLEAR_SKIES, t: 15}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 80}, {w: w.FOG, t: 90}, {w: w.THUNDER, t: 100}],
    FRINGES: [{w: w.CLEAR_SKIES, t: 15}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 80}, {w: w.FOG, t: 90}, {w: w.THUNDER, t: 100}],
    PEAKS: [{w: w.CLEAR_SKIES, t: 10}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 75}, {w: w.FOG, t: 85}, {w: w.WIND, t: 95}, {w: w.DUST_STORMS, t: 100}],
    LOCHS: [{w: w.CLEAR_SKIES, t: 20}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 80}, {w: w.FOG, t: 90}, {w: w.THUNDERSTORMS, t: 100}],
    // ひんがしの国
    KUGANE: [{w: w.RAIN, t: 10}, {w: w.FOG, t: 20}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLEAR_SKIES, t: 100}],
    SHIROGANE: [{w: w.RAIN, t: 10}, {w: w.FOG, t: 20}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLEAR_SKIES, t: 100}],
    // オサード
    RUBY_SEA: [{w: w.THUNDER, t: 10}, {w: w.WIND, t: 20}, {w: w.CLOUDS, t: 35}, {w: w.FAIR_SKIES, t: 75}, {w: w.CLEAR_SKIES, t: 100}],
    YANXIA: [{w: w.SHOWERS, t: 5}, {w: w.RAIN, t: 25}, {w: w.FOG, t: 25}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLEAR_SKIES, t: 100}],
    AZIM_STEPPE: [{w: w.GALES, t: 5}, {w: w.WIND, t: 10}, {w: w.RAIN, t: 17}, {w: w.FOG, t: 25}, {w: w.CLOUDS, t: 35}, {w: w.FAIR_SKIES, t: 75}, {w: w.CLEAR_SKIES, t: 100}],
    // 禁断の地 エウレカ
    EUREKA_ANEMOS: [{w: w.FAIR_SKIES, t: 30}, {w: w.GALES, t: 60}, {w: w.SHOWERS, t: 90}, {w: w.SNOW, t: 100}],
    EUREKA_PAGOS: [{w: w.FAIR_SKIES, t: 10}, {w: w.FOG, t: 28}, {w: w.HEAT_WAVES, t: 46}, {w: w.SNOW, t: 64}, {w: w.THUNDER, t: 82}, {w: w.BLIZZARDS, t: 100}],
    EUREKA_PYROS: [{w: w.FAIR_SKIES, t: 10}, {w: w.HEAT_WAVES, t: 28}, {w: w.THUNDER, t: 46}, {w: w.BLIZZARDS, t: 64}, {w: w.UMBRAL_WIND, t: 82}, {w: w.SNOW, t: 100}],
    EUREKA_HYDATOS: [{w: w.FAIR_SKIES, t: 12}, {w: w.SHOWERS, t: 34}, {w: w.GLOOM, t: 56}, {w: w.THUNDERSTORMS, t: 78}, {w: w.SNOW, t: 100}],
    // 南方ボズヤ戦線
    BOZJAN_SOUTHERN_FRONT: [{w: w.FAIR_SKIES, t: 52}, {w: w.RAIN, t: 64}, {w: w.WIND, t: 76}, {w: w.THUNDER, t: 88}, {w: w.DUST_STORMS, t: 100}],
    ZADNOR: [{w: w.FAIR_SKIES, t: 60}, {w: w.RAIN, t: 70}, {w: w.WIND, t: 80}, {w: w.THUNDER, t: 90}, {w: w.SNOW, t: 100}],
    // ノルヴラント
    CRYSTARIUM: [{w: w.CLEAR_SKIES, t: 20}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 75}, {w: w.FOG, t: 85}, {w: w.RAIN, t: 95}, {w: w.THUNDERSTORMS, t: 100}],
    EULMORE: [{w: w.GALES, t: 10}, {w: w.RAIN, t: 20}, {w: w.FOG, t: 30}, {w: w.CLOUDS, t: 45}, {w: w.FAIR_SKIES, t: 85}, {w: w.CLEAR_SKIES, t: 100}],
    LAKELAND: [{w: w.CLEAR_SKIES, t: 20}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 75}, {w: w.FOG, t: 85}, {w: w.RAIN, t: 95}, {w: w.THUNDERSTORMS, t: 100}],
    KHOLUSIA: [{w: w.GALES, t: 10}, {w: w.RAIN, t: 20}, {w: w.FOG, t: 30}, {w: w.CLOUDS, t: 45}, {w: w.FAIR_SKIES, t: 85}, {w: w.CLEAR_SKIES, t: 100}],
    AMH_ARAENG: [{w: w.FAIR_SKIES, t: 45}, {w: w.CLOUDS, t: 60}, {w: w.DUST_STORMS, t: 70}, {w: w.HEAT_WAVES, t: 80}, {w: w.CLEAR_SKIES, t: 100}],
    IL_MHEG: [{w: w.RAIN, t: 10}, {w: w.FOG, t: 20}, {w: w.CLOUDS, t: 35}, {w: w.THUNDERSTORMS, t: 45}, {w: w.CLEAR_SKIES, t: 60}, {w: w.FAIR_SKIES, t: 100}],
    RAK_TIKA_GREATWOOD: [{w: w.FOG, t: 10}, {w: w.RAIN, t: 20}, {w: w.UMBRAL_WIND, t: 30}, {w: w.CLEAR_SKIES, t: 45}, {w: w.FAIR_SKIES, t: 85}, {w: w.CLOUDS, t: 100}],
    TEMPEST: [{w: w.CLOUDS, t: 20}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLEAR_SKIES, t: 100}],
    // 北洋地域
    OLD_SHARLAYAN: [{w: w.CLEAR_SKIES, t: 10}, {w: w.FAIR_SKIES, t: 50}, {w: w.CLOUDS, t: 70}, {w: w.FOG, t: 85}, {w: w.SNOW, t: 100}],
    LABYRINTHOS: [{w: w.CLEAR_SKIES, t: 15}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 85}, {w: w.RAIN, t: 100}],
    // イルサバード
    RADZ_AT_HAN: [{w: w.FOG, t: 10}, {w: w.RAIN, t: 25}, {w: w.CLEAR_SKIES, t: 40}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLOUDS, t: 100}],
    THAVNAIR: [{w: w.FOG, t: 10}, {w: w.RAIN, t: 20}, {w: w.SHOWERS, t: 25}, {w: w.CLEAR_SKIES, t: 40}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLOUDS, t: 100}],
    GARLEMALD: [{w: w.SNOW, t: 45}, {w: w.THUNDER, t: 50}, {w: w.RAIN, t: 55}, {w: w.FOG, t: 60}, {w: w.CLOUDS, t: 85}, {w: w.FAIR_SKIES, t: 95}, {w: w.CLEAR_SKIES, t: 100}],
    // 星外宙域
    MARE_LAMENTORUM: [{w: w.UMBRAL_WIND, t: 15}, {w: w.MOON_DUST, t: 30}, {w: w.FAIR_SKIES, t: 100}],
    ULTIMA_THULE: [{w: w.ASTROMAGNETIC_STORMS, t: 15}, {w: w.FAIR_SKIES, t: 85}, {w: w.UMBRAL_WIND, t: 100}],
    SINUS_ARDORUM: [{w: w.MOON_DUST, t: 15}, {w: w.FAIR_SKIES, t: 85}, {w: w.UMBRAL_WIND, t: 100}],
    PHAENNA: [{w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 80}, {w: w.RAIN, t: 100}],
    OIZYS: [{w: w.CLOUDS, t: 20}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLEAR_SKIES, t: 100}],
    // 古代世界
    ELPIS: [{w: w.CLOUDS, t: 25}, {w: w.UMBRAL_WIND, t: 40}, {w: w.FAIR_SKIES, t: 85}, {w: w.CLEAR_SKIES, t: 100}],
    // トラル大陸
    TULIYOLLAL: [{w: w.CLEAR_SKIES, t: 40}, {w: w.FAIR_SKIES, t: 80}, {w: w.CLOUDS, t: 85}, {w: w.FOG, t: 95}, {w: w.RAIN, t: 100}],
    URQOPACHA: [{w: w.CLEAR_SKIES, t: 20}, {w: w.FAIR_SKIES, t: 50}, {w: w.CLOUDS, t: 70}, {w: w.FOG, t: 80}, {w: w.WIND, t: 90}, {w: w.SNOW, t: 100}],
    KOZAMA_UKA: [{w: w.CLEAR_SKIES, t: 25}, {w: w.FAIR_SKIES, t: 60}, {w: w.CLOUDS, t: 75}, {w: w.FOG, t: 85}, {w: w.RAIN, t: 95}, {w: w.SHOWERS, t: 100}],
    YAK_T_EL: [{w: w.CLEAR_SKIES, t: 15}, {w: w.FAIR_SKIES, t: 55}, {w: w.CLOUDS, t: 70}, {w: w.FOG, t: 85}, {w: w.RAIN, t: 100}],
    SOLUTION_NINE: [{w: w.FAIR_SKIES, t: 100}],
    SHAALOANI: [{w: w.CLEAR_SKIES, t: 5}, {w: w.FAIR_SKIES, t: 50}, {w: w.CLOUDS, t: 70}, {w: w.DUST_STORMS, t: 85}, {w: w.GALES, t: 100}],
    HERITAGE_FOUND: [{w: w.FAIR_SKIES, t: 5}, {w: w.CLOUDS, t: 25}, {w: w.FOG, t: 40}, {w: w.RAIN, t: 45}, {w: w.THUNDERSTORMS, t: 50}, {w: w.UMBRAL_STATIC, t: 100}],
    // アンロスト・ワールド
    LIVING_MEMORY: [{w: w.RAIN, t: 10}, {w: w.FOG, t: 20}, {w: w.CLOUDS, t: 40}, {w: w.FAIR_SKIES, t: 100}],
    // その他
    SOUTH_HORN: [{w: w.CLEAR_SKIES, t: 10}, {w: w.FAIR_SKIES, t: 55}, {w: w.CLOUDS, t: 70}, {w: w.RAIN, t: 80}, {w: w.ATMOSPHERIC_PHANTASMS, t: 95}, {w: w.ILLUSORY_DISTURBANCES, t: 100}],
} as const;

export type Zone = keyof typeof thresholds;

export function getAllZones(): Zone[] {
  return Object.keys(thresholds) as Zone[];
}

function getWeatherByTarget(entries: readonly WeatherThreshold[], target: number) {
  const entry = entries.find(e => target < e.t);
  return entry?.w ?? null
}

export function getZoneWeather(zone: Zone, et?: EorzeaTime) {
  et ??= EorzeaTime.now();
  const entries = thresholds[zone]
  const weather = getWeatherByTarget(entries, et.weatherTarget);
  if (!weather) throw new Error(`Could not find weather for zone "${zone}" at target: ${et.weatherTarget}`);
  return weather
}