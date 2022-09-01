import { getSourceFunction } from './getPasteSource';
import { GOOGLE_SHEET_NODE_NAME } from './constants';
import { KnownSourceType } from './KnownSourceType';

/**
 * @internal
 * Checks whether the fragment provided contain elements from Google sheets
 * @param fragment
 * @returns
 */
const isGoogleSheetDocument: getSourceFunction = (
    htmlAttributes: Record<string, string>,
    fragment: DocumentFragment
) => (!!fragment.querySelector(GOOGLE_SHEET_NODE_NAME) ? KnownSourceType.GoogleSheets : false);

export default isGoogleSheetDocument;
