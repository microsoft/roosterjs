import { toArray } from 'roosterjs-editor-dom';

const WAC_IDENTIFY_SELECTOR =
    'ul[class^="BulletListStyle"]>.OutlineElement,ol[class^="NumberListStyle"]>.OutlineElement,span.WACImageContainer';

/**
 * @internal
 * Check whether the fragment provided contain Wac Elements
 * @param wacListElements List to populate with the Wac ELements
 * @param fragment Fragment to verify
 * @returns
 */
export function documentContainWacElements(wacListElements: Node[], fragment: DocumentFragment) {
    wacListElements = toArray(fragment.querySelectorAll(WAC_IDENTIFY_SELECTOR));
    return !!(wacListElements.length > 0);
}
