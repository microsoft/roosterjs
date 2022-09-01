import { getSourceFunction } from './getPasteSource';
import { KnownSourceType } from './KnownSourceType';
import { WAC_IDENTIFY_SELECTOR } from './constants';

/**
 * @internal
 * Check whether the fragment provided contain Wac Elements
 * @param wacListElements List to populate with the Wac ELements
 * @param fragment Fragment to verify
 * @returns
 */
const documentContainWacElements: getSourceFunction = (
    htmlAttributes: Record<string, string>,
    fragment: DocumentFragment
) => (!!fragment.querySelector(WAC_IDENTIFY_SELECTOR) ? KnownSourceType.WacComponents : false);

export default documentContainWacElements;
