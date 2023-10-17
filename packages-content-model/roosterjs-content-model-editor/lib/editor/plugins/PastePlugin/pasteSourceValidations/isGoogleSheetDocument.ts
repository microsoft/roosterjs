import { GOOGLE_SHEET_NODE_NAME } from './constants';
import type { GetSourceFunction } from './getPasteSource';

/**
 * @internal
 * Checks whether the fragment provided contain elements from Google sheets
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const isGoogleSheetDocument: GetSourceFunction = props => {
    const { fragment } = props;
    return !!fragment.querySelector(GOOGLE_SHEET_NODE_NAME);
};
