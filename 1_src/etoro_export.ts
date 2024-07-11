
import {
  SharedPortfolio
} from "./shared";

import {
  MappingEntry,
  ETORO_TO_SA_MAPPING,
  ETORO_IGNORE
} from "./etoro_config";



function mapEtoroToSASymbol(sa_symbol: string): MappingEntry | undefined {
  return ETORO_TO_SA_MAPPING[sa_symbol];
}

async function getEtoroContainer() {
  const ETORO_CONTAINER_TAG = "et-portfolio-group-list";
  let etoro_container = null;
  while (etoro_container === null || etoro_container.length == 0) {
    etoro_container = document.getElementsByTagName(ETORO_CONTAINER_TAG);
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log(
    "Found etoro portoflio container with tag " + ETORO_CONTAINER_TAG + "..."
  );
  return etoro_container[0];
}

async function getEtoroPortfolio() {
  console.log("Requesting etoro portfolio");
  const dom_container = await getEtoroContainer();
  const ETORO_ROW_CLASS = "watchlist-grid-instruments-list";
  const dom_rows = dom_container.querySelectorAll(
    `[automation-id="${ETORO_ROW_CLASS}"]`
  );
  const result: SharedPortfolio[] = [];
  const avg_open_automation_id =
    "portfolio-overview-table-body-cell-avg-open-rate";
  const symbol_id = "portfolio-overview-table-body-cell-market-name";
  const units_id = "portfolio-overview-table-body-cell-units-value";
  // iterate dom rows and find avg open automation id
  dom_rows.forEach((row) => {
    let avg_open_str = (row.querySelector(
      `[automation-id="${avg_open_automation_id}"]`
    ) as HTMLElement | null)?.innerText;
    let symbol = (row.querySelector(
      `[automation-id="${symbol_id}"]`
    ) as HTMLElement | null)?.innerText;

    let units_str = (row.querySelector(`[automation-id="${units_id}"]`) as HTMLElement | null)?.innerText;
    if (!units_str || !avg_open_str || !symbol) {
      return;
    }
    let avg_open = parseFloat(avg_open_str);
    let units = parseFloat(units_str);
    if (ETORO_IGNORE.includes(symbol)) {
      return;
    }
    const mapped: MappingEntry | undefined = mapEtoroToSASymbol(symbol);
    if (mapped) {
      symbol = mapped.sa_name;
      avg_open = avg_open * mapped.conversion_rate;
    }
    result.push({
      avg_open,
      symbol,
      units,
    });
    return result;
  });

  return result.filter((it) => !!it.units);
}


async function getEtoroPortfolioWithInstructions() {
  const portfolio = await getEtoroPortfolio();
  console.log("JSON portfolio : ")
  console.log(portfolio)
  console.log("Good, now copy the following variable, focus the tab where to import it, and paste it in the console:")
  console.log("const exported_portfolio = " + JSON.stringify(portfolio) + ";");
}


declare global {
  interface Window {
    getEtoroPortfolio: () => Promise<SharedPortfolio[]>;
    getEtoroPortfolioWithInstructions: () => Promise<void>;
  }
}

window.getEtoroPortfolio = getEtoroPortfolio;
window.getEtoroPortfolioWithInstructions = getEtoroPortfolioWithInstructions;


window.getEtoroPortfolioWithInstructions()