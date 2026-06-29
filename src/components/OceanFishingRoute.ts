import oceanFishingTime, { OceanFishingTime } from "../data/OceanFishingTime.js";
import oceanFishingZone, { OceanFishingZone } from "../data/OceanFishingZone.js";

export interface RouteZone {
    zone: OceanFishingZone,
    time: OceanFishingTime
}

/**
 * オーシャンフィッシング航路を算出するためのクラス。
 * なおPatch 7.51時点での情報に基づくため過去パッチの日時におけるスケジュールは不正確である可能性がある。
 */
export class OceanFishingRoute {
    /** 乗船受付が始まる周期 */
    static readonly CYCLE_SECONDS = 7200;
    /** 乗船受付を行う期間 */
    static readonly ACCEPT_WINDOW_SECONDS = 900;
    /** 同期のために2020/01/05 1:00 JSTを基準とするためのオフセット (`Math.floor(new Date("2020-01-05T01:00:00+0900").getTime()/7200000)`) */
    static readonly TIME_CYCLE_OFFSET = 219188;

    constructor(public unixSeconds: number) {
        if (Number.isNaN(unixSeconds)) throw new Error(`NaN is not acceptable for ocean fishing route`);
    }

    /** インスタンスが持つUNIX時間に応じた{@link Date}のインスタンス */
    get date() {
        return new Date(this.unixSeconds * 1000);
    }

    /** 基準となる日時(2020/01/05 1:00 JST)から数えた航海数 */
    get cycle() {
        // JST 1時に航路の切り替えが行われる
        const offset: number = OceanFishingRoute.TIME_CYCLE_OFFSET;
        return Math.floor(this.unixSeconds / OceanFishingRoute.CYCLE_SECONDS - offset);
    }

    /** 乗船を受け付けているかを返す。 */
    isAccepting() {
        return (this.unixSeconds % OceanFishingRoute.CYCLE_SECONDS) < OceanFishingRoute.ACCEPT_WINDOW_SECONDS;
    }

    /** インスタンスが持つ時間またはそれ以前に航海が始まるUNIX時間を返す。 */
    getCurrentCycleStartUnixSeconds() {
        const us = this.unixSeconds;
        const cs = OceanFishingRoute.CYCLE_SECONDS;
        return us - (us % cs);
    }

    /**
     * インスタンスが持つ時間またはそれ以前に航海が始まる時間のインスタンスを作成して返す。
     * @param [step=0] 指定された整数だけ始まる航海をずらして返す。(例: -1を設定してひとつ前の航海時の情報を得る。1を設定して次の航海の情報を得る。)
     */
    getCycleStart(step: number = 0) {
        return new OceanFishingRoute(this.getCurrentCycleStartUnixSeconds() + step * OceanFishingRoute.CYCLE_SECONDS);
    }

    protected getTimeByIndex(i: number) {
        const times: OceanFishingTime[] = [oceanFishingTime.DAY, oceanFishingTime.EVENING, oceanFishingTime.NIGHT];
        return times[i % times.length]
    }

    /** 指定されたサイクル(航海)での開始時間帯を取得する。 */
    protected getStartTimeIndex(cycle?: number): number {
        const loopSize = {s: 11, m: 48, l: 144};
        const loopIndex = (cycle ?? this.cycle) % loopSize.l;

        if (!Number.isInteger(loopIndex) || loopIndex < 0 || loopSize.l <= loopIndex) {
            throw new Error(`Invalid loop index (must be integer, 0 <= i < 135)`);
        }
        const startTimeIndex = Math.floor(loopIndex / loopSize.m);
        const mediumLoopIndex = loopIndex % loopSize.m;

        if (loopSize.s * 4 < mediumLoopIndex) return startTimeIndex;
        const smallLoopIndex = mediumLoopIndex % loopSize.s;
        if (smallLoopIndex < 3) return startTimeIndex;
        if (smallLoopIndex < 7) return startTimeIndex + 1;
        return startTimeIndex + 2;
    }

    /** 直近の航海における開始時間帯(昼、夕、または夜)を返す。 */
    getStartTime(cycle?: number): OceanFishingTime {
        return this.getTimeByIndex(this.getStartTimeIndex(cycle));
    }

    /** 直近の航海における時間帯(昼、夕、または夜)すべての配列を返す。 */
    getTimes(cycle?: number): OceanFishingTime[] {
        const startIndex = this.getStartTimeIndex(cycle)
        return [
            this.getTimeByIndex(startIndex),
            this.getTimeByIndex(startIndex + 1),
            this.getTimeByIndex(startIndex + 2),
        ]
    }

    protected getDestinationIndex(zones: OceanFishingZone[], cycle?: number) {
        cycle ??= this.cycle
        const days = Math.floor(cycle / 12);
        const index = (days + cycle) % zones.length;
        return zones[index]
    }

    /** 近海航路の行き先を返す。 */
    getIndigoDestination(cycle?: number): OceanFishingZone {
        const z = oceanFishingZone;
        const dests = [
            z.ROTHLYT_SOUND,
            z.NORTHERN_STRAIT_OF_MERLTHOR,
            z.RHOTANO_SEA,
            z.BLOODBRINE_SEA,
        ];
        return this.getDestinationIndex(dests, cycle);
    }

    /** 遠洋航路の行き先を返す。 */
    getRubyDestination(cycle?: number) {
        const z = oceanFishingZone;
        const dests = [
            z.THE_ONE_RIVER,
            z.THAVNAIR,
            z.THE_RUBY_SEA,
            z.THAVNAIR,
        ]
        return this.getDestinationIndex(dests, cycle)
    }

    /** 航路の行き先に応じて設定されているルートをエリアの配列で返す。 */
    getAllZonesForDestination(dest: OceanFishingZone): OceanFishingZone[] | null {
        const z = oceanFishingZone;
        switch (dest) {
            // 近海航路
            case z.ROTHLYT_SOUND:
                return [z.THE_CIELDALAES, z.RHOTANO_SEA, z.ROTHLYT_SOUND];
            case z.NORTHERN_STRAIT_OF_MERLTHOR:
                return [z.SOUTHERN_STRAIT_OF_MERLTHOR, z.GALADION_BAY, z.NORTHERN_STRAIT_OF_MERLTHOR];
            case z.RHOTANO_SEA:
                return [z.GALADION_BAY, z.SOUTHERN_STRAIT_OF_MERLTHOR, z.RHOTANO_SEA];
            case z.BLOODBRINE_SEA:
                return [z.THE_CIELDALAES, z.NORTHERN_STRAIT_OF_MERLTHOR, z.BLOODBRINE_SEA];
            // 遠洋航路
            case z.THE_ONE_RIVER:
                return [z.THE_SIRENSONG_SEA, z.KUGANE, z.THE_ONE_RIVER];
            case z.THAVNAIR:
                return [z.UNNAMED_ISLAND, z.THE_SIRENSONG_SEA, z.THAVNAIR];
            case z.THE_RUBY_SEA:
                return [z.THE_SIRENSONG_SEA, z.KUGANE, z.THE_RUBY_SEA];
        }
        return null;
    }

    /** 近海航路または遠洋航路のルートを返す */
    protected getRoute(isIndigo: boolean) {
        const dest = isIndigo ? this.getIndigoDestination() : this.getRubyDestination();
        const route = this.getAllZonesForDestination(dest);
        if (!route) throw new Error(`Route for ${dest} is not registered.`);
        const times = this.getTimes();
        if (times.length != route.length) throw new Error(`Number of time zones and routes does not match`);
        return times.map((t, i) => {
            return {time: t, zone: route[i]} as RouteZone
        });
    }

    /** 近海航路のルートを返す。 */
    getIndigoRoute() {
        return this.getRoute(true);
    }

    /** 遠洋航路のルートを返す。 */
    getRubyRoute() {
        return this.getRoute(false);
    }

    /** `Date`のインスタンスまたはミリ秒単位のUNIX時間からインスタンスを作成する */
    static from(date: Date | number) {
        const unixSeconds = Math.floor((date instanceof Date ? date.getTime() : date ?? Date.now()) / 1000);
        return new this(unixSeconds);
    }

    /** 現在時刻から{@link OceanFishingRoute}のインスタンスを作成する */
    static now() {
        return this.from(Date.now());
    }
}

export default OceanFishingRoute;