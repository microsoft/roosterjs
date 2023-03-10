import createElement from '../utils/createElement';
import getDelimiterFromElement from './getDelimiterFromElement';
import { DelimiterClasses } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Adds delimiters to the element provided. If the delimiters already exists, will not be added
 * @param node the node to add the delimiters
 */
export default function addDelimiters(node: Element) {
    const [delimiterAfter, delimiterBefore] = getDelimiters(node);

    if (!delimiterAfter) {
        addDelimiterAfter(node);
    }
    if (!delimiterBefore) {
        addDelimiterBefore(node);
    }
}

function getDelimiters(entityWrapper: Element): (Element | undefined)[] {
    return [entityWrapper.nextElementSibling, entityWrapper.previousElementSibling].map(el =>
        el && getDelimiterFromElement(el) ? el : undefined
    );
}

/**
 * Adds delimiter after the element provided.
 * @param element element to use
 */
function addDelimiterAfter(element: Element) {
    insertDelimiter(element, DelimiterClasses.DELIMITER_AFTER);
}

/**
 * Adds delimiter before the element provided.
 * @param element element to use
 */
function addDelimiterBefore(element: Element) {
    insertDelimiter(element, DelimiterClasses.DELIMITER_BEFORE);
}

function insertDelimiter(element: Element, delimiterClass: DelimiterClasses) {
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
