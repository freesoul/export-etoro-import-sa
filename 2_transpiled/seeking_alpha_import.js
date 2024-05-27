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
        const ticker_name_test_id = "portfolio-ticker-name";
        const res = [];
        rows.forEach((row) => {
            var _a;
            const ticker_name = (_a = row.querySelector(`[data-test-id="${ticker_name_test_id}"]`)) === null || _a === void 0 ? void 0 : _a.innerText;
            if (!ticker_name) {
                console.error("No ticker name found in row", row);
                return;
            }
            const shares_tds = row.querySelectorAll("td");
            if (shares_tds.length < 5) {
                console.error("Not enough tds in row", shares_tds.length);
                return;
            }
            const num_shares = shares_tds[3].innerText;
            const share_price = shares_tds[4].innerText;
            res.push({
                ticker_name,
                share_price: parseFloat(share_price),
                num_shares: parseFloat(num_shares),
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
                    if (etoro.units !== seeking.num_shares ||
                        etoro.avg_open !== seeking.share_price) {
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
    });
}
export {};
// const operations = await getTickersAddUpdateRemove(
//     etoro_portfolio,
//     seeking_alpha_portfolio
// );
