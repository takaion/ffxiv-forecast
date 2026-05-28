export default class EorzeaTime {
    static readonly DAY = 4200
    static readonly HOUR = this.DAY / 24
    static readonly MINUTE = this.HOUR / 60
    static readonly SECOND = this.MINUTE / 60

    constructor(public unixSeconds: number) {}

    get bell() {
        return Math.floor(this.unixSeconds / 175);
    }

    get hours() {
        return this.bell % 24; 
    }

    protected get moment() {
        return (this.unixSeconds % 175) / 175 * 60
    }

    get minutes() {
        return Math.floor(this.moment);
    }

    get seconds() {
        const m = this.moment;
        return Math.floor((m - Math.floor(m)) * 60);
    }

    /** H:MM 形式で記述されるエオルゼア時間の文字列 */
    get timeString() {
        return `${this.hours}:${this.minutes.toFixed(0).padStart(2, "0")}`
    }

    /** H:MM:SS 形式で記述されるエオルゼア時間の文字列 */
    get detailedTimeString() {
        return `${this.timeString}:${this.seconds.toFixed(0).padStart(2, "0")}`
    }

    /** 天気算出用の整数(0～99) */
    get weatherTarget() {
        const bell = this.bell;
        const increment = (bell + 8 - (bell % 8)) % 24;
        const days = Math.floor(bell / 24);
        
        const base = days * 100 + increment;
        const step1 = (base << 11) ^ base;
        const step2 = (step1 >> 8) ^ step1;
        return step2 % 100
    }

    /**
     * 天気が始まる時間(0:00:00、8:00:00または16:00:00)の新しいインスタンスを作成して返す。
     * @param step 前後させる天気のステップ数。例えば0を指定すると現在の天気、1を指定すると次の天気、-1を指定すると前の天気が始まる時間のインスタンスが作成される。
     * @returns 
     */
    getWeatherTime(step: number = 0) {
        const us = this.unixSeconds // Unix Seconds
        const eh = 8 * EorzeaTime.HOUR // Eight Hours
        return new EorzeaTime(us + step * eh - (us % eh))
    }
    
    /** `Date`のインスタンスまたはミリ秒単位のUNIX時間からインスタンスを作成する */
    static from(date: Date | number) {
        const unixSeconds = Math.floor((date instanceof Date ? date.getTime() : date ?? Date.now()) / 1000);
        return new this(unixSeconds);
    }

    /** 現在時刻から{@link EorzeaTime}のインスタンスを作成する */
    static now() {
        return this.from(Date.now());
    }
}
