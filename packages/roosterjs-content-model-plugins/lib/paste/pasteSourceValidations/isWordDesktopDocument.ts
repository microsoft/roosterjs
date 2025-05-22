import { PastePropertyNames } from './constants';
import type { GetSourceFunction } from './getPasteSource';

const WORD_ATTRIBUTE_NAME = 'xmlns:w';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';
const WORD_PROG_ID = 'Word.Document';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Word Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const isWordDesktopDocument: GetSourceFunction = props => {
    const { htmlAttributes, clipboardData } = props;

    return (
        htmlAttributes[WORD_ATTRIBUTE_NAME] == WORD_ATTRIBUTE_VALUE ||
        htmlAttributes[PastePropertyNames.PROG_ID_NAME] == WORD_PROG_ID ||
        // Safari removes the metadata from the clipboard html, so we need to do this check.
        !!(
            clipboardData.rawHtml &&
            clipboardData.rawHtml
                ?.replace(/ /g, '')
                .indexOf(`${WORD_ATTRIBUTE_NAME}="${WORD_ATTRIBUTE_VALUE}`) > -1
        )
    );
};
