export const oceanFishingTime = {
    DAY: "day",
    EVENING: "evening",
    NIGHT: "night"
} as const;

export type OceanFishingTime = (typeof oceanFishingTime)[keyof typeof oceanFishingTime];
export default oceanFishingTime