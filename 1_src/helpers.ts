

interface FirstOfMultipleSelectorsQuery {
    result: HTMLElement | null;
    query_idx: Number;
}

async function wait_for_first_selector_that_exists(queries: string[], max_wait_seconds: number = 7): Promise<FirstOfMultipleSelectorsQuery | null> {
    const start_time = Date.now();
    let output: FirstOfMultipleSelectorsQuery = {
        result: null,
        query_idx: 0
    };
    while (output.result === null) {
        // Element found
        for (let i = 0; i < queries.length; i++) {
            const selector = document.querySelector(queries[i]);
            if (selector) {
                output.result = selector as HTMLElement | null;
                output.query_idx = i;
                return output;
            }
        }

        // Delay
        await new Promise(r => setTimeout(r, 100));

        // Timeout
        if (Date.now() - start_time > max_wait_seconds * 1000) {
            console.error(`wait_for_first_selector_that_exists: Timeout reached for queries: ${queries}`);
            return null;
        }
    }
    return output;
}

async function wait_for_selector_exists(query: string, max_wait_seconds: number = 7, parentElement: HTMLElement | null = null): Promise<HTMLElement | null> {
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
            return selector as HTMLElement | null;
        }

        // Delay
        await new Promise(r => setTimeout(r, 100));

        // Timeout
        if (Date.now() - start_time > max_wait_seconds * 1000) {
            console.warn(`wait_for_selector_exists: Timeout reached for query: ${query}`);
            break;
        }
    }
    return null;
}

async function wait_for_selector_cease_existing(selector: string, max_wait_seconds: number = 7, root: HTMLElement | null = null): Promise<boolean> {
    return await wait_for_selectors_stop_existing([selector], max_wait_seconds, root);
}

async function wait_for_selectors_stop_existing(queries: string[], max_wait_seconds: number = 7, root: HTMLElement | null = null): Promise<boolean> {
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
        await new Promise(r => setTimeout(r, 100));

        // Timeout
        if (Date.now() - start_time > max_wait_seconds * 1000) {
            console.error(`wait_for_selectors_stop_existing: Timeout reached for queries: ${queries}`);
            break;
        }
    }
    return false;
}

function set_input_value(input: HTMLElement, value: string) {

    // Explanation:
    // Directly setting input.value does not trigger React's synthetic event system.
    // React relies on events like 'input' to detect changes and update the component's state.
    // By using the setter and dispatching the 'input' event, we ensure React is notified of the change.
    //https://stackoverflow.com/questions/43874981/react-programmatically-change-component-value-doesnt-trigger-onchange-event

    if (!input) {
        console.error("Input element not found.");
        return;
    }
    // Setting the value directly using the setters
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, value);
    // Dispatching the 'input' event to notify React of the change
    input.dispatchEvent(new Event('input', { bubbles: true }));

}

async function find_selector_with_text_content(selector: string, text: string) : Promise<HTMLElement | null> {
    const elements = document.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent === text) {
            return elements[i] as HTMLElement;
        }
    }
    return null;
}




export {
    wait_for_selector_exists,
    wait_for_first_selector_that_exists,
    wait_for_selector_cease_existing,
    wait_for_selectors_stop_existing,
    set_input_value,
    find_selector_with_text_content,
    FirstOfMultipleSelectorsQuery
}

/** Add in window for debugging purposes */

declare global {
    interface Window {
        _wait_for_selector_exists: (query: string) => Promise<HTMLElement | null>;
        _wait_for_first_selector_that_exists: (queries: string[]) => Promise<FirstOfMultipleSelectorsQuery | null>;
        _wait_for_selector_cease_existing: (selector: string) => Promise<Boolean>;
        _wait_for_selectors_stop_existing: (queries: string[]) => Promise<boolean>;
        _set_input_value: (input: HTMLElement, value: string) => void;
        _find_selector_with_text_content: (selector: string, text: string) => Promise<HTMLElement | null>;
    }
}

window._wait_for_selector_exists = wait_for_selector_exists;
window._wait_for_first_selector_that_exists = wait_for_first_selector_that_exists;
window._wait_for_selector_cease_existing = wait_for_selector_cease_existing;
window._wait_for_selectors_stop_existing = wait_for_selectors_stop_existing;
window._set_input_value = set_input_value;
window._find_selector_with_text_content = find_selector_with_text_content;