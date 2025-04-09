import { PastePropertyNames } from './constants';
import type { GetSourceFunction } from './getPasteSource';

const ONE_NOTE_ATTRIBUTE_VALUE = 'OneNote.File';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Excel Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const isOneNoteDesktopDocument: GetSourceFunction = props => {
    const { htmlAttributes } = props;
    // The presence of this attribute confirms its origin from Excel Desktop
    return htmlAttributes[PastePropertyNames.PROG_ID_NAME] == ONE_NOTE_ATTRIBUTE_VALUE;
};
