export const oceanFishingZone = {
    // 近海航路
    RHOTANO_SEA: "rhotanoSea",
    BLOODBRINE_SEA: "bloodbrineSea",
    ROTHLYT_SOUND: "rothlytSound",
    NORTHERN_STRAIT_OF_MERLTHOR: "northernStraitOfMelthor",
    SOUTHERN_STRAIT_OF_MERLTHOR: "southernStraitOfMelthor",
    GALADION_BAY: "galadionBay",
    THE_CIELDALAES: "theCieldalaes",
    // 遠洋航路
    THE_RUBY_SEA: "theRubySea",
    THAVNAIR: "thavnair",
    THE_ONE_RIVER: "theOneRiver",
    THE_SIRENSONG_SEA: "theSirensongSea",
    KUGANE: "kugane",
    UNNAMED_ISLAND: "unnamedIsland",
} as const;

export type OceanFishingZone = (typeof oceanFishingZone)[keyof typeof oceanFishingZone];
export default oceanFishingZone