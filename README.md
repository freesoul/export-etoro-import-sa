
## Exporting from Etoro
1. Optionally configure discrepancies in symbols and conversion rates across platforms, see configuration section.
2. Copy the content of `3_minified/extoro_export.min.js`.
3. Go to your etoro portfolio in your browser.
4. Open the inspector (F12), go to the console, and paste the code.
5. Copy the output.

## Importing in Seeking Alpha
1. Go to your **holdings tab** of your Seeking Alpha concerned portfolio.
2. Open the inspector (F12), go to the console, and paste the output of the exporting phase.
3. Copy the content of `3_minified/seeking_alpha_import.min.js` and paste it in the console.
4. Type in the console `doAll(exported_portfolio)`, which will add, remove, and update the symbols accordingly.

### Current limitations  
- Limited to 1 lot per symbol.  
- Only 'buy'
- No date manipulation

## Configuration
You can edit the configuration files, such as `1_src/etoro_config.ts`.  
This will require rebuilding the source afterwards.  
  
## Rebuilding the code
1. Install npm and run `npm install`
2. TS to js : `npm run build`. It uses `rollup` behind, as `tsc` would not resolve imports.
3. Compress : `grunt`
