
// Can't export directly in etoro_export.ts because we want direct compatibility with browser console
interface EtoroPortfolio {
    avg_open: number;
    symbol: string;
    units: number;
}

export { EtoroPortfolio }



interface Window {
  getEtoroPortfolio: () => Promise<EtoroPortfolio[]>;
}
declare const window: Window;

window.getEtoroPortfolio = getEtoroPortfolio;
