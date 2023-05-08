import safeInstanceOf from '../utils/safeInstanceOf';
import { DelimiterClasses } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Retrieves Delimiter information from a provided element.
 * @param element element to try to retrieve a delimiter
 * @returns delimiter info if it is a Delimiter, else null
 */
export default function getDelimiterFromElement(element: Node | null | undefined): Element | null {
    if (!element) {
        return null;
    }
    if (
        safeInstanceOf(element, 'HTMLSpanElement') &&
        (element.classList.contains(DelimiterClasses.DELIMITER_AFTER) ||
            element.classList.contains(DelimiterClasses.DELIMITER_BEFORE)) &&
        element.textContent === ZERO_WIDTH_SPACE
    ) {
        return element;
    }

    return null;
}
