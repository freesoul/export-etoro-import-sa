import {
    wait_for_selector_exists,
    wait_for_first_selector_that_exists,
    wait_for_selector_cease_existing,
    set_input_value,
} from "./helpers";
import {
    SharedPortfolio
} from "./shared";

// Main portfolio
const PORTFOLIO_MAIN_TICKER_NAME_SELECTOR = "[data-test-id='portfolio-ticker-name']"
const PORTFOLIO_MAIN_CONTAINER_SELECTOR = "[data-test-id='default-portfolio-tickers'] table"
const PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR = "[data-test-id='holding-options-button']"

// General modal
const MODAL_CONTENT_SELECTOR = "[data-test-id='modal-content']"
const MODAL_TITLE_SELECTOR = "[data-test-id='modal-title']"

// Add symbol
const MODAL_ADD_SYMBOL_SELECTOR = "[data-test-id='add-symbols-button']"
const MODAL_CLOSE_BUTTON_SELECTOR = "[data-test-id='close-modal-button']"
const MODAL_ADD_SYMBOL_SEARCH_INPUT_SELECTOR = "[data-test-id='modal-content'] input[data-test-id='search-input']";
const MODAL_ADD_SYMBOL_RESULTS_TITLE_SELECTOR = "[data-test-id='result-list-title']"
const MODAL_ADD_SYMBOL_HELP_LABEL_SELECTOR = "[data-test-id='help-label']"
const MODAL_ADD_SYMBOL_RESULT_ITEM_NAME_SELECTOR = "[data-test-id='symbol-search-result-item'] [data-test-id='item-name']"
const MODAL_ADDED_SYMBOL_SELECTOR = "[data-test-id='ticker-name-label']"
const MODAL_ADD_SYMBOL_ACCEPT = "[data-test-id='add-ticker-done-btn']"

// Delete 
const PORTFOLIO_MAIN_ROW_DROPDOWN_DELETE_LOT_SELECTOR = "[data-test-id='dropdown-option-delete']"
const MODAL_REMOVE_SYMBOL_SELECTOR = "[data-test-id='delete-symbol-button']"


// Edit
const PORTFOLIO_MAIN_ROW_ADD_LOT = "[data-test-id='add-lot']"
const PORTFOLIO_MAIN_ROW_DROPDOWN_EDIT_LOT_SELECTOR = "[data-test-id='dropdown-option-edit']"
const MODAL_EDIT_SHARES_SELECTOR = "input#share"
const MODAL_EDIT_PRICE_SELECTOR = "input#price"
const MODAL_EDIT_SAVE_SELECTOR = MODAL_CONTENT_SELECTOR + " button[type='submit']"

async function get_container(): Promise<HTMLElement | null> {
    if (!await wait_for_selector_exists(PORTFOLIO_MAIN_CONTAINER_SELECTOR)) {
        return null;
    }
    const selectors = document.querySelectorAll(PORTFOLIO_MAIN_CONTAINER_SELECTOR);
    if (selectors.length === 0) {
        return null;
    }
    // return last one
    return selectors[selectors.length - 1] as HTMLElement;
}


async function find_symbol_row(symbol: string): Promise<HTMLElement | null> {
    const dom_container = await get_container();
    if (!dom_container) {
        console.log("No container found");
        return null;
    }
    const rows = dom_container.querySelectorAll("tbody tr");
    for (const row of rows) {
        const symbol_td = row.querySelector(PORTFOLIO_MAIN_TICKER_NAME_SELECTOR);
        if (symbol_td && symbol_td.textContent === symbol) {
            return row as HTMLElement;
        }
    }

    return null;
}

async function getSeekingAlphaPortfolio(): Promise<SharedPortfolio[]> {
    const dom_container = await get_container();
    if (!dom_container) {
        console.log("No container found");
        return [];
    }
    const rows = dom_container.querySelectorAll("tbody tr");
    const res: SharedPortfolio[] = [];
    rows.forEach((row) => {
        const symbol = (row.querySelector(PORTFOLIO_MAIN_TICKER_NAME_SELECTOR) as HTMLElement | null)?.innerText;

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

// interface PortfolioUpdate {
//     source: SharedPortfolio;
//     destination: SharedPortfolio;
// }

interface AddUpdateRemove {
    add: SharedPortfolio[];
    update: SharedPortfolio[];
    remove: SharedPortfolio[];
    unchanged: SharedPortfolio[];
}

async function getTickersAddUpdateRemove(
    source_portfolio: SharedPortfolio[],
    seeking_alpha_portfolio: SharedPortfolio[]
): Promise<AddUpdateRemove> {
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
                    !isSimilarNumber(etoro.units, seeking.units, 2) ||
                    !isSimilarNumber(etoro.avg_open, seeking.avg_open, 2)
                ) {
                    console.log("Found divergence in symbol", etoro.symbol, etoro, seeking)
                    res.update.push(etoro);
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


const closeCancelModal = async () => {
    if (! await wait_for_selector_exists(MODAL_TITLE_SELECTOR, 3)) {
        return true;
    }

    const close_button = await wait_for_selector_exists(MODAL_CLOSE_BUTTON_SELECTOR)
    if (close_button) {
        close_button.click()
    }
    const closed_successfully: boolean = await wait_for_selector_cease_existing(MODAL_TITLE_SELECTOR)

    if (!closed_successfully) {
        console.error("Could not close modal")
    }
    return closed_successfully
}


const isAddSymbolModalOpen = async () => {
    const modal_title = await wait_for_selector_exists(MODAL_TITLE_SELECTOR, 3)
    if (!modal_title) {
        return false;
    }
    return modal_title.innerText === "Add Symbols to Follow"
}

async function ensureAddSymbolModalOpen(): Promise<boolean> {
    if (await isAddSymbolModalOpen()) {
        return true;
    }
    if (document.querySelector(MODAL_ADD_SYMBOL_SELECTOR)) {
        (document.querySelector(MODAL_ADD_SYMBOL_SELECTOR) as HTMLElement).click()
        const modal_title = await wait_for_selector_exists(MODAL_TITLE_SELECTOR)
        if (!modal_title) {
            console.error("Could not find modal title")
        }
        return modal_title !== null
    }
    console.log("Could not find add symbol button")
    return false;
}

async function closeAddSymbolModal(): Promise<boolean> {

    const done_button = await wait_for_selector_exists(MODAL_ADD_SYMBOL_ACCEPT)
    if (done_button && !done_button.hasAttribute("disabled")) {
        done_button.click()

        const closed_successfully: boolean = await wait_for_selector_cease_existing(MODAL_TITLE_SELECTOR)

        if (!closed_successfully) {
            console.error("Could not close modal")
            return false
        }
        return true
    } else {
        return await closeCancelModal()
    }
}

async function doAddSymbol(symbol: string, close_after: boolean = true): Promise<boolean> {

    // Open modal
    if (!await ensureAddSymbolModalOpen()) {
        console.error("Could not open add symbol modal")
        return false;
    }

    try {
        // Type the symbol
        const search_input = await wait_for_selector_exists(MODAL_ADD_SYMBOL_SEARCH_INPUT_SELECTOR) as HTMLInputElement | null;
        if (!search_input) {
            throw new Error("Could not find search input")
        }
        set_input_value(search_input, symbol)

        // Wait for results
        const result = await wait_for_first_selector_that_exists([MODAL_ADD_SYMBOL_RESULTS_TITLE_SELECTOR, MODAL_ADD_SYMBOL_HELP_LABEL_SELECTOR + ".text-red-85"])

        if (result === null) {
            throw new Error("Could not find search results")
        } else if (result.query_idx === 0) {
            // Confirm a matching result
            const first_result = await wait_for_selector_exists(MODAL_ADD_SYMBOL_RESULT_ITEM_NAME_SELECTOR)
            if (first_result && first_result.textContent === symbol) {
                first_result.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13
                }));

            } else {
                throw Error("Could not find searched symbol (query: " + symbol + ", found: " + first_result?.textContent + ")");
            }

            // Confirm it was added
            const added_symbol = await wait_for_selector_exists(MODAL_ADDED_SYMBOL_SELECTOR)
            if (added_symbol && added_symbol.innerText === symbol) {
                console.log("Added symbol " + symbol)
            } else {
                throw Error("Could not find added symbol")
            }

        } else if (result.query_idx === 1) {
            // Result not found
            throw "No result matching '" + symbol + "' found"
        }

    } catch (e) {
        console.error(e)
        return false;
    } finally {
        if (close_after) {
            await closeAddSymbolModal()
        }
    }
    return true;
}

const doEditSymbol = async (data: SharedPortfolio) => {

    // Find row
    const concerned_row = await find_symbol_row(data.symbol)
    if (!concerned_row) {
        console.error("Could not find row with symbol", data.symbol)
        return false;
    }

    // Determine wether we should click "Add lot" or "Edit lot"
    const add_lot_btn = concerned_row.querySelector(PORTFOLIO_MAIN_ROW_ADD_LOT) as HTMLElement | null;
    if (add_lot_btn) {
        add_lot_btn.click()
    } else {
        // open the dropdown
        const dropdown_opener = concerned_row.querySelector(PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR) as HTMLElement | null;
        if (!dropdown_opener) {
            console.error("Could not find dropdown opener for ticker " + data.symbol)
            return false;
        }
        // dropdown_opener.scrollIntoView()
        dropdown_opener.click()
        console.debug("Opening dropdown")

        let edit_lot_btn = await wait_for_selector_exists(PORTFOLIO_MAIN_ROW_DROPDOWN_EDIT_LOT_SELECTOR, 1)
        if (!edit_lot_btn) {
            console.debug("Opening dropdown again")
            dropdown_opener.click()
        }

        edit_lot_btn = await wait_for_selector_exists(PORTFOLIO_MAIN_ROW_DROPDOWN_EDIT_LOT_SELECTOR, 1)
        if (!edit_lot_btn) {
            console.error("Could not find edit lot button for ticker " + data.symbol)
            return false;
        }
        console.debug("Clicking edit lot")
        edit_lot_btn.click()

        // if (!await wait_for_selector_cease_existing(PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR, 3, concerned_row)) {
        //     console.error("Dropdown selector never got closed")
        //     return false;
        // }
        // It actually never ceases exist in this case (only in delete case)

        console.debug("Edit lot modal opened")

    }

    // Edit shares
    const shares_input = await wait_for_selector_exists(MODAL_EDIT_SHARES_SELECTOR) as HTMLInputElement | null;
    if (!shares_input) {
        console.error("Could not find shares input")
        return false;
    }
    set_input_value(shares_input, data.units.toString())

    // Edit price
    const price_input = await wait_for_selector_exists(MODAL_EDIT_PRICE_SELECTOR) as HTMLInputElement | null;
    if (!price_input) {
        console.error("Could not find price input")
        return false;
    }
    set_input_value(price_input, data.avg_open.toString())

    // Save
    const save_btn = await wait_for_selector_exists(MODAL_EDIT_SAVE_SELECTOR)
    if (save_btn) {
        save_btn.click()
    }

    // Wait for modal close
    await wait_for_selector_cease_existing(MODAL_EDIT_SAVE_SELECTOR)
    
    return true;
}

async function doRemoveSymbol(symbol: string): Promise<boolean> {
    if (await isAddSymbolModalOpen()) {
        await closeCancelModal()
    }

    const table_loaded = await wait_for_selector_exists(PORTFOLIO_MAIN_TICKER_NAME_SELECTOR)
    if (!table_loaded) {
        console.error("Could not find table")
        return false;
    }

    const concerned_row = await find_symbol_row(symbol)
    if (!concerned_row) {
        console.error("Could not find row with symbol", symbol)
        return false;
    }

    // First delete lot
    const dropdown_opener = concerned_row?.querySelector(PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR) as HTMLElement | null;
    if (dropdown_opener) {
        dropdown_opener.scrollIntoView()
        console.log("Scrolled to dropdown opener")

        dropdown_opener.click()
        console.log("Clicked dropdown opener")

        let delete_lot_btn = await wait_for_selector_exists(PORTFOLIO_MAIN_ROW_DROPDOWN_DELETE_LOT_SELECTOR, 1)
        if (!delete_lot_btn) {
            dropdown_opener.click()
        }

        delete_lot_btn = await wait_for_selector_exists(PORTFOLIO_MAIN_ROW_DROPDOWN_DELETE_LOT_SELECTOR, 1)

        if (!delete_lot_btn) {
            console.error("Could not find delete lot button for ticker " + symbol)
            return false;
        }
        delete_lot_btn.click()

        if (!await wait_for_selector_cease_existing(PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR, 3, concerned_row)) {
            console.error("Could not close dropdown")
            return false;
        }
    }

    // Then find the row delete button
    const row_delete_btn = await wait_for_selector_exists("button", 7, concerned_row)
    if (!row_delete_btn) {
        console.error("Could not find delete button")
        return false;
    }
    row_delete_btn.scrollIntoView()
    row_delete_btn.click()


    // Wait for modal delete btn
    const modal_delete = await wait_for_selector_exists(MODAL_REMOVE_SYMBOL_SELECTOR)
    if (!modal_delete) {
        console.error("Could not find modal delete button")
        return false;
    }
    modal_delete.click()

    // Wait for modal close
    await wait_for_selector_cease_existing(MODAL_REMOVE_SYMBOL_SELECTOR)

    return true;
}

async function doAddAll(portfolios: SharedPortfolio[]): Promise<boolean> {
    for (const portfolio of portfolios) {
        if (!await doAddSymbol(portfolio.symbol, false)) {
            console.warn("Could not add symbol " + portfolio.symbol)
        }
    }
    return await closeAddSymbolModal()
}

async function doEditAll(portfolios: SharedPortfolio[]): Promise<boolean> {
    for (const portfolio of portfolios) {
        if (!await doEditSymbol(portfolio)) {
            console.warn("Could not edit symbol " + portfolio.symbol)
        }
    }
    return true;
}

async function doRemoveAll(portfolios: SharedPortfolio[]) {
    for (const portfolio of portfolios) {
        if (await doRemoveSymbol(portfolio.symbol)) {
            console.log("Removed symbol " + portfolio.symbol)
        }
    }
}

async function doAll(source_portfolio: SharedPortfolio[]) {
    const sa_portfolio = await getSeekingAlphaPortfolio();
    console.log("Existing portfolio", sa_portfolio)
    const operations = await getTickersAddUpdateRemove(source_portfolio, sa_portfolio);
    console.log("Operations", operations)
    console.log("removing", operations.remove)
    await doRemoveAll(operations.remove)
    console.log("adding", operations.add)
    await doAddAll(operations.add)
    console.log("updating just added items", operations.update)
    await doEditAll(operations.add)
    console.log("updating existing items", operations.update)
    await doEditAll(operations.update)
    console.log("done")
}

declare global {
    interface Window {
        doAll: (source_portfolio: SharedPortfolio[]) => void;
        doAddAll: (portfolios: SharedPortfolio[]) => void;
        doEditAll: (portfolios: SharedPortfolio[]) => void;
        doRemoveAll: (portfolios: SharedPortfolio[]) => void


        /**Debug exports */
        _getSeekingAlphaPortfolio: () => Promise<SharedPortfolio[]>;
        _getTickersAddUpdateRemove: (
            source_portfolio: SharedPortfolio[],
            seeking_alpha_portfolio: SharedPortfolio[],
        ) => Promise<AddUpdateRemove>;
        _doAddSymbol: (symbol: string) => void;
        _doEditSymbol: (data: SharedPortfolio) => void;
        _find_symbol_row: (symbol: string) => Promise<HTMLElement | null>;
    }
}



/**Debug exports */

window._getSeekingAlphaPortfolio = getSeekingAlphaPortfolio;
window._getTickersAddUpdateRemove = getTickersAddUpdateRemove;
window._doAddSymbol = doAddSymbol;
window._doEditSymbol = doEditSymbol;
window._find_symbol_row = find_symbol_row;

window.doAll = doAll;
window.doAddAll = doAddAll;
window.doEditAll = doEditAll;
window.doRemoveAll = doRemoveAll;
