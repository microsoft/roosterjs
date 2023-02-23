import createElement from '../utils/createElement';
import { DelimiterClasses } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Adds delimiters to the element provided.
 * @param element element to be between delimiters
 */
export default function addDelimiters(element: HTMLElement) {
    function insertDelimiter(delimiterClass: DelimiterClasses) {
        const span = createElement(
            {
                tag: 'span',
                className: delimiterClass,
                children: [ZERO_WIDTH_SPACE],
            },
            element.ownerDocument
        );
        if (span) {
            const insertPosition: InsertPosition =
                delimiterClass == DelimiterClasses.DELIMITER_AFTER ? 'afterend' : 'beforebegin';
            element.insertAdjacentElement(insertPosition, span);
        }
    }
    insertDelimiter(DelimiterClasses.DELIMITER_AFTER);
    insertDelimiter(DelimiterClasses.DELIMITER_BEFORE);
}
