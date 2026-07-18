import { Weather } from "../data/Weather.js"
import { getAvailableWeathers, getZoneWeather, ZoneId } from "../data/ZoneWeather.js"
import EorzeaTime from "./EorzeaTime.js"

interface TimeRange {
    /** 開始時間。"15:00"、"15"といったstringおよび15といったnumberで指定が可能。`number`でnを指定した場合、n時であると解釈される。 */
    start: string | number
    /** 終了時間。"15:00"、"15"といったstringおよび15といったnumberで指定が可能。`number`でnを指定した場合、n時であると解釈される。 */
    end: string | number
}

/** ゾーンまたはエリアにおける時間ならびに天候条件 */
export interface ZoneConditionOptions {
    /** 対象となるゾーン/エリア */
    zone: ZoneId,
    /** 時間条件 */
    et?: TimeRange
    /** 天気単体または天気の配列で表される天候条件。移ろいの場合、直前の天気は{@link previousWeather}に指定する。 */
    weather?: Weather[] | Weather
    /** 天気単体または天気の配列で表される、直前の天候条件 */
    previousWeather?: Weather[] | Weather
}

/** 最小限の文字数で記述が可能な時間ならびに天候条件 */
export interface MinimizedZoneConditionOptions {
    /** 対象となるゾーン/エリア。{@link ZoneConditionOptions.zone}に対応する。 */
    z: ZoneConditionOptions["zone"]
    /** 時間条件。{@link ZoneConditionOptions.et}に対応する。 */
    t?: {
        /** 開始時間。"15:00"、"15"といったstringおよび15といったnumberで指定が可能。`number`でnを指定した場合、n時であると解釈される。{@link TimeRange.start}に対応する。 */
        s: TimeRange["start"],
        /** 終了時間。"15:00"、"15"といったstringおよび15といったnumberで指定が可能。`number`でnを指定した場合、n時であると解釈される。{@link TimeRange.end}に対応する。 */
        e: TimeRange["end"]
    }
    /** 天気単体または天気の配列で表される天候条件。移ろいの場合、直前の天気は{@link p}に指定する。{@link ZoneConditionOptions.weather}に対応する。 */
    w?: ZoneConditionOptions["weather"]
    /** 天気単体または天気の配列で表される、直前の天候条件。{@link ZoneConditionOptions.previousWeather}に対応する。 */
    p?: ZoneConditionOptions["previousWeather"]
}

export interface ZoneConditionMatchedWindow {
    start: EorzeaTime;
    end: EorzeaTime;
}

/** 最小化された条件から{@link ZoneConditionOptions}のオブジェクトを作成する */
export function extractMinimizedZoneConditionOptions(o: MinimizedZoneConditionOptions): ZoneConditionOptions {
    return { zone: o.z, et: o.t ? { start: o.t.s, end: o.t.e } : undefined, weather: o.w, previousWeather: o.p }
}

/** 
 * 指定されたゾーン/エリアにおける条件を管理する。
 * エオルゼア時間({@link EorzeaTime})を与えることによって条件が満たされているか判定したり、次の条件が満たされる時間を検索する機能を持つ。
 */
export class ZoneCondition {
    /** 対象となるゾーン/エリア */
    readonly zone: ZoneId
    /** 
     * 条件を満たすエオルゼア時間の開始および終了時間。
     * 開始時間が終了時間よりも後の場合、0:00をまたいだ範囲と判定する。
     * 開始時間が終了時間と等しい場合、すべての時間で条件に合致すると判定する。
     */
    readonly et?: {
        /** 0:00～23:59を分単位で0から1439の間の整数で再表現したもの */
        start: number,
        /** 0:00～23:59を分単位で0から1439の間の整数で再表現したもの */
        end: number
    }
    /**
     * 条件を満たす天候のセット。
     * 空はすべての天候で条件に合致すると判定する。
     */
    readonly weather: {
        current: Set<Weather>
        previous: Set<Weather>
    }

    protected cachedWindowStartCandidates?: number[]

    constructor(options: ZoneConditionOptions) {
        this.zone = options.zone
        if (options.et) {
            this.et = { start: this.parseTime(options.et.start), end: this.parseTime(options.et.end) }
        }
        const toArray = (w: Weather[] | Weather | undefined): Set<Weather> => new Set(!w ? [] : Array.isArray(w) ? w : [w])
        this.weather = {
            current: toArray(options.weather),
            previous: toArray(options.previousWeather)
        }
    }

    /** "23"や"23:30"といったstring、または12などのnumberを{@link et}で使用する分単位の整数に変換する */
    protected parseTime(time: string | number): number {
        // mはnumberと推論されるがundefinedの可能性あり
        const [h, m] = time.toString().split(":").map(t => Number(t))
        return (60 * h + (m ?? 0)) % 1440
    }

    /** このインスタンスに含まれる条件が常に満たされるかを返す。 */
    isAlways() {
        return !this.et && !this.hasWeatherCondition()
    }

    /**
     * 指定されたゾーン/エリアに対して、判定が必要な天候条件があるかを返す。
     * `true`の場合は条件にマッチしているかの判定にゾーン/エリアにおける天気の計算が必要。
     * `false`の場合は天候条件がないか常に満たしているので計算ならびに判定が不要。
     * 
     * Note: 判定しても常に`false`となることを防ぐためには{@link isValidWeatherConditionForZone}を使用してください。
     * @param zone 
     * @returns 
     */
    hasWeatherCondition() {
        const available = getAvailableWeathers(this.zone)
        const weatherCheck = (w: Set<Weather>) => w.size > 0 && available.intersection(w).size < available.size;
        return weatherCheck(this.weather.current) || weatherCheck(this.weather.previous)
    }

    /**
     * 指定されたエオルゼア時間が条件に一致するかを判定する
     */
    isMatchTime(et?: EorzeaTime) {
        // 時間条件を無視できる場合はtrueで早期リターン
        const condEt = this.et
        if (!condEt || condEt.start == condEt.end) return true
        et ??= EorzeaTime.now()
        const target = 60 * et.hours + et.minutes
        if (condEt.start > condEt.end) {
            return condEt.start <= target || target < condEt.end
        }
        return condEt.start <= target && target < condEt.end
    }

    /**
     * 指定されたゾーン/エリアで有効な天気一覧および条件の天候一覧から有効な条件かを判定する
     * @param strict `true`の場合、条件中の天気すべてがゾーン/エリアの有効な天気であることを必要とする。`false`の場合、一部の天気のみが有効な天気であれば有効と判定する。デフォルトは`false`。
     * @returns 
     */
    isValidWeatherConditionForZone(strict?: boolean) {
        const curr = this.weather.current
        const prev = this.weather.previous
        const available = getAvailableWeathers(this.zone)
        const check = (cond: Set<Weather>) =>
            cond.size == 0 || (strict ? available.intersection(cond).size == curr.size : available.intersection(cond).size > 0);
        return check(curr) && check(prev)
    }

    /**
     * 指定されたエオルゼア時間(指定しない場合は、現在日時から生成されたエオルゼア時間)の天気が条件に一致するかを判定する
     * @param et 
     * @returns 
     */
    isMatchWeather(et?: EorzeaTime) {
        // 天候条件を無視できる場合はtrueで早期リターン
        const [currCond, prevCond] = [this.weather.current, this.weather.previous]
        if (currCond.size == 0 && prevCond.size == 0) return true

        et ??= EorzeaTime.now()
        const [curr, prev] = [getZoneWeather(this.zone, et), getZoneWeather(this.zone, et.getWeatherTime(-1))];
        return (currCond.size == 0 || currCond.has(curr)) && (prevCond.size == 0 || prevCond.has(prev))
    }

    /**
     * 指定されたエオルゼア時間が条件にマッチするかを判定する。
     * @param et 
     * @returns 
     */
    isMatch(et?: EorzeaTime) {
        et ??= EorzeaTime.now()
        return this.isMatchTime(et) && this.isMatchWeather(et)
    }

    protected get weatherChangeTimeInWindow(): number[] {
        if (!this.hasWeatherCondition()) return [];
        const candidates = [0, 480, 960];
        const et = this.et;
        if (!et) return candidates;
        return candidates.filter(m => et.start < et.end ? et.start < m && m < et.end : et.start < m || m < et.end).toSorted((a, b) => a - b);
    }

    /** 保持している時間条件からウィンドウの開始としてチェックする必要のあるETのリストを作成して返す。 */
    protected get windowStartCandidates(): number[] {
        return Array.from(new Set([this.et ? this.et.start : 0, ...this.weatherChangeTimeInWindow]));
    }

    /** 保持している時間条件からウィンドウの終了としてチェックする必要のあるETのリストを作成して返す。 */
    protected get windowEndCandidates(): number[] {
        return Array.from(new Set([this.et ? this.et.end : 0, ...this.weatherChangeTimeInWindow]));
    }

    /** ウィンドウの境界となる可能性のある時間のリスト */
    protected get windowCandidates(): number[] {
        return Array.from(new Set([...(this.et ? [this.et.start, this.et.end] : [0]), ...this.weatherChangeTimeInWindow]));
    }

    protected getNextEorzeaTimeFromCandidateMinutes(et: EorzeaTime, minutes: number[]) {
        const t = et.hours * 60 + et.minutes
        const candidates = Array.from(new Set(minutes)).toSorted((a, b) => a - b)
        const next = candidates.find(c => t < c) ?? candidates[0]
        return et.getSpecifiedTime(Math.floor(next / 60), next % 60)
    }

    /**
     * チェックすべきエオルゼア時間を返す
     * @param et 現在の調査対象エオルゼア時間
     * @param candidates チェック候補となる、1日のうち0:00から何分経過したかを示す0～1440の整数の配列
     * @param isNext エオルゼア時間を進めるか(true: 進める, false: 戻す)
     * @returns 次の調査対象エオルゼア時間
     */
    private getCandidate(et: EorzeaTime, candidates: number[], isNext: boolean) {
        const time = et.hours * 60 + et.minutes;
        const sortedCandidates = Array.from(new Set(candidates)).toSorted((a, b) => isNext ? a - b : b - a);
        const matched = sortedCandidates.find(c => isNext ? time < c : c < time) ?? sortedCandidates[0];
        // 同じETである場合のループを回避: 1/2 0:00→(skipDays)1/1 0:00→(getSpecifiedTime)1/2 0:00 で同じ時間になってしまう
        const daysToSkip = isNext ? 0 : (time == matched ? -2 : -1);
        return et.skipDays(daysToSkip).getSpecifiedTime(Math.floor(matched / 60), matched % 60);
    }

    private getPreviousCandidate(et: EorzeaTime, candidates: number[]) {
        return this.getCandidate(et, candidates, false);
    }

    private getNextCandidate(et: EorzeaTime, candidates: number[]) {
        return this.getCandidate(et, candidates, true);
    }

    /** `curr`がウィンドウの始端かを判定する */
    private isWindowStart(prev: EorzeaTime, curr: EorzeaTime) {
        return !this.isMatch(prev) && this.isMatch(curr)
    }

    /** `curr`がウィンドウの終端かを判定する */
    private isWindowEnd(prev: EorzeaTime, curr: EorzeaTime) {
        return this.isMatch(prev) && !this.isMatch(curr);
    }

    private findPreviousWindowBorder(isFindStart: boolean, et?: EorzeaTime, allowSameTime: boolean = true) {
        et ??= EorzeaTime.now();
        if (this.isAlways()) return et;
        const candidates = this.windowCandidates;
        let current = new EorzeaTime(et.unixSeconds - (allowSameTime ? 0 : 1));
        const getPrevious = () => this.getPreviousCandidate(current, candidates);
        const isSatisfied = (p: EorzeaTime, c: EorzeaTime) => isFindStart ? this.isWindowStart(p, c) : this.isWindowEnd(p, c);
        let previous = getPrevious();
        while (!isSatisfied(previous, current)) {
            current = previous;
            previous = getPrevious();
        }
        return current
    }

    private findNextWindowBorder(isFindStart: boolean, et?: EorzeaTime): EorzeaTime {
        et ??= EorzeaTime.now();
        if (this.isAlways()) return et;
        const candidates = this.windowCandidates;
        let current = et;
        const getNext = () => this.getNextCandidate(current, candidates);
        const isSatisfied = (c: EorzeaTime, n: EorzeaTime) => isFindStart ? this.isWindowStart(c, n) : this.isWindowEnd(c, n);
        let next = getNext();
        while (!isSatisfied(current, next)) {
            current = next;
            next = getNext();
        }
        return next
    }

    /**
     * `et` と同じかより前の時間でウィンドウが開始した時間を返す
     * @param et 
     * @param allowSameTime etに与えた時間と同じ時間を許容するか
     */
    findPreviousWindowStart(et?: EorzeaTime, allowSameTime?: boolean): EorzeaTime {
        return this.findPreviousWindowBorder(true, et, allowSameTime);
    }

    /**
     * `et` と同じかより前の時間でウィンドウが終了した時間を返す
     * @param et 
     * @param allowSameTime etに与えた時間と同じ時間を許容するか
     */
    findPreviousWindowEnd(et?: EorzeaTime, allowSameTime?: boolean): EorzeaTime {
        return this.findPreviousWindowBorder(false, et, allowSameTime);
    }

    /**
     * `et` より後の時間でウィンドウが開始する時間を返す
     * @param et 
     * @returns 
     */
    findNextWindowStart(et?: EorzeaTime): EorzeaTime {
        return this.findNextWindowBorder(true, et);
    }

    /**
     * `et` より後の時間でウィンドウが終了する時間を返す
     * @param et 
     * @returns 
     */
    findNextWindowEnd(et?: EorzeaTime): EorzeaTime {
        return this.findNextWindowBorder(false, et);
    }

    findPreviousWindow(et: EorzeaTime, allowCurrent: boolean = false): ZoneConditionMatchedWindow {
        const start = !allowCurrent && this.isMatch(et) ?
            this.findPreviousWindowStart(this.findPreviousWindowStart(et, false), false) :
            this.findPreviousWindowStart(et, true);
        const end = this.findNextWindowEnd(start)
        return { start, end }
    }

    findCurrentWindow(et: EorzeaTime): ZoneConditionMatchedWindow | null {
        if (!this.isMatch(et)) return null;
        return { start: this.findPreviousWindowStart(et, true), end: this.findNextWindowEnd(et) };
    }

    findNextWindow(et: EorzeaTime): ZoneConditionMatchedWindow {
        const start = this.findNextWindowStart(et);
        const end = this.findNextWindowEnd(start);
        return { start, end }
    }

    /**
     * インスタンスの持つ条件に合致するエオルゼア時間を検索する。
     * 与えられたエオルゼア時間(指定しない場合は、現在日時から作成されたエオルゼア時間のインスタンス)がすでに条件を満たす場合はその次のマッチする日時を検索する。
     * 
     * 常にマッチする条件のインスタンスである場合は与えられたエオルゼア時間(指定しない場合は現在日時から作成されたエオルゼア時間)のインスタンスを返す。
     * @param base 
     * @returns 
     * @deprecated Use {@link findNextWindowStart} or {@link findNextWindow} instead.
     */
    findNextMatch(base?: EorzeaTime): EorzeaTime {
        let et = base ?? EorzeaTime.now()
        if (this.isAlways()) return et;
        if (!this.isValidWeatherConditionForZone()) throw new Error(`Cannot find the next match (weather set is invalid)`);
        et = this.findNextWindowEnd(et); // 今マッチしている場合は終了する時間へ飛ぶ
        const candidates = this.windowStartCandidates;
        do {
            et = this.getNextEorzeaTimeFromCandidateMinutes(et, candidates);
        } while (!this.isMatch(et)); // isWeatherMatchだけでも十分に判定できるが念のため
        return et;
    }

    /**
     * 与えられた `base` (指定しない場合は現在時間) から条件(気候、ET)が終了する時間を算出する。
     * 与えられたエオルゼア時間が条件を満たす時間ではない場合、そのまま返す。
     * @deprecated Use {@link findNextWindowEnd} or {@link findPreviousWindowEnd} instead.
     */
    findWindowEnd(base?: EorzeaTime): EorzeaTime {
        let et = base ?? EorzeaTime.now();
        if (this.isAlways() || !this.isMatch(et)) return et;
        const candidates = this.windowEndCandidates;
        while (this.isMatch(et)) {
            et = this.getNextEorzeaTimeFromCandidateMinutes(et, candidates)
        }
        return et;
    }

    /** {@link MinimizedZoneConditionOptions}の形式で記述された条件からインスタンスを作成する */
    static fromMinimized(minimizedOptions: MinimizedZoneConditionOptions) {
        return new this(extractMinimizedZoneConditionOptions(minimizedOptions))
    }
}

export default ZoneCondition;