/**
 * Unique Id
 */
const UNIQUE_ID = 'uniqueId';

/**
 * Unique Id data selector
 */
export const UNIQUE_ID_DATA_SELECTOR: string = 'data-unique-id';

/**
 * Get unique id querySelector attribute
 * @param uniqueId unique id value, if not passed it will return only the general unique id query
 */
export function getUniqueIdQuerySelector(uniqueId?: string) {
    return uniqueId ? `[${UNIQUE_ID_DATA_SELECTOR}="${uniqueId}"]` : `[${UNIQUE_ID_DATA_SELECTOR}]`;
}

/**
 * Get the value of the unique id data attribute
 * @param el
 * @returns
 */
export function getUniqueId(el: HTMLElement) {
    return el.dataset[UNIQUE_ID] ?? '';
}

/**
 * Add an unique id to element and ensure that is unique
 * @param el The HTMLElement that will receive the id
 * @param idPrefix The prefix that will antecede the id (Ex: tableSelected01)
 */
export function addUniqueId(el: HTMLElement, idPrefix: string) {
    const doc = el.ownerDocument;
    if (!el.dataset[UNIQUE_ID]) {
        applyId(el, idPrefix, doc);
    } else {
        const elements = doc.querySelectorAll(`[${UNIQUE_ID_DATA_SELECTOR}]`);
        if (elements.length > 1) {
            delete el.dataset[UNIQUE_ID];
            applyId(el, idPrefix, doc);
        }
    }
}

function applyId(el: HTMLElement, idPrefix: string, doc: Document) {
    let cont = 0;
    const getElement = () => getElementByUniqueId(doc, idPrefix + cont);
    //Ensure that there are no elements with the same ID
    let element = getElement();
    while (element) {
        cont++;
        element = getElement();
    }

    setUniqueId(el, idPrefix + cont);
}

function setUniqueId(el: HTMLElement, uniqueId: string) {
    el.dataset[UNIQUE_ID] = uniqueId;
}

function getElementByUniqueId(doc: Document, uniqueId: string) {
    return doc.querySelector(`[${UNIQUE_ID_DATA_SELECTOR}="${uniqueId}"]`);
}
