// ヌシ情報を取得するサンプル

import { getBigFishName } from "../components/Locale.js";
import ZoneCondition from "../components/ZoneCondition.js";
import entries, { BigFishId, getRealCondition } from "../data/BigFishData.js";

function main() {
    Object.entries(entries).map(([bigFishId, minimizedCondition]) => {
        const name = getBigFishName(bigFishId as BigFishId);
        const condition = ZoneCondition.fromMinimized(getRealCondition(minimizedCondition));
        const nextChance = condition.findNextMatch();
        console.log(`${name}: ${nextChance.getEarthDate().toLocaleString("ja-JP")}`);
    })
}

main();