import { GOOGLE_SHEET_NODE_NAME } from './constants';

/**
 * @internal
 * Checks whether the fragment provided contain elements from Google sheets
 * @param fragment
 * @returns
 */
export function isGoogleSheetDocument(fragment: DocumentFragment) {
    return !!fragment.querySelector(GOOGLE_SHEET_NODE_NAME);
}
