(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function wait_for_first_selector_that_exists(queries_1) {
        return __awaiter(this, arguments, void 0, function* (queries, max_wait_seconds = 7) {
            const start_time = Date.now();
            let output = {
                result: null,
                query_idx: 0
            };
            while (output.result === null) {
                // Element found
                for (let i = 0; i < queries.length; i++) {
                    const selector = document.querySelector(queries[i]);
                    if (selector) {
                        output.result = selector;
                        output.query_idx = i;
                        return output;
                    }
                }
                // Delay
                yield new Promise(r => setTimeout(r, 100));
                // Timeout
                if (Date.now() - start_time > max_wait_seconds * 1000) {
                    console.error(`wait_for_first_selector_that_exists: Timeout reached for queries: ${queries}`);
                    return null;
                }
            }
            return output;
        });
    }
    function wait_for_selector_exists(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, max_wait_seconds = 7, parentElement = null) {
            /**
             * Wait for the specified element to exist in the DOM.
             * It also ensures that the element is ready for interaction.
             */
            let selector = null;
            let start_time = Date.now();
            while (selector === null) {
                const root = parentElement || document;
                // Element found
                selector = root.querySelector(query);
                if (selector) {
                    return selector;
                }
                // Delay
                yield new Promise(r => setTimeout(r, 100));
                // Timeout
                if (Date.now() - start_time > max_wait_seconds * 1000) {
                    console.warn(`wait_for_selector_exists: Timeout reached for query: ${query}`);
                    break;
                }
            }
            return null;
        });
    }
    function wait_for_selector_cease_existing(selector_1) {
        return __awaiter(this, arguments, void 0, function* (selector, max_wait_seconds = 7, root = null) {
            return yield wait_for_selectors_stop_existing([selector], max_wait_seconds, root);
        });
    }
    function wait_for_selectors_stop_existing(queries_1) {
        return __awaiter(this, arguments, void 0, function* (queries, max_wait_seconds = 7, root = null) {
            let start_time = Date.now();
            while (true) {
                let all_null = true;
                for (let i = 0; i < queries.length; i++) {
                    const root_element = root || document;
                    const selector = root_element.querySelector(queries[i]);
                    if (selector) {
                        all_null = false;
                        break;
                    }
                }
                if (all_null) {
                    return true;
                }
                // Delay
                yield new Promise(r => setTimeout(r, 100));
                // Timeout
                if (Date.now() - start_time > max_wait_seconds * 1000) {
                    console.error(`wait_for_selectors_stop_existing: Timeout reached for queries: ${queries}`);
                    break;
                }
            }
            return false;
        });
    }
    function set_input_value(input, value) {
        // Explanation:
        // Directly setting input.value does not trigger React's synthetic event system.
        // React relies on events like 'input' to detect changes and update the component's state.
        // By using the setter and dispatching the 'input' event, we ensure React is notified of the change.
        //https://stackoverflow.com/questions/43874981/react-programmatically-change-component-value-doesnt-trigger-onchange-event
        var _a;
        if (!input) {
            console.error("Input element not found.");
            return;
        }
        // Setting the value directly using the setters
        const setter = (_a = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')) === null || _a === void 0 ? void 0 : _a.set;
        setter === null || setter === void 0 ? void 0 : setter.call(input, value);
        // Dispatching the 'input' event to notify React of the change
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function find_selector_with_text_content(selector, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const elements = document.querySelectorAll(selector);
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].textContent === text) {
                    return elements[i];
                }
            }
            return null;
        });
    }
    window._wait_for_selector_exists = wait_for_selector_exists;
    window._wait_for_first_selector_that_exists = wait_for_first_selector_that_exists;
    window._wait_for_selector_cease_existing = wait_for_selector_cease_existing;
    window._wait_for_selectors_stop_existing = wait_for_selectors_stop_existing;
    window._set_input_value = set_input_value;
    window._find_selector_with_text_content = find_selector_with_text_content;

    // Main portfolio
    const PORTFOLIO_MAIN_TICKER_NAME_SELECTOR = "[data-test-id='portfolio-ticker-name']";
    const PORTFOLIO_MAIN_CONTAINER_SELECTOR = "[data-test-id='default-portfolio-tickers'] table";
    const PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR = "[data-test-id='holding-options-button']";
    // General modal
    const MODAL_CONTENT_SELECTOR = "[data-test-id='modal-content']";
    const MODAL_TITLE_SELECTOR = "[data-test-id='modal-title']";
    // Add symbol
    const MODAL_ADD_SYMBOL_SELECTOR = "[data-test-id='add-symbols-button']";
    const MODAL_CLOSE_BUTTON_SELECTOR = "[data-test-id='close-modal-button']";
    const MODAL_ADD_SYMBOL_SEARCH_INPUT_SELECTOR = "[data-test-id='modal-content'] input[data-test-id='search-input']";
    const MODAL_ADD_SYMBOL_RESULTS_TITLE_SELECTOR = "[data-test-id='result-list-title']";
    const MODAL_ADD_SYMBOL_HELP_LABEL_SELECTOR = "[data-test-id='help-label']";
    const MODAL_ADD_SYMBOL_RESULT_ITEM_NAME_SELECTOR = "[data-test-id='symbol-search-result-item'] [data-test-id='item-name']";
    const MODAL_ADDED_SYMBOL_SELECTOR = "[data-test-id='ticker-name-label']";
    const MODAL_ADD_SYMBOL_ACCEPT = "[data-test-id='add-ticker-done-btn']";
    // Delete 
    const PORTFOLIO_MAIN_ROW_DROPDOWN_DELETE_LOT_SELECTOR = "[data-test-id='dropdown-option-delete']";
    const MODAL_REMOVE_SYMBOL_SELECTOR = "[data-test-id='delete-symbol-button']";
    // Edit
    const PORTFOLIO_MAIN_ROW_ADD_LOT = "[data-test-id='add-lot']";
    const PORTFOLIO_MAIN_ROW_DROPDOWN_EDIT_LOT_SELECTOR = "[data-test-id='dropdown-option-edit']";
    const MODAL_EDIT_SHARES_SELECTOR = "input#share";
    const MODAL_EDIT_PRICE_SELECTOR = "input#price";
    const MODAL_EDIT_SAVE_SELECTOR = MODAL_CONTENT_SELECTOR + " button[type='submit']";
    function get_container() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield wait_for_selector_exists(PORTFOLIO_MAIN_CONTAINER_SELECTOR))) {
                return null;
            }
            const selectors = document.querySelectorAll(PORTFOLIO_MAIN_CONTAINER_SELECTOR);
            if (selectors.length === 0) {
                return null;
            }
            // return last one
            return selectors[selectors.length - 1];
        });
    }
    function find_symbol_row(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const dom_container = yield get_container();
            if (!dom_container) {
                console.log("No container found");
                return null;
            }
            const rows = dom_container.querySelectorAll("tbody tr");
            for (const row of rows) {
                const symbol_td = row.querySelector(PORTFOLIO_MAIN_TICKER_NAME_SELECTOR);
                if (symbol_td && symbol_td.textContent === symbol) {
                    return row;
                }
            }
            return null;
        });
    }
    function getSeekingAlphaPortfolio() {
        return __awaiter(this, void 0, void 0, function* () {
            const dom_container = yield get_container();
            if (!dom_container) {
                console.log("No container found");
                return [];
            }
            const rows = dom_container.querySelectorAll("tbody tr");
            const res = [];
            rows.forEach((row) => {
                var _a;
                const symbol = (_a = row.querySelector(PORTFOLIO_MAIN_TICKER_NAME_SELECTOR)) === null || _a === void 0 ? void 0 : _a.innerText;
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
    function getTickersAddUpdateRemove(source_portfolio, seeking_alpha_portfolio) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = {
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
            function isSimilarNumber(a, b, num_decimals) {
                return a.toFixed(num_decimals) === b.toFixed(num_decimals);
            }
            // Update
            source_portfolio.forEach((etoro) => {
                seeking_alpha_portfolio.forEach((seeking) => {
                    if (etoro.symbol === seeking.symbol) {
                        if (!isSimilarNumber(etoro.units, seeking.units, 2) ||
                            !isSimilarNumber(etoro.avg_open, seeking.avg_open, 2)) {
                            console.log("Found divergence in symbol", etoro.symbol, etoro, seeking);
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
    const closeCancelModal = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!(yield wait_for_selector_exists(MODAL_TITLE_SELECTOR, 3))) {
            return true;
        }
        const close_button = yield wait_for_selector_exists(MODAL_CLOSE_BUTTON_SELECTOR);
        if (close_button) {
            close_button.click();
        }
        const closed_successfully = yield wait_for_selector_cease_existing(MODAL_TITLE_SELECTOR);
        if (!closed_successfully) {
            console.error("Could not close modal");
        }
        return closed_successfully;
    });
    const isAddSymbolModalOpen = () => __awaiter(void 0, void 0, void 0, function* () {
        const modal_title = yield wait_for_selector_exists(MODAL_TITLE_SELECTOR, 3);
        if (!modal_title) {
            return false;
        }
        return modal_title.innerText === "Add Symbols to Follow";
    });
    function ensureAddSymbolModalOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield isAddSymbolModalOpen()) {
                return true;
            }
            if (document.querySelector(MODAL_ADD_SYMBOL_SELECTOR)) {
                document.querySelector(MODAL_ADD_SYMBOL_SELECTOR).click();
                const modal_title = yield wait_for_selector_exists(MODAL_TITLE_SELECTOR);
                if (!modal_title) {
                    console.error("Could not find modal title");
                }
                return modal_title !== null;
            }
            console.log("Could not find add symbol button");
            return false;
        });
    }
    function closeAddSymbolModal() {
        return __awaiter(this, void 0, void 0, function* () {
            const done_button = yield wait_for_selector_exists(MODAL_ADD_SYMBOL_ACCEPT);
            if (done_button && !done_button.hasAttribute("disabled")) {
                done_button.click();
                const closed_successfully = yield wait_for_selector_cease_existing(MODAL_TITLE_SELECTOR);
                if (!closed_successfully) {
                    console.error("Could not close modal");
                    return false;
                }
                return true;
            }
            else {
                return yield closeCancelModal();
            }
        });
    }
    function doAddSymbol(symbol_1) {
        return __awaiter(this, arguments, void 0, function* (symbol, close_after = true) {
            // Open modal
            if (!(yield ensureAddSymbolModalOpen())) {
                console.error("Could not open add symbol modal");
                return false;
            }
            try {
                // Type the symbol
                const search_input = yield wait_for_selector_exists(MODAL_ADD_SYMBOL_SEARCH_INPUT_SELECTOR);
                if (!search_input) {
                    throw new Error("Could not find search input");
                }
                set_input_value(search_input, symbol);
                // Wait for results
                const result = yield wait_for_first_selector_that_exists([MODAL_ADD_SYMBOL_RESULTS_TITLE_SELECTOR, MODAL_ADD_SYMBOL_HELP_LABEL_SELECTOR + ".text-red-85"]);
                if (result === null) {
                    throw new Error("Could not find search results");
                }
                else if (result.query_idx === 0) {
                    // Confirm a matching result
                    const first_result = yield wait_for_selector_exists(MODAL_ADD_SYMBOL_RESULT_ITEM_NAME_SELECTOR);
                    if (first_result && first_result.textContent === symbol) {
                        first_result.dispatchEvent(new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13
                        }));
                    }
                    else {
                        throw Error("Could not find searched symbol (query: " + symbol + ", found: " + (first_result === null || first_result === void 0 ? void 0 : first_result.textContent) + ")");
                    }
                    // Confirm it was added
                    const added_symbol = yield wait_for_selector_exists(MODAL_ADDED_SYMBOL_SELECTOR);
                    if (added_symbol && added_symbol.innerText === symbol) {
                        console.log("Added symbol " + symbol);
                    }
                    else {
                        throw Error("Could not find added symbol");
                    }
                }
                else if (result.query_idx === 1) {
                    // Result not found
                    throw "No result matching '" + symbol + "' found";
                }
            }
            catch (e) {
                console.error(e);
                return false;
            }
            finally {
                if (close_after) {
                    yield closeAddSymbolModal();
                }
            }
            return true;
        });
    }
    const doEditSymbol = (data) => __awaiter(void 0, void 0, void 0, function* () {
        // Find row
        const concerned_row = yield find_symbol_row(data.symbol);
        if (!concerned_row) {
            console.error("Could not find row with symbol", data.symbol);
            return false;
        }
        // Determine wether we should click "Add lot" or "Edit lot"
        const add_lot_btn = concerned_row.querySelector(PORTFOLIO_MAIN_ROW_ADD_LOT);
        if (add_lot_btn) {
            add_lot_btn.click();
        }
        else {
            // open the dropdown
            const dropdown_opener = concerned_row.querySelector(PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR);
            if (!dropdown_opener) {
                console.error("Could not find dropdown opener for ticker " + data.symbol);
                return false;
            }
            // dropdown_opener.scrollIntoView()
            dropdown_opener.click();
            console.debug("Opening dropdown");
            let edit_lot_btn = yield wait_for_selector_exists(PORTFOLIO_MAIN_ROW_DROPDOWN_EDIT_LOT_SELECTOR, 1);
            if (!edit_lot_btn) {
                console.debug("Opening dropdown again");
                dropdown_opener.click();
            }
            edit_lot_btn = yield wait_for_selector_exists(PORTFOLIO_MAIN_ROW_DROPDOWN_EDIT_LOT_SELECTOR, 1);
            if (!edit_lot_btn) {
                console.error("Could not find edit lot button for ticker " + data.symbol);
                return false;
            }
            console.debug("Clicking edit lot");
            edit_lot_btn.click();
            // if (!await wait_for_selector_cease_existing(PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR, 3, concerned_row)) {
            //     console.error("Dropdown selector never got closed")
            //     return false;
            // }
            // It actually never ceases exist in this case (only in delete case)
            console.debug("Edit lot modal opened");
        }
        // Edit shares
        const shares_input = yield wait_for_selector_exists(MODAL_EDIT_SHARES_SELECTOR);
        if (!shares_input) {
            console.error("Could not find shares input");
            return false;
        }
        set_input_value(shares_input, data.units.toString());
        // Edit price
        const price_input = yield wait_for_selector_exists(MODAL_EDIT_PRICE_SELECTOR);
        if (!price_input) {
            console.error("Could not find price input");
            return false;
        }
        set_input_value(price_input, data.avg_open.toString());
        // Save
        const save_btn = yield wait_for_selector_exists(MODAL_EDIT_SAVE_SELECTOR);
        if (save_btn) {
            save_btn.click();
        }
        // Wait for modal close
        yield wait_for_selector_cease_existing(MODAL_EDIT_SAVE_SELECTOR);
        return true;
    });
    function doRemoveSymbol(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield isAddSymbolModalOpen()) {
                yield closeCancelModal();
            }
            const table_loaded = yield wait_for_selector_exists(PORTFOLIO_MAIN_TICKER_NAME_SELECTOR);
            if (!table_loaded) {
                console.error("Could not find table");
                return false;
            }
            const concerned_row = yield find_symbol_row(symbol);
            if (!concerned_row) {
                console.error("Could not find row with symbol", symbol);
                return false;
            }
            // First delete lot
            const dropdown_opener = concerned_row === null || concerned_row === void 0 ? void 0 : concerned_row.querySelector(PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR);
            if (dropdown_opener) {
                dropdown_opener.scrollIntoView();
                console.log("Scrolled to dropdown opener");
                dropdown_opener.click();
                console.log("Clicked dropdown opener");
                let delete_lot_btn = yield wait_for_selector_exists(PORTFOLIO_MAIN_ROW_DROPDOWN_DELETE_LOT_SELECTOR, 1);
                if (!delete_lot_btn) {
                    dropdown_opener.click();
                }
                delete_lot_btn = yield wait_for_selector_exists(PORTFOLIO_MAIN_ROW_DROPDOWN_DELETE_LOT_SELECTOR, 1);
                if (!delete_lot_btn) {
                    console.error("Could not find delete lot button for ticker " + symbol);
                    return false;
                }
                delete_lot_btn.click();
                if (!(yield wait_for_selector_cease_existing(PORTFOLIO_MAIN_ROW_DROPDOWN_OPENER_SELECTOR, 3, concerned_row))) {
                    console.error("Could not close dropdown");
                    return false;
                }
            }
            // Then find the row delete button
            const row_delete_btn = yield wait_for_selector_exists("button", 7, concerned_row);
            if (!row_delete_btn) {
                console.error("Could not find delete button");
                return false;
            }
            row_delete_btn.scrollIntoView();
            row_delete_btn.click();
            // Wait for modal delete btn
            const modal_delete = yield wait_for_selector_exists(MODAL_REMOVE_SYMBOL_SELECTOR);
            if (!modal_delete) {
                console.error("Could not find modal delete button");
                return false;
            }
            modal_delete.click();
            // Wait for modal close
            yield wait_for_selector_cease_existing(MODAL_REMOVE_SYMBOL_SELECTOR);
            return true;
        });
    }
    function doAddAll(portfolios) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const portfolio of portfolios) {
                if (!(yield doAddSymbol(portfolio.symbol, false))) {
                    console.warn("Could not add symbol " + portfolio.symbol);
                }
            }
            return yield closeAddSymbolModal();
        });
    }
    function doEditAll(portfolios) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const portfolio of portfolios) {
                if (!(yield doEditSymbol(portfolio))) {
                    console.warn("Could not edit symbol " + portfolio.symbol);
                }
            }
            return true;
        });
    }
    function doRemoveAll(portfolios) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const portfolio of portfolios) {
                if (yield doRemoveSymbol(portfolio.symbol)) {
                    console.log("Removed symbol " + portfolio.symbol);
                }
            }
        });
    }
    function doAll(source_portfolio) {
        return __awaiter(this, void 0, void 0, function* () {
            const sa_portfolio = yield getSeekingAlphaPortfolio();
            console.log("Existing portfolio", sa_portfolio);
            const operations = yield getTickersAddUpdateRemove(source_portfolio, sa_portfolio);
            console.log("Operations", operations);
            console.log("removing", operations.remove);
            yield doRemoveAll(operations.remove);
            console.log("adding", operations.add);
            yield doAddAll(operations.add);
            console.log("updating just added items", operations.update);
            yield doEditAll(operations.add);
            console.log("updating existing items", operations.update);
            yield doEditAll(operations.update);
            console.log("done");
        });
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

})();
