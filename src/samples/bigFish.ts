// ヌシ情報を取得するサンプル

import { getBigFishName } from "../components/Locale.js";
import ZoneCondition from "../components/ZoneCondition.js";
import bigFishEntries, { BigFishId, getRealCondition } from "../data/BigFishData.js";

function main() {
    Object.entries(bigFishEntries).map(([bigFishId, minimizedCondition]) => {
        const name = getBigFishName(bigFishId as BigFishId);
        const condition = ZoneCondition.fromMinimized(getRealCondition(minimizedCondition));
        const nextChance = condition.findNextWindowStart();
        console.log(`${name}: ${nextChance.getEarthDate().toLocaleString("ja-JP")}`);
    })
}

main();