// EXPORT ETORO PORTFOLIO
async function getEtoroContainer() {
  const ETORO_CONTAINER_TAG = "et-portfolio-group-list";
  let etoro_container = null;
  while (etoro_container === null || etoro_container.length == 0) {
    etoro_container = document.getElementsByTagName(ETORO_CONTAINER_TAG);
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log(
    "Found etoro portoflio container with tag " + ETORO_CONTAINER_TAG
  );
  console.log(etoro_container[0]);
  return etoro_container[0];
}

function mapEtoroToSASymbol(sa_symbol) {
  const mapping = {
    "BA.L": {
      sa_name: "BAESY",
      conversion_rate: 71.24 / 1384,
    },
  };
  return mapping[sa_symbol];
}

async function getEtoroPortfolio() {
  console.log("Requesting etoro portfolio");
  const dom_container = await getEtoroContainer();
  const ETORO_ROW_CLASS = "watchlist-grid-instruments-list";
  const dom_rows = dom_container.querySelectorAll(
    `[automation-id="${ETORO_ROW_CLASS}"]`
  );
  result = [];
  const avg_open_automation_id =
    "portfolio-overview-table-body-cell-avg-open-rate";
  const symbol_id = "portfolio-overview-table-body-cell-market-name";
  const units_id = "portfolio-overview-table-body-cell-units-value";
  // iterate dom rows and find avg open automation id
  dom_rows.forEach((row) => {
    const avg_open = row.querySelector(
      `[automation-id="${avg_open_automation_id}"]`
    )?.innerText;
    const symbol = row.querySelector(
      `[automation-id="${symbol_id}"]`
    )?.innerText;
    const units = row.querySelector(`[automation-id="${units_id}"]`)?.innerText;
    if (!units) {
      return;
    }
    const mapped = mapEtoroToSASymbol(symbol);
    if (mapped) {
      symbol = mapped.sa_name;
      avg_open = avg_open * mapped.conversion_rate;
    }
    result.push({
      avg_open,
      symbol,
      units,
    });
  });

  return result.filter((it) => !!it.units);
}
// const etoro_portfolio = await getEtoroPortfolio();
const etoro_portfolio = [
  {
    avg_open: "101.49726",
    symbol: "AMZN",
    units: "6.48293",
  },
  {
    avg_open: "103.76774",
    symbol: "GOOG",
    units: "7.22768",
  },
  {
    avg_open: "184.99976",
    symbol: "FSLR",
    units: "1.43243",
  },
  {
    avg_open: "39.04873",
    symbol: "LMB",
    units: "7.68271",
  },
  {
    avg_open: "305.9874",
    symbol: "RR.L",
    units: "116.29",
  },
  {
    avg_open: "343.87939",
    symbol: "META",
    units: "1.8902",
  },
  {
    avg_open: "120.47069",
    symbol: "TSM",
    units: "3.32031",
  },
  {
    avg_open: "22.54145",
    symbol: "ERJ",
    units: "27.94852",
  },
  {
    avg_open: "61.96268",
    symbol: "NEE",
    units: "7.66591",
  },
  {
    avg_open: "77.95",
    symbol: "DAC",
    units: "1.60363",
  },
  {
    avg_open: "47.9704",
    symbol: "CTVA",
    units: "13.55002",
  },
  {
    avg_open: "12.6482",
    symbol: "AM",
    units: "19.76293",
  },
  {
    avg_open: "1253.99",
    symbol: "BA.L",
    units: "44.00",
  },
  {
    avg_open: "27.62",
    symbol: "JD.US",
    units: "3.62057",
  },
  {
    avg_open: "56.77659",
    symbol: "KO",
    units: "164.90274",
  },
  {
    avg_open: "62.18",
    symbol: "AEM",
    units: "9.64941",
  },
  {
    avg_open: "21.72",
    symbol: "AY",
    units: "9.2081",
  },
  {
    avg_open: "40.50",
    symbol: "AMPH",
    units: "3.08642",
  },
  {
    avg_open: "121.38",
    symbol: "MRK",
    units: "3.29544",
  },
  {
    avg_open: "209.33927",
    symbol: "LHX",
    units: "7.85779",
  },
  {
    avg_open: "102.84",
    symbol: "IIPR",
    units: "2.431",
  },
  {
    avg_open: "426.46",
    symbol: "MA",
    units: "1.17244",
  },
  {
    avg_open: "27.41587",
    symbol: "PFE",
    units: "44.97395",
  },
  {
    avg_open: "39.89109",
    symbol: "NEM",
    units: "24.06553",
  },
  {
    avg_open: "25.62488",
    symbol: "EPRT",
    units: "11.70737",
  },
  {
    avg_open: "38.27",
    symbol: "EQT",
    units: "2.48236",
  },
  {
    avg_open: "445.53783",
    symbol: "LMT",
    units: "0.89779",
  },
  {
    avg_open: "21.37",
    symbol: "STLA.US",
    units: "9.35891",
  },
  {
    avg_open: "99.47",
    symbol: "CPT",
    units: "2.51332",
  },
  {
    avg_open: "1369.99",
    symbol: "AVGO",
    units: "0.14599",
  },
  {
    avg_open: "268.12",
    symbol: "V",
    units: "1.49187",
  },
  {
    avg_open: "456.50",
    symbol: "NOC",
    units: "0.43812",
  },
  {
    avg_open: "55.76984",
    symbol: "WPC",
    units: "7.17234",
  },
  {
    avg_open: "251.76467",
    symbol: "HII",
    units: "1.29089",
  },
  {
    avg_open: "60.71865",
    symbol: "PYPL",
    units: "11.3661",
  },
  {
    avg_open: "773.90",
    symbol: "BLK",
    units: "1.29216",
  },
  {
    avg_open: "17.36332",
    symbol: "T",
    units: "25.9167",
  },
  {
    avg_open: "59.28953",
    symbol: "TSN",
    units: "10.11983",
  },
  {
    avg_open: "58.93505",
    symbol: "ADC",
    units: "22.48237",
  },
  {
    avg_open: "30.38",
    symbol: "CAG",
    units: "7.57077",
  },
  {
    avg_open: "19.01",
    symbol: "STWD",
    units: "13.15097",
  },
  {
    avg_open: "0.02576",
    symbol: "JASMY",
    units: "3881.99",
  },
  {
    avg_open: "49.70491",
    symbol: "SQM",
    units: "5.02968",
  },
  {
    avg_open: "28.7937",
    symbol: "VICI",
    units: "55.56772",
  },
  {
    avg_open: "40.44426",
    symbol: "VZ",
    units: "14.26667",
  },
  {
    avg_open: "31.73",
    symbol: "EXLS",
    units: "4.72739",
  },
  {
    avg_open: "56.88",
    symbol: "CRSP",
    units: "2.44198",
  },
  {
    avg_open: "84.25789",
    symbol: "BABA",
    units: "17.62446",
  },
  {
    avg_open: "41.65362",
    symbol: "MPLX",
    units: "8.40263",
  },
  {
    avg_open: "152.77367",
    symbol: "JNJ",
    units: "6.70927",
  },
  {
    avg_open: "21.155",
    symbol: "CVE",
    units: "5.90737",
  },
  {
    avg_open: "126.60",
    symbol: "VOW3.DE",
    units: "1.89",
  },
  {
    avg_open: "48.67",
    symbol: "SLB",
    units: "5.13663",
  },
  {
    avg_open: "22.13",
    symbol: "KRG",
    units: "9.03751",
  },
  {
    avg_open: "93.5401",
    symbol: "XBI",
    units: "1.06906",
  },
  {
    avg_open: "72.20856",
    symbol: "MDLZ",
    units: "2.76976",
  },
  {
    avg_open: "106.92",
    symbol: "BIDU",
    units: "1.40292",
  },
  {
    avg_open: "13.44664",
    symbol: "VALE",
    units: "20.45114",
  },
  {
    avg_open: "7.39635",
    symbol: "SOFI",
    units: "269.47722",
  },
  {
    avg_open: "13.14414",
    symbol: "PAGS",
    units: "30.05141",
  },
  {
    avg_open: "37.50",
    symbol: "TARS",
    units: "13.33333",
  },
  {
    avg_open: "15.89986",
    symbol: "PBR",
    units: "56.75493",
  },
  {
    avg_open: "129.48",
    symbol: "DLTR",
    units: "1.54464",
  },
  {
    avg_open: "167.76",
    symbol: "TGT",
    units: "0.44707",
  },
  {
    avg_open: "106.25702",
    symbol: "NKE",
    units: "5.83848",
  },
  {
    avg_open: "16.56248",
    symbol: "STNE",
    units: "16.14957",
  },
  {
    avg_open: "148.16608",
    symbol: "ALB",
    units: "3.5771",
  },
  {
    avg_open: "77.63",
    symbol: "GILD",
    units: "2.57638",
  },
  {
    avg_open: "32.51805",
    symbol: "JKS",
    units: "7.84161",
  },
  {
    avg_open: "37.42642",
    symbol: "INTC",
    units: "25.38314",
  },
  {
    avg_open: "65.428",
    symbol: "LIT",
    units: "3.06235",
  },
  {
    avg_open: "6.7298",
    symbol: "LAC",
    units: "69.83867",
  },
  {
    avg_open: "241.8354",
    symbol: "NVTKL.L",
    units: "0.06",
  },
];

// EXPORT SEEKING ALPHA PORTFOLIO
async function getSeekingAlphaPortfolio() {
  const data_test_id = "default-portfolio-tickers";
  const dom_container = document.querySelector(
    `[data-test-id="${data_test_id}"] table`
  );
  console.log("Container: ", dom_container);
  const rows = dom_container.querySelectorAll("tbody tr");
  const ticker_name_test_id = "portfolio-ticker-name";
  const share_price_test_id = "portfolio-ticker-price-price";
  const res = [];
  rows.forEach((row) => {
    const ticker_name = row.querySelector(
      `[data-test-id="${ticker_name_test_id}"]`
    )?.innerText;
    const share_price = row.querySelector(
      `[data-test-id="${share_price_test_id}"]`
    )?.innerText;
    const num_shares = row.querySelectorAll("td")[3].innerText;
    if (!ticker_name) {
      return;
    }
    res.push({
      ticker_name,
      share_price: parseFloat(share_price),
      num_shares: parseFloat(num_shares),
    });
  });
  return res;
}
const seeking_alpha_portfolio = await getSeekingAlphaPortfolio();
console.log(seeking_alpha_portfolio);

//

async function getTickersAddUpdateRemove(
  etoro_portfolio,
  seeking_alpha_portfolio
) {
  let res = {
    add: [],
    update: [],
    remove: [],
  };

  // Add
  etoro_portfolio.forEach((etoro) => {
    let found = false;
    seeking_alpha_portfolio.forEach((seeking) => {
      if (etoro.symbol === seeking.ticker_name) {
        found = true;
      }
    });
    if (!found) {
      res.add.push(etoro);
    }
  });

  // Update
  etoro_portfolio.forEach((etoro) => {
    seeking_alpha_portfolio.forEach((seeking) => {
      if (etoro.symbol === seeking.ticker_name) {
        if (
          etoro.units !== seeking.num_shares ||
          etoro.avg_open !== seeking.share_price
        ) {
          res.update.push({
            etoro: etoro,
            seeking: seeking,
          });
        }
      }
    });
  });

  // Remove
  seeking_alpha_portfolio.forEach((seeking) => {
    let found = false;
    etoro_portfolio.forEach((etoro) => {
      if (etoro.symbol === seeking.ticker_name) {
        found = true;
      }
    });
    if (!found) {
      res.remove.push(seeking);
    }
  });

  return res;
}

const operations = await getTickersAddUpdateRemove(
  etoro_portfolio,
  seeking_alpha_portfolio
);

console.log(operations);
