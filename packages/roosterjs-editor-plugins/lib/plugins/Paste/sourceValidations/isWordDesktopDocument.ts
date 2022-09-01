import { getSourceFunction } from './getPasteSource';
import { KnownSourceType } from './KnownSourceType';
import { PROG_ID_NAME } from './constants';

const WORD_ATTRIBUTE_NAME = 'xmlns:w';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';
const WORD_PROG_ID = 'Word.Document';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Word Desktop documents
 * @param htmlAttributes html attributes to check.
 * @returns
 */
const isWordDesktopDocument: getSourceFunction = (htmlAttributes: Record<string, string>) =>
    htmlAttributes[WORD_ATTRIBUTE_NAME] == WORD_ATTRIBUTE_VALUE ||
    htmlAttributes[PROG_ID_NAME] == WORD_PROG_ID
        ? KnownSourceType.WordDesktop
        : false;

export default isWordDesktopDocument;
