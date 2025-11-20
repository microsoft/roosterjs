import { DocumentPropertyNames } from './constants';
import type { GetSourceFunction } from './getDocumentSource';

/**
 * @internal
 * Checks whether the fragment provided contain elements from Google sheets
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const isGoogleSheetDocument: GetSourceFunction = props => {
    const { fragment } = props;
    return !!fragment.querySelector(DocumentPropertyNames.GOOGLE_SHEET_NODE_NAME);
};
