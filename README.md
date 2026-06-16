# ffxiv-forecast

## セットアップ / Setup

.npmrc
```
@takaion:registry=https://npm.pkg.github.com
```

## インストール / Install

npm
```
$ npm install @takaion/ffxiv-forecast
```

pnpm
```
$ pnpm add @takaion/ffxiv-forecast
```

## 主なクラスと関数 / Key classes and functions

* `EorzeaTime`
* `OceanFishingRoute`
* `ZoneCondition`
* 各言語への変換 / Translate to each language
    * `getBigFishName(bigFish, locale?)`
    * `getOceanFishingTimeName(oceanFishingTime, locale?)`
    * `getOceanFishingZoneName(oceanFishingZone, locale?)`
    * `getWeatherName(weather, locale?)`
    * `getZoneName(zone, locale?)`
* エリアと天気 / Zone and weather
    * `getAllZones()`
    * `getZoneWeather(zone, eorzeaTime?)`
    * `getAvailableWeathers(zone)`
