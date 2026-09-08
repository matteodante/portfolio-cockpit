# Project screenshot asset provenance

Retrieved 2026-09-08 from Apple's public App Store metadata and CDN. These are official screenshots supplied by app publisher Matteo Dante, not generated or reconstructed product UI.

## Official listings

- English: [Maestro: AI Tutor & Study App](https://apps.apple.com/us/app/maestro-ai-tutor-study-app/id6780267046?uo=4) — App Store ID 6780267046.
- English: [GymTree: Workout Tracker AI](https://apps.apple.com/us/app/gymtree-workout-tracker-ai/id6761392403?uo=4) — App Store ID 6761392403.
- Italian: [Maestro: Tutor AI per studiare](https://apps.apple.com/it/app/maestro-tutor-ai-per-studiare/id6780267046?uo=4) — App Store ID 6780267046.
- Italian: [GymTree: Scheda Palestra AI](https://apps.apple.com/it/app/gymtree-scheda-palestra-ai/id6761392403?uo=4) — App Store ID 6761392403.

- US lookup: https://itunes.apple.com/lookup?id=6780267046,6761392403&country=us
- Italy lookup: https://itunes.apple.com/lookup?id=6780267046,6761392403&country=it
- Lookup snapshots: `.impeccable/tmp/app-store-en.json` and `.impeccable/tmp/app-store.json`.

## Shipping files

All JPEGs are 221 × 480 pixels, downloaded at the exact screenshot URL returned by the lookup. The suffix 1 or 2 denotes the first or second screenshot in the official listing. Existing filenames without an en suffix remain the Italian assets.

| File | Locale | Official image source |
| --- | --- | --- |
| `public/landing-v2/gymtree-1.jpg` | IT | [Apple CDN](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/b0/8f/ce/b08fce70-32c2-6ea6-4640-8594c7666cde/01-workout-log.png/320x480bb.jpg) |
| `public/landing-v2/gymtree-2.jpg` | IT | [Apple CDN](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/6c/b3/ce/6cb3cea8-15a2-74a2-9704-02b8c33b3b4a/02-workout-plan.png/320x480bb.jpg) |
| `public/landing-v2/gymtree-en-1.jpg` | EN | [Apple CDN](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d4/79/85/d47985e0-f02c-6c61-dca6-0963370072ef/01-workout-log.png/320x480bb.jpg) |
| `public/landing-v2/gymtree-en-2.jpg` | EN | [Apple CDN](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/22/5d/49/225d4910-47a4-4048-85cf-1e355dda516f/02-workout-plan.png/320x480bb.jpg) |
| `public/landing-v2/maestro-1.jpg` | IT | [Apple CDN](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/db/5d/a2/db5da2f5-606c-7bc3-129e-c7cd05fbde0b/01-device-bottom.png/320x480bb.jpg) |
| `public/landing-v2/maestro-2.jpg` | IT | [Apple CDN](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/63/38/10/6338105d-92c7-eaaf-cc87-254bd37d699d/02-device-top.png/320x480bb.jpg) |
| `public/landing-v2/maestro-en-1.jpg` | EN | [Apple CDN](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/08/35/dd/0835dd3e-665a-e21b-c378-5be9e9f2f5bc/01-device-bottom.png/320x480bb.jpg) |
| `public/landing-v2/maestro-en-2.jpg` | EN | [Apple CDN](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f6/96/e3/f696e3b3-39b8-d059-eda9-fa68cacda194/02-device-top.png/320x480bb.jpg) |

## Verification

- Visually inspected all four English images: Maestro copy and app screens are English; GymTree workout log and workout plan copy are English.
- Compared decoded RGB pixels for each of the eight saved JPEGs against a fresh download of its recorded official source: all eight match exactly.
- The global Impeccable embed-prompt command inserted a JPEG COM comment describing the source, locale, screenshot order and retrieval date. This adds provenance metadata without changing image pixels. Each file also has a .origin.json source record.
- No app screenshot was generated, cropped, resized, recolored, or rewritten.

## Saved-file SHA-256 (including provenance comment)

- `gymtree-1.jpg`: `d0a71e3ea0dd1ba326dcd308cbaa04357ff6408717fd649eb5dcb5191a1ab075`.
- `gymtree-2.jpg`: `ec4c7c2fd60ea22dc3858c5e80510430775146873642b6950f58137587bf30fc`.
- `gymtree-en-1.jpg`: `25b729b28edf9875184a57f411fcec500b03697aaa3815bc7e46bcfcb78e05a6`.
- `gymtree-en-2.jpg`: `36ecf496d03f681274ab77ee539d8af8975b45e947208cf22b743b79713f427c`.
- `maestro-1.jpg`: `b82dba5bf7320ad2e9d2bfe4d10eb47a4eccb561683858ca101f6c6fdfef1e91`.
- `maestro-2.jpg`: `fcb2cad40720bc70d1c8b4fbd06c39ffd64d5bc17e8ffc875dc2a44485a8234a`.
- `maestro-en-1.jpg`: `2cc40d828a0152bc56342ae7eb5685a8cfa573d6407dfbb54167272791328276`.
- `maestro-en-2.jpg`: `889fb2f2ecd86aec15c5704b57c869671b13a7c39557d8703dc46082d6cccd37`.
