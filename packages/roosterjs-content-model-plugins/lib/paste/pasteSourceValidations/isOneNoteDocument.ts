import { PastePropertyNames } from './constants';
import type { GetSourceFunction } from './getPasteSource';

const ONE_NOTE_ATTRIBUTE_VALUE = 'OneNote.File';

/**
 * @internal
 * Checks whether the provided HTML attributes identify a OneNote Desktop document
 * @param props Properties related to the PasteEvent
 * @returns True if the document is identified as a OneNote Desktop document, otherwise false
 */
export const isOneNoteDesktopDocument: GetSourceFunction = props => {
    const { htmlAttributes } = props;
    // The presence of this attribute confirms its origin from OneNote Desktop
    return htmlAttributes[PastePropertyNames.PROG_ID_NAME] == ONE_NOTE_ATTRIBUTE_VALUE;
};
