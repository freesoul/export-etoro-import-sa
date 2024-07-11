
## Exporting from Etoro
1. Optionally configure discrepancies in symbols and conversion rates across platforms `1_src/etoro_config.ts`
1. Copy the content of `3_minified/extoro_export.min.js`.
2. Go to your etoro portfolio in your browser.
3. Open the inspector (F12), go to the console, and paste the code.
4. Copy the output.

## Importing in Seeking Alpha
1. Go to your **holdings tab** of your Seeking Alpha concerned portfolio.
2. Open the inspector (F12), go to the console, and paste the output of the exporting phase.
3. Copy the content of `3_minified/seeking_alpha_import.min.js` and paste it in the console.
4. Type in the console `doAll()`

## Rebuilding
1. TS to js : `npm run build`. It uses `rollup` behind, as `tsc` would not resolve imports.
2. Compress : `grunt`