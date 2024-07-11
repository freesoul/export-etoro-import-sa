import {
    wait_for_selector_exists,
    wait_for_first_selector_that_exists,
} from "./helpers";
import {
    SharedPortfolio
} from "./shared";

async function getSeekingAlphaPortfolio(): Promise<SharedPortfolio[]> {
    const data_test_id = "default-portfolio-tickers";
    const dom_container: HTMLElement | null = document.querySelector(
        `[data-test-id="${data_test_id}"] table`
    );
    if (!dom_container) {
        console.log("No container found");
        return [];
    }
    console.log("Container: ", dom_container);
    const rows = dom_container.querySelectorAll("tbody tr");
    const symbol_test_id = "portfolio-ticker-name";
    const res: SharedPortfolio[] = [];
    rows.forEach((row) => {
        const symbol = (row.querySelector(
            `[data-test-id="${symbol_test_id}"]`
        ) as HTMLElement | null)?.innerText;

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
}

interface AddUpdateRemove {
    add: SharedPortfolio[];
    update: {
        etoro: SharedPortfolio;
        seeking: SharedPortfolio;
    }[];
    remove: SharedPortfolio[];
    unchanged: SharedPortfolio[];
}

async function getTickersAddUpdateRemove(
    source_portfolio: SharedPortfolio[],
    seeking_alpha_portfolio: SharedPortfolio[]
) {
    let res: AddUpdateRemove = {
        add: [],
        update: [],
        remove: [],
        unchanged: [],
    };

    // Add
    source_portfolio.forEach((etoro) => {
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

    function isSimilarNumber(a: number, b: number, num_decimals: number): boolean {
        return a.toFixed(num_decimals) === b.toFixed(num_decimals);
    }

    // Update
    source_portfolio.forEach((etoro) => {
        seeking_alpha_portfolio.forEach((seeking) => {
            if (etoro.symbol === seeking.symbol) {
                if (
                    isSimilarNumber(etoro.units, seeking.units, 2) &&
                    isSimilarNumber(etoro.avg_open, seeking.avg_open, 2)
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
        source_portfolio.forEach((etoro) => {
            if (etoro.symbol === seeking.symbol) {
                found = true;
            }
        });
        if (!found) {
            res.remove.push(seeking);
        }
    });

    // Unchanged
    source_portfolio.forEach((etoro) => {
        seeking_alpha_portfolio.forEach((seeking) => {
            if (etoro.symbol === seeking.symbol) {
                if (
                    isSimilarNumber(etoro.units, seeking.units, 2) &&
                    isSimilarNumber(etoro.avg_open, seeking.avg_open, 2)
                ) {
                    res.unchanged.push(seeking);
                }
            }
        });
    });

    return res;
}


const doAddSymbol = async (symbol: string) => {
    const open_symbold_list_button_el: HTMLElement | null = document.querySelector("[data-test-id='add-symbols-button']")
    if (!open_symbold_list_button_el) {
        console.error("Could not find add symbol button")
        return;
    }
    open_symbold_list_button_el.click()
    const search_input = await wait_for_selector_exists("[data-test-id='modal-content'] input[data-test-id='text-input']") as HTMLInputElement | null;

    if (!search_input) {
        console.error("Could not find search input")
        return;
    }
    search_input.value = symbol

    const result = await wait_for_first_selector_that_exists(["[data-test-id='result-list-title']", "[data-test-id='help-label']"])

    console.log(result)

}

const doEditSymbol = async (data: SharedPortfolio) => {

    const open_symbold_list_button_el: HTMLElement | null = document.querySelector("[data-test-id='edit-portfolio-button']") as HTMLElement | null;

    if (!open_symbold_list_button_el) {
        console.error("Could not find edit symbol button")
        return;
    }

    open_symbold_list_button_el.click()

    const edit_symbols_list_el = await wait_for_selector_exists("[data-test-id='symbols-list']")
    if (!edit_symbols_list_el) {
        console.error("Could not find edit symbols list")
        return;
    }

    const symbols = edit_symbols_list_el.querySelectorAll("[data-test-id='ticker-name-label']") as NodeListOf<HTMLElement>
    const symbols_list = []
    for (const symbol of symbols) {
        symbols_list.push(symbol.innerText)
    }
}

async function doAddAll() {

}

async function doEditAll() {

}

async function doRemoveAll() {

}

async function doAll() {

}

declare global {
    interface Window {
        doAll: () => void;
        doAddAll: () => void;
        doEditAll: () => void;
        doRemoveAll: () => void;

        /**Debug exports */
        _getSeekingAlphaPortfolio: () => Promise<SharedPortfolio[]>;
        _getTickersAddUpdateRemove: (
            source_portfolio: SharedPortfolio[],
            seeking_alpha_portfolio: SharedPortfolio[],
        ) => Promise<AddUpdateRemove>;
        _doAddSymbol: (symbol: string) => void;
        _doEditSymbol: (data: SharedPortfolio) => void;
    }
}



/**Debug exports */

window._getSeekingAlphaPortfolio = getSeekingAlphaPortfolio;
window._getTickersAddUpdateRemove = getTickersAddUpdateRemove;
window._doAddSymbol = doAddSymbol;
window._doEditSymbol = doEditSymbol;

window.doAll = doAll;
window.doAddAll = doAddAll;
window.doEditAll = doEditAll;
window.doRemoveAll = doRemoveAll;