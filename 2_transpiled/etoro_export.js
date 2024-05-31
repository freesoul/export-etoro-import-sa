var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const IGNORE = ["NVTKL.L"];
const ETORO_TO_SA_MAPPING = {
    "BA.L": {
        sa_name: "BAESY",
        conversion_rate: 71.24 / 1384,
    },
    "JD.US": {
        sa_name: "JD",
        conversion_rate: 1,
    },
    "RR.L": {
        sa_name: "RYCEY",
        conversion_rate: 5.63 / 442.1358,
    },
    "STLA.US": {
        sa_name: "STLA",
        conversion_rate: 1,
    },
    "VOW3.DE": {
        sa_name: "VWAGY",
        conversion_rate: 15.08 / 120.72,
    },
    "JASMY": {
        sa_name: "JASMY-USD",
        conversion_rate: 1,
    },
};
function mapEtoroToSASymbol(sa_symbol) {
    return ETORO_TO_SA_MAPPING[sa_symbol];
}
function getEtoroContainer() {
    return __awaiter(this, void 0, void 0, function* () {
        const ETORO_CONTAINER_TAG = "et-portfolio-group-list";
        let etoro_container = null;
        while (etoro_container === null || etoro_container.length == 0) {
            etoro_container = document.getElementsByTagName(ETORO_CONTAINER_TAG);
            yield new Promise((r) => setTimeout(r, 1000));
        }
        console.log("Found etoro portoflio container with tag " + ETORO_CONTAINER_TAG);
        console.log(etoro_container[0]);
        return etoro_container[0];
    });
}
function getEtoroPortfolio() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Requesting etoro portfolio");
        const dom_container = yield getEtoroContainer();
        const ETORO_ROW_CLASS = "watchlist-grid-instruments-list";
        const dom_rows = dom_container.querySelectorAll(`[automation-id="${ETORO_ROW_CLASS}"]`);
        const result = [];
        const avg_open_automation_id = "portfolio-overview-table-body-cell-avg-open-rate";
        const symbol_id = "portfolio-overview-table-body-cell-market-name";
        const units_id = "portfolio-overview-table-body-cell-units-value";
        // iterate dom rows and find avg open automation id
        dom_rows.forEach((row) => {
            var _a, _b, _c;
            let avg_open_str = (_a = row.querySelector(`[automation-id="${avg_open_automation_id}"]`)) === null || _a === void 0 ? void 0 : _a.innerText;
            let symbol = (_b = row.querySelector(`[automation-id="${symbol_id}"]`)) === null || _b === void 0 ? void 0 : _b.innerText;
            let units_str = (_c = row.querySelector(`[automation-id="${units_id}"]`)) === null || _c === void 0 ? void 0 : _c.innerText;
            if (!units_str || !avg_open_str || !symbol) {
                return;
            }
            let avg_open = parseFloat(avg_open_str);
            let units = parseFloat(units_str);
            if (IGNORE.includes(symbol)) {
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
    });
}
window.getEtoroPortfolio = getEtoroPortfolio;
export {};
