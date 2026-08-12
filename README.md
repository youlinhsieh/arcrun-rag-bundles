# Arcrun RAG — install bundles

Prebuilt worker/service bundles for the **Arcrun RAG** one-click installer.
Served via jsDelivr; fetched automatically during install — you never need to read this repo.

- `manifest.json` — schema `arcrun-rag-bundles/v1`（6 components，逐顆見下）
- `arcrun-cypher-executor/` — **arcrun-cypher-executor**
- `arcrun-kbdb/` — **arcrun-kbdb**
- `arcrun-http-request/` — **arcrun-http-request**
- `arcrun-code/` — **arcrun-code**
- `tier2/ui/` — **arcrun-rag-ui**
- `arcrun-mcp/` — **arcrun-mcp**
- `daemon/` — 桌面 App（Mac／Windows）安裝檔

Built from `Arcrun@2fcae722e7d7` by `installer/scripts/ship.mjs`（arcrun-rag repo，release 1.4.43，built 2026-08-12）。

⚠️ 這份檔案由出貨管線每次自動重寫（`installer/scripts/render-bundles-readme.mjs`）——
不要手動改這裡列的零件清單，要改就改 `installer/scripts/bundle-components.mjs`（唯一真相源，改一個地方兩條出貨路徑同時生效）。

