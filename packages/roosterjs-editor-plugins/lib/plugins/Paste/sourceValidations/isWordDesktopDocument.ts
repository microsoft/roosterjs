import { PROG_ID_NAME } from './constants';
import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

const WORD_ATTRIBUTE_NAME = 'xmlns:w';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';
const WORD_PROG_ID = 'Word.Document';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Word Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
const isWordDesktopDocument: getSourceFunction = (props: getSourceInputParams) => {
    const { htmlAttributes } = props;
    return (
        htmlAttributes[WORD_ATTRIBUTE_NAME] == WORD_ATTRIBUTE_VALUE ||
        htmlAttributes[PROG_ID_NAME] == WORD_PROG_ID
    );
};

export default isWordDesktopDocument;
