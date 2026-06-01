import { MinimizedZoneConditionOptions, ZoneConditionOptions } from "../components/ZoneCondition.js";

export interface BigFishCondition {
    condition: ZoneConditionOptions
    intuition?: {
        condition: ZoneConditionOptions,
        nRequired?: number
    }[]
}

interface MinimizedBigFishCondition {
    c: MinimizedZoneConditionOptions,
    i?: {c: MinimizedZoneConditionOptions, n?: number}[],
    r?: MinimizedZoneConditionOptions,
}

export type BigFishId
    = "NEPTO_DRAGON" | "ENDOCERAS" | "NAMITARO" | "HELICOPRION" | "SHONISAURUS" | "KUNO_THE_KILLER"
    | "CHARIBENET" | "SEA_BUTTERFLY" | "OPABINIA" | "PROBLEMATICUS" | "ARMOR_FISH" | "RAIMDELLOPTERUS"
    | "XENACANTHUS" | "DREPANASPIS" | "STETHACANTHUS" | "RUBY_DRAGON" | "WARDEN_OF_THE_SEVEN_HUES" | "THE_UNCONDITIONAL"
    | "LISTRACANTHUS" | "AQUAMATON" | "CINDER_SURPRISE" | "EALAD_SKAAN" | "GREAT_SERPENT_OF_RONKA" | "LANCETFISH"
    | "HYPHALOSAURUS" | "GHARLICHTHYS" | "SNOWY_PAREXUS" | "LEPOCERAS_ELEGANS" | "FURCACAUDA" | "SIDEREAL_WHALE";
    
const entries: Record<BigFishId, MinimizedBigFishCondition> = {
    // 2.x
    NEPTO_DRAGON: {c: {z: "EASTERN_LA_NOSCEA", w: ["rain", "showers"]}},
    ENDOCERAS: {c: {z: "WESTERN_LA_NOSCEA", t: {s: 20, e: 6}, p: ["fairSkies", "clearSkies"], w: ["clouds", "fog", "wind"]}},
    NAMITARO: {c: {z: "SOUTH_SHROUD", w: ["thunder", "thunderstorms"]}},
    HELICOPRION: {c: {z: "SOUTHERN_THANALAN", t: {s: 8, e: 20}, p: ["fog", "clouds"], w: "heatWaves"}},
    SHONISAURUS: {c: {z: "COERTHAS_CENTRAL_HIGHLANDS", p: ["clearSkies", "fairSkies"], w: "blizzards"}},
    KUNO_THE_KILLER: {c: {z: "MOR_DHONA"}, i: [{c: {z: "MOR_DHONA", t: {s: 8, e: 18}, w: "gloom"}}], r: {z: "MOR_DHONA", t: {s: 8, e: 18}, w: "gloom"}},
    // 3.x
    CHARIBENET: {c: {z: "COERTHAS_WESTERN_HIGHLANDS", t: {s: 0, e: 3}, w: "blizzards"}},
    SEA_BUTTERFLY: {c: {z: "SEA_OF_CLOUDS", t: {s: 5, e: 7}, w: "clearSkies"}},
    OPABINIA: {c: {z: "AZYS_LLA", w: "thunder"}},
    PROBLEMATICUS: {c: {z: "DRAVANIAN_FORELANDS", t: {s: 10, e: 16}, w: ["clearSkies", "fairSkies"]}},
    ARMOR_FISH: {c: {z: "DRAVANIAN_HINTERLANDS", t: {s: 1, e: 4}, w: "clearSkies"}},
    RAIMDELLOPTERUS: {c: {z: "CHURNING_MISTS", t: {s: 5, e: 8}, w: "gales"}},
    // 4.x
    XENACANTHUS: {c: {z: "FRINGES", t: {s: 16, e: 20}, w: ["clearSkies", "fairSkies", "clouds"]}},
    DREPANASPIS: {c: {z: "PEAKS", w: "dustStorms"}},
    STETHACANTHUS: {c: {z: "LOCHS", t: {s: 16, e: 18}}, i: [{c: {z: "LOCHS", t: {s: 12, e: 18}, w: "thunderstorms"}, n: 2}], r: {z: "LOCHS", t: {s: 12, e: 18}, w: "thunderstorms"}},
    RUBY_DRAGON: {c: {z: "RUBY_SEA", t: {s: 4, e: 8}, p: "thunder", w: "clouds"}},
    WARDEN_OF_THE_SEVEN_HUES: {c: {z: "YANXIA"}, i: [{c: {z: "YANXIA", t: {s: 0, e: 4}}, n: 3}, {c: {z: "YANXIA", t: {s: 4, e: 8}}, n: 3}, {c: {z: "YANXIA", t: {s: 0, e: 16}, p: "fairSkies", w: ["fairSkies", "clearSkies"]}, n: 5}], r: {z: "YANXIA", t: {s: 4, e: 16}, p: "fairSkies", w: ["fairSkies", "clearSkies"]}},
    THE_UNCONDITIONAL: {c: {z: "AZIM_STEPPE", t: {s: "5:30", e: "6:30"}, p: "rain", w: "clearSkies"}},
    // 5.x
    LISTRACANTHUS: {c: {z: "LAKELAND", t: {s: 16, e: 0}, p: ["fairSkies", "clearSkies"], w: "fog"}},
    AQUAMATON: {c: {z: "KHOLUSIA", t: {s: 10, e: 16}}, i: [{c: {z: "KHOLUSIA", t: {s: 10, e: 14}, p: ["clearSkies", "fairSkies"], w: "gales"}}, {c: {z: "KHOLUSIA"}, n: 5}], r: {z: "KHOLUSIA", t: {s: 10, e: 16}, p: ["clearSkies", "fairSkies"], w: "gales"}},
    CINDER_SURPRISE: {c: {z: "AMH_ARAENG", t: {s: 0, e: 2}, p: "dustStorms", w: "heatWaves"}, i: [{c: {z: "AMH_ARAENG"}, n: 10}]},
    EALAD_SKAAN: {c: {z: "IL_MHEG", t: {s: "23:30", e: 0}, p: "thunderstorms", w: "clearSkies"}},
    GREAT_SERPENT_OF_RONKA: {c: {z: "RAK_TIKA_GREATWOOD", t: {s: 10, e: 12}}},
    LANCETFISH: {c: {z: "TEMPEST", t: {s: 0, e: 2}, p: "fairSkies", w: "clouds"}, i: [{c: {z: "TEMPEST", t: {s: 22, e: 0}, w: "fairSkies"}}]},
    // 6.x
    HYPHALOSAURUS: {c: {z: "LABYRINTHOS", t: {s: 9, e: 12}, p: "clearSkies", w: "fairSkies"}, i: [{c: {z: "LABYRINTHOS"}, n: 3}]},
    GHARLICHTHYS: {c: {z: "THAVNAIR", t: {s: 14, e: 16}, p: "showers", w: "fairSkies"}, i: [{c: {z: "THAVNAIR", w: "fairSkies"}, n: 12}]},
    SNOWY_PAREXUS: {c: {z: "GARLEMALD", t: {s: 16, e: 0}, p: "fairSkies", w: "snow"}, i: [{c: {z: "GARLEMALD"}, n: 3}]},
    LEPOCERAS_ELEGANS: {c: {z: "MARE_LAMENTORUM", t: {s: 8, e: 10}, p: "moonDust", w: "fairSkies"}},
    FURCACAUDA: {c: {z: "ELPIS", t: {s: "15:30", e: "16:30"}, p: "fairSkies", w: "umbralWind"}},
    SIDEREAL_WHALE: {c: {z: "ULTIMA_THULE", t: {s: 0, e: 8}, p: "umbralWind", w: "astromagneticStorms"}},
};

export function getRealCondition(cond: MinimizedBigFishCondition) {
    const zone = cond.c.z;
    if (cond.r) {
        if (cond.r.z != zone) throw new Error(`Invalid zone: the zone specified as the read condition is invalid (must be ${zone})`);
        return cond.r
    }

    if (!cond.i) return cond.c;
    // ゾーンチェック
    if (!cond.i.every(a => a.c.z == zone)) throw new Error(`Invalid zone: at least one zone of intuitions is invalid (must be ${zone})`);
    return cond.c
}

export default entries;