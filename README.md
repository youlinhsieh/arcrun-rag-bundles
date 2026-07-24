# Arcrun RAG — install bundles

Prebuilt worker bundles for the **Arcrun RAG** one-click installer.
Served via jsDelivr; fetched automatically during install — you never need to read this repo.

- `manifest.json` — schema `arcrun-rag-bundles/v1`（25 workers: tier1 components + tier2 engines）
- `tier1/<component>/` — wrapper `index.js` + `<hash>-component.wasm`
- `tier2/<engine>/` — bundled `index.js`（services stripped＝lazy-bound at install）

Built from `Arcrun@ad367e4` by `installer/scripts/build-bundles.mjs`（arcrun-rag repo）.
