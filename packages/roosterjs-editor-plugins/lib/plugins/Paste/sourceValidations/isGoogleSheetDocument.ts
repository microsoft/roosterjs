import { GOOGLE_SHEET_NODE_NAME } from './constants';
import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

/**
 * @internal
 * Checks whether the fragment provided contain elements from Google sheets
 * @param props Properties related to the PasteEvent
 * @returns
 */
const isGoogleSheetDocument: getSourceFunction = (props: getSourceInputParams) => {
    const { fragment } = props;
    return !!fragment.querySelector(GOOGLE_SHEET_NODE_NAME);
};

export default isGoogleSheetDocument;
