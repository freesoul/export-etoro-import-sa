import {
    EtoroPortfolio,
} from "./etoro_portfolio";
interface SeekingAlphaPortfolio {
    ticker_name: string;
    share_price: number;
    num_shares: number;
}

async function getSeekingAlphaPortfolio() {
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
    const ticker_name_test_id = "portfolio-ticker-name";
    const res: SeekingAlphaPortfolio[] = [];
    rows.forEach((row) => {
        const ticker_name = (row.querySelector(
            `[data-test-id="${ticker_name_test_id}"]`
        ) as HTMLElement | null)?.innerText;
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
}

interface AddUpdateRemove {
    add: EtoroPortfolio[];
    update: {
        etoro: EtoroPortfolio;
        seeking: SeekingAlphaPortfolio;
    }[];
    remove: SeekingAlphaPortfolio[];
}

async function getTickersAddUpdateRemove(
    etoro_portfolio: EtoroPortfolio[],
    seeking_alpha_portfolio: SeekingAlphaPortfolio[]
) {
    let res: AddUpdateRemove = {
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

// const operations = await getTickersAddUpdateRemove(
//     etoro_portfolio,
//     seeking_alpha_portfolio
// );
