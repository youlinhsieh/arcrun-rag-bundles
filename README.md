# Arcrun RAG — install bundles

Prebuilt worker/service bundles for the **Arcrun RAG** one-click installer.
Served via jsDelivr; fetched automatically during install — you never need to read this repo.

- `manifest.json` — 索引：`core`＝安裝時就部署的 23 顆、`library`＝這一版公庫的 23 顆（其餘用到才下載）
- `arcrun-array-ops/` — **arcrun-array-ops**（首裝）
- `arcrun-auth-oauth2/` — **arcrun-auth-oauth2**（首裝）
- `arcrun-auth-service-account/` — **arcrun-auth-service-account**（首裝）
- `arcrun-auth-static-key/` — **arcrun-auth-static-key**（首裝）
- `arcrun-code/` — **arcrun-code**（首裝）
- `arcrun-cron/` — **arcrun-cron**（首裝）
- `arcrun-cypher-executor/` — **arcrun-cypher-executor**（首裝）
- `arcrun-date-ops/` — **arcrun-date-ops**（首裝）
- `arcrun-filter/` — **arcrun-filter**（首裝）
- `arcrun-foreach-control/` — **arcrun-foreach-control**（首裝）
- `arcrun-http-request/` — **arcrun-http-request**（首裝）
- `arcrun-if-control/` — **arcrun-if-control**（首裝）
- `arcrun-kbdb/` — **arcrun-kbdb**（首裝）
- `arcrun-mcp/` — **arcrun-mcp**（首裝）
- `arcrun-merge/` — **arcrun-merge**（首裝）
- `arcrun-number-ops/` — **arcrun-number-ops**（首裝）
- `tier2/ui/` — **arcrun-rag-ui**（首裝）
- `arcrun-set/` — **arcrun-set**（首裝）
- `arcrun-string-ops/` — **arcrun-string-ops**（首裝）
- `arcrun-switch/` — **arcrun-switch**（首裝）
- `arcrun-try-catch/` — **arcrun-try-catch**（首裝）
- `arcrun-validate-json/` — **arcrun-validate-json**（首裝）
- `arcrun-wait/` — **arcrun-wait**（首裝）
- `daemon/` — 桌面 App（Mac／Windows）安裝檔

Built from `Arcrun@a4880fa7d081` by `installer/scripts/ship.mjs`（arcrun-rag repo，release 1.4.62，built 2026-08-29）。

⚠️ 這份檔案由出貨管線每次自動重寫（`installer/scripts/render-bundles-readme.mjs`）——
不要手動改這裡列的零件清單——它是算出來的：公庫＝Arcrun 這一版編了什麼，
首裝＝安裝器會推的工作流證明需要什麼（`installer/scripts/bundle-components.mjs`）。

