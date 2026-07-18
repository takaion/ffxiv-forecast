import EorzeaTime from "./EorzeaTime.js"
import ZoneCondition from "./ZoneCondition.js"

const et = EorzeaTime.now()

describe("ZoneCondition", () => {
    const always = ZoneCondition.fromMinimized({z: "LIMSA_LOMINSA"})
    const furcacauda = ZoneCondition.fromMinimized({z: "ELPIS", t: {s: "15:30", e: "16:30"}, p: "fairSkies", w: "umbralWind"}) // フルカカウダ

    describe("findNextWindowStart", () => {
        test("Always available: returns the same instance", () => {
            const zc = always
            expect(zc.findNextWindowStart(et).unixSeconds).toBe(et.unixSeconds)
        })

        test("Time only: before starts", () => {
            const zc = ZoneCondition.fromMinimized({z: "LIMSA_LOMINSA", t: {s: 8, e: 12}})
            const t = et.getSpecifiedTime(6, 0)
            expect(zc.findNextWindowStart(t).unixSeconds).toBe(t.unixSeconds + EorzeaTime.HOUR * 2)
        })

        test("Time only: after starts", () => {
            const zc = ZoneCondition.fromMinimized({z: "LIMSA_LOMINSA", t: {s: 8, e: 12}})
            const t = et.getSpecifiedTime(10, 0)
            expect(zc.findNextWindowStart(t).unixSeconds).toBe(t.unixSeconds + EorzeaTime.HOUR * 22)
        })

        test("Time only: just start -> next day", () => {
            const zc = ZoneCondition.fromMinimized({z: "LIMSA_LOMINSA", t: {s: 8, e: 12}})
            const t = et.getSpecifiedTime(8, 0)
            expect(zc.findNextWindowStart(t).unixSeconds).toBe(t.unixSeconds + EorzeaTime.DAY)
        })

        test("Weather only: single", () => {
            const zc = ZoneCondition.fromMinimized({z: "LIMSA_LOMINSA", w: "clearSkies"})
            const u = Math.floor(new Date("2026/06/01 03:13:20+0900").getTime() / 1000)
            const t = EorzeaTime.from(new Date("2026/06/01 00:00:00+0900"))
            expect(zc.findNextWindowStart(t).unixSeconds).toBe(u)
        })

        test("Weather only: multiple", () => {
            const zc = ZoneCondition.fromMinimized({z: "YAK_T_EL", w: ["clouds", "fog"]})
            const u = Math.floor(new Date("2026/06/01 00:30:00+0900").getTime() / 1000)
            const t = EorzeaTime.from(new Date("2026/06/01 00:00:00+0900"))
            expect(zc.findNextWindowStart(t).unixSeconds).toBe(u)
        })

        test("Moving weather only", () => {
            const zc = ZoneCondition.fromMinimized({z: "COERTHAS_WESTERN_HIGHLANDS", p: ["blizzards", "snow"], w: ["clearSkies", "fairSkies"]}) // ブルーコープス
            const u = Math.floor(new Date("2026/06/01 01:16:40+0900").getTime() / 1000)
            const t = EorzeaTime.from(new Date("2026/06/01 00:00:00+0900"))
            expect(zc.findNextWindowStart(t).unixSeconds).toBe(u)
        })

        test("All conditions: half hour", () => {
            const zc = furcacauda
            const u = Math.floor(new Date("2026/06/01 05:56:40+0900").getTime() / 1000)
            const t = EorzeaTime.from(new Date("2026/06/01 00:00:00+0900"))
            expect(zc.findNextWindowStart(t).unixSeconds).toBe(u)
        })
    })

    describe("findNextWindowEnd", () => {
        test("Always available: returns the same instance", () => {
            const zc = always
            expect(zc.findNextWindowEnd(et).unixSeconds).toBe(et.unixSeconds)
        })

        test("Less than ET 1h", () => {
            const zc = furcacauda
            const u = Math.floor(new Date("2026/06/01 05:56:40+0900").getTime() / 1000)
            const t = EorzeaTime.from(new Date("2026/06/01 05:56:40+0900"))
            const result = zc.findNextWindowEnd(t)
            expect(result.unixSeconds - u).toBe(88) // 88 Sec
        })
    })
})