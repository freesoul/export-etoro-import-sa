var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getSeekingAlphaPortfolio() {
    return __awaiter(this, void 0, void 0, function* () {
        const data_test_id = "default-portfolio-tickers";
        const dom_container = document.querySelector(`[data-test-id="${data_test_id}"] table`);
        if (!dom_container) {
            console.log("No container found");
            return [];
        }
        console.log("Container: ", dom_container);
        const rows = dom_container.querySelectorAll("tbody tr");
        const symbol_test_id = "portfolio-ticker-name";
        const res = [];
        rows.forEach((row) => {
            var _a;
            const symbol = (_a = row.querySelector(`[data-test-id="${symbol_test_id}"]`)) === null || _a === void 0 ? void 0 : _a.innerText;
            if (!symbol) {
                console.log("No ticker name found in row", row);
                return;
            }
            const shares_tds = row.querySelectorAll("td");
            if (shares_tds.length < 5) {
                console.error("Not enough tds in row", shares_tds.length);
                return;
            }
            const units = shares_tds[4].innerText;
            const avg_open = shares_tds[5].innerText;
            res.push({
                symbol,
                avg_open: parseFloat(avg_open),
                units: parseFloat(units),
            });
        });
        return res;
    });
}
function getTickersAddUpdateRemove(etoro_portfolio, seeking_alpha_portfolio) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = {
            add: [],
            update: [],
            remove: [],
            unchanged: [],
        };
        // Add
        etoro_portfolio.forEach((etoro) => {
            let found = false;
            seeking_alpha_portfolio.forEach((seeking) => {
                if (etoro.symbol === seeking.symbol) {
                    found = true;
                }
            });
            if (!found) {
                res.add.push(etoro);
            }
        });
        function isSimilarNumber(a, b, num_decimals) {
            return a.toFixed(num_decimals) === b.toFixed(num_decimals);
        }
        // Update
        etoro_portfolio.forEach((etoro) => {
            seeking_alpha_portfolio.forEach((seeking) => {
                if (etoro.symbol === seeking.symbol) {
                    if (isSimilarNumber(etoro.units, seeking.units, 2) &&
                        isSimilarNumber(etoro.avg_open, seeking.avg_open, 2)) {
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
                if (etoro.symbol === seeking.symbol) {
                    found = true;
                }
            });
            if (!found) {
                res.remove.push(seeking);
            }
        });
        // Unchanged
        etoro_portfolio.forEach((etoro) => {
            seeking_alpha_portfolio.forEach((seeking) => {
                if (etoro.symbol === seeking.symbol) {
                    if (isSimilarNumber(etoro.units, seeking.units, 2) &&
                        isSimilarNumber(etoro.avg_open, seeking.avg_open, 2)) {
                        res.unchanged.push(seeking);
                    }
                }
            });
        });
        return res;
    });
}
// const operations = await getTickersAddUpdateRemove(
//     etoro_portfolio,
//     seeking_alpha_portfolio
// );
function wait_for_selector_exists(query) {
    return __awaiter(this, void 0, void 0, function* () {
        let selector = null;
        while (selector === null) {
            selector = document.querySelector(query);
            if (selector) {
                return selector;
            }
            yield new Promise(r => setTimeout(r, 100));
        }
        return null;
    });
}
function wait_for_first_selector_that_exists(queries) {
    return __awaiter(this, void 0, void 0, function* () {
        let output = {
            result: null,
            query_idx: 0
        };
        while (output.result === null) {
            for (let i = 0; i < queries.length; i++) {
                const selector = document.querySelector(queries[i]);
                if (selector) {
                    output.result = selector;
                    output.query_idx = i;
                    return output;
                }
            }
            yield new Promise(r => setTimeout(r, 100));
        }
        return output;
    });
}
const doAddSymbol = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const open_symbold_list_button_el = document.querySelector("[data-test-id='add-symbols-button']");
    if (!open_symbold_list_button_el) {
        console.error("Could not find add symbol button");
        return;
    }
    open_symbold_list_button_el.click();
    const search_input = yield wait_for_selector_exists("[data-test-id='modal-content'] input[data-test-id='text-input']");
    if (!search_input) {
        console.error("Could not find search input");
        return;
    }
    search_input.value = symbol;
    const result = wait_for_first_selector_that_exists(["[data-test-id='result-list-title']", "[data-test-id='help-label']"]);
    console.log(result);
});
const doEditSymbol = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const open_symbold_list_button_el = document.querySelector("[data-test-id='edit-portfolio-button']");
    if (!open_symbold_list_button_el) {
        console.error("Could not find edit symbol button");
        return;
    }
    open_symbold_list_button_el.click();
    const edit_symbols_list_el = yield wait_for_selector_exists("[data-test-id='symbols-list']");
    if (!edit_symbols_list_el) {
        console.error("Could not find edit symbols list");
        return;
    }
    const symbols = edit_symbols_list_el.querySelectorAll("[data-test-id='ticker-name-label']");
    const symbols_list = [];
    for (const symbol of symbols) {
        symbols_list.push(symbol.innerText);
    }
});
window.getSeekingAlphaPortfolio = getSeekingAlphaPortfolio;
window.getTickersAddUpdateRemove = getTickersAddUpdateRemove;
window.doAddSymbol = doAddSymbol;
window.doEditSymbol = doEditSymbol;
window.wait_for_selector_exists = wait_for_selector_exists;
window.wait_for_first_selector_that_exists = wait_for_first_selector_that_exists;
export {};
