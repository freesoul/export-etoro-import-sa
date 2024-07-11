

interface FirstOfMultipleSelectorsQuery {
    result: HTMLElement | null;
    query_idx: Number;
}

async function wait_for_first_selector_that_exists(queries: string[]): Promise<FirstOfMultipleSelectorsQuery> {
    let output: FirstOfMultipleSelectorsQuery = {
        result: null,
        query_idx: 0
    };
    while (output.result === null) {
        for (let i = 0; i < queries.length; i++) {
            const selector = document.querySelector(queries[i]);
            if (selector) {
                output.result = selector as HTMLElement | null;
                output.query_idx = i;
                return output;
            }
        }
        await new Promise(r => setTimeout(r, 100));
    }
    return output;
}

async function wait_for_selector_exists(query: string): Promise<HTMLElement | null> {
    let selector = null;
    while (selector === null) {
        selector = document.querySelector(query);
        if (selector) {
            return selector as HTMLElement | null;
        }
        await new Promise(r => setTimeout(r, 100));
    }
    return null;
}

export { wait_for_selector_exists, wait_for_first_selector_that_exists, FirstOfMultipleSelectorsQuery }

/** Add in window for debugging purposes */


declare global {
    interface Window {
        _wait_for_selector_exists: (query: string) => Promise<HTMLElement | null>;
        _wait_for_first_selector_that_exists: (queries: string[]) => Promise<FirstOfMultipleSelectorsQuery>;
    }    
}

window._wait_for_selector_exists = wait_for_selector_exists;
window._wait_for_first_selector_that_exists = wait_for_first_selector_that_exists;
